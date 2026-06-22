import { Brain, FileText, Target, Lightbulb, CheckCircle2 } from 'lucide-react';
import ServicePageTemplate from '../components/services/ServicePageTemplate';
import type { ServiceStep, ServiceFaq, ServiceCondition } from '../components/services/ServicePageTemplate';
import SEO from '../components/SEO';
import { ServiceSchema, BreadcrumbSchema, FAQSchema } from '../components/StructuredData';
import { useLanguage } from '../LanguageProvider';
import { getPageSEO } from '../seo';

const whatWeDo = [
  { en: 'Individualized behavior intervention plans', ar: 'خطط تدخل سلوكي فردية' },
  { en: 'Positive reinforcement strategies', ar: 'استراتيجيات التعزيز الإيجابي' },
  { en: 'Social skills training', ar: 'تدريب المهارات الاجتماعية' },
  { en: 'Communication development', ar: 'تنمية التواصل' },
  { en: 'Parent and caregiver training', ar: 'تدريب الوالدين ومقدمي الرعاية' },
  { en: 'Progress monitoring and data tracking', ar: 'متابعة التقدم وتتبع البيانات' },
];

const conditions: ServiceCondition[] = [
  { label: 'Autism Spectrum Disorder', labelAR: 'اضطراب طيف التوحد' },
  { label: 'Behavioral Outbursts', labelAR: 'النوبات السلوكية' },
  { label: 'Self-Injurious Behavior', labelAR: 'السلوك الإيذائي للنفس' },
  { label: 'Social Communication Difficulties', labelAR: 'صعوبات التواصل الاجتماعي' },
  { label: 'Repetitive Behaviors', labelAR: 'السلوكيات التكرارية' },
  { label: 'Daily Living Skill Deficits', labelAR: 'قصور مهارات الحياة اليومية' },
];

const processSteps: ServiceStep[] = [
  {
    number: '01',
    title: 'Behavioral Assessment',
    titleAR: 'التقييم السلوكي',
    description: 'A board-certified behavior analyst conducts a comprehensive functional assessment to identify the child\'s current skills, behaviors, and areas for growth.',
    descriptionAR: 'يُجري محلل سلوك معتمد تقييمًا وظيفيًا شاملاً لتحديد مهارات الطفل الحالية وسلوكياته ومجالات النمو.',
    icon: FileText,
    color: '#3355EE',
  },
  {
    number: '02',
    title: 'Personalized Plan',
    titleAR: 'الخطة الشخصية',
    description: 'A behavior analyst designs a tailored ABA program with individualized goals, measurable targets, and reinforcement strategies suited to your child.',
    descriptionAR: 'يُصمم محلل سلوك برنامج ABA مخصصًا بأهداف فردية وأهداف قابلة للقياس واستراتيجيات تعزيز تناسب طفلك.',
    icon: Target,
    color: '#E91E8C',
  },
  {
    number: '03',
    title: 'Structured Sessions',
    titleAR: 'الجلسات المنظمة',
    description: 'One-on-one and small-group sessions in a supportive, structured environment using play-based and naturalistic teaching strategies.',
    descriptionAR: 'جلسات فردية وجماعية صغيرة في بيئة داعمة ومنظمة تستخدم أساليب التعليم القائم على اللعب والتعليم الطبيعي.',
    icon: Lightbulb,
    color: '#3DBE6E',
  },
  {
    number: '04',
    title: 'Family Training & Review',
    titleAR: 'تدريب الأسرة والمراجعة',
    description: 'We train caregivers on ABA techniques and review goals monthly with the family to ensure continuous, meaningful progress.',
    descriptionAR: 'ندرّب مقدمي الرعاية على تقنيات ABA ونراجع الأهداف شهريًا مع الأسرة لضمان تقدم مستمر وهادف.',
    icon: CheckCircle2,
    color: '#FFCC22',
  },
];

