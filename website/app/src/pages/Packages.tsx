import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Check, Star, Sparkles } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useLanguage } from '../LanguageProvider';

const packages = [
  {
    name: 'Individual Sessions',
    nameAR: 'جلسات فردية',
    hoursPerWeek: 'As Needed',
    hoursPerWeekAR: 'حسب الحاجة',
    discount: '-',
    monthlyFee: '350 SAR/Hour',
    monthlyFeeAR: '350 ريال/ساعة',
    hoursLabel: 'As Needed',
    period: 'Hour',
    price: '350',
    popular: false,
    color: '#3355EE',
    discountLabel: undefined,
    features: ['As Needed', 'Initial Assessment', 'Progress Reports'],
    featuresAR: ['حسب الحاجة', 'التقييم الأولي', 'تقارير التقدم'],
    notIncluded: [],
    notIncludedAR: [],
  },
  {
    name: 'Package A',
    nameAR: 'الباقة A',
    hoursPerWeek: '5 Hours/Week',
    hoursPerWeekAR: '٥ ساعات/أسبوع',
    discount: '5%',
    monthlyFee: '6,650',
    monthlyFeeAR: '٦٬٦٥٠',
    hoursLabel: '5 Hours/Week',
    period: 'monthly',
    price: '6,650',
    popular: false,
    color: '#3355EE',
    discountLabel: '5%',
    features: ['5 Hours/Week', 'Initial Assessment', 'Weekly Reports'],
    featuresAR: ['٥ ساعات/أسبوع', 'التقييم الأولي', 'تقارير أسبوعية'],
    notIncluded: [],
    notIncludedAR: [],
  },
  {
    name: 'Package B',
    nameAR: 'الباقة B',
    hoursPerWeek: '10 Hours/Week',
    hoursPerWeekAR: '١٠ ساعات/أسبوع',
    discount: '10%',
    monthlyFee: '12,600',
    monthlyFeeAR: '١٢٬٦٠٠',
    hoursLabel: '10 Hours/Week',
    period: 'monthly',
    price: '12,600',
    popular: false,
    color: '#FF4D94',
    discountLabel: '10%',
    features: ['10 Hours/Week', 'Initial Assessment', 'Weekly Reports', 'Home Activities'],
    featuresAR: ['١٠ ساعات/أسبوع', 'التقييم الأولي', 'تقارير أسبوعية', 'أنشطة منزلية'],
    notIncluded: [],
    notIncludedAR: [],
  },
  {
    name: 'Package C',
    nameAR: 'الباقة C',
    hoursPerWeek: '15 Hours/Week',
    hoursPerWeekAR: '١٥ ساعة/أسبوع',
    discount: '15%',
    monthlyFee: '17,850',
    monthlyFeeAR: '١٧٬٨٥٠',
    hoursLabel: '15 Hours/Week',
    period: 'monthly',
    price: '17,850',
    popular: true,
    color: '#FFCC22',
    discountLabel: '15%',
    features: ['15 Hours/Week', 'Full Assessment', 'Weekly Reports', 'Home Activities', 'Parent Coaching'],
    featuresAR: ['١٥ ساعة/أسبوع', 'تقييم كامل', 'تقارير أسبوعية', 'أنشطة منزلية', 'توجيه للأهل'],
    notIncluded: [],
    notIncludedAR: [],
  },
  {
    name: 'Intensive Package',
    nameAR: 'الباقة المكثفة',
    hoursPerWeek: '30 Hours/Week',
    hoursPerWeekAR: '٣٠ ساعة/أسبوع',
    discount: '30%',
    monthlyFee: '29,400',
    monthlyFeeAR: '٢٩٬٤٠٠',
    hoursLabel: '30 Hours/Week',
    period: 'monthly',
    price: '29,400',
    popular: false,
    color: '#7766DD',
    discountLabel: '30%',
    features: ['30 Hours/Week', 'Full Assessment', 'Daily Reports', 'Full Family Support'],
    featuresAR: ['٣٠ ساعة/أسبوع', 'تقييم كامل', 'تقارير يومية', 'دعم عائلي كامل'],
    notIncluded: [],
    notIncludedAR: [],
  },
];

