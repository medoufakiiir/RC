const express = require('express');
const prisma = require('../db');
const { getSystemPrompt } = require('../chatbot/system-prompt');

const router = express.Router();

function getAllProviders() {
  const providers = [];
  if (process.env.GROQ_API_KEY) {
    providers.push({
      url: 'https://api.groq.com/openai/v1/chat/completions',
      key: process.env.GROQ_API_KEY,
      model: 'llama-3.3-70b-versatile',
      name: 'groq-70b',
    });
    providers.push({
      url: 'https://api.groq.com/openai/v1/chat/completions',
      key: process.env.GROQ_API_KEY,
      model: 'llama-3.1-8b-instant',
      name: 'groq-8b',
    });
  }
  if (process.env.GEMINI_API_KEY) providers.push({
    url: 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',
    key: process.env.GEMINI_API_KEY,
    model: 'gemini-2.0-flash',
    name: 'gemini',
  });
  if (process.env.DEEPSEEK_API_KEY) providers.push({
    url: 'https://api.deepseek.com/v1/chat/completions',
    key: process.env.DEEPSEEK_API_KEY,
    model: 'deepseek-chat',
    name: 'deepseek',
  });
  return providers;
}

// ═══════════════════════════════════════
// INSTANT RESPONSES — no LLM call needed
// ═══════════════════════════════════════
const INSTANT_RESPONSES = [
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
    keywords: ['physical therapy', ' pt ', 'walking', 'crawling', 'balance', 'motor', 'طبيعي', 'مشي', 'حركة', 'توازن'],
    en: "Our Physical Therapy helps children with:\n• Gross motor delays (crawling, walking, running)\n• Balance and coordination\n• Neurological conditions like cerebral palsy\n• Muscle weakness or tone issues\n\nWould you like to book an assessment?",
    ar: "العلاج الطبيعي يساعد الأطفال في:\n• تأخر المهارات الحركية الكبرى (الزحف، المشي، الركض)\n• التوازن والتنسيق\n• الحالات العصبية مثل الشلل الدماغي\n• ضعف العضلات أو مشاكل التوتر العضلي\n\nهل تود حجز تقييم؟",
  },
  {
    keywords: ['aba', 'behavior', 'autism', 'autistic', 'asd', 'سلوك', 'سلوكي', 'توحد'],
    en: "Our ABA (Applied Behavior Analysis) Therapy helps children with:\n• Autism Spectrum Disorder (ASD) support\n• Behavioral challenges and self-regulation\n• Social skills development\n• Communication through positive behavior\n\nWould you like to book an assessment?",
    ar: "علاج ABA (تحليل السلوك التطبيقي) يساعد الأطفال في:\n• دعم اضطراب طيف التوحد\n• التحديات السلوكية والتنظيم الذاتي\n• تطوير المهارات الاجتماعية\n• التواصل من خلال السلوك الإيجابي\n\nهل تود حجز تقييم؟",
  },
  {
    keywords: ['assessment', 'evaluation', 'diagnos', 'check', 'test', 'تقييم', 'فحص', 'تشخيص'],
    en: "Our Developmental Assessment is a comprehensive evaluation that:\n• Identifies your child's strengths and areas needing support\n• Creates a personalized therapy plan\n• Is the best starting point if you're unsure which therapy fits\n\nWould you like to book one?",
    ar: "التقييم التطوري هو تقييم شامل:\n• يحدد نقاط قوة طفلك والمجالات التي تحتاج دعم\n• ينشئ خطة علاج مخصصة\n• هو أفضل نقطة بداية إذا كنت غير متأكد أي علاج يناسب طفلك\n\nهل تود حجز تقييم؟",
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
      return language === 'ar' ? entry.ar : entry.en;
    }
  }

  return null;
}

// ═══════════════════════════════════════
// LLM + BOOKING (only when needed)
// ═══════════════════════════════════════

