import { MessageCircle, FileText, Target, Lightbulb, CheckCircle2 } from 'lucide-react';
import ServicePageTemplate from '../components/services/ServicePageTemplate';
import type { ServiceStep, ServiceFaq, ServiceCondition } from '../components/services/ServicePageTemplate';

const whatWeDo = [
  { en: 'Articulation and pronunciation therapy', ar: 'علاج النطق والنطق الصحيح' },
  { en: 'Expressive and receptive language development', ar: 'تنمية اللغة التعبيرية والاستقبالية' },
  { en: 'Stuttering and fluency treatment', ar: 'علاج التلعثم والطلاقة' },
  { en: 'Augmentative and alternative communication (AAC)', ar: 'التواصل المعزز والبديل (AAC)' },
  { en: 'Social communication skills', ar: 'مهارات التواصل الاجتماعي' },
  { en: 'Feeding and swallowing therapy', ar: 'علاج التغذية والبلع' },
];

const conditions: ServiceCondition[] = [
  { label: 'Speech Delays', labelAR: 'تأخر الكلام' },
  { label: 'Stuttering', labelAR: 'التلعثم' },
  { label: 'Articulation Disorders', labelAR: 'اضطرابات النطق' },
  { label: 'Language Processing Difficulties', labelAR: 'صعوبات معالجة اللغة' },
  { label: 'Selective Mutism', labelAR: 'الصمت الانتقائي' },
  { label: 'Autism-Related Communication Challenges', labelAR: 'تحديات التواصل المرتبطة بالتوحد' },
  { label: 'Hearing Loss Impact on Speech', labelAR: 'أثر فقدان السمع على الكلام' },
];

const processSteps: ServiceStep[] = [
  {
    number: '01',
    title: 'Speech Evaluation',
    titleAR: 'تقييم النطق',
    description: 'A certified speech-language therapist conducts a comprehensive assessment of the child\'s articulation, language comprehension, and expressive communication abilities.',
    descriptionAR: 'يُجري اختصاصي نطق ولغة معتمد تقييمًا شاملاً لقدرات الطفل في النطق وفهم اللغة والتعبير التواصلي.',
    icon: FileText,
    color: '#3355EE',
  },
  {
    number: '02',
    title: 'Goal Setting',
    titleAR: 'تحديد الأهداف',
    description: 'We set clear, measurable speech and language goals in collaboration with the family, aligned with the child\'s unique needs and priorities.',
    descriptionAR: 'نضع أهدافًا واضحة وقابلة للقياس في النطق واللغة بالتعاون مع الأسرة، تتماشى مع احتياجات طفلك الفريدة وأولوياتهم.',
    icon: Target,
    color: '#FF4D94',
  },
  {
    number: '03',
    title: 'Therapy Sessions',
    titleAR: 'جلسات العلاج',
    description: 'Regular one-on-one sessions using play-based and structured evidence-based techniques. Parents receive guidance to reinforce skills at home.',
    descriptionAR: 'جلسات فردية منتظمة تستخدم تقنيات قائمة على اللعب ومبنية على الأدلة. يتلقى الوالدان إرشادات لتعزيز المهارات في المنزل.',
    icon: Lightbulb,
    color: '#33CC44',
  },
  {
    number: '04',
    title: 'Home Practice & Progress',
    titleAR: 'التمرين المنزلي والتقدم',
    description: 'We equip families with practical home exercises and track the child\'s progress monthly, adjusting goals as they continue to develop.',
    descriptionAR: 'نزوّد الأسر بتمارين منزلية عملية ونتابع تقدم الطفل شهريًا، مع تعديل الأهداف تبعًا لاستمرار نموه.',
    icon: CheckCircle2,
    color: '#FFCC22',
  },
];