const faqs: ServiceFaq[] = [
  {
    q: 'What is ABA therapy?',
    qAR: 'ما هو علاج ABA؟',
    a: 'Applied Behavior Analysis is a scientific approach to understanding and improving behaviors. It is one of the most researched and effective therapies for children with autism and related conditions.',
    aAR: 'تحليل السلوك التطبيقي هو نهج علمي لفهم السلوكيات وتحسينها. وهو من أكثر العلاجات بحثًا وفاعليةً للأطفال المصابين بالتوحد والحالات ذات الصلة.',
  },
  {
    q: 'How many hours per week are recommended?',
    qAR: 'كم عدد ساعات الأسبوع الموصى بها؟',
    a: 'Intensity varies by need. Some children benefit from 10 hours per week, while others may need 20–30 hours. We determine the right amount through assessment.',
    aAR: 'تتفاوت الكثافة حسب الاحتياج. يستفيد بعض الأطفال من 10 ساعات أسبوعيًا، بينما قد يحتاج آخرون إلى 20-30 ساعة. نحدد المقدار الصحيح عبر التقييم.',
  },
  {
    q: 'Will there be practice at home?',
    qAR: 'هل سيكون هناك تمرين في المنزل؟',
    a: 'Yes. Parent training is an essential part of ABA. We coach families on techniques to reinforce skills naturally throughout the day.',
    aAR: 'نعم. تدريب الوالدين جزء أساسي من ABA. نُدرّب الأسر على تقنيات تعزيز المهارات بشكل طبيعي على مدار اليوم.',
  },
  {
    q: 'How long until we see progress?',
    qAR: 'متى نبدأ بملاحظة التقدم؟',
    a: 'Many families notice changes within 4–8 weeks. Significant skill development typically takes 3–6 months of consistent therapy.',
    aAR: 'تلاحظ كثير من الأسر تغييرات في غضون 4-8 أسابيع. يستغرق التطور المهاري الملحوظ عادةً 3-6 أشهر من العلاج المنتظم.',
  },
  {
    q: 'Is ABA only for children with autism?',
    qAR: 'هل ABA مخصص فقط للأطفال المصابين بالتوحد؟',
    a: 'While ABA is most commonly used for autism, it is also effective for ADHD, behavioral challenges, and other developmental needs.',
    aAR: 'على الرغم من أن ABA يُستخدم في الغالب لعلاج التوحد، فهو فعّال أيضًا لفرط الحركة والتحديات السلوكية واحتياجات النمو الأخرى.',
  },
];

const heroVisual = (
  <img
    src="/assets/mascots/behavior-guide.png"
    alt="Behavior Guide mascot"
    className="w-56 h-72 object-contain drop-shadow-lg z-10"
  />
);

export default function ABATherapyPage() {
  const { locale } = useLanguage();
  const seo = getPageSEO('abaTherapy', locale)!;

  return (
    <>
      <SEO {...seo} />
      <ServiceSchema name="ABA / Behavior Therapy" description={seo.description} url="/services/aba-therapy" />
      <BreadcrumbSchema items={[{ name: locale === 'ar' ? 'الرئيسية' : 'Home', url: '/' }, { name: locale === 'ar' ? 'الخدمات' : 'Services', url: '/services' }, { name: locale === 'ar' ? 'علاج ABA' : 'ABA Therapy', url: '/services/aba-therapy' }]} />
      <FAQSchema items={faqs.map(f => ({ question: locale === 'ar' ? f.qAR : f.q, answer: locale === 'ar' ? f.aAR : f.a }))} />
      <ServicePageTemplate
      heroBgStyle={{ backgroundColor: '#EEFF99' }}
      heroVisual={heroVisual}
      tagIcon={Brain}
      tagBgClass="bg-brand-blue/10 text-brand-blue"
      title={{ en: 'ABA / Behavior Therapy', ar: 'العلاج السلوكي ABA' }}
      tagline={{
        en: 'Evidence-based strategies to build positive behaviors and essential life skills.',
        ar: 'استراتيجيات قائمة على الأدلة لبناء سلوكيات إيجابية ومهارات حياتية أساسية.',
      }}
      about={{
        en: [
          'Applied Behavior Analysis is a scientifically validated therapy that helps children develop essential communication, social, and daily living skills by reinforcing positive behaviors and reducing harmful ones in a structured, supportive environment.',
        ],
        ar: [
          'تحليل السلوك التطبيقي علاج مُثبت علميًا يساعد الأطفال على تطوير مهارات التواصل والتفاعل الاجتماعي والحياة اليومية من خلال تعزيز السلوكيات الإيجابية والحد من السلبية في بيئة منظمة وداعمة.',
        ],
      }}
      whatWeDo={whatWeDo}
      conditions={conditions}
      processSteps={processSteps}
      faqs={faqs}
      ctaTitle={{
        en: 'Ready to Help Your Child Thrive?',
        ar: 'هل أنت مستعد لمساعدة طفلك على الازدهار؟',
      }}
      ctaMascotSrc="/assets/mascots/behavior-guide.png"
    />
    </>
  );
}
