import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Instagram, Twitter } from 'lucide-react';
import { useLanguage } from '../LanguageProvider';

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="bg-[#0A0F2E] text-white relative overflow-hidden">
      {/* Colorful top accent line */}
      <div className="h-1 w-full flex">
        <div className="flex-1 bg-brand-blue" />
        <div className="flex-1 bg-brand-pink" />
        <div className="flex-1 bg-brand-yellow" />
        <div className="flex-1 bg-brand-green" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Logo & tagline */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden">
                <img
                  src="/logo/Riyada%20Center%20Logo%20Souce-01.png"
                  alt="Riyada Center"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-display font-bold text-xl text-white">
                Riyada Center
              </span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed mb-4">
              {t('footer.tagline')}
            </p>
            <p className="text-brand-yellow font-semibold text-xs tracking-[0.2em] uppercase">
              {t('footer.slogan')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-sm mb-4 text-white/90">{t('footer.quickLinks')}</h4>
            <ul className="space-y-3">
              {[
                { label: t('nav.home'), href: '/' },
                { label: t('nav.services'), href: '/services/speech-language-therapy' },
                { label: t('nav.packages'), href: '/packages' },
                { label: t('footer.about'), href: '/about' },
                { label: t('footer.contactUs'), href: '/contact' },
                { label: t('footer.bookSession'), href: '/booking' },
              ].map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-white/50 hover:text-white text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-sm mb-4 text-white/90">{t('footer.ourServices')}</h4>
            <ul className="space-y-3">
              {[
                { label: 'Assessments & Consultations', href: '/services/speech-language-therapy' },
                { label: 'ABA / Behavior Therapy', href: '/services/speech-language-therapy' },
                { label: 'Speech & Language Therapy', href: '/services/speech-language-therapy' },
                { label: 'Occupational Therapy', href: '/services/speech-language-therapy' },
              ].map((service) => (
                <li key={service.label}>
                  <Link to={service.href} className="text-white/50 hover:text-white text-sm transition-colors">
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-sm mb-4 text-white/90">{t('footer.contactUs')}</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-brand-blue mt-0.5 shrink-0" />
                <span className="text-white/50 text-sm" dir="ltr">
                  Makkah Al Mukarramah Road, Al Sulaymaniyah District, Riyadh, Saudi Arabia
                </span>
              </li>

              <li className="flex items-center gap-3">
                <Phone size={16} className="text-brand-green shrink-0" />
                <span className="text-white/50 text-sm" dir="ltr">
                  +966 55 501 9224
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-brand-pink shrink-0" />
                  <span className="text-white/50 text-sm">RC@riyada-ventures.com</span>
              </li>
            </ul>
            <div className="flex items-center gap-3 mt-6">
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-blue transition-colors">
                <Instagram size={16} />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-blue transition-colors">
                <Twitter size={16} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-xs">{t('footer.allRights')}</p>
          <div className="flex items-center gap-2">
            {['#3355EE', '#FF4D94', '#FFCC22', '#33CC44', '#7766DD'].map((color) => (
              <div key={color} className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

