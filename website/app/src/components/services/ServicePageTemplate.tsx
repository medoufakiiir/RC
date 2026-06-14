import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Calendar } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { CSSProperties, ReactNode } from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import { useLanguage } from '../../LanguageProvider';

export interface ServiceStep {
  number: string;
  title: string;
  titleAR: string;
  description: string;
  descriptionAR: string;
  icon: LucideIcon;
  color: string;
}

export interface ServiceFaq {
  q: string;
  qAR: string;
  a: string;
  aAR: string;
}

export interface ServiceCondition {
  label: string;
  labelAR: string;
}

export interface ServiceTemplateProps {
  // Hero
  heroBgStyle: CSSProperties;
  heroVisual: ReactNode;
  tagIcon: LucideIcon;
  tagBgClass: string;
  title: { en: string; ar: string };
  tagline: { en: string; ar: string };

  // Sections
  about: { en: string[]; ar: string[] };
  whatWeDo: { en: string; ar: string }[];
  conditions: ServiceCondition[];
  processSteps: ServiceStep[];
  faqs: ServiceFaq[];

  // CTA
  ctaTitle: { en: string; ar: string };
  ctaMascotSrc?: string;
}

export default function ServicePageTemplate({
  heroBgStyle,
  heroVisual,
  tagIcon: TagIcon,
  tagBgClass,
  title,
  tagline,
  about,
  whatWeDo,
  conditions,
  processSteps,
  faqs,
  ctaTitle,
  ctaMascotSrc,
}: ServiceTemplateProps) {
  const { locale } = useLanguage();
  const isAR = locale === 'ar';

  return (
    <div className="min-h-screen bg-bg-base">
      <Navbar />

      {/* 1 — Hero */}
      <section className="pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              className="relative h-80 lg:h-[420px] rounded-card overflow-hidden flex items-center justify-center"
              style={heroBgStyle}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {heroVisual}
              <div className="absolute top-6 left-6 w-16 h-16 rounded-full bg-white/20" />
              <div className="absolute bottom-8 right-8 w-10 h-10 rounded-full bg-white/20" />
              <div className="absolute top-1/2 right-12 w-6 h-6 rounded-full bg-white/30" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-pill text-xs font-semibold tracking-wider uppercase mb-4 ${tagBgClass}`}>
                <TagIcon size={14} />
                {isAR ? title.ar : title.en}
              </div>
              <h1 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-text-primary mb-4 leading-tight">
                {isAR ? title.ar : title.en}
              </h1>
              <p className="text-text-secondary text-base leading-relaxed mb-6">
                {isAR ? tagline.ar : tagline.en}
              </p>
              <Link to="/booking" className="btn-primary inline-flex items-center gap-2">
                <Calendar size={18} />
                {isAR ? 'احجز استشارة مجانية' : 'Book a Free Consultation'}
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2 — About This Service */}
      <section className="py-16 bg-card">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <motion.h2
            className="font-display font-bold text-2xl md:text-3xl text-text-primary mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {isAR ? 'عن هذه الخدمة' : 'About This Service'}
          </motion.h2>
          <motion.div
            className="space-y-4 text-text-secondary text-base leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            {(isAR ? about.ar : about.en).map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 3 — What We Do */}
      <section className="py-16 bg-bg-base">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <motion.h2
            className="font-display font-bold text-2xl md:text-3xl text-text-primary mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {isAR ? 'ماذا نفعل' : 'What We Do'}
          </motion.h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {whatWeDo.map((item, i) => (
              <motion.li
                key={i}
                className="flex items-start gap-3 text-text-secondary text-base leading-relaxed"
                initial={{ opacity: 0, x: isAR ? 10 : -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
              >
                <CheckCircle2 size={20} className="text-brand-blue shrink-0 mt-0.5" />
                {isAR ? item.ar : item.en}
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      {/* 4 — What We Treat */}
      <section
        className="py-16 bg-[#EEFF99] dark:bg-card"
        style={{ clipPath: 'polygon(0 4%, 100% 0, 100% 96%, 0 100%)' }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.h2
            className="font-display font-bold text-2xl md:text-3xl text-[#08091A] dark:text-text-primary mb-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {isAR ? 'ما الذي نعالجه' : 'What We Treat'}
          </motion.h2>
          <div className="flex flex-wrap justify-center gap-3">
            {conditions.map((condition, i) => (
              <motion.span
                key={condition.label}
                className="px-4 py-1.5 rounded-full bg-brand-blue text-white font-medium text-sm cursor-default"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                {isAR ? condition.labelAR : condition.label}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* 5 — Our Process */}
      <section className="py-24 bg-bg-base">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <motion.h2
            className="font-display font-bold text-2xl md:text-3xl text-text-primary mb-14 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {isAR ? 'خطوات عملنا' : 'Our Process'}
          </motion.h2>
          <div className="relative">
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-brand-blue/10 -translate-y-1/2" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {processSteps.map((step, i) => {
                const StepIcon = step.icon;
                return (
                  <motion.div
                    key={step.number}
                    className="relative bg-card rounded-card p-6 shadow-card hover:shadow-card-hover transition-all duration-300"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15, duration: 0.5 }}
                  >
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
                      <StepIcon size={20} style={{ color: step.color }} />
                    </div>
                    <h3 className="font-display font-bold text-lg text-text-primary mb-2">
                      {isAR ? step.titleAR : step.title}
                    </h3>
                    <p className="text-text-secondary text-sm leading-relaxed">
                      {isAR ? step.descriptionAR : step.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 6 — FAQs */}
      <section className="py-24 bg-card">
        <div className="max-w-3xl mx-auto px-6 md:px-12">
          <motion.h2
            className="font-display font-bold text-2xl md:text-3xl text-text-primary mb-10 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {isAR ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
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
                  {isAR ? faq.qAR : faq.q}
                  <ArrowRight
                    size={16}
                    className="text-brand-blue transition-transform group-open:rotate-90 shrink-0 ms-4 rtl:scale-x-[-1]"
                  />
                </summary>
                <div className="px-5 pb-5 text-text-secondary text-sm leading-relaxed bg-brand-yellow/10 dark:bg-brand-yellow/20">
                  {isAR ? faq.aAR : faq.a}
                </div>
              </motion.details>
            ))}
          </div>
        </div>
      </section>

      {/* 7 — CTA */}
      <section className="py-20 bg-brand-blue relative overflow-hidden">
        {ctaMascotSrc && (
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <img
              src={ctaMascotSrc}
              alt=""
              className="w-64 h-80 object-contain absolute -left-8 -bottom-16"
            />
          </div>
        )}
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.h2
            className="font-display font-bold text-3xl md:text-4xl text-white mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {isAR ? ctaTitle.ar : ctaTitle.en}
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <Link
              to="/booking"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-brand-blue font-bold rounded-pill shadow-lg hover:scale-105 transition-transform duration-200"
            >
              <Calendar size={20} />
              {isAR ? 'احجز استشارة مجانية' : 'Book a Free Consultation'}
              <ArrowRight size={18} className="rtl:rotate-180" />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
