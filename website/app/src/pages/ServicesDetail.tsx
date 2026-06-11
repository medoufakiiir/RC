import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, MessageCircle, Calendar, FileText, Target, Lightbulb } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useLanguage } from '../LanguageProvider';

const processSteps = [
  {
    number: '01',
    title: 'Initial Assessment',
    titleAR: 'التقييم الأولي',
    description: 'Our speech-language pathologist conducts a comprehensive evaluation of your child\'s communication abilities, including articulation, language comprehension, and expressive skills.',
    descriptionAR: 'يقوم اختصاصي النطق واللغة لدينا بإجراء تقييم شامل لقدرات طفلك على التواصل، بما في ذلك النطق وفهم اللغة والقدرات التعبيرية.',
    icon: FileText,
    color: '#3355EE',
  },
  {
    number: '02',
    title: 'Goal Setting',
    titleAR: 'تحديد الأهداف',
    description: 'Based on assessment results, we create personalized therapy goals aligned with your child\'s unique needs and your family\'s priorities.',
    descriptionAR: 'استنادًا إلى نتائج التقييم، نضع أهداف علاجية شخصية تتماشى مع احتياجات طفلك وأولويات عائلتك.',
    icon: Target,
    color: '#FF4D94',
  },
  {
    number: '03',
    title: 'Therapy Sessions',
    titleAR: 'جلسات العلاج',
    description: 'Engaging, play-based therapy sessions using evidence-based techniques. Parents receive guidance for reinforcing skills at home.',
    descriptionAR: 'جلسات علاج ممتعة قائمة على اللعب باستخدام تقنيات مدعومة بالأدلة. يتلقى الوالدان إرشادات لتعزيز المهارات في المنزل.',
    icon: Lightbulb,
    color: '#33CC44',
  },
  {
    number: '04',
    title: 'Progress Monitoring',
    titleAR: 'متابعة التقدم',
    description: 'Regular evaluations track your child\'s progress. Goals are adjusted as needed to ensure continuous growth and development.',
    descriptionAR: 'تُجرى تقييمات منتظمة لرصد تقدم طفلك. تُعدل الأهداف عند الحاجة لضمان نمو وتطور مستمر.',
    icon: CheckCircle2,
    color: '#FFCC22',
  },
];

const conditions = [
  { label: 'Articulation Disorders', labelAR: 'اضطرابات النطق' },
  { label: 'Language Delays', labelAR: 'تأخر اللغة' },
  { label: 'Stuttering', labelAR: 'التأتأة' },
  { label: 'Apraxia of Speech', labelAR: 'اضطراب التخطيط الحركي للكلام' },
  { label: 'Autism-Related Communication', labelAR: 'التواصل المرتبط بالتوحد' },
  { label: 'Social Communication', labelAR: 'التواصل الاجتماعي' },
];

const faqs = [
  {
    q: 'How long does each therapy session last?',
    qAR: 'كم مدة كل جلسة علاج؟',
    a: 'Standard sessions are 45 minutes, including time for parent consultation. Intensive sessions may be 60 minutes.',
    aAR: 'الجلسات القياسية مدتها 45 دقيقة، بما في ذلك وقت استشارة الوالد. قد تستمر الجلسات المكثفة 60 دقيقة.',
  },
  {
    q: 'How many sessions does my child need per week?',
    qAR: 'كم عدد الجلسات التي يحتاجها طفلي أسبوعيًا؟',
    a: 'This depends on the assessment results. Most children start with 1-2 sessions per week and adjust based on progress.',
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
    a: 'Yes, all our therapists are bilingual and provide sessions in both Arabic and English based on your child\'s needs.',
    aAR: 'نعم، جميع معالجينا ثنائيو اللغة ويقدمون جلسات باللغتين العربية والإنجليزية حسب حاجة طفلك.',
  },
];

