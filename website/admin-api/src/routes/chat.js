const express = require('express');
const prisma = require('../db');

const router = express.Router();

// ═══════════════════════════════════════
// BOOKING STATE MACHINE (in-memory, per session)
// ═══════════════════════════════════════
const bookingSessions = new Map();

const BOOKING_STEPS = ['parent_name', 'child_name', 'child_age', 'service', 'phone', 'preferred_time', 'confirm'];

const BOOKING_QUESTIONS = {
  parent_name: {
    en: "What is the parent's full name (first and last)?",
    ar: "ما هو الاسم الكامل لولي الأمر (الاسم الأول والأخير)؟",
  },
  child_name: {
    en: "What is your child's first name?",
    ar: "ما هو اسم طفلك؟",
  },
  child_age: {
    en: "How old is your child? (We serve ages 0-18)",
    ar: "كم عمر طفلك؟ (نخدم الأعمار من 0 إلى 18)",
  },
  service: {
    en: "Which service are you interested in?\n1. Speech & Language Therapy\n2. Occupational Therapy (OT)\n3. Physical Therapy (PT)\n4. ABA Therapy\n5. Developmental Assessment",
    ar: "أي خدمة تهمك؟\n1. علاج النطق واللغة\n2. العلاج الوظيفي\n3. العلاج الطبيعي\n4. علاج ABA السلوكي\n5. التقييم التطوري",
  },
  phone: {
    en: "What is your phone number? (e.g., 05XXXXXXXX or +966XXXXXXXXX)",
    ar: "ما هو رقم هاتفك؟ (مثال: 05XXXXXXXX أو +966XXXXXXXXX)",
  },
  preferred_time: {
    en: "When would you prefer? (Sun-Thu, 8AM-6PM)\nYou can say something like 'Sunday morning' or 'any day afternoon'.",
    ar: "متى تفضل؟ (الأحد-الخميس، 8 صباحاً - 6 مساءً)\nيمكنك قول 'صباح الأحد' أو 'أي يوم بعد الظهر'.",
  },
};

const SERVICE_MAP = {
  '1': 'Speech & Language Therapy',
  '2': 'Occupational Therapy',
  '3': 'Physical Therapy',
  '4': 'ABA Therapy',
  '5': 'Developmental Assessment',
  'speech': 'Speech & Language Therapy',
  'language': 'Speech & Language Therapy',
  'نطق': 'علاج النطق واللغة',
  'لغة': 'علاج النطق واللغة',
  'occupational': 'Occupational Therapy',
  'ot': 'Occupational Therapy',
  'وظيفي': 'العلاج الوظيفي',
  'physical': 'Physical Therapy',
  'pt': 'Physical Therapy',
  'طبيعي': 'العلاج الطبيعي',
  'aba': 'ABA Therapy',
  'behavior': 'ABA Therapy',
  'سلوك': 'علاج ABA السلوكي',
  'سلوكي': 'علاج ABA السلوكي',
  'assessment': 'Developmental Assessment',
  'evaluation': 'Developmental Assessment',
  'تقييم': 'التقييم التطوري',
};

