import { motion } from 'framer-motion';
import { useLanguage } from '../LanguageProvider';

const tagColors = ['#3355EE', '#E91E8C', '#7B52AB'];

const conditions = [
  { label: 'Autism Spectrum Disorder (ASD)', labelAR: 'طيف التوحد' },
  { label: 'ADHD', labelAR: 'فرط الحركة وتشتت الانتباه' },
  { label: 'Speech Delay', labelAR: 'تأخر النطق' },
  { label: 'Developmental Delay', labelAR: 'تأخر النمو' },
  { label: 'Learning Difficulties', labelAR: 'صعوبات التعلم' },
  { label: 'Sensory Disorders', labelAR: 'اضطرابات الحس' },
];

export default function WhoWeServe() {
  const { locale, t } = useLanguage();
  return (
    <section className="py-24 bg-[#EEFF99] relative overflow-hidden" style={{ clipPath: 'polygon(0 4%, 100% 0, 100% 96%, 0 100%)' }}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: content */}
          <div>
            <motion.h2
              className="font-display font-bold text-3xl md:text-4xl text-[#08091A] mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              {t('whoWeServe.title')}
            </motion.h2>

            <div className="flex flex-wrap gap-3">
              {conditions.map((condition, i) => (
                <motion.div
                  key={condition.label}
                  className="px-4 py-2 rounded-full font-sans font-semibold text-sm text-white cursor-default"
                  style={{ backgroundColor: tagColors[i % tagColors.length] }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.3 }}
                >
                  {locale === 'ar' ? condition.labelAR : condition.label}
                </motion.div>
              ))}
            </div>

            <motion.p
              className="font-sans text-[#1A1A2E] text-base leading-relaxed mt-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              {t('whoWeServe.description')}
            </motion.p>
          </div>

          {/* Right: mascot */}
          <motion.div
            className="flex justify-center lg:justify-end"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <img
              src="/assets/mascots/behavior-guide.png"
              alt="Behavior Guide mascot"
              className="w-64 h-80 object-contain drop-shadow-xl"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
