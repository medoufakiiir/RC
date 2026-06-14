import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ClipboardList, MessageCircle, Brain, Hand } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useLanguage } from '../LanguageProvider';

const services = [
  {
    title: 'Assessments & Consultations',
    titleAR: 'التقييمات والاستشارات',
    description: 'Comprehensive developmental evaluations to understand your child\'s unique needs and create a personalized therapy roadmap.',
    descriptionAR: 'تقييمات نمو شاملة لفهم احتياجات طفلك الفريدة وإنشاء خارطة طريق علاجية مخصصة.',
    icon: ClipboardList,
    mascot: null,
    accentColor: '#FFCC22',
    bgClass: 'bg-[#FFCC22]',
    href: '/services/assessments',
    whatWeDo: [
      'Initial developmental evaluation',
      'Detailed child assessment report',
      'Personalized therapy roadmap',
      'Parent consultation session',
    ],
    whatWeDoAR: [
      'التقييم التنموي الأولي',
      'تقرير تقييم مفصل للطفل',
      'خارطة طريق علاجية مخصصة',
      'جلسة استشارة مع الوالدين',
    ],
  },
  {
    title: 'ABA / Behavior Therapy',
    titleAR: 'العلاج السلوكي ABA',
    description: 'Evidence-based Applied Behavior Analysis to help children develop positive behaviors, communication, and essential life skills.',
    descriptionAR: 'تحليل السلوك التطبيقي المعتمد لمساعدة الأطفال على تطوير السلوكيات الإيجابية والتواصل ومهارات الحياة الأساسية.',
    icon: Brain,
    mascot: '/assets/mascots/behavior-guide.png',
    accentColor: '#3355EE',
    bgClass: 'bg-[#EEFF99]',
    href: '/services/aba-therapy',
    whatWeDo: [
      'Applied behavior analysis',
      'Positive reinforcement programs',
      'Skill acquisition training',
      'Parent coaching',
    ],
    whatWeDoAR: [
      'تحليل السلوك التطبيقي',
      'برامج التعزيز الإيجابي',
      'تدريب اكتساب المهارات',
      'توجيه الوالدين',
    ],
  },
  {
    title: 'Speech & Language Therapy',
    titleAR: 'علاج النطق واللغة',
    description: 'Professional speech therapy sessions to improve communication, articulation, and language comprehension for children 3–12.',
    descriptionAR: 'جلسات علاج نطق ولغة احترافية لتحسين التواصل والنطق وفهم اللغة للأطفال من عمر 3 إلى 12.',
    icon: MessageCircle,
    mascot: '/assets/mascots/language-explorer.png',
    accentColor: '#7B52AB',
    bgClass: 'bg-[#DDBAE8]',
    href: '/services/speech-language',
    whatWeDo: [
      'Articulation & phonology therapy',
      'Language development sessions',
      'Stuttering treatment',
      'Social communication skills',
    ],
    whatWeDoAR: [
      'علاج النطق والصوتيات',
      'جلسات تطوير اللغة',
      'علاج التأتأة',
      'مهارات التواصل الاجتماعي',
    ],
  },
  {
    title: 'Occupational Therapy',
    titleAR: 'العلاج الوظيفي',
    description: 'Sensory integration and fine motor skill development to help children navigate daily activities and build independence with confidence.',
    descriptionAR: 'تكامل حسي وتطوير مهارات الحركة الدقيقة لمساعدة الأطفال على التعامل مع الأنشطة اليومية وبناء الاستقلالية بثقة.',
    icon: Hand,
    mascot: '/assets/mascots/skill-builder.png',
    accentColor: '#3DBE6E',
    bgClass: 'bg-[#C8F5B5]',
    href: '/services/occupational-therapy',
    whatWeDo: [
      'Sensory integration therapy',
      'Fine motor skill development',
      'Self-care skill training',
      'Handwriting & school readiness',
    ],
    whatWeDoAR: [
      'علاج التكامل الحسي',
      'تطوير مهارات الحركة الدقيقة',
      'تدريب مهارات الرعاية الذاتية',
      'الكتابة اليدوية والاستعداد للمدرسة',
    ],
  },
];

