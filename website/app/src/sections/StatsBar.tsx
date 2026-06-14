import { motion } from 'framer-motion';
import { useLanguage } from '../LanguageProvider';

const stats = [
  { number: '4', label: 'statsBar.services' },
  { number: '3-12', label: 'statsBar.ages' },
  { number: '6', label: 'statsBar.workingDays' },
  // Location headline changes based on Arabic/English (Riyadh السعودية)
  { number: 'statsBar.city', label: 'statsBar.location' },
];

export default function StatsBar() {
  const { t } = useLanguage();
  return (
    <section className="bg-brand-blue py-8 relative z-30">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/20">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="flex flex-col items-center py-4 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <span className="font-display font-bold text-3xl md:text-4xl text-white mb-1">
                {t(stat.number)}
              </span>
              <span className="text-white/75 text-sm font-medium">
                {t(stat.label)}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
