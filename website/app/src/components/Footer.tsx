import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Instagram, Twitter } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useLanguage } from '../LanguageProvider';

const BRAND_COLORS = ['#3355EE','#E91E8C','#3355EE','#3DBE6E','#7B52AB','#3355EE'];

const footerServices = [
  { labelEN: 'Assessments & Consultations', labelAR: 'التقييمات والاستشارات', href: '/services/assessments' },
  { labelEN: 'ABA / Behavior Therapy',       labelAR: 'العلاج السلوكي ABA',   href: '/services/aba-therapy' },
  { labelEN: 'Speech & Language Therapy',    labelAR: 'علاج النطق واللغة',     href: '/services/speech-language' },
  { labelEN: 'Occupational Therapy',         labelAR: 'العلاج الوظيفي',        href: '/services/occupational-therapy' },
];

const ACCENT_COLORS = ['#3355EE', '#FF4D94', '#FFCC22', '#33CC44'];

const EASE = [0.22, 1, 0.36, 1] as const;

const col = (delay: number) => ({
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, delay, ease: EASE } },
});

export default function Footer() {
  const { locale, t } = useLanguage();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <footer ref={ref} className="bg-[#0A0D18] text-white relative overflow-hidden">

      {/* Colorful top accent bar — animates in */}
      <div className="h-1 w-full flex overflow-hidden">
        {ACCENT_COLORS.map((color, i) => (
          <motion.div
            key={color}
            className="flex-1"
            style={{ backgroundColor: color }}
            initial={{ scaleX: 0, originX: locale === 'ar' ? 1 : 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
          />
        ))}
      </div>

      {/* Subtle grid background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: 'linear-gradient(#3355EE 1px, transparent 1px), linear-gradient(90deg, #3355EE 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

          {/* ── Col 1: Logo & tagline ──────────────────── */}
          <motion.div
            className="md:col-span-1"
            variants={col(0.05)}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
          >
            <Link to="/" className="flex items-center gap-3 mb-5 group">
              <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center overflow-hidden shrink-0 shadow-md transition-transform duration-200 group-hover:scale-105">
                <img
                  src="/logo/Riyada%20Center%20Logo%20Souce-01.png"
                  alt="Riyada Center"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                {locale === 'ar' ? (
                  <div className="font-display font-bold text-xl text-white leading-none">
                    مركز ريادة
                  </div>
                ) : (
                  <div dir="ltr" className="font-display font-bold text-xl leading-none inline-flex items-baseline gap-0">
                    {'Riyada'.split('').map((ch, i) => (
                      <span key={i} style={{ color: BRAND_COLORS[i] }}>{ch}</span>
                    ))}
                    <span className="mx-1" />
                    {'Center'.split('').map((ch, i) => (
                      <span key={i} style={{ color: BRAND_COLORS[i % BRAND_COLORS.length] }}>{ch}</span>
                    ))}
                  </div>
                )}
                <div className="text-brand-yellow font-semibold text-[11px] mt-1.5 tracking-[0.18em] uppercase">
                  {locale === 'ar' ? 'ابني. طور. ارتقِ.' : 'Connect. Develop. Rise.'}
                </div>
              </div>
            </Link>

            <p className="text-white/55 text-sm leading-relaxed mb-5">
              {t('footer.tagline')}
            </p>

            {/* Brand color dots */}
            <div className="flex items-center gap-1.5">
              {['#3355EE','#FF4D94','#FFCC22','#33CC44','#7766DD'].map((c) => (
                <div key={c} className="w-2 h-2 rounded-full" style={{ backgroundColor: c }} />
              ))}
            </div>
          </motion.div>

          {/* ── Col 2: Quick links ─────────────────────── */}
          <motion.div
            variants={col(0.13)}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
          >
            <h4 className="font-semibold text-sm mb-5 text-white/90 uppercase tracking-wider">
              {t('footer.quickLinks')}
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: t('nav.home'),        href: '/' },
                { label: t('nav.services'),    href: '/services' },
                { label: t('nav.packages'),    href: '/packages' },
                { label: t('footer.about'),    href: '/about' },
                { label: t('footer.contactUs'),href: '/contact' },
                { label: t('footer.bookSession'), href: '/booking' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="group flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors duration-200"
                  >
                    <span className="w-1 h-1 rounded-full bg-brand-blue opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* ── Col 3: Services ────────────────────────── */}
          <motion.div
            variants={col(0.21)}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
          >
            <h4 className="font-semibold text-sm mb-5 text-white/90 uppercase tracking-wider">
              {t('footer.ourServices')}
            </h4>
            <ul className="space-y-2.5">
              {footerServices.map((service) => (
                <li key={service.href}>
                  <Link
                    to={service.href}
                    className="group flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors duration-200"
                  >
                    <span className="w-1 h-1 rounded-full bg-brand-pink opacity-0 group-hover:opacity-100 transition-opacity" />
                    {locale === 'ar' ? service.labelAR : service.labelEN}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* ── Col 4: Contact ─────────────────────────── */}
          <motion.div
            variants={col(0.29)}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
          >
            <h4 className="font-semibold text-sm mb-5 text-white/90 uppercase tracking-wider">
              {t('footer.contactUs')}
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-brand-blue/15 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin size={13} className="text-brand-blue" />
                </div>
                <span className="text-white/50 text-sm leading-relaxed" dir="ltr">
                  Makkah Al Mukarramah Road,<br />Al Sulaymaniyah District,<br />Riyadh, Saudi Arabia
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-brand-green/15 flex items-center justify-center shrink-0">
                  <Phone size={13} className="text-brand-green" />
                </div>
                <span className="text-white/50 text-sm" dir="ltr">+966 55 501 9224</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-brand-pink/15 flex items-center justify-center shrink-0">
                  <Mail size={13} className="text-brand-pink" />
                </div>
                <span className="text-white/50 text-sm">RC@riyada-ventures.com</span>
              </li>
            </ul>

            <div className="flex items-center gap-2.5 mt-6">
              <a
                href="#"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-white/8 border border-white/10 flex items-center justify-center text-white/50 hover:bg-brand-blue hover:text-white hover:border-brand-blue transition-all duration-200"
              >
                <Instagram size={15} />
              </a>
              <a
                href="#"
                aria-label="Twitter / X"
                className="w-9 h-9 rounded-full bg-white/8 border border-white/10 flex items-center justify-center text-white/50 hover:bg-brand-blue hover:text-white hover:border-brand-blue transition-all duration-200"
              >
                <Twitter size={15} />
              </a>
            </div>
          </motion.div>
        </div>

        {/* ── Bottom bar ─────────────────────────────────── */}
        <motion.div
          className="border-t border-white/8 mt-14 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.45 }}
        >
          <p className="text-white/30 text-xs">{t('footer.allRights')}</p>
          <div className="flex items-center gap-4">
            <Link to="/terms" className="text-white/30 hover:text-white/70 text-xs transition-colors duration-200">
              {t('footer.terms')}
            </Link>
            <Link to="/privacy" className="text-white/30 hover:text-white/70 text-xs transition-colors duration-200">
              {t('footer.privacy')}
            </Link>
            <div className="flex items-center gap-1.5">
              {['#3355EE','#FF4D94','#FFCC22','#33CC44','#7766DD'].map((color) => (
                <div key={color} className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
