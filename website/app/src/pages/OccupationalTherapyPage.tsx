import { Hand, FileText, Target, Lightbulb, CheckCircle2 } from 'lucide-react';
import ServicePageTemplate from '../components/services/ServicePageTemplate';
import type { ServiceStep, ServiceFaq, ServiceCondition } from '../components/services/ServicePageTemplate';

const whatWeDo = [
  { en: 'Fine motor skill development', ar: 'تنمية المهارات الحركية الدقيقة' },
  { en: 'Sensory integration therapy', ar: 'علاج التكامل الحسي' },
  { en: 'Handwriting and pencil grip training', ar: 'تدريب الكتابة اليدوية وإمساك القلم' },
  { en: 'Visual perception exercises', ar: 'تمارين الإدراك البصري' },
  { en: 'Self-care and daily living skills', ar: 'مهارات الرعاية الذاتية والحياة اليومية' },
  { en: 'Sensory diet planning', ar: 'تخطيط النظام الحسي' },
];

const conditions: ServiceCondition[] = [
  { label: 'Sensory Processing Disorder', labelAR: 'اضطراب المعالجة الحسية' },
  { label: 'Fine Motor Delays', labelAR: 'تأخر المهارات الحركية الدقيقة' },
  { label: 'Handwriting Difficulties', labelAR: 'صعوبات الكتابة اليدوية' },
  { label: 'Developmental Coordination Disorder', labelAR: 'اضطراب التنسيق التنموي' },
  { label: 'ADHD', labelAR: 'اضطراب نقص الانتباه وفرط الحركة' },
  { label: 'Autism Spectrum Disorder', labelAR: 'اضطراب طيف التوحد' },
  { label: 'Low Muscle Tone', labelAR: 'ضعف قوة العضلات' },
];

const processSteps: ServiceStep[] = [
  {
    number: '01',
    title: 'OT Assessment',
    titleAR: 'تقييم العلاج الوظيفي',
    description: 'Our occupational therapist evaluates the child\'s sensory processing, fine motor skills, visual perception, and ability to perform daily activities.',
    descriptionAR: 'يقيّم معالجنا الوظيفي معالجة الحواس والمهارات الحركية الدقيقة والإدراك البصري وقدرة الطفل على أداء الأنشطة اليومية.',
    icon: FileText,
    color: '#3355EE',
  },
  {
    number: '02',
    title: 'Therapy Plan',
    titleAR: 'خطة العلاج',
    description: 'A customized occupational therapy program is designed, with individualized goals focused on the skills that matter most for the child\'s independence.',
    descriptionAR: 'يُصمم برنامج علاج وظيفي مخصص بأهداف فردية تركز على المهارات الأكثر أهميةً لاستقلالية الطفل.',
    icon: Target,
    color: '#E91E8C',
  },
  {
    number: '03',
    title: 'Hands-On Sessions',
    titleAR: 'الجلسات التطبيقية',
    description: 'Engaging, activity-based therapy in our sensory-equipped rooms. Sessions are designed to be fun while building real functional skills.',
    descriptionAR: 'علاج ممتع قائم على الأنشطة في غرفنا المجهزة حسيًا. صُمِّمت الجلسات لتكون ممتعة مع بناء مهارات وظيفية حقيقية.',
    icon: Lightbulb,
    color: '#3DBE6E',
  },
  {
    number: '04',
    title: 'Family Integration',
    titleAR: 'الاندماج الأسري',
    description: 'We coach families on carrying learned skills into daily home routines, with regular progress reviews to adapt the plan as the child grows.',
    descriptionAR: 'ندرّب الأسر على دمج المهارات المكتسبة في الروتين اليومي المنزلي، مع مراجعات منتظمة للتقدم لتكييف الخطة مع نمو الطفل.',
    icon: CheckCircle2,
    color: '#FFCC22',
  },
];