function validateField(step, value) {
  const v = value.trim();
  switch (step) {
    case 'parent_name':
      if (v.split(/\s+/).length < 2) return { en: "Please provide your full name (first and last name).", ar: "يرجى تقديم اسمك الكامل (الاسم الأول والأخير)." };
      if (v.length < 4) return { en: "That doesn't look like a valid name. Please try again.", ar: "هذا لا يبدو اسماً صحيحاً. يرجى المحاولة مرة أخرى." };
      return null;
    case 'child_name':
      if (v.length < 2) return { en: "Please provide your child's name.", ar: "يرجى تقديم اسم طفلك." };
      if (/^\d+$/.test(v)) return { en: "That doesn't look like a name. Please provide your child's first name.", ar: "هذا لا يبدو اسماً. يرجى تقديم الاسم الأول لطفلك." };
      return null;
    case 'child_age': {
      const num = parseInt(v);
      if (isNaN(num) && !/\d/.test(v)) return { en: "Please provide a valid age (number between 0 and 18).", ar: "يرجى تقديم عمر صحيح (رقم بين 0 و 18)." };
      const extracted = parseInt(v.match(/\d+/)?.[0]);
      if (extracted < 0 || extracted > 18) return { en: "We serve children aged 0-18. Please provide a valid age.", ar: "نخدم الأطفال من عمر 0 إلى 18 سنة. يرجى تقديم عمر صحيح." };
      return null;
    }
    case 'service': {
      const lower = v.toLowerCase();
      const match = Object.keys(SERVICE_MAP).find(k => lower.includes(k));
      if (!match) return { en: "Please choose one of our services:\n1. Speech & Language Therapy\n2. Occupational Therapy\n3. Physical Therapy\n4. ABA Therapy\n5. Developmental Assessment\n\nYou can type the number or name.", ar: "يرجى اختيار أحد خدماتنا:\n1. علاج النطق واللغة\n2. العلاج الوظيفي\n3. العلاج الطبيعي\n4. علاج ABA السلوكي\n5. التقييم التطوري\n\nيمكنك كتابة الرقم أو الاسم." };
      return null;
    }
    case 'phone': {
      const digits = v.replace(/\D/g, '');
      if (digits.length < 8) return { en: "Please provide a valid phone number (at least 8 digits).", ar: "يرجى تقديم رقم هاتف صحيح (8 أرقام على الأقل)." };
      return null;
    }
    case 'preferred_time':
      return null; // Any answer is accepted
    default:
      return null;
  }
}

function parseService(text) {
  const lower = text.toLowerCase().trim();
  for (const [key, val] of Object.entries(SERVICE_MAP)) {
    if (lower.includes(key)) return val;
  }
  return text.trim();
}

function getBookingSummary(data, lang) {
  if (lang === 'ar') {
    return `هذا ملخص معلوماتك:\n• ولي الأمر: ${data.parent_name}\n• اسم الطفل: ${data.child_name}\n• العمر: ${data.child_age}\n• الخدمة: ${data.service}\n• الهاتف: ${data.phone}\n• الوقت المفضل: ${data.preferred_time || 'غير محدد'}\n\nهل المعلومات صحيحة؟ (نعم / لا)`;
  }
  return `Here's a summary of your information:\n• Parent: ${data.parent_name}\n• Child: ${data.child_name}\n• Age: ${data.child_age}\n• Service: ${data.service}\n• Phone: ${data.phone}\n• Preferred time: ${data.preferred_time || 'Not specified'}\n\nIs everything correct? (yes / no)`;
}