const tools = [
  {
    type: 'function',
    function: {
      name: 'book_appointment',
      description: 'ONLY call this after you have explicitly collected AND confirmed ALL 5 required fields from the user: parent_name, child_name, child_age, service, phone. Do NOT call this if any field is missing or was not directly provided by the user.',
      parameters: {
        type: 'object',
        properties: {
          parent_name:    { type: 'string', description: 'Full name of parent — MUST be explicitly provided by user' },
          child_name:     { type: 'string', description: 'Child name — MUST be explicitly provided by user' },
          child_age:      { type: 'string', description: 'Child age — MUST be explicitly provided by user' },
          service:        { type: 'string', description: 'Therapy service' },
          phone:          { type: 'string', description: 'Phone number — MUST be explicitly provided by user' },
          preferred_time: { type: 'string', description: 'Preferred days or times' },
          notes:          { type: 'string', description: 'Additional notes' },
          language:       { type: 'string', enum: ['ar', 'en'], description: 'Conversation language' },
        },
        required: ['parent_name', 'child_name', 'child_age', 'service', 'phone'],
      },
    },
  },
];

function cleanResponse(text) {
  return text
    .replace(/[一-鿿㐀-䶿豈-﫿]/g, '')
    .replace(/[　-〿぀-ゟ゠-ヿ]/g, '')
    .replace(/[가-힯]/g, '')
    .replace(/[đĐơƠưƯăĂ]/g, '')
    .replace(/để|của|với|và|không|này|những/g, '')
    .replace(/我们|你好|的|了|在|是|有|这|那|什么|可以/g, '')
    .replace(/，/g, '،')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function detectLanguage(messages) {
  const lastUserMsg = [...messages].reverse().find(m => m.role === 'user')?.content ?? '';
  return detectLanguageFromText(lastUserMsg);
}

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

const VALID_SERVICES = [
  'speech', 'language', 'نطق', 'لغة',
  'occupational', 'ot', 'وظيفي',
  'physical', 'pt', 'طبيعي',
  'aba', 'behavior', 'سلوك', 'سلوكي',
  'assessment', 'evaluation', 'تقييم',
];

function validateAppointment(data) {
  if (!data.parent_name || data.parent_name.trim().split(/\s+/).length < 2) return 'Invalid parent name';
  if (!data.child_name || data.child_name.trim().length < 2) return 'Invalid child name';
  if (!data.child_age) return 'Missing child age';
  const ageNum = parseInt(data.child_age);
  if (isNaN(ageNum) && !/\d/.test(data.child_age)) return 'Invalid child age';
  if (!isNaN(ageNum) && (ageNum < 0 || ageNum > 18)) return 'Child age must be 0-18';
  if (!data.phone) return 'Missing phone';
  const digits = data.phone.replace(/\D/g, '');
  if (digits.length < 8) return 'Phone number too short';
  if (!data.service) return 'Missing service';
  const svcLower = data.service.toLowerCase();
  if (!VALID_SERVICES.some(s => svcLower.includes(s))) return 'Service not recognized';
  return null;
}

async function saveAppointment(data, sessionId) {
  const error = validateAppointment(data);
  if (error) {
    console.error('[saveAppointment] Validation failed:', error, data);
    return false;
  }
  try {
    await prisma.chatbotAppointment.create({
      data: {
        sessionId: sessionId ?? null,
        parentName: data.parent_name.trim(), childName: data.child_name.trim(), childAge: data.child_age || '',
        service: data.service || '', phone: data.phone.trim(),
        preferredTime: data.preferred_time ?? null, notes: data.notes ?? null,
        language: data.language ?? 'ar', status: 'pending', source: 'chatbot',
      },
    });
    return true;
  } catch (e) { console.error('[saveAppointment]', e.message); return false; }
}

async function callLLM(providers, messages, useTools = true) {
  let lastError;
  for (const provider of providers) {
    try {
      const body = {
        model: provider.model,
        messages,
        max_tokens: 1024,
        temperature: 0.3,
      };
      if (useTools && provider.name !== 'gemini') body.tools = tools;
      if (useTools && provider.name !== 'gemini') body.tool_choice = 'auto';

      const res = await fetch(provider.url, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${provider.key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.text();
        console.error(`[LLM] ${provider.name} HTTP ${res.status}:`, err.slice(0, 300));
        lastError = new Error(res.status === 429 ? `${provider.name} rate limited` : `${provider.name} error: ${res.status}`);
        continue;
      }
      return { result: await res.json(), provider };
    } catch (e) {
      console.error(`[LLM] ${provider.name} failed:`, e.message);
      lastError = e;
    }
  }
  throw lastError || new Error('No LLM providers available');
}

// ═══════════════════════════════════════
// MAIN ROUTE
// ═══════════════════════════════════════

router.post('/', async (req, res) => {
  try {
    const { messages, session_id, page_url, user_agent, is_new_session } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Invalid messages' });
    }
    if (messages.length > 20) {
      return res.status(400).json({ error: 'Conversation too long. Please start a new chat.' });
    }
    if (messages.some(m => typeof m.content === 'string' && m.content.length > 2000)) {
      return res.status(400).json({ error: 'Message too long. Please shorten your message.' });
    }

    const language = detectLanguage(messages);
    await upsertSession({ sessionId: session_id, language, pageUrl: page_url, userAgent: user_agent, isNew: is_new_session });

    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
    if (lastUserMsg) await saveMsg({ sessionId: session_id, role: 'user', content: lastUserMsg.content, language });

    // TRY INSTANT RESPONSE FIRST (no LLM call = no rate limits)
    if (lastUserMsg && messages.length <= 2) {
      const instant = tryInstantResponse(lastUserMsg.content, language);
      if (instant) {
        console.log(`[Chat] Instant response for: "${lastUserMsg.content.slice(0, 50)}"`);
        await saveMsg({ sessionId: session_id, role: 'assistant', content: instant, language });
        return res.json({ content: [{ type: 'text', text: instant }] });
      }
    }

    // FALL BACK TO LLM for complex questions (booking flow, specific child concerns, etc.)
    const providers = getAllProviders();
    if (providers.length === 0) return res.status(500).json({ error: 'Chatbot not configured' });

    const langHint = language === 'en'
      ? '\n\nIMPORTANT: The user is writing in ENGLISH. You MUST reply ONLY in English. Do NOT reply in Arabic.'
      : language === 'ar'
      ? '\n\nIMPORTANT: المستخدم يكتب بالعربية. يجب أن ترد بالعربية فقط.'
      : '';

    const llmMessages = [
      { role: 'system', content: getSystemPrompt() + langHint },
      ...messages,
    ];

    const { result: response, provider: usedProvider } = await callLLM(providers, llmMessages);
    const choice = response.choices?.[0]?.message;

    if (!choice) return res.status(500).json({ error: 'No response from AI' });

    if (choice.tool_calls?.length > 0) {
      const toolCall = choice.tool_calls[0];
      if (toolCall.function.name === 'book_appointment') {
        const args = JSON.parse(toolCall.function.arguments);
        const saved = await saveAppointment(args, session_id);

        const { result: followUp } = await callLLM([usedProvider, ...providers.filter(p => p.name !== usedProvider.name)], [
          ...llmMessages,
          choice,
          {
            role: 'tool',
            tool_call_id: toolCall.id,
            content: saved
              ? 'Appointment request saved successfully. Tell the user their request has been received and our team will contact them within 24 hours to confirm the appointment.'
              : 'Booking FAILED — the information provided is incomplete or invalid. You MUST go back and collect the correct information from the user: parent full name (first + last), child name, child age (0-18), a valid phone number (at least 8 digits), and one of our 5 services. Ask one question at a time. Do NOT attempt to book again until all fields are valid.',
          },
        ], false);

        const raw = followUp.choices?.[0]?.message?.content ?? '';
        const replyText = cleanResponse(raw);
        if (replyText) await saveMsg({ sessionId: session_id, role: 'assistant', content: replyText, language });
        return res.json({ content: [{ type: 'text', text: replyText }] });
      }
    }

    const raw = choice.content ?? '';
    const replyText = cleanResponse(raw);
    if (replyText) await saveMsg({ sessionId: session_id, role: 'assistant', content: replyText, language });
    res.json({ content: [{ type: 'text', text: replyText }] });
  } catch (error) {
    console.error('[Chat API Error]', error);
    const isRateLimit = error.message?.includes('rate limit');
    const fallback = isRateLimit
      ? { content: [{ type: 'text', text: 'عذراً، الخدمة مشغولة حالياً. يرجى الانتظار قليلاً والمحاولة مرة أخرى.\n\nSorry, I\'m a bit busy right now. Please wait a moment and try again.' }] }
      : { error: 'Something went wrong.' };
    res.status(isRateLimit ? 429 : 500).json(fallback);
  }
});

module.exports = router;