export default function ServicesDetail() {
  const { locale, t } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-bg-base">
      <Navbar />

      {/* Service Hero */}
      <section className="pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: mascot + bg */}
            <motion.div
              className="relative h-80 lg:h-[420px] rounded-card overflow-hidden flex items-center justify-center"
              style={{ backgroundColor: '#DDBAE8' }}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <img
                src="/assets/mascots/language-explorer.png"
                alt="Language Explorer mascot"
                className="w-56 h-72 object-contain drop-shadow-lg z-10"
              />
              {/* Decorative circles */}
              <div className="absolute top-6 left-6 w-16 h-16 rounded-full bg-white/20" />
              <div className="absolute bottom-8 right-8 w-10 h-10 rounded-full bg-white/20" />
              <div className="absolute top-1/2 right-12 w-6 h-6 rounded-full bg-white/30" />
            </motion.div>

            {/* Right: title + info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-pill bg-brand-purple/10 text-brand-purple text-xs font-semibold tracking-wider uppercase mb-4">
                <MessageCircle size={14} />
                {t('serviceDetail.tag')}
              </div>
              <h1 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-text-primary mb-4 leading-tight">
                {t('serviceDetail.title')}
              </h1>
              <p className="text-text-secondary text-base leading-relaxed mb-6">
                {t('serviceDetail.description')}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/booking" className="btn-primary">
                  <Calendar size={18} className="mr-2" />
                  Book a Session
                </Link>
                <button className="btn-secondary">Download Brochure</button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-16 bg-surface">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <motion.h2
            className="font-display font-bold text-2xl md:text-3xl text-text-primary mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {t('serviceDetail.aboutService')}
          </motion.h2>
          <motion.div
            className="prose prose-lg max-w-none text-text-secondary leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <p className="mb-4">
              At Riyada Center, our Speech and Language Therapy program is designed to help children find their voice. Led by licensed speech-language pathologists, we address a wide range of communication challenges including articulation disorders, language delays, stuttering, and social communication difficulties.
            </p>
            <p className="mb-4">
              We believe every child deserves the ability to express themselves clearly and confidently. Our therapy sessions are designed to be engaging, fun, and effective — using play-based activities that keep children motivated while building essential communication skills.
            </p>
          </motion.div>
        </div>
      </section>

      {/* What We Treat */}
      <section className="py-16 bg-[#EEFF99]" style={{ clipPath: 'polygon(0 4%, 100% 0, 100% 96%, 0 100%)' }}>
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.h2
            className="font-display font-bold text-2xl md:text-3xl text-text-primary mb-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {t('serviceDetail.whatWeTreat')}
          </motion.h2>
          <div className="flex flex-wrap justify-center gap-3">
            {conditions.map((condition, i) => (
              <motion.div
                key={condition.label}
                className="px-5 py-3 bg-surface border-2 border-brand-blue text-brand-blue rounded-pill font-medium text-sm hover:bg-brand-blue hover:text-white transition-colors duration-200 cursor-default"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                {locale === 'ar' ? condition.labelAR : condition.label}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-24 bg-bg-base">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <motion.h2
            className="font-display font-bold text-2xl md:text-3xl text-text-primary mb-14 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {t('serviceDetail.processTitle')}
          </motion.h2>

          <div className="relative">
            {/* Connecting line (desktop only) */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-brand-blue/10 -translate-y-1/2" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {processSteps.map((step, i) => (
                <motion.div
                  key={step.number}
                  className="relative bg-card rounded-card p-6 shadow-card hover:shadow-card-hover transition-all duration-300"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                >
                  {/* Step number */}
                  <div
                    className="font-display font-black text-5xl mb-4"
                    style={{ color: step.color, opacity: 0.2 }}
                  >
                    {step.number}
                  </div>
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: step.color + '15' }}
                  >
                    <step.icon size={20} style={{ color: step.color }} />
                  </div>
                  <h3 className="font-display font-bold text-lg text-text-primary mb-2">
                    {locale === 'ar' ? step.titleAR : step.title}
                  </h3>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {locale === 'ar' ? step.descriptionAR : step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-24 bg-surface">
        <div className="max-w-3xl mx-auto px-6 md:px-12">
          <motion.h2
            className="font-display font-bold text-2xl md:text-3xl text-text-primary mb-10 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {t('serviceDetail.faqTitle')}
          </motion.h2>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.details
                key={i}
                className="group rounded-2xl border border-border overflow-hidden cursor-pointer hover:border-brand-blue/20 transition-colors"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <summary className="flex items-center justify-between p-5 font-medium text-text-primary text-sm select-none">
                  {locale === 'ar' ? faq.qAR : faq.q}
                  <ArrowRight
                    size={16}
                    className="text-brand-blue transition-transform group-open:rotate-90 shrink-0 ml-4"
                  />
                </summary>
                <div className="px-5 pb-5 text-text-secondary text-sm leading-relaxed bg-brand-yellow/10 dark:bg-brand-yellow/20">
                  {locale === 'ar' ? faq.aAR : faq.a}
                </div>
              </motion.details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 bg-brand-blue relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src="/assets/mascots/language-explorer.png" alt="" className="w-64 h-80 object-contain absolute -left-8 -bottom-16" />
        </div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.h2
            className="font-display font-bold text-3xl md:text-4xl text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {t('serviceDetail.notSure')}
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <Link to="/booking" className="inline-flex items-center px-8 py-4 bg-white text-brand-blue font-bold rounded-pill shadow-lg hover:scale-105 transition-transform duration-200">
              <Calendar size={20} className="mr-2" />
              {t('serviceDetail.bookNow')}
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
