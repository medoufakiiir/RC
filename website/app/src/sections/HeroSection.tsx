import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../LanguageProvider';

export default function HeroSection() {
  const { locale, t } = useLanguage();
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!textRef.current) return;
    const el = textRef.current;
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    requestAnimationFrame(() => {
      el.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden bg-bg-base">
      {/* Dark radial gradient — dark mode only */}
      <div className="absolute inset-0 mc-hero-radial hidden dark:block" aria-hidden />
      <div className="absolute inset-0 mc-hero-texture hidden dark:block" aria-hidden />

      {/* Light mode: subtle brand-blue tint at top */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-blue/5 to-transparent dark:hidden" aria-hidden />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 py-16 md:px-12 lg:flex-row lg:items-stretch lg:gap-16">

        {/* Text side */}
        <div
          className={`relative z-20 w-full lg:w-1/2 flex items-center ${locale === 'ar' ? 'lg:order-2 lg:text-right lg:pl-10' : 'lg:order-1 lg:pr-10'}`}
        >
          <div ref={textRef} className="w-full">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-pill bg-brand-blue/10 text-brand-blue text-xs font-semibold tracking-wider uppercase mb-6">
              <span>{t('hero.eyebrow')}</span>
              <span className="text-brand-yellow">{t('hero.copyright')}</span>
            </div>

            <h1 className="mc-heading font-display font-bold text-4xl md:text-5xl lg:text-[56px] leading-tight mb-2">
              {t('hero.heading1')}
            </h1>
            <h1 className="mc-heading font-display font-bold text-4xl md:text-5xl lg:text-[56px] leading-tight mb-6">
              <span>{t('hero.heading2First')}</span>{' '}
              <span>{t('hero.heading2Second')}</span>
            </h1>

            <p className="text-lg text-text-secondary dark:text-white/70 font-normal mb-4">
              {t('hero.subheading')}
            </p>

            <p className="text-base text-text-primary dark:text-white/85 leading-relaxed mb-8 max-w-md">
              {t('hero.body')}
            </p>

            <div className={`flex flex-wrap gap-4 ${locale === 'ar' ? 'justify-end' : ''}`}>
              <Link to="/booking" className="btn-primary">
                {t('hero.book')}
              </Link>
              <Link to="/services" className="btn-secondary">
                {t('hero.explore')}
              </Link>
            </div>

            <div className={`flex items-center gap-3 mt-12 ${locale === 'ar' ? 'justify-end' : ''}`}>
              {['#3355EE', '#FF4D94', '#FFCC22', '#33CC44', '#7766DD'].map((color) => (
                <div key={color} className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
              ))}
            </div>
          </div>
        </div>

        {/* Image side */}
        <div className={`relative w-full lg:w-1/2 ${locale === 'ar' ? 'lg:order-1' : 'lg:order-2'}`}>
          <div className="relative h-[520px] overflow-hidden rounded-[2rem] md:h-[620px] lg:h-full lg:rounded-[2rem]">
            <img
              src="/assets/images/speech-session.jpg"
              alt="Riyada Center speech session"
              className="absolute inset-0 h-full w-full object-cover"
            />
            {/* Fade toward text — light: white fade, dark: dark-navy fade */}
            <div
              className={`absolute inset-0 ${locale === 'ar' ? 'bg-gradient-to-r' : 'bg-gradient-to-l'} from-bg-base/80 via-bg-base/40 to-transparent`}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