// ═══════════════════════════════════════
// INSTANT RESPONSES — no LLM call needed
// ═══════════════════════════════════════
const INSTANT_RESPONSES = [
  {
    keywords: ['book', 'booking', 'appointment', 'schedule', 'reserve', 'حجز', 'موعد', 'أحجز', 'احجز'],
    startBooking: true,
  },
  {
    keywords: ['why riyada', 'why choose', 'why you', 'why should', 'ليش ريادة', 'لماذا ريادة', 'ليه ريادة'],
    en: "Riyada Center is a specialized pediatric development and rehabilitation center in Riyadh. We offer:\n• 5 specialized therapy services under one roof\n• Qualified and experienced therapists\n• Personalized treatment plans for every child\n• A supportive and family-centered approach\n• Our motto: Connect. Develop. Rise.\n\nWould you like to learn more about our services or book an appointment?",
    ar: "مركز ريادة هو مركز متخصص في تطوير وتأهيل الأطفال في الرياض. نقدم:\n• 5 خدمات علاجية متخصصة تحت سقف واحد\n• معالجين مؤهلين وذوي خبرة\n• خطط علاج مخصصة لكل طفل\n• نهج داعم يركز على الأسرة\n• شعارنا: تواصل. تطور. انطلق.\n\nهل تود معرفة المزيد عن خدماتنا أو حجز موعد؟",
  },
  {
    keywords: ['services', 'service', 'what do you offer', 'what do you do', 'خدمات', 'خدماتكم', 'ماذا تقدم'],
    en: "We offer 5 specialized services:\n• Speech & Language Therapy — for communication and language delays\n• Occupational Therapy (OT) — for fine motor skills and sensory processing\n• Physical Therapy (PT) — for gross motor skills and movement\n• ABA Therapy — for behavioral challenges and autism support\n• Developmental Assessment — a full evaluation to understand your child's needs\n\nWould you like to know more about any service, or book an appointment?",
    ar: "نقدم 5 خدمات متخصصة:\n• علاج النطق واللغة — لتأخر التواصل واللغة\n• العلاج الوظيفي — للمهارات الحركية الدقيقة والتكامل الحسي\n• العلاج الطبيعي — للمهارات الحركية والحركة\n• علاج ABA السلوكي — للتحديات السلوكية ودعم التوحد\n• التقييم التطوري — تقييم شامل لفهم احتياجات طفلك\n\nهل تود معرفة المزيد عن أي خدمة، أو حجز موعد؟",
  },
  {
    keywords: ['hours', 'working hours', 'open', 'when', 'time', 'أوقات', 'ساعات', 'متى', 'دوام'],
    en: "We are open Sunday to Thursday, 8:00 AM to 6:00 PM. We are closed on Friday and Saturday.\n\nWould you like to book an appointment?",
    ar: "نعمل من الأحد إلى الخميس، من الساعة 8:00 صباحاً حتى 6:00 مساءً. نحن مغلقون يوم الجمعة والسبت.\n\nهل تود حجز موعد؟",
  },
  {
    keywords: ['where', 'location', 'address', 'map', 'directions', 'وين', 'أين', 'موقع', 'عنوان', 'خريطة'],
    en: "We are located in Riyadh, Saudi Arabia. For the exact address and directions, please contact us at RC@riyada-ventures.com or visit our website: rc.riyada-ventures.com",
    ar: "نحن في الرياض، المملكة العربية السعودية. للعنوان الدقيق والاتجاهات، تواصل معنا على RC@riyada-ventures.com أو زر موقعنا: rc.riyada-ventures.com",
  },
  {
    keywords: ['insurance', 'تأمين', 'تغطية'],
    en: "We work with major health insurance providers in Saudi Arabia. Please contact us at RC@riyada-ventures.com to verify your specific insurance coverage. Self-pay options are also available.",
    ar: "نتعامل مع شركات التأمين الصحي الرئيسية في المملكة. تواصل معنا على RC@riyada-ventures.com للتحقق من تغطية تأمينك. الدفع الذاتي متاح أيضاً.",
  },
  {
    keywords: ['price', 'cost', 'how much', 'pricing', 'fees', 'سعر', 'أسعار', 'كم', 'تكلفة', 'رسوم'],
    en: "Pricing depends on the type of therapy and assessment needed. Please contact us at RC@riyada-ventures.com for detailed pricing information.",
    ar: "الأسعار تعتمد على نوع العلاج والتقييم المطلوب. تواصل معنا على RC@riyada-ventures.com للحصول على تفاصيل الأسعار.",
  },
  {
    keywords: ['age', 'ages', 'how old', 'عمر', 'أعمار', 'سن'],
    en: "We serve children from birth to 18 years old.\n\nWould you like to book an assessment for your child?",
    ar: "نخدم الأطفال من الولادة حتى عمر 18 سنة.\n\nهل تود حجز تقييم لطفلك؟",
  },
  {
    keywords: ['contact', 'email', 'phone', 'call', 'reach', 'تواصل', 'اتصال', 'بريد', 'هاتف', 'رقم'],
    en: "You can reach us at:\n• Email: RC@riyada-ventures.com\n• Website: rc.riyada-ventures.com\n• Or I can help you book an appointment right here!",
    ar: "يمكنك التواصل معنا عبر:\n• البريد الإلكتروني: RC@riyada-ventures.com\n• الموقع: rc.riyada-ventures.com\n• أو أقدر أساعدك بحجز موعد هنا مباشرة!",
  },
  {
    keywords: ['speech', 'language therapy', 'talk', 'stutter', 'نطق', 'لغة', 'كلام', 'تأتأة'],
    en: "Our Speech & Language Therapy helps children with:\n• Pronunciation and articulation difficulties\n• Language delays (understanding and expressing)\n• Stuttering and fluency\n• Communication challenges related to autism\n\nWould you like to book an assessment?",
    ar: "علاج النطق واللغة يساعد الأطفال في:\n• صعوبات النطق والتلفظ\n• تأخر اللغة (الفهم والتعبير)\n• التأتأة والطلاقة\n• تحديات التواصل المرتبطة بالتوحد\n\nهل تود حجز تقييم؟",
  },
  {
    keywords: ['occupational', ' ot ', 'fine motor', 'sensory', 'handwriting', 'وظيفي', 'حسي', 'كتابة'],
    en: "Our Occupational Therapy helps children with:\n• Fine motor skills (writing, cutting, buttons)\n• Sensory processing difficulties\n• Daily living skills and self-care\n• School readiness and handwriting\n\nWould you like to book an assessment?",
    ar: "العلاج الوظيفي يساعد الأطفال في:\n• المهارات الحركية الدقيقة (الكتابة، القص، الأزرار)\n• صعوبات المعالجة الحسية\n• مهارات الحياة اليومية والعناية الذاتية\n• الاستعداد المدرسي والكتابة\n\nهل تود حجز تقييم؟",
  },
  {
    keywords: ['physical therapy', ' pt ', 'walking', 'crawling', 'balance', 'gross motor', 'طبيعي', 'مشي', 'حركة', 'توازن'],
    en: "Our Physical Therapy helps children with:\n• Gross motor delays (crawling, walking, running)\n• Balance and coordination\n• Neurological conditions like cerebral palsy\n• Muscle weakness or tone issues\n\nWould you like to book an assessment?",
    ar: "العلاج الطبيعي يساعد الأطفال في:\n• تأخر المهارات الحركية الكبرى (الزحف، المشي، الركض)\n• التوازن والتنسيق\n• الحالات العصبية مثل الشلل الدماغي\n• ضعف العضلات أو مشاكل التوتر العضلي\n\nهل تود حجز تقييم؟",
  },
  {
    keywords: ['aba', 'behavior', 'autism', 'autistic', 'asd', 'adhd', 'hyperactiv', 'attention deficit', 'سلوك', 'سلوكي', 'توحد', 'فرط حركة', 'تشتت'],
    en: "Our ABA (Applied Behavior Analysis) Therapy helps children with:\n• Autism Spectrum Disorder (ASD) support\n• Behavioral challenges and self-regulation\n• Social skills development\n• Communication through positive behavior\n\nWould you like to book an assessment?",
    ar: "علاج ABA (تحليل السلوك التطبيقي) يساعد الأطفال في:\n• دعم اضطراب طيف التوحد\n• التحديات السلوكية والتنظيم الذاتي\n• تطوير المهارات الاجتماعية\n• التواصل من خلال السلوك الإيجابي\n\nهل تود حجز تقييم؟",
  },
  {
    keywords: ['assessment', 'evaluation', 'diagnos', 'check', 'test', 'تقييم', 'فحص', 'تشخيص'],
    en: "Our Developmental Assessment is a comprehensive evaluation that:\n• Identifies your child's strengths and areas needing support\n• Creates a personalized therapy plan\n• Is the best starting point if you're unsure which therapy fits\n\nWould you like to book one?",
    ar: "التقييم التطوري هو تقييم شامل:\n• يحدد نقاط قوة طفلك والمجالات التي تحتاج دعم\n• ينشئ خطة علاج مخصصة\n• هو أفضل نقطة بداية إذا كنت غير متأكد أي علاج يناسب طفلك\n\nهل تود حجز تقييم؟",
  },
  {
    keywords: ['my child', 'my son', 'my daughter', 'my kid', 'worried', 'concerned', 'delay', 'late', 'طفلي', 'ابني', 'بنتي', 'ولدي', 'قلق', 'تأخر', 'متأخر'],
    en: "I understand your concern — you're doing the right thing by reaching out. I'd recommend starting with a Developmental Assessment. It gives us a full picture of your child's strengths and needs, and helps us create a personalized plan.\n\nWould you like to book an assessment?",
    ar: "أفهم قلقك — أنت تقوم بالخطوة الصحيحة بالتواصل معنا. أنصح بالبدء بالتقييم التطوري. يعطينا صورة كاملة عن نقاط قوة طفلك واحتياجاته، ويساعدنا في إنشاء خطة مخصصة.\n\nهل تود حجز تقييم؟",
  },
];

