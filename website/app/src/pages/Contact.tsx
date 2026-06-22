import { type FormEvent, useState } from 'react';

import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { addContactMessage } from '../lib/contactStore';
import { submitContact } from '../services/adminApi';
import { useLanguage } from '../LanguageProvider';
import { GlowCard } from '@/components/ui/spotlight-card';
import SEO from '../components/SEO';
import { BreadcrumbSchema } from '../components/StructuredData';
import { getPageSEO } from '../seo';

const serviceOptions = [
  { value: 'Assessment', labelAR: 'التقييم' },
  { value: 'ABA Therapy', labelAR: 'علاج ABA' },
  { value: 'Speech Therapy', labelAR: 'علاج النطق' },
  { value: 'Occupational Therapy', labelAR: 'العلاج الوظيفي' },
];

const initialFormState = {
  name: '',
  email: '',
  phone: '',
  service: '',
  childAge: '',
  concern: '',
  message: '',
};

export default function Contact() {
  const { locale, t } = useLanguage();
  const [form, setForm] = useState(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!form.name.trim()) newErrors.name = t('contact.errors.name');
    if (!form.email.trim()) {
      newErrors.email = t('contact.errors.email');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = t('contact.errors.emailInvalid');
    }
    if (!form.phone.trim()) newErrors.phone = t('contact.errors.phone');
    if (!form.service) newErrors.service = t('contact.errors.service');
    if (!form.childAge.trim()) newErrors.childAge = t('contact.errors.childAge');
    if (!form.concern.trim()) newErrors.concern = t('contact.errors.concern');
    if (!form.message.trim()) newErrors.message = t('contact.errors.message');

    return newErrors;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      const payload = {
        name:     form.name.trim(),
        email:    form.email.trim(),
        phone:    form.phone.trim(),
        service:  form.service,
        childAge: form.childAge.trim(),
        concern:  form.concern.trim(),
        message:  form.message.trim(),
      };
      try {
        await submitContact(payload);
      } catch {
        addContactMessage(payload);
      }
      setSubmitted(true);
      setForm(initialFormState);
    }
  };

  const handleChange = (field: string, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: '' }));
  };

  const seo = getPageSEO('contact', locale)!;

  return (
    <div className="min-h-screen bg-bg-base">
      <SEO {...seo} />
      <BreadcrumbSchema items={[{ name: locale === 'ar' ? 'الرئيسية' : 'Home', url: '/' }, { name: locale === 'ar' ? 'تواصل معنا' : 'Contact', url: '/contact' }]} />
      <Navbar />

      <main className="pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <section className="mb-12 text-center">
            <motion.p
              className="text-brand-yellow font-semibold uppercase tracking-[0.35em] mb-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {t('contact.pageTag')}
            </motion.p>
            <motion.h1
              className="font-display font-bold text-4xl md:text-5xl text-text-primary"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {t('contact.pageTitle')}
            </motion.h1>
            <motion.p
              className="max-w-2xl mx-auto mt-4 text-text-secondary text-sm md:text-base leading-7"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {t('contact.pageCopy')}
            </motion.p>
          </section>

          <div className="grid gap-8 xl:grid-cols-[1.3fr_0.9fr]">
            <motion.section
              className="rounded-card bg-card p-8 shadow-card"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-8">
                <p className="text-sm uppercase tracking-[0.35em] text-brand-blue font-semibold mb-2">
                  {t('contact.formLabel')}
                </p>
                <h2 className="font-semibold text-2xl text-text-primary">
                  {t('contact.formHeading')}
                </h2>
                <p className="mt-3 text-sm text-text-secondary leading-6">
                  {t('contact.formCopy')}
                </p>
              </div>

              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="rounded-3xl border border-brand-green/20 bg-brand-green/10 p-6"
                  >
                    <p className="text-brand-green font-semibold mb-2">{t('contact.thankYou')}</p>
                    <h3 className="font-semibold text-lg text-text-primary mb-2">
                      {t('contact.successHeadline')}
                    </h3>
                    <p className="text-text-secondary text-sm leading-6">
                      {t('contact.successCopy')}
                    </p>
                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="mt-6 inline-flex items-center justify-center rounded-pill bg-brand-blue px-5 py-3 text-sm font-semibold text-white shadow-button hover:bg-brand-blue/90 transition-colors"
                    >
                      {t('contact.sendAnother')}
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    className="space-y-5"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="grid gap-5 md:grid-cols-2">
                      <div>
                        <label className="text-sm font-medium text-text-primary" htmlFor="name">
                          {t('contact.fullName')}
                        </label>
                        <input
                          id="name"
                          type="text"
                          value={form.name}
                          onChange={(event) => handleChange('name', event.target.value)}
                          className="mt-2 w-full rounded-3xl border border-border/80 bg-surface p-4 text-sm text-text-primary placeholder:text-text-secondary outline-none transition-colors focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10"
                        />
                        {errors.name && <p className="mt-2 text-xs text-red-500">{errors.name}</p>}
                      </div>
                      <div>
                        <label className="text-sm font-medium text-text-primary" htmlFor="email">
                          {t('contact.email')}
                        </label>
                        <input
                          id="email"
                          type="email"
                          value={form.email}
                          onChange={(event) => handleChange('email', event.target.value)}
                          className="mt-2 w-full rounded-3xl border border-border/80 bg-surface p-4 text-sm text-text-primary placeholder:text-text-secondary outline-none transition-colors focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10"
                        />
                        {errors.email && <p className="mt-2 text-xs text-red-500">{errors.email}</p>}
                      </div>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                      <div>
                        <label className="text-sm font-medium text-text-primary" htmlFor="phone">
                          {t('contact.phone')}
                        </label>
                        <input
                          id="phone"
                          type="tel"
                          value={form.phone}
                          onChange={(event) => handleChange('phone', event.target.value)}
                          className="mt-2 w-full rounded-3xl border border-border/80 bg-surface p-4 text-sm text-text-primary placeholder:text-text-secondary outline-none transition-colors focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10"
                        />
                        {errors.phone && <p className="mt-2 text-xs text-red-500">{errors.phone}</p>}
                      </div>
                      <div>
                        <label className="text-sm font-medium text-text-primary" htmlFor="service">
                          {t('contact.serviceOfInterest')}
                        </label>
                        <select
                          id="service"
                          value={form.service}
                          onChange={(event) => handleChange('service', event.target.value)}
                          className="mt-2 w-full rounded-3xl border border-border/80 bg-surface p-4 text-sm text-text-primary placeholder:text-text-secondary outline-none transition-colors focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10"
                        >
                          <option value="">{t('contact.selectService')}</option>
                          {serviceOptions.map((option) => (
                            <option
                              key={option.value}
                              value={option.value}
                              className="bg-[#081026] text-white"
                            >
                              {locale === 'ar' ? option.labelAR : option.value}
                            </option>
                          ))}
                        </select>
                        {errors.service && <p className="mt-2 text-xs text-red-500">{errors.service}</p>}
                      </div>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                      <div>
                        <label className="text-sm font-medium text-text-primary" htmlFor="childAge">
                          {t('contact.childAge')}
                        </label>
                        <input
                          id="childAge"
                          type="text"
                          value={form.childAge}
                          onChange={(event) => handleChange('childAge', event.target.value)}
                          className="mt-2 w-full rounded-3xl border border-border/80 bg-surface p-4 text-sm text-text-primary placeholder:text-text-secondary outline-none transition-colors focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10"
                        />
                        {errors.childAge && <p className="mt-2 text-xs text-red-500">{errors.childAge}</p>}
                      </div>
                      <div>
                        <label className="text-sm font-medium text-text-primary" htmlFor="concern">
                          {t('contact.primaryConcern')}
                        </label>
                        <input
                          id="concern"
                          type="text"
                          value={form.concern}
                          onChange={(event) => handleChange('concern', event.target.value)}
                          className="mt-2 w-full rounded-3xl border border-border/80 bg-surface p-4 text-sm text-text-primary placeholder:text-text-secondary outline-none transition-colors focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10"
                        />
                        {errors.concern && <p className="mt-2 text-xs text-red-500">{errors.concern}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-text-primary" htmlFor="message">
                        {t('contact.message')}
                      </label>
                      <textarea
                        id="message"
                        rows={6}
                        value={form.message}
                        onChange={(event) => handleChange('message', event.target.value)}
                        className="mt-2 w-full rounded-[2rem] border border-border/80 bg-surface p-4 text-sm text-text-primary placeholder:text-text-secondary outline-none transition-colors focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10"
                      />
                      {errors.message && <p className="mt-2 text-xs text-red-500">{errors.message}</p>}
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="rounded-3xl bg-brand-blue/10 p-4 text-sm text-text-secondary">
                        <p className="font-semibold text-text-primary">{t('contact.needHelp')}</p>
                        <p className="mt-1">{t('contact.needHelpCopy')}</p>
                      </div>
                      <button
                        type="submit"
                        className="inline-flex items-center justify-center rounded-pill bg-brand-blue px-7 py-3 text-sm font-semibold text-white shadow-button hover:bg-brand-blue/90 transition-colors"
                      >
                        {t('contact.sendMessage')}
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.section>

            <motion.aside
              className="space-y-6 rounded-card bg-[#081026] p-8 text-white shadow-card"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="rounded-[2rem] bg-white/5 p-6 ring-1 ring-white/10">
                <p className="text-xs uppercase tracking-[0.35em] text-brand-yellow font-semibold mb-3">
                  {t('contact.pageTag')}
                </p>
                <h3 className="font-semibold text-2xl text-white">{t('contact.formHeading')}</h3>
                <p className="mt-4 text-sm leading-6 text-white/70">
                  {t('contact.formCopy')}
                </p>
              </div>

              <div className="space-y-5 rounded-[2rem] bg-white/5 p-6 ring-1 ring-white/10">
                <div>
                  <p className="text-xs text-white/50 uppercase tracking-[0.25em] mb-2">{t('contact.emailLabel')}</p>
                  <p className="text-sm text-white">RC@riyada-ventures.com</p>
                </div>
                <div>
                  <p className="text-xs text-white/50 uppercase tracking-[0.25em] mb-2">{t('contact.phoneLabel')}</p>
                  <p className="text-sm text-white" dir="ltr">+966 55 501 9224</p>
                </div>
                <div>
                  <p className="text-xs text-white/50 uppercase tracking-[0.25em] mb-2">{t('contact.locationLabel')}</p>
                  <p className="text-sm text-white">
                    Makkah Al Mukarramah Road, Al Sulaymaniyah District, Riyadh, Saudi Arabia
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <GlowCard customSize glowColor="blue" className="w-full">
                  <div className="p-6">
                    <p className="text-sm font-semibold text-white mb-2">{t('contact.fastResponse')}</p>
                    <p className="text-xs text-white/60">{t('contact.fastResponseSub')}</p>
                  </div>
                </GlowCard>
                <GlowCard customSize glowColor="purple" className="w-full">
                  <div className="p-6">
                    <p className="text-sm font-semibold text-white mb-2">{t('contact.expertTeam')}</p>
                    <p className="text-xs text-white/60">{t('contact.expertTeamSub')}</p>
                  </div>
                </GlowCard>
              </div>
            </motion.aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
