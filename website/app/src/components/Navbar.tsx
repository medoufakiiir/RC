import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe, Moon, SunMedium } from 'lucide-react';
import { getInitialThemeMode, setSavedThemeMode, applyTheme, type ThemeMode } from '../theme';
import { useLanguage } from '../LanguageProvider';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [themeMode, setThemeMode] = useState<ThemeMode>('dark');
  const location = useLocation();
  const { locale, setLocale, t } = useLanguage();

  const navLinks = [
    { label: t('nav.home'), href: '/' },
    { label: t('nav.services'), href: '/services/speech-language-therapy' },
    { label: t('nav.packages'), href: '/packages' },
    { label: t('nav.booking'), href: '/booking' },
    { label: t('nav.about'), href: '/about' },
    { label: t('nav.contact'), href: '/contact' },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const initial = getInitialThemeMode()
    setThemeMode(initial)
  }, []);

  return (
    <>
      <nav
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
          scrolled ? 'shadow-lg' : ''
        }`}
      >
          <div
        className={`glass-pill rounded-pill px-4 py-2.5 flex items-center gap-6 transition-all duration-300 ${
          scrolled ? 'bg-card/90 backdrop-blur-xl' : 'bg-card/70 backdrop-blur-md'
        }`}
      >

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 shrink-0 rounded-full bg-white/0 overflow-hidden flex items-center justify-center">
              <img
                src="/logo/Riyada%20Center%20Logo%20Souce-01.png"
                alt="Riyada Center"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-display font-bold text-text-primary text-sm hidden sm:block">Riyada Center</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-3.5 py-2 rounded-pill text-sm font-medium transition-colors duration-200 ${
                  location.pathname === link.href
                    ? 'bg-brand-blue/10 text-brand-blue'
                    : 'text-text-primary hover:text-brand-blue hover:bg-brand-blue/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setLocale(locale === 'ar' ? 'en' : 'ar');
              }}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-pill bg-muted text-xs font-medium text-text-secondary hover:bg-muted/70 transition-colors border border-border/60"
              aria-label={locale === 'ar' ? t('nav.switchToEnglish') : t('nav.switchToArabic')}
            >
              <Globe size={14} />
              <span>{t('nav.languageToggle')}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                const next = themeMode === 'dark' ? 'light' : 'dark'
                setThemeMode(next)
                applyTheme(next)
                setSavedThemeMode(next)
              }}
              className="hidden sm:inline-flex items-center justify-center p-2 rounded-pill bg-muted text-text-secondary hover:bg-muted/70 transition-colors border border-border/60"
              aria-label={themeMode === 'dark' ? t('nav.switchToLight') : t('nav.switchToDark')}
            >
              {themeMode === 'dark' ? <SunMedium size={16} /> : <Moon size={16} />}
            </button>

            <Link
              to="/booking"
              className="hidden sm:inline-flex items-center justify-center px-5 py-2 bg-brand-blue text-white font-semibold text-sm rounded-pill shadow-button hover:scale-105 hover:brightness-110 transition-all duration-200"
            >
              {t('nav.bookNow')}
            </Link>
            <button
              className="md:hidden p-2 rounded-lg hover:bg-muted/50 transition-colors border border-border/60"
              onClick={() => setMobileOpen(!mobileOpen)}
            >

              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm dark:bg-black/40"
            onClick={() => setMobileOpen(false)}
          />

          <div className="absolute top-20 left-4 right-4 bg-card rounded-card shadow-xl p-6 flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-200 border border-border/60">

            <button
              type="button"
              onClick={() => {
                setLocale(locale === 'ar' ? 'en' : 'ar');
              }}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-muted text-text-secondary hover:bg-muted/70 transition-colors border border-border/60"
              aria-label={locale === 'ar' ? t('nav.switchToEnglish') : t('nav.switchToArabic')}
            >
              <Globe size={16} />
              {t('nav.languageToggle')}
            </button>

            <button
              type="button"
              onClick={() => {
                const next = themeMode === 'dark' ? 'light' : 'dark'
                setThemeMode(next)
                applyTheme(next)
                setSavedThemeMode(next)
              }}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-muted text-text-secondary hover:bg-muted/70 transition-colors border border-border/60"
              aria-label={themeMode === 'dark' ? t('nav.switchToLight') : t('nav.switchToDark')}
            >
              {themeMode === 'dark' ? <SunMedium size={16} /> : <Moon size={16} />}
              {themeMode === 'dark' ? t('nav.lightMode') : t('nav.darkMode')}
            </button>

            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  location.pathname === link.href
                    ? 'bg-brand-blue/10 text-brand-blue'
                    : 'text-text-primary hover:bg-muted/50'
                }`}
              >

                {link.label}
              </Link>
            ))}
            <Link
              to="/booking"
              className="mt-2 inline-flex items-center justify-center px-6 py-3 bg-brand-blue text-white font-semibold text-sm rounded-pill shadow-button"
            >
              {t('nav.bookNow')}
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