const OFF_TOPIC_EN = "I'm Raya, Riyada Center's assistant. I can only help with our services, booking appointments, or child development questions related to our center. How can I help you?";
const OFF_TOPIC_AR = "أنا رايا، مساعدة مركز ريادة. أستطيع مساعدتك فقط بما يخص خدمات المركز، حجز المواعيد، أو استفسارات عن تطور الأطفال. كيف أقدر أساعدك؟";

const GREETING_EN = "Welcome to Riyada Center! I'm Raya, your assistant. I can help you with:\n• Learning about our therapy services\n• Booking an appointment\n• Answering questions about child development\n\nHow can I help you today?";
const GREETING_AR = "أهلاً بك في مركز ريادة! أنا رايا، مساعدتك. أقدر أساعدك في:\n• التعرف على خدماتنا العلاجية\n• حجز موعد\n• الإجابة على أسئلة عن تطور الأطفال\n\nكيف أقدر أساعدك اليوم؟";

const OFF_TOPIC_KEYWORDS = [
  'weather', 'recipe', 'cook', 'game', 'play', 'movie', 'music', 'song',
  'joke', 'funny', 'math', 'code', 'program', 'hack', 'password',
  'news', 'politics', 'religion', 'football', 'soccer', 'car', 'house',
  'translate', 'write me', 'essay', 'homework', 'school project',
  'طبخ', 'لعبة', 'فيلم', 'أغنية', 'نكتة', 'رياضة', 'كرة', 'سيارة', 'بيت', 'منزل',
  'ترجم', 'واجب', 'مدرسة',
];