const faqs: ServiceFaq[] = [
  {
    q: 'What does an occupational therapist actually do with my child?',
    qAR: 'ماذا يفعل المعالج الوظيفي مع طفلي تحديدًا؟',
    a: 'Our OTs use structured play, sensory activities, and skill-building exercises tailored to help your child manage daily tasks more independently — from buttoning clothes to holding a pencil.',
    aAR: 'يستخدم معالجونا الوظيفيون اللعب المنظم والأنشطة الحسية وتمارين بناء المهارات المصممة لمساعدة طفلك على أداء المهام اليومية باستقلالية أكبر — من تزرير الملابس إلى إمساك القلم.',
  },
  {
    q: 'How do I know if my child needs occupational therapy?',
    qAR: 'كيف أعرف إن كان طفلي بحاجة إلى علاج وظيفي؟',
    a: 'Signs include difficulty with handwriting, dressing, using utensils, avoiding tactile activities, or appearing clumsy. A free consultation can help determine whether OT is the right fit.',
    aAR: 'تشمل العلامات صعوبة الكتابة أو ارتداء الملابس أو استخدام الأدوات، وتجنب الأنشطة اللمسية، أو الحركة غير المنسجمة. استشارة مجانية تساعد في تحديد ما إذا كان العلاج الوظيفي مناسبًا.',
  },
  {
    q: 'What are sensory processing difficulties?',
    qAR: 'ما هي صعوبات المعالجة الحسية؟',
    a: 'Some children are over- or under-sensitive to sensory input such as sound, touch, or movement. This can affect their ability to focus, participate in activities, and regulate emotions.',
    aAR: 'بعض الأطفال حساسون زيادة أو نقصًا تجاه المدخلات الحسية كالصوت واللمس والحركة، مما قد يؤثر على قدرتهم على التركيز والمشاركة في الأنشطة وضبط المشاعر.',
  },
  {
    q: 'Will my child need special equipment or tools?',
    qAR: 'هل سيحتاج طفلي إلى أدوات أو معدات خاصة؟',
    a: 'Some children benefit from sensory tools such as weighted vests, fidget tools, or special pencil grips. We guide families on appropriate options based on the child\'s profile.',
    aAR: 'يستفيد بعض الأطفال من أدوات حسية كالسترات الثقيلة أو أدوات التركيز أو أقلام الإمساك الخاصة. نرشد الأسر إلى الخيارات المناسبة بناءً على ملف طفلهم.',
  },
  {
    q: 'How does OT help with school performance?',
    qAR: 'كيف يساعد العلاج الوظيفي على تحسين الأداء المدرسي؟',
    a: 'Occupational therapy strengthens the skills needed for classroom success — handwriting, attention span, organization, and the ability to sit and focus during lessons.',
    aAR: 'يُعزز العلاج الوظيفي المهارات اللازمة للنجاح في الفصل الدراسي — الكتابة اليدوية وفترة الانتباه والتنظيم والقدرة على الجلوس والتركيز أثناء الدروس.',
  },
];

const heroVisual = (
  <img
    src="/assets/mascots/skill-builder.png"
    alt="Skill Builder mascot"
    className="w-56 h-72 object-contain drop-shadow-lg z-10"
  />
);

export default function OccupationalTherapyPage() {
  return (
    <ServicePageTemplate
      heroBgStyle={{ backgroundColor: '#C8F5B5' }}
      heroVisual={heroVisual}
      tagIcon={Hand}
      tagBgClass="bg-brand-green/10 text-brand-green"
      title={{ en: 'Occupational Therapy', ar: 'العلاج الوظيفي' }}
      tagline={{
        en: 'Helping children master everyday activities with confidence and independence.',
        ar: 'مساعدة الأطفال على إتقان الأنشطة اليومية بثقة واستقلالية.',
      }}
      about={{
        en: [
          'Occupational therapy helps children develop the physical, cognitive, and sensory skills they need to participate in everyday activities — from getting dressed and writing to playing and socializing with peers.',
        ],
        ar: [
          'يساعد العلاج الوظيفي الأطفال على تطوير المهارات الجسدية والمعرفية والحسية اللازمة للمشاركة في الأنشطة اليومية — من ارتداء الملابس والكتابة إلى اللعب والتفاعل مع الأقران.',
        ],
      }}
      whatWeDo={whatWeDo}
      conditions={conditions}
      processSteps={processSteps}
      faqs={faqs}
      ctaTitle={{
        en: 'Ready to Help Your Child Navigate Daily Life with Confidence?',
        ar: 'هل أنت مستعد لمساعدة طفلك على التنقل بثقة في حياته اليومية؟',
      }}
      ctaMascotSrc="/assets/mascots/skill-builder.png"
    />
  );
}
