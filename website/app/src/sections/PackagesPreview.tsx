import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Check, Star } from 'lucide-react';
import { useLanguage } from '../LanguageProvider';

const packages = [
  {
    name: 'Individual Sessions',
    nameAR: 'جلسات فردية',
    sessions: 'As Needed',
    sessionsAR: 'حسب الحاجة',
    price: '350',
    period: 'Hour',
    popular: false,
    discount: undefined,
    features: ['As Needed', 'Initial Assessment', 'Progress Reports'],
    featuresAR: ['حسب الحاجة', 'التقييم الأولي', 'تقارير التقدم'],
  },
  {
    name: 'Package A',
    nameAR: 'الباقة A',
    sessions: '5 Hours/Week',
    sessionsAR: '٥ ساعات/أسبوع',
    price: '6,650',
    period: 'monthly',
    periodAR: 'شهريًا',
    popular: false,
    discount: '5%',
    features: ['5 Hours/Week', 'Initial Assessment', 'Weekly Reports'],
    featuresAR: ['٥ ساعات/أسبوع', 'التقييم الأولي', 'تقارير أسبوعية'],
  },
  {
    name: 'Package B',
    nameAR: 'الباقة B',
    sessions: '10 Hours/Week',
    sessionsAR: '١٠ ساعات/أسبوع',
    price: '12,600',
    period: 'monthly',
    periodAR: 'شهريًا',
    popular: false,
    discount: '10%',
    features: ['10 Hours/Week', 'Initial Assessment', 'Weekly Reports', 'Home Activities'],
    featuresAR: ['١٠ ساعات/أسبوع', 'التقييم الأولي', 'تقارير أسبوعية', 'أنشطة منزلية'],
  },
  {
    name: 'Package C',
    nameAR: 'الباقة C',
    sessions: '15 Hours/Week',
    sessionsAR: '١٥ ساعة/أسبوع',
    price: '17,850',
    period: 'monthly',
    periodAR: 'شهريًا',
    popular: true,
    discount: '15%',
    features: ['15 Hours/Week', 'Full Assessment', 'Weekly Reports', 'Home Activities', 'Parent Coaching'],
    featuresAR: ['١٥ ساعة/أسبوع', 'تقييم كامل', 'تقارير أسبوعية', 'أنشطة منزلية', 'توجيه للأهل'],
  },
  {
    name: 'Intensive Package',
    nameAR: 'الباقة المكثفة',
    sessions: '30 Hours/Week',
    sessionsAR: '٣٠ ساعة/أسبوع',
    price: '29,400',
    period: 'monthly',
    periodAR: 'شهريًا',
    popular: false,
    discount: '30%',
    features: ['30 Hours/Week', 'Full Assessment', 'Daily Reports', 'Full Family Support'],
    featuresAR: ['٣٠ ساعة/أسبوع', 'تقييم كامل', 'تقارير يومية', 'دعم عائلي كامل'],
  },
];

export default function PackagesPreview() {
  const { locale, t } = useLanguage();
  return (
    <section className="py-24 bg-bg-base relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-14">
          <motion.h2
            className="font-display font-bold text-3xl md:text-4xl text-text-primary mb-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {t('packagesPreview.title')}
          </motion.h2>
          <p className="text-text-secondary text-base">
            {t('packagesPreview.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {packages.map((pkg, i) => (
            <motion.div
              key={pkg.name}
              className={`relative rounded-card p-6 transition-all duration-300 ${
                pkg.popular
                  ? 'bg-brand-blue text-white -translate-y-2 shadow-lg scale-105'
                  : 'bg-card border border-border shadow-card hover:-translate-y-1 hover:shadow-card-hover'
              }`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
            >
              {pkg.popular && (
                <div className="absolute top-5 right-5 bg-brand-yellow text-[#7A5A00] px-2.5 py-1 text-xs font-bold rounded-full flex items-center gap-1">
                  <Star size={12} fill="currentColor" />
                </div>
              )}


              {pkg.discount && !pkg.popular && (
                <div className="absolute -top-3 right-3 px-2.5 py-1 bg-brand-yellow text-[#7A5A00] text-xs font-bold rounded-pill">
                  {pkg.discount} {t('packagesPreview.off')}
                </div>
              )}

              <h3 className={`font-display font-bold text-lg mb-1 ${pkg.popular ? 'text-white' : 'text-text-primary'}`}>
                {locale === 'ar' ? pkg.nameAR : pkg.name}
              </h3>
              <p className={`text-xs mb-4 ${pkg.popular ? 'text-white/70' : 'text-text-secondary'}`}>
                {locale === 'ar' ? pkg.sessionsAR ?? pkg.sessions : pkg.sessions}
              </p>


              <div className="mb-5">
                <span className={`font-display font-bold text-3xl ${pkg.popular ? 'text-white' : 'text-brand-blue'}`}>
                  {pkg.price}
                </span>
                <span className={`text-xs ml-1 ${pkg.popular ? 'text-white/70' : 'text-text-secondary'}`}>
                  {pkg.name === 'Individual Sessions'
                    ? t('packagesPreview.sarHour')
                    : locale === 'ar'
                    ? `${t('packagesPreview.sarPer')} ${pkg.periodAR ?? pkg.period}`
                    : `${t('packagesPreview.sarPer')} ${pkg.period}`}
                </span>
              </div>


              <ul className="space-y-2 mb-6">
                {pkg.features.map((feature, index) => (
                  <li key={`${feature}-${index}`} className="flex items-start gap-2 text-xs">
                    <Check size={14} className={pkg.popular ? 'text-brand-green shrink-0 mt-0.5' : 'text-brand-green shrink-0 mt-0.5'} />
                    <span className={pkg.popular ? 'text-white/90' : 'text-text-secondary'}>{locale === 'ar' ? pkg.featuresAR?.[index] ?? feature : feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/booking"
                className={`block text-center py-2.5 rounded-pill font-semibold text-sm transition-all duration-200 ${
                  pkg.popular
                    ? 'bg-white text-brand-blue hover:bg-white/90'
                    : 'bg-brand-blue text-white hover:brightness-110'
                }`}
              >
                {t('packagesPreview.bookNow')}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Skill builder mascot */}
        <motion.div
          className="hidden lg:flex justify-center mt-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <img
            src="/assets/mascots/skill-builder.png"
            alt="Skill Builder"
            className="w-24 h-32 object-contain animate-float"
          />
        </motion.div>
      </div>
    </section>
  );
}