export default function PackagesPage() {
  const { locale, t } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-bg-base">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-pill bg-brand-blue/10 text-brand-blue text-xs font-semibold tracking-wider uppercase mb-4">
              <Sparkles size={14} />
              {t('packagesPage.heroTag')}
            </div>
            <h1 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-text-primary mb-4">
              {t('packagesPage.heroTitle')}
            </h1>
            <p className="text-text-secondary text-base max-w-xl mx-auto">
              {t('packagesPage.heroDescription')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {packages.map((pkg, i) => (

              <motion.div
                key={pkg.name}
                className={`relative rounded-card overflow-hidden transition-all duration-300 ${
                  pkg.popular
                    ? 'bg-[#0A0F2E] text-white scale-105 shadow-xl lg:-translate-y-4'
                    : 'bg-card border border-border shadow-card hover:-translate-y-1 hover:shadow-card-hover'
                }`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                {/* Top color bar */}
                <div className="h-1.5 w-full" style={{ backgroundColor: pkg.popular ? '#FFCC22' : pkg.color }} />

                {pkg.popular && (
                  <div className="absolute top-4 right-4 px-3 py-1 bg-brand-yellow text-[#7A5A00] text-xs font-bold rounded-pill flex items-center gap-1">
                    <Star size={12} fill="currentColor" />
                    {t('packagesPage.mostPopular')}
                  </div>
                )}

                {pkg.discountLabel && !pkg.popular && pkg.discountLabel !== '-' && (
                  <div className="absolute top-4 right-4 px-2.5 py-1 bg-brand-yellow text-[#7A5A00] text-xs font-bold rounded-pill">
                    {pkg.discountLabel} {t('packagesPage.off')}
                  </div>
                )}


                <div className="p-6">
                  <h3 className={`font-display font-bold text-lg mb-1 ${pkg.popular ? 'text-white' : 'text-text-primary'}`}>
                    {locale === 'ar' ? pkg.nameAR : pkg.name}
                  </h3>
                  <p className={`text-xs mb-5 ${pkg.popular ? 'text-white/60' : 'text-text-secondary'}`}>
                    {locale === 'ar' ? pkg.hoursPerWeekAR ?? pkg.hoursPerWeek : pkg.hoursPerWeek}
                  </p>

                  <div className="mb-6">
                    <span className={`font-display font-bold text-3xl ${pkg.popular ? 'text-brand-yellow' : 'text-brand-blue'}`}>
                      {locale === 'ar' ? pkg.monthlyFeeAR ?? pkg.monthlyFee : pkg.monthlyFee}
                    </span>
                  </div>


                  <ul className="space-y-2.5 mb-6">
                    {pkg.features.map((feature, index) => (
                      <li key={`${feature}-${index}`} className="flex items-start gap-2 text-xs">
                        <Check size={14} className="text-brand-green shrink-0 mt-0.5" />
                        <span className={pkg.popular ? 'text-white/90' : 'text-text-secondary'}>{locale === 'ar' ? pkg.featuresAR?.[index] ?? feature : feature}</span>
                      </li>
                    ))}
                    {pkg.notIncluded.map((feature, index) => (
                      <li key={`${feature}-${index}`} className="flex items-start gap-2 text-xs opacity-40">
                        <span className="w-3.5 h-3.5 rounded-full border border-current shrink-0 mt-0.5 flex items-center justify-center text-[10px]">
                          -
                        </span>
                        <span className={pkg.popular ? 'text-white/60' : 'text-text-secondary'}>{locale === 'ar' ? pkg.notIncludedAR?.[index] ?? feature : feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    to="/booking"
                className={`block text-center py-3 rounded-pill font-semibold text-sm transition-all duration-200 ${
                      pkg.popular
                        ? 'bg-brand-yellow text-[#0A0F2E] hover:brightness-110'
                        : 'bg-brand-blue text-white hover:brightness-110'
                    }`}

                  >
                    {t('packagesPreview.bookNow')}
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
          <p className="text-center text-text-secondary text-xs mt-10">
            {t('packagesPage.note')}
          </p>
        </div>
      </section>

      {/* Mascot Section */}

      <section className="py-16 bg-card relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <img
              src="/assets/mascots/skill-builder.png"
              alt="Skill Builder"
              className="w-28 h-36 object-contain mx-auto mb-6 animate-float"
            />
            <h2 className="font-display font-bold text-2xl text-text-primary mb-3">
              {t('packagesPage.ctaTitle')}
            </h2>
            <p className="text-text-secondary text-sm mb-6 max-w-md mx-auto">
              {t('packagesPage.ctaDescription')}
            </p>
            <Link to="/booking" className="btn-primary">
              {t('packagesPage.ctaButton')}
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