export default function ServicesPage() {
  const { locale } = useLanguage();


  return (
    <div className="min-h-screen bg-bg-base">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-16 bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-pill bg-brand-blue/10 text-brand-blue text-xs font-semibold tracking-wider uppercase mb-5">
              {locale === 'ar' ? 'خدماتنا المتخصصة' : 'Our Specialized Services'}
            </div>
            <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-[56px] text-text-primary mb-5 leading-tight">
              {locale === 'ar' ? (
                <>
                  <span className="text-brand-blue">خدماتنا</span>
                </>
              ) : (
                <>
                  <span className="text-brand-blue">Our </span>
                  <span className="text-brand-pink">Services</span>
                </>
              )}
            </h1>
            <p className="font-sans text-text-secondary text-lg max-w-2xl mx-auto leading-relaxed">
              {locale === 'ar'
                ? 'برامج علاجية شاملة مصممة لمساعدة كل طفل على تحقيق إمكاناته الكاملة — في بيئة دافئة تركز على الأسرة.'
                : 'Comprehensive therapy programs designed to help every child reach their full potential — in a warm, family-centred environment.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Service cards grid */}
      <section className="pb-24 bg-bg-base">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, i) => (
              <motion.div
                key={service.title}
                className="group relative bg-card rounded-card border border-border overflow-hidden shadow-card hover:-translate-y-1 hover:shadow-card-hover transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                {/* Colored top band */}
                <div className={`h-2 ${service.bgClass}`} />

                <div className="p-8">
                  {/* Icon row */}
                  <div className="flex items-start justify-between mb-5">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center"
                      style={{ backgroundColor: service.accentColor + '22' }}
                    >
                      <service.icon size={28} style={{ color: service.accentColor }} />
                    </div>
                    {service.mascot && (
                      <img
                        src={service.mascot}
                        alt=""
                        className="w-20 h-20 object-contain opacity-75 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"
                      />
                    )}
                  </div>

                  {/* Title + description */}
                  <h3 className="font-display font-bold text-xl text-text-primary mb-3">
                    {locale === 'ar' ? service.titleAR : service.title}
                  </h3>
                  <p className="font-sans text-text-secondary text-sm leading-relaxed mb-5">
                    {locale === 'ar' ? service.descriptionAR : service.description}
                  </p>

                  {/* Bullet points */}
                  <ul className="space-y-1.5 mb-6">
                    {(locale === 'ar' ? service.whatWeDoAR : service.whatWeDo).map((point) => (
                      <li key={point} className="flex items-center gap-2 text-xs font-sans text-text-secondary">
                        <span
                          className="w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ backgroundColor: service.accentColor }}
                        />
                        {point}
                      </li>
                    ))}
                  </ul>

                  {/* Learn More link */}
                  <Link
                    to={service.href}
                    className="inline-flex items-center gap-2 font-semibold text-sm transition-all duration-200 hover:gap-3"
                    style={{ color: service.accentColor }}
                  >
                    {locale === 'ar' ? 'تعرف أكثر' : 'Learn More'}
                    <ArrowRight size={16} className="rtl:rotate-180" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 bg-brand-blue relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06]">
          <img
            src="/logo/Riyada%20Center%20Logo%20Souce-05.png"
            alt=""
            className="absolute right-0 bottom-0 w-96 pointer-events-none select-none"
          />
        </div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.h2
            className="font-display font-bold text-3xl md:text-4xl text-white mb-5"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {locale === 'ar' ? 'لست متأكدًا من أين تبدأ؟' : 'Not Sure Where to Start?'}
          </motion.h2>
          <motion.p
            className="font-sans text-white/70 text-base mb-8 max-w-lg mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            {locale === 'ar'
              ? 'ابدأ بجلسة تقييم. فريقنا سيرشدك إلى مسار العلاج الأمثل لطفلك.'
              : 'Start with an assessment session. Our team will guide you to the right therapy path for your child.'}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link
              to="/booking"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-brand-blue font-bold rounded-pill shadow-lg hover:scale-105 transition-transform duration-200"
            >
              {locale === 'ar' ? 'احجز استشارة مجانية' : 'Book a Free Consultation'}
              <ArrowRight size={18} className="rtl:rotate-180" />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