const faqs: ServiceFaq[] = [
  {
    q: 'How long does each therapy session last?',
    qAR: 'كم مدة كل جلسة علاج؟',
    a: 'Standard sessions are 45 minutes, including time for parent consultation. Intensive sessions may be 60 minutes.',
    aAR: 'الجلسات القياسية مدتها 45 دقيقة، بما في ذلك وقت استشارة الوالد. قد تستمر الجلسات المكثفة 60 دقيقة.',
  },
  {
    q: 'How many sessions does my child need per week?',
    qAR: 'كم عدد الجلسات التي يحتاجها طفلي أسبوعيًا؟',
    a: 'This depends on the assessment results. Most children start with 1–2 sessions per week, adjusted based on progress.',
    aAR: 'يعتمد ذلك على نتائج التقييم. يبدأ معظم الأطفال بجلسة أو جلستين أسبوعيًا ويتم تعديلها بناءً على التقدم.',
  },
  {
    q: 'Can parents observe or participate in sessions?',
    qAR: 'هل يمكن للوالدين المشاركة أو الحضور في الجلسات؟',
    a: 'Absolutely! We encourage parent involvement and provide coaching so you can reinforce techniques at home.',
    aAR: 'بالتأكيد! نشجع مشاركة الوالدين ونوفر التدريب لتطبيق التقنيات في المنزل.',
  },
  {
    q: 'What age range do you work with?',
    qAR: 'ما هو النطاق العمري الذي تعملون معه؟',
    a: 'We provide speech and language therapy for children ages 3 to 12 years old.',
    aAR: 'نوفر علاج النطق واللغة للأطفال من عمر 3 إلى 12 سنة.',
  },
  {
    q: 'Do you offer sessions in Arabic?',
    qAR: 'هل تقدمون جلسات باللغة العربية؟',
    a: 'Yes. All our therapists are bilingual and provide sessions in both Arabic and English based on your child\'s needs.',
    aAR: 'نعم، جميع معالجينا ثنائيو اللغة ويقدمون جلسات باللغتين العربية والإنجليزية حسب حاجة طفلك.',
  },
];

const heroVisual = (
  <img
    src="/assets/mascots/language-explorer.png"
    alt="Language Explorer mascot"
    className="w-56 h-72 object-contain drop-shadow-lg z-10"
  />
);

export default function ServicesDetail() {
  return (
    <ServicePageTemplate
      heroBgStyle={{ backgroundColor: '#DDBAE8' }}
      heroVisual={heroVisual}
      tagIcon={MessageCircle}
      tagBgClass="bg-brand-purple/10 text-brand-purple"
      title={{ en: 'Speech & Language Therapy', ar: 'علاج النطق واللغة' }}
      tagline={{
        en: 'Helping children find their voice through evidence-based, play-centred therapy.',
        ar: 'مساعدة الأطفال على إيجاد أصواتهم من خلال علاج قائم على الأدلة ومحوره اللعب.',
      }}
      about={{
        en: [
          'Our speech and language therapy program supports children who face difficulties with communication, articulation, fluency, and language comprehension. Our certified therapists use evidence-based techniques tailored to each child\'s unique needs.',
          'We believe every child deserves the ability to express themselves clearly and confidently. Our sessions are engaging, fun, and effective — using play-based activities that keep children motivated while building essential communication skills.',
        ],
        ar: [
          'يدعم برنامج علاج النطق واللغة لدينا الأطفال الذين يواجهون صعوبات في التواصل والنطق والطلاقة وفهم اللغة. يستخدم معالجونا المعتمدون تقنيات مبنية على الدليل العلمي ومصممة لاحتياجات كل طفل.',
          'نؤمن بأن لكل طفل الحق في التعبير عن نفسه بوضوح وثقة. جلساتنا ممتعة وفعّالة في آنٍ واحد — من خلال أنشطة قائمة على اللعب تُبقي الطفل متحفزًا بينما يكتسب مهارات التواصل الأساسية.',
        ],
      }}
      whatWeDo={whatWeDo}
      conditions={conditions}
      processSteps={processSteps}
      faqs={faqs}
      ctaTitle={{
        en: 'Ready to Help Your Child Find Their Voice?',
        ar: 'هل أنت مستعد لمساعدة طفلك على إيجاد صوته؟',
      }}
      ctaMascotSrc="/assets/mascots/language-explorer.png"
    />
  );
}
