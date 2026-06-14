import { motion } from 'framer-motion';
import { Heart, Users, Award, Clock, Shield, Sparkles } from 'lucide-react';
import { useLanguage } from '../LanguageProvider';

const benefits = [
  {
    icon: Heart,
    color: '#FF4D94',
    title: 'Child-Centered Care',
    titleAR: 'رعاية تركز على الطفل',
    description: 'Every program is tailored to your child\'s unique personality, strengths, and goals.',
    descriptionAR: 'كل برنامج مصمم وفقًا لشخصية طفلك الفريدة وقوته وأهدافه.',
  },
  {
    icon: Users,
    color: '#3355EE',
    title: 'Expert Team',
    titleAR: 'فريق خبير',
    description: 'Licensed therapists with specialized training in pediatric development.',
    descriptionAR: 'معالِجون مرخَّصون مدرَّبون تدريبًا متخصصًا في تنمية الأطفال.',
  },
  {
    icon: Award,
    color: '#FFCC22',
    title: 'Proven Methods',
    titleAR: 'طرق مثبتة',
    description: 'Evidence-based therapeutic approaches backed by research and results.',
    descriptionAR: 'أساليب علاجية مدعومة بالأدلة تستند إلى البحث والنتائج.',
  },
  {
    icon: Clock,
    color: '#33CC44',
    title: 'Flexible Scheduling',
    titleAR: 'جدولة مرنة',
    description: 'Sessions available Sunday through Thursday with convenient time slots.',
    descriptionAR: 'جلسات متاحة من الأحد إلى الخميس مع أوقات ملائمة.',
  },
  {
    icon: Shield,
    color: '#7766DD',
    title: 'Safe Environment',
    titleAR: 'بيئة آمنة',
    description: 'A nurturing, sensory-friendly space designed for children\'s comfort.',
    descriptionAR: 'بيئة داعمة وملائمة للحواس مصممة لراحة الأطفال.',
  },
  {
    icon: Sparkles,
    color: '#FF4D94',
    title: 'Holistic Approach',
    titleAR: 'نهج شامل',
    description: 'We address the whole child — cognitive, physical, emotional, and social.',
    descriptionAR: 'نحدد الطفل ككل — عقليًا، وجسديًا، وعاطفيًا، واجتماعيًا.',
  },
];

export default function WhyRiyada() {
  const { locale, t } = useLanguage();
  return (
    <section className="py-24 bg-gray-50 dark:bg-brand-blue relative overflow-hidden">
      {/* Decorative skill builder peek */}
      <div className="absolute -bottom-8 -right-8 opacity-10">
        <img
          src="/assets/mascots/skill-builder.png"
          alt=""
          className="w-48 h-60 object-contain"
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <motion.h2
          className="font-display font-bold text-3xl md:text-4xl text-text-primary dark:text-white text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {t('whyRiyada.title')}
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, i) => (
            <motion.div
              key={benefit.title}
              className="bg-card rounded-card p-6 shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all duration-300 border border-border"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                style={{ backgroundColor: benefit.color + '15' }}
              >
                <benefit.icon size={24} style={{ color: benefit.color }} />
              </div>
              <h3 className="font-display font-bold text-lg text-text-primary mb-2">
                {locale === 'ar' ? benefit.titleAR : benefit.title}
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                {locale === 'ar' ? benefit.descriptionAR : benefit.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
