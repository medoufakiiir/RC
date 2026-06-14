import { ClipboardList, FileText, Target, Lightbulb, CheckCircle2 } from 'lucide-react';
import ServicePageTemplate from '../components/services/ServicePageTemplate';
import type { ServiceStep, ServiceFaq, ServiceCondition } from '../components/services/ServicePageTemplate';

const whatWeDo = [
  { en: 'Developmental screening', ar: 'الفحص النمائي' },
  { en: 'Cognitive and behavioral assessments', ar: 'تقييمات معرفية وسلوكية' },
  { en: 'Speech and language evaluations', ar: 'تقييمات النطق واللغة' },
  { en: 'Sensory processing assessments', ar: 'تقييمات المعالجة الحسية' },
  { en: 'Personalized roadmap creation', ar: 'إعداد خارطة طريق شخصية' },
  { en: 'Family consultation and goal-setting', ar: 'استشارة الأسرة وتحديد الأهداف' },
];

const conditions: ServiceCondition[] = [
  { label: 'Developmental Delays', labelAR: 'تأخر النمو' },
  { label: 'Autism Spectrum Disorder', labelAR: 'اضطراب طيف التوحد' },
  { label: 'Learning Difficulties', labelAR: 'صعوبات التعلم' },
  { label: 'ADHD', labelAR: 'اضطراب نقص الانتباه وفرط الحركة' },
  { label: 'Speech Disorders', labelAR: 'اضطرابات النطق' },
  { label: 'Behavioral Challenges', labelAR: 'التحديات السلوكية' },
  { label: 'Sensory Processing Issues', labelAR: 'مشكلات المعالجة الحسية' },
];

const processSteps: ServiceStep[] = [
  {
    number: '01',
    title: 'Initial Consultation',
    titleAR: 'الاستشارة الأولية',
    description: 'We meet with the family to discuss the child\'s developmental history, concerns, and goals — helping us design the most effective evaluation plan.',
    descriptionAR: 'نلتقي بالأسرة لمناقشة التاريخ النمائي للطفل ومخاوفهم وأهدافهم، مما يساعدنا في وضع خطة التقييم الأنسب.',
    icon: FileText,
    color: '#3355EE',
  },
  {
    number: '02',
    title: 'Comprehensive Evaluation',
    titleAR: 'التقييم الشامل',
    description: 'Our certified specialists conduct a full multi-disciplinary assessment using standardized tools and clinical observation across all developmental domains.',
    descriptionAR: 'يُجري متخصصونا المعتمدون تقييمًا شاملاً متعدد التخصصات باستخدام أدوات معيارية وملاحظة سريرية في جميع مجالات النمو.',
    icon: Target,
    color: '#FF4D94',
  },
  {
    number: '03',
    title: 'Results & Roadmap',
    titleAR: 'النتائج وخارطة الطريق',
    description: 'We present findings in a detailed written report and meet with the family to explain results, discuss diagnosis, and recommend a clear personalized therapy plan.',
    descriptionAR: 'نقدم نتائجنا في تقرير مكتوب مفصل ونلتقي بالأسرة لشرح النتائج ومناقشة التشخيص والتوصية بخطة علاجية شخصية واضحة.',
    icon: Lightbulb,
    color: '#33CC44',
  },
  {
    number: '04',
    title: 'Begin Therapy',
    titleAR: 'بدء العلاج',
    description: 'The child begins their tailored therapy program with goals and progress tracked consistently to adapt the plan as they grow.',
    descriptionAR: 'يبدأ الطفل برنامجه العلاجي المخصص مع متابعة منتظمة للأهداف والتقدم لضمان تكيّف الخطة مع نموه.',
    icon: CheckCircle2,
    color: '#FFCC22',
  },
];