const GREETING_PATTERNS = /^(hi|hello|hey|hii+|hola|yo|sup|merhaba|مرحبا|مرحباً|هلا|اهلا|أهلاً|السلام عليكم|سلام|هاي)[\s!.؟?]*$/i;

function detectLanguageFromText(text) {
  const arabicChars = (text.match(/[؀-ۿ]/g) ?? []).length;
  const latinChars  = (text.match(/[a-zA-Z]/g) ?? []).length;
  if (arabicChars > 0 && latinChars === 0) return 'ar';
  if (latinChars > 0 && arabicChars === 0) return 'en';
  return arabicChars >= latinChars ? 'ar' : 'en';
}

function tryInstantResponse(text, language) {
  const lower = ` ${text.toLowerCase().trim()} `;

  if (GREETING_PATTERNS.test(text.trim())) {
    return language === 'ar' ? GREETING_AR : GREETING_EN;
  }

  if (OFF_TOPIC_KEYWORDS.some(k => lower.includes(k))) {
    return language === 'ar' ? OFF_TOPIC_AR : OFF_TOPIC_EN;
  }

  for (const entry of INSTANT_RESPONSES) {
    if (entry.keywords.some(k => lower.includes(k.toLowerCase()))) {
      if (entry.startBooking) return '__START_BOOKING__';
      return language === 'ar' ? entry.ar : entry.en;
    }
  }

  return null;
}

// ═══════════════════════════════════════
// DATABASE HELPERS
// ═══════════════════════════════════════

