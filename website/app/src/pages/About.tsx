import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Target, Heart, Lightbulb, ArrowRight, MapPin, Phone, Mail } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useLanguage } from '../LanguageProvider';
import { GlowCard } from '@/components/ui/spotlight-card';

const values = [
  {
    icon: Target,
    title: 'Our Vision',
    titleAR: 'رؤيتنا',
    description: 'To be the leading pediatric development center in the region, where every child discovers their potential and every family finds support.',
    descriptionAR: 'أن نكون المركز الرائد لتطوير الأطفال في المنطقة، حيث يكتشف كل طفل إمكاناته وتجد كل أسرة الدعم الذي تحتاجه.',
    color: '#FFCC22',
    glowColor: 'orange' as const,
  },
  {
    icon: Heart,
    title: 'Our Mission',
    titleAR: 'مهمتنا',
    description: 'To provide exceptional, evidence-based therapeutic services that nurture each child\'s unique abilities in a warm, inclusive environment.',
    descriptionAR: 'تقديم خدمات علاجية استثنائية ومبنية على الدليل العلمي تُنمّي القدرات الفريدة لكل طفل في بيئة دافئة وشاملة.',
    color: '#FF4D94',
    glowColor: 'red' as const,
  },
  {
    icon: Lightbulb,
    title: 'Our Values',
    titleAR: 'قيمنا',
    description: 'Compassion, excellence, innovation, and family-centered care guide every decision we make and every interaction we have.',
    descriptionAR: 'الرحمة والتميز والابتكار ورعاية الأسرة تقود كل قرار نتخذه وكل تفاعل نقوم به.',
    color: '#33CC44',
    glowColor: 'green' as const,
  },
];

const team = [
  {
    name: 'Mohammed Al Harthi',
    nameAR: 'محمد الحارثي',
    role: 'Founder',
    roleAR: 'مؤسس',
    image: null,
    initial: 'M',
    color: '#3355EE',
  },
  {
    name: 'Bader Al Harthi',
    nameAR: 'بدر الحارثي',
    role: 'Founder',
    roleAR: 'مؤسس',
    image: null,
    initial: 'B',
    color: '#FF4D94',
  },
  {
    name: 'Dua Atieh',
    nameAR: 'دعاء عطية',
    role: 'Chief Executive Officer',
    roleAR: 'الرئيسة التنفيذية',
    image: null,
    initial: 'D',
    color: '#33CC44',
  },
  {
    name: 'Our Team',
    nameAR: 'فريقنا',
    role: 'Behavior Specialists',
    roleAR: 'أخصائيو سلوك',
    image: null,
    initial: 'O',
    color: '#7766DD',
  },
  {
    name: 'Our Team',
    nameAR: 'فريقنا',
    role: 'Speech & Language Therapists',
    roleAR: 'أخصائيو نطق ولغة',
    image: null,
    initial: 'O',
    color: '#3355EE',
  },
  {
    name: 'Our Team',
    nameAR: 'فريقنا',
    role: 'Occupational Therapists',
    roleAR: 'أخصائيو علاج وظيفي',
    image: null,
    initial: 'O',
    color: '#FF4D94',
  },
  {
    name: 'Shaden Alhamdan',
    nameAR: 'شادن الحمدان',
    role: 'Behavior Therapist',
    roleAR: 'أخصائية علاج سلوكي',
    image: null,
    initial: 'S',
    color: '#7766DD',
  },
];