const faqs: ServiceFaq[] = [
  {
    q: 'How long does an assessment take?',
    qAR: 'كم تستغرق عملية التقييم؟',
    a: 'Comprehensive assessments typically take 2–3 hours spread over one or two sessions, depending on the type of evaluation needed.',
    aAR: 'تستغرق التقييمات الشاملة عادةً 2-3 ساعات موزعة على جلسة أو جلستين، حسب نوع التقييم المطلوب.',
  },
  {
    q: 'What age can children be assessed?',
    qAR: 'ما هو العمر الذي يمكن تقييم الأطفال فيه؟',
    a: 'We assess children from 2.5 to 12 years old. Early assessment leads to earlier intervention and better outcomes.',
    aAR: 'نُجري تقييمات للأطفال من عمر 2.5 إلى 12 سنة. التقييم المبكر يؤدي إلى تدخل أسرع ونتائج أفضل.',
  },
  {
    q: 'Do I need a referral from a doctor?',
    qAR: 'هل أحتاج إلى إحالة من طبيب؟',
    a: 'No referral is required. Families can contact us directly to schedule an assessment at any time.',
    aAR: 'لا حاجة لإحالة طبية. يمكن للأسر التواصل معنا مباشرةً لتحديد موعد التقييم في أي وقت.',
  },
  {
    q: 'Will my child find the assessment stressful?',
    qAR: 'هل سيشعر طفلي بالضغط خلال التقييم؟',
    a: 'Our assessments are designed to be child-friendly and engaging. We use play-based methods to keep children comfortable and at ease throughout.',
    aAR: 'صُمِّمت تقييماتنا لتكون ودية للأطفال وجذابة. نستخدم أساليب قائمة على اللعب لإبقاء الطفل مرتاحًا ومطمئنًا طوال الجلسة.',
  },
  {
    q: 'What happens after the assessment?',
    qAR: 'ماذا يحدث بعد التقييم؟',
    a: 'You receive a detailed written report with findings and recommendations, followed by a family meeting to plan the next steps together.',
    aAR: 'ستتلقون تقريرًا مكتوبًا مفصلاً يتضمن النتائج والتوصيات، يعقبه اجتماع عائلي للتخطيط للخطوات التالية معًا.',
  },
];

const heroVisual = (
  <div className="w-28 h-28 rounded-3xl bg-[#FFCC22]/30 flex items-center justify-center z-10">
    <ClipboardList size={56} style={{ color: '#FFCC22' }} />
  </div>
);

export default function AssessmentsPage() {
  return (
    <ServicePageTemplate
      heroBgStyle={{ backgroundColor: '#FEF7CD' }}
      heroVisual={heroVisual}
      tagIcon={ClipboardList}
      tagBgClass="bg-brand-yellow/20 text-[#5C3D00] dark:text-brand-yellow"
      title={{ en: 'Assessments & Consultations', ar: 'التقييمات والاستشارات' }}
      tagline={{
        en: 'Understanding your child\'s needs is the first step. Our comprehensive assessment provides clarity and direction for your child\'s developmental journey.',
        ar: 'فهم احتياجات طفلك هو الخطوة الأولى. يمنح تقييمنا الشامل الوضوح والاتجاه لرحلة طفلك في التطور.',
      }}
      about={{
        en: [
          'Comprehensive developmental evaluations that give families a clear picture of their child\'s strengths, challenges, and the best path forward. Our assessments are conducted by certified specialists using internationally recognized tools.',
        ],
        ar: [
          'تقييمات نمائية شاملة تمنح الأسر صورة واضحة عن نقاط قوة طفلهم وتحدياته وأفضل مسار للمضي قدمًا. تُجرى تقييماتنا من قِبل متخصصين معتمدين باستخدام أدوات معترف بها دوليًا.',
        ],
      }}
      whatWeDo={whatWeDo}
      conditions={conditions}
      processSteps={processSteps}
      faqs={faqs}
      ctaTitle={{
        en: 'Ready to Understand Your Child Better?',
        ar: 'هل أنت مستعد لفهم طفلك بشكل أعمق؟',
      }}
    />
  );
}
