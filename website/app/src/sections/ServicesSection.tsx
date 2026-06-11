import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ClipboardList, MessageCircle, Brain, Hand } from 'lucide-react';
import { useLanguage } from '../LanguageProvider';

const services = [
  {
    title: 'Assessments & Consultations',
    titleAR: 'التقييمات والاستشارات',
    description: 'Comprehensive developmental evaluations to understand your child\'s unique needs and create a personalized roadmap.',
    descriptionAR: 'تقييمات نمو شاملة لفهم احتياجات طفلك الفريدة وإنشاء خارطة طريق مخصصة.',
    color: '#FFCC22',
    bgClass: 'bg-[#FFCC22]',
    icon: ClipboardList,
    mascot: null,
    href: '/services/speech-language-therapy',
  },
  {
    title: 'ABA / Behavior Therapy',
    titleAR: 'العلاج السلوكي ABA',
    description: 'Evidence-based Applied Behavior Analysis to help children develop positive behaviors and essential life skills.',
    descriptionAR: 'تحليل السلوك التطبيقي المعتمد لمساعدة الأطفال على تطوير سلوكيات إيجابية ومهارات حياتية أساسية.',
    color: '#EEFF99',
    bgClass: 'bg-[#EEFF99]',
    icon: Brain,
    mascot: '/assets/mascots/behavior-guide.png',
    href: '/services/speech-language-therapy',
  },
  {
    title: 'Speech & Language Therapy',
    titleAR: 'علاج النطق واللغة',
    description: 'Professional speech therapy sessions to improve communication, articulation, and language comprehension.',
    descriptionAR: 'جلسات علاج نطق ولغة احترافية لتحسين التواصل والنطق وفهم اللغة.',
    color: '#DDBAE8',
    bgClass: 'bg-[#DDBAE8]',
    icon: MessageCircle,
    mascot: '/assets/mascots/language-explorer.png',
    href: '/services/speech-language-therapy',
  },
  {
    title: 'Occupational Therapy',
    titleAR: 'العلاج الوظيفي',
    description: 'Sensory integration and fine motor skill development to help children navigate daily activities with confidence.',
    descriptionAR: 'تكامل حسي وتطوير مهارات التحكم الدقيق لمساعدة الأطفال على التعامل مع الأنشطة اليومية بثقة.',
    color: '#C8F5B5',
    bgClass: 'bg-[#C8F5B5]',
    icon: Hand,
    mascot: '/assets/mascots/skill-builder.png',
    href: '/services/speech-language-therapy',
  },
];

export default function ServicesSection() {
  const { locale, t } = useLanguage();
  return (
    <section className="py-24 bg-card relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section heading */}
        <div className="text-center mb-16">
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-3">
            <span className="text-brand-blue">{t('servicesSection.titlePrefix')}</span>{' '}
            <span className="text-brand-pink">{t('servicesSection.titleSuffix')}</span>
          </h2>
          <p className="text-text-secondary text-base max-w-lg mx-auto">
            {t('servicesSection.description')}
          </p>
        </div>

        {/* Service cards grid */}
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
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: service.color + '30' }}
                  >
                    <service.icon
                      size={28}
                      style={{ color: service.color === '#EEFF99' ? '#7A8A3A' : service.color === '#C8F5B5' ? '#2A8A3A' : service.color }}
                    />
                  </div>
                  {service.mascot && (
                    <img
                      src={service.mascot}
                      alt=""
                      className="w-20 h-20 object-contain opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"
                    />
                  )}
                </div>

                <h3 className="font-display font-bold text-xl text-text-primary mb-3">
                  {locale === 'ar' ? service.titleAR : service.title}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed mb-6">
                  {locale === 'ar' ? service.descriptionAR : service.description}
                </p>

                <Link
                  to={service.href}
                  className="inline-flex items-center gap-2 text-brand-blue font-semibold text-sm hover:gap-3 transition-all duration-200"
                >
                  {t('servicesSection.learnMore')}
                  <ArrowRight size={16} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