async function upsertSession({ sessionId, language, pageUrl, userAgent, isNew }) {
  if (!sessionId) return;
  try {
    if (isNew) {
      await prisma.chatbotSession.upsert({
        where: { sessionId },
        update: { lastSeen: new Date(), status: 'active' },
        create: { sessionId, language, pageUrl: pageUrl ?? '', userAgent: userAgent ?? '', status: 'active' },
      });
    } else {
      await prisma.chatbotSession.update({ where: { sessionId }, data: { lastSeen: new Date() } }).catch(() => {});
    }
  } catch (e) { console.error('[upsertSession]', e.message); }
}

async function saveMsg({ sessionId, role, content, language }) {
  if (!sessionId) return;
  try {
    await prisma.chatbotMessage.create({ data: { sessionId, role, content, language } });
  } catch (e) { console.error('[saveMsg]', e.message); }
}

async function saveAppointmentToDB(data, sessionId, language) {
  try {
    await prisma.chatbotAppointment.create({
      data: {
        sessionId: sessionId ?? null,
        parentName: data.parent_name, childName: data.child_name, childAge: data.child_age,
        service: data.service, phone: data.phone,
        preferredTime: data.preferred_time ?? null, notes: null,
        language: language ?? 'ar', status: 'pending', source: 'chatbot',
      },
    });
    return true;
  } catch (e) { console.error('[saveAppointment]', e.message); return false; }
}

// ═══════════════════════════════════════
// BOOKING FLOW HANDLER
// ═══════════════════════════════════════

function handleBookingFlow(sessionId, userText, language) {
  let session = bookingSessions.get(sessionId);

  if (!session) {
    session = { step: 0, data: {}, language, createdAt: Date.now() };
    bookingSessions.set(sessionId, session);
    const q = BOOKING_QUESTIONS[BOOKING_STEPS[0]];
    const intro = language === 'ar'
      ? "يسعدني مساعدتك في حجز موعد! هيا نبدأ.\n\n"
      : "I'd love to help you book an appointment! Let's get started.\n\n";
    return intro + q[language];
  }

  const currentStep = BOOKING_STEPS[session.step];

  // Handle confirmation step
  if (currentStep === 'confirm') {
    const lower = userText.toLowerCase().trim();
    const isYes = /^(yes|yeah|yep|y|correct|confirm|نعم|أيوا|ايوا|اي|صح|صحيح|تمام|اكيد|أكيد)$/i.test(lower);
    const isNo = /^(no|nope|n|wrong|غلط|لا|لأ|خطأ)$/i.test(lower);

    if (isYes) {
      return '__SAVE_BOOKING__';
    }
    if (isNo) {
      session.step = 0;
      session.data = {};
      const q = BOOKING_QUESTIONS[BOOKING_STEPS[0]];
      const msg = language === 'ar'
        ? "لا بأس! هيا نبدأ من جديد.\n\n"
        : "No problem! Let's start over.\n\n";
      return msg + q[language];
    }
    return language === 'ar'
      ? "يرجى الإجابة بـ 'نعم' أو 'لا'."
      : "Please answer 'yes' or 'no'.";
  }

  // Validate current field
  const error = validateField(currentStep, userText);
  if (error) {
    return error[language] || error.en;
  }

  // Store the validated value
  if (currentStep === 'service') {
    session.data[currentStep] = parseService(userText);
  } else if (currentStep === 'child_age') {
    const num = userText.match(/\d+/)?.[0];
    session.data[currentStep] = num ? `${num} years` : userText.trim();
  } else {
    session.data[currentStep] = userText.trim();
  }

  // Move to next step
  session.step++;
  const nextStep = BOOKING_STEPS[session.step];

  if (nextStep === 'confirm') {
    return getBookingSummary(session.data, language);
  }

  const q = BOOKING_QUESTIONS[nextStep];
  return q[language];
}

function startBookingFlow(sessionId, language) {
  const session = { step: 0, data: {}, language };
  bookingSessions.set(sessionId, session);
  const q = BOOKING_QUESTIONS[BOOKING_STEPS[0]];
  const intro = language === 'ar'
    ? "يسعدني مساعدتك في حجز موعد! هيا نبدأ.\n\n"
    : "I'd love to help you book an appointment! Let's get started.\n\n";
  return intro + q[language];
}