export default function About() {
  const { locale, t } = useLanguage();


  return (
    <div className="min-h-screen bg-bg-base">
      <Navbar />

      {/* Hero with diagonal split */}
      <section className="pt-20 min-h-[70vh] relative overflow-hidden">
        <div className="absolute inset-0 grid grid-cols-1 lg:grid-cols-2">
          {/* Left: cobalt bg with wordmark */}
          <div className="bg-brand-blue flex items-center justify-center relative overflow-hidden">

            {/* Decorative shapes */}
            <div className="absolute top-20 left-20 w-24 h-24 rounded-full bg-white/5" />
            <div className="absolute bottom-32 right-16 w-16 h-16 rounded-full bg-white/10" />
            <div className="absolute top-1/3 right-1/3 w-8 h-8 rounded-full bg-white/10" />

            <motion.div
              className="text-center relative z-10 px-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mx-auto mb-6 overflow-hidden">
                <img
                  src="/logo/Riyada%20Center%20Logo%20Souce-01.png"
                  alt="Riyada Center"
                  className="w-full h-full object-contain"
                />
              </div>
              {/* Always LTR: individual letter styling must not be reversed by RTL */}
              <h1
                dir="ltr"
                className="font-display font-bold text-4xl md:text-5xl mb-3 inline-flex flex-wrap items-baseline gap-0 justify-center"
              >
                <span style={{ color: '#ffffff' }}>R</span>
                <span style={{ color: '#E91E8C' }}>i</span>
                <span style={{ color: '#ffffff' }}>y</span>
                <span style={{ color: '#3DBE6E' }}>a</span>
                <span style={{ color: '#FFD60A' }}>d</span>
                <span style={{ color: '#ffffff' }}>a</span>
                <span className="mx-2" />
                <span style={{ color: '#ffffff' }}>C</span>
                <span style={{ color: '#E91E8C' }}>e</span>
                <span style={{ color: '#ffffff' }}>n</span>
                <span style={{ color: '#3DBE6E' }}>t</span>
                <span style={{ color: '#E91E8C' }}>e</span>
                <span style={{ color: '#ffffff' }}>r</span>
              </h1>
              <p className="font-display font-semibold text-lg" style={{ color: '#E91E8C' }}>
                {t('about.heroSlogan')}
              </p>
            </motion.div>
          </div>

          {/* Right: image */}
          <div className="relative">
            <img
              src="/assets/images/sensory-room.jpg"
              alt="Riyada Center facility"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-blue/20 to-transparent" />
          </div>
        </div>

        {/* Diagonal overlay on mobile */}
        <div className="lg:hidden absolute inset-0 bg-brand-blue" />
      </section>

      {/* Vision / Mission / Values */}
      <section className="py-24 bg-card">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.h2
            className="font-display font-bold text-3xl text-text-primary text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {t('about.drivesUs')}
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((item, i) => (
              <motion.div
                key={item.title}
                className="flex flex-col"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
              >
                <GlowCard customSize glowColor={item.glowColor} className="w-full flex-1">
                  <div className="p-8 flex flex-col">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                      style={{ backgroundColor: item.color + '25' }}
                    >
                      <item.icon size={26} style={{ color: item.color }} />
                    </div>
                    <h3 className="font-display font-bold text-lg text-text-primary mb-3">
                      {locale === 'ar' ? item.titleAR : item.title}
                    </h3>
                    <p className="font-sans text-sm leading-relaxed text-text-secondary">
                      {locale === 'ar' ? item.descriptionAR : item.description}
                    </p>
                  </div>
                </GlowCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-bg-base">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.h2
            className="font-display font-bold text-3xl text-text-primary text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {t('about.meetTeam')}
          </motion.h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {team.map((member, i) => (
              <motion.div
                key={`${member.name}-${i}`}
                className="text-center group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <div
                  className="w-24 h-24 md:w-28 md:h-28 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-2xl transition-transform duration-300 group-hover:scale-105"
                  style={{ backgroundColor: member.color }}
                >
                  {member.initial}
                </div>
                <h3 className="font-semibold text-sm text-text-primary mb-1">
                  {locale === 'ar' ? member.nameAR : member.name}
                </h3>
                <p className="text-xs text-text-secondary">
                  {locale === 'ar' ? member.roleAR : member.role}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Mascot — fixed container so the full character is visible */}
          <motion.div
            className="flex justify-center mt-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <img
              src="/assets/mascots/language-explorer.png"
              alt=""
              className="w-24 h-36 object-contain object-bottom animate-float opacity-60"
            />
          </motion.div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-24 bg-brand-blue dark:bg-[#0A0F2E] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-brand-blue" />
          <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full bg-brand-pink" />
        </div>

        {/* Watermark */}
        <img
          src="/logo/Riyada%20Center%20Logo%20Souce-05.png"
          alt=""
          className="pointer-events-none absolute left-8 bottom-0 w-[500px] opacity-[0.04] z-0 select-none"
        />

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.h2
            className="font-display font-bold text-3xl md:text-4xl mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {t('about.visitCenter')}
          </motion.h2>
          <p className="text-white/60 mb-10 max-w-lg mx-auto">
            {t('about.visitCopy')}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <motion.div
              className="flex flex-col items-center gap-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0, duration: 0.5 }}
            >
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                <MapPin size={20} className="text-brand-blue" />
              </div>
              <span className="text-sm text-white/70" dir="ltr">
                Makkah Al Mukarramah Road, Al Sulaymaniyah District, Riyadh, Saudi Arabia
              </span>
            </motion.div>
            <motion.div
              className="flex flex-col items-center gap-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                <Phone size={20} className="text-brand-green" />
              </div>
              <span className="text-sm text-white/70" dir="ltr">+966 555 019 224</span>
            </motion.div>
            <motion.div
              className="flex flex-col items-center gap-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                <Mail size={20} className="text-brand-pink" />
              </div>
              <span className="text-sm text-white/70">RC@riyada-ventures.com</span>
            </motion.div>
          </div>

          <Link
            to="/booking"
            className="inline-flex items-center gap-2 px-8 py-4 bg-brand-blue text-white font-bold rounded-pill shadow-button hover:scale-105 transition-transform"
          >
            {t('about.bookVisit')}
            <ArrowRight size={18} className="rtl:rotate-180" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
