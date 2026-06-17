import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe, Moon, SunMedium } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getInitialThemeMode, setSavedThemeMode, applyTheme, type ThemeMode } from '../theme';
import { useLanguage } from '../LanguageProvider';

const BRAND_COLORS = ['#3355EE','#E91E8C','#3355EE','#3DBE6E','#7B52AB','#3355EE'];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [themeMode, setThemeMode] = useState<ThemeMode>('dark');
  const location = useLocation();
  const { locale, setLocale, t } = useLanguage();

  const navLinks = [
    { label: t('nav.home'),     href: '/' },
    { label: t('nav.services'), href: '/services' },
    { label: t('nav.booking'),  href: '/booking' },
    { label: t('nav.about'),    href: '/about' },
    { label: t('nav.contact'),  href: '/contact' },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  useEffect(() => { setThemeMode(getInitialThemeMode()); }, []);

  const isRTL = locale === 'ar';

  return (
    <>
      {/* ── Floating pill navbar ───────────────────────────── */}
      {/* Outer div owns the fixed centering — keeps -translate-x-1/2 safe from Framer Motion */}
      <div className={`fixed top-3 md:top-4 left-1/2 -translate-x-1/2 z-50 transition-shadow duration-300 ${scrolled ? 'shadow-lg' : ''}`}>
        <motion.nav
          initial={{ y: -56, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
        <div
          className={`glass-pill rounded-pill px-3 py-1.5 md:px-4 md:py-2.5 flex items-center gap-3 md:gap-6 transition-all duration-300 backdrop-blur-[12px] border border-border/60 ${
            scrolled ? 'bg-card/95' : 'bg-card/75'
          }`}
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0 group">
            <div className="h-8 w-8 md:h-10 md:w-10 shrink-0 rounded-xl bg-white overflow-hidden flex items-center justify-center shadow-sm transition-transform duration-200 group-hover:scale-105">
              <img
                src="/logo/Riyada%20Center%20Logo%20Souce-01.png"
                alt="Riyada Center"
                className="w-full h-full object-contain"
              />
            </div>
            <span dir="ltr" className="font-display font-bold text-base md:text-lg whitespace-nowrap hidden sm:inline-flex items-baseline gap-0">
              {'Riyada'.split('').map((ch, i) => (
                <span key={i} style={{ color: BRAND_COLORS[i] }}>{ch}</span>
              ))}
              <span className="mx-1" />
              {'Center'.split('').map((ch, i) => (
                <span key={i} style={{ color: BRAND_COLORS[i % BRAND_COLORS.length] }}>{ch}</span>
              ))}
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-0.5">
            {navLinks.map((link) => {
              const active = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`relative px-3.5 py-2 rounded-pill text-sm font-medium transition-colors duration-200 ${
                    active
                      ? 'text-brand-blue'
                      : 'text-text-primary hover:text-brand-blue hover:bg-brand-blue/5'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-pill bg-brand-blue/10"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            {/* Language toggle */}
            <button
              type="button"
              onClick={() => setLocale(isRTL ? 'en' : 'ar')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-pill bg-muted text-xs font-medium text-text-secondary hover:bg-muted/70 hover:text-brand-blue transition-colors border border-border/60"
              aria-label={isRTL ? t('nav.switchToEnglish') : t('nav.switchToArabic')}
            >
              <Globe size={13} />
              <span>{t('nav.languageToggle')}</span>
            </button>

            {/* Theme toggle */}
            <button
              type="button"
              onClick={() => {
                const next: ThemeMode = themeMode === 'dark' ? 'light' : 'dark';
                setThemeMode(next);
                applyTheme(next);
                setSavedThemeMode(next);
              }}
              className="hidden sm:inline-flex items-center justify-center p-2 rounded-pill bg-muted text-text-secondary hover:bg-muted/70 hover:text-brand-blue transition-colors border border-border/60"
              aria-label={themeMode === 'dark' ? t('nav.switchToLight') : t('nav.switchToDark')}
            >
              <motion.span
                key={themeMode}
                initial={{ rotate: -30, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 0.25 }}
              >
                {themeMode === 'dark' ? <SunMedium size={16} /> : <Moon size={16} />}
              </motion.span>
            </button>

            {/* Book now CTA */}
            <Link
              to="/booking"
              className="hidden sm:inline-flex items-center justify-center px-5 py-2 bg-brand-blue text-white font-semibold text-sm rounded-pill shadow-button hover:scale-105 hover:brightness-110 transition-all duration-200"
            >
              {t('nav.bookNow')}
            </Link>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-muted/50 transition-colors border border-border/60"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={mobileOpen ? 'close' : 'open'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex"
                >
                  {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </div>
        </motion.nav>
      </div>

      {/* ── Mobile menu ────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-bg-base/60 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="absolute top-20 left-4 right-4 bg-card rounded-card shadow-xl p-5 flex flex-col gap-2 border border-border/60"
            >
              {/* Utility row */}
              <div className="flex gap-2 mb-1">
                <button
                  type="button"
                  onClick={() => setLocale(isRTL ? 'en' : 'ar')}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-muted text-text-secondary hover:bg-muted/70 transition-colors border border-border/60 text-sm"
                >
                  <Globe size={15} />
                  {t('nav.languageToggle')}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const next: ThemeMode = themeMode === 'dark' ? 'light' : 'dark';
                    setThemeMode(next);
                    applyTheme(next);
                    setSavedThemeMode(next);
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-muted text-text-secondary hover:bg-muted/70 transition-colors border border-border/60 text-sm"
                >
                  {themeMode === 'dark' ? <SunMedium size={15} /> : <Moon size={15} />}
                  {themeMode === 'dark' ? t('nav.lightMode') : t('nav.darkMode')}
                </button>
              </div>

              {/* Divider */}
              <div className="h-px bg-border/60 my-1" />

              {/* Nav links */}
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: isRTL ? 12 : -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.2 }}
                >
                  <Link
                    to={link.href}
                    className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      location.pathname === link.href
                        ? 'bg-brand-blue/10 text-brand-blue font-semibold'
                        : 'text-text-primary hover:bg-muted/50 hover:text-brand-blue'
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              <Link
                to="/booking"
                className="mt-2 inline-flex items-center justify-center px-6 py-3 bg-brand-blue text-white font-semibold text-sm rounded-pill shadow-button hover:brightness-110 transition-all"
              >
                {t('nav.bookNow')}
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