// Clean up old sessions every 30 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, val] of bookingSessions) {
    if (now - (val.createdAt || 0) > 30 * 60 * 1000) bookingSessions.delete(key);
  }
}, 30 * 60 * 1000);

// ═══════════════════════════════════════
// MAIN ROUTE
// ═══════════════════════════════════════

router.post('/', async (req, res) => {
  try {
    const { messages, session_id, page_url, user_agent, is_new_session } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Invalid messages' });
    }
    if (messages.length > 30) {
      return res.status(400).json({ error: 'Conversation too long. Please start a new chat.' });
    }
    if (messages.some(m => typeof m.content === 'string' && m.content.length > 2000)) {
      return res.status(400).json({ error: 'Message too long. Please shorten your message.' });
    }

    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
    if (!lastUserMsg) return res.status(400).json({ error: 'No user message found' });

    const userText = lastUserMsg.content.trim();
    const language = detectLanguageFromText(userText);

    await upsertSession({ sessionId: session_id, language, pageUrl: page_url, userAgent: user_agent, isNew: is_new_session });
    await saveMsg({ sessionId: session_id, role: 'user', content: userText, language });

    // CHECK IF IN ACTIVE BOOKING FLOW
    if (bookingSessions.has(session_id)) {
      const bookingLang = bookingSessions.get(session_id).language || language;
      const reply = handleBookingFlow(session_id, userText, bookingLang);

      if (reply === '__SAVE_BOOKING__') {
        const session = bookingSessions.get(session_id) || { data: {} };
        const saved = await saveAppointmentToDB(session.data, session_id, bookingLang);
        bookingSessions.delete(session_id);
        const confirmMsg = saved
          ? (bookingLang === 'ar'
            ? "تم استلام طلب حجزك بنجاح! ✓\n\nسيتواصل معك فريقنا خلال 24 ساعة لتأكيد الموعد. شكراً لثقتك بمركز ريادة!"
            : "Your appointment request has been received! ✓\n\nOur team will contact you within 24 hours to confirm. Thank you for choosing Riyada Center!")
          : (bookingLang === 'ar'
            ? "عذراً، حدث خطأ في حفظ الحجز. يرجى التواصل معنا مباشرة على RC@riyada-ventures.com"
            : "Sorry, there was an error saving your booking. Please contact us directly at RC@riyada-ventures.com");
        await saveMsg({ sessionId: session_id, role: 'assistant', content: confirmMsg, language });
        return res.json({ content: [{ type: 'text', text: confirmMsg }] });
      }

      await saveMsg({ sessionId: session_id, role: 'assistant', content: reply, language });
      return res.json({ content: [{ type: 'text', text: reply }] });
    }

    // TRY INSTANT RESPONSE
    const instant = tryInstantResponse(userText, language);

    if (instant === '__START_BOOKING__') {
      const reply = startBookingFlow(session_id, language);
      await saveMsg({ sessionId: session_id, role: 'assistant', content: reply, language });
      return res.json({ content: [{ type: 'text', text: reply }] });
    }

    if (instant) {
      await saveMsg({ sessionId: session_id, role: 'assistant', content: instant, language });
      return res.json({ content: [{ type: 'text', text: instant }] });
    }

    // DEFAULT: off-topic response (safer than calling rate-limited LLM)
    const fallback = language === 'ar' ? OFF_TOPIC_AR : OFF_TOPIC_EN;
    await saveMsg({ sessionId: session_id, role: 'assistant', content: fallback, language });
    return res.json({ content: [{ type: 'text', text: fallback }] });

  } catch (error) {
    console.error('[Chat API Error]', error);
    res.status(500).json({ content: [{ type: 'text', text: 'عذراً، حدث خطأ. يرجى المحاولة مرة أخرى.\nSorry, something went wrong. Please try again.' }] });
  }
});

module.exports = router;
