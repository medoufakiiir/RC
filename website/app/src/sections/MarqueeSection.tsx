import { motion } from 'framer-motion';

import { useLanguage } from '../LanguageProvider';

type MarqueeItem = { en: string; ar: string };

const marqueeItems: MarqueeItem[] = [
  {
    en: 'Experienced Therapists',
    ar: 'معالجون ذوو خبرة',
  },
  {
    en: 'Safe Environment',
    ar: 'بيئة آمنة',
  },
  {
    en: 'Customized Plans',
    ar: 'خطط مخصصة',
  },
  {
    en: 'Evidence-Based Methods',
    ar: 'طرق مدعومة بالأدلة',
  },
  {
    en: 'Family Support',
    ar: 'دعم العائلة',
  },
  {
    en: 'Sensory-Friendly Space',
    ar: 'مساحة مناسبة للحواس',
  },
];

export default function MarqueeSection() {
  const { locale } = useLanguage();

  return (
    <section className="py-8 bg-card overflow-hidden border-y border-border">
      <motion.div
        className="flex animate-marquee whitespace-nowrap"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        {[...marqueeItems, ...marqueeItems, ...marqueeItems, ...marqueeItems].map(
          (item, i) => (
            <span
              key={`${item.en}-${i}`}
              className="mx-8 text-2xl md:text-3xl font-display font-bold text-transparent bg-clip-text"
              style={{
                backgroundImage: `linear-gradient(90deg, #3355EE, #FF4D94, #FFCC22, #33CC44, #7766DD)`,
                backgroundSize: '200% 100%',
              }}
            >
              {locale === 'ar' ? item.ar : item.en}
              <span className="mx-8 text-brand-blue">&bull;</span>
            </span>
          )
        )}
      </motion.div>
    </section>
  );
}
