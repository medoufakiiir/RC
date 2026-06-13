import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLanguage } from '../LanguageProvider';

const EASE = [0.22, 1, 0.36, 1] as const;

const DOTS = [
  { x: '8%',  y: '25%', size: 5, color: '#FF4D94', delay: 0 },
  { x: '88%', y: '18%', size: 7, color: '#FFCC22', delay: 0.4 },
  { x: '80%', y: '72%', size: 5, color: '#7766DD', delay: 0.8 },
  { x: '12%', y: '78%', size: 6, color: '#3355EE', delay: 0.2 },
  { x: '48%', y: '8%',  size: 4, color: '#33CC44', delay: 1.0 },
  { x: '92%', y: '50%', size: 5, color: '#FF4D94', delay: 0.6 },
];

export default function Forbidden() {
  const { locale } = useLanguage();
  const isAR = locale === 'ar';

  return (
    <div className="min-h-screen bg-[#0D0D1A] text-white flex flex-col items-center justify-center px-6 relative overflow-hidden">

      {/* Floating dots */}
      {DOTS.map((dot, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{ left: dot.x, top: dot.y, width: dot.size, height: dot.size, backgroundColor: dot.color }}
          animate={{ y: [0, -10, 0], opacity: [0.35, 0.9, 0.35] }}
          transition={{ duration: 3.2 + i * 0.3, delay: dot.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: 'linear-gradient(#FF4D94 1px, transparent 1px), linear-gradient(90deg, #FF4D94 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Glow blobs */}
      <div className="absolute top-1/3 right-1/4 w-72 h-72 rounded-full bg-brand-pink/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/4 w-72 h-72 rounded-full bg-brand-purple/10 blur-3xl pointer-events-none" />

      <div className="relative flex flex-col items-center text-center max-w-lg">

        {/* Mascot — a friendly locked character */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0, rotate: 15 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mb-8 select-none"
        >
          <div className="relative inline-block">
            {/* Body */}
            <div className="w-36 h-36 rounded-full bg-gradient-to-br from-brand-pink to-brand-purple flex items-center justify-center shadow-[0_0_60px_rgba(255,77,148,0.3)]">
              <div className="flex flex-col items-center gap-2">
                {/* Eyes — stern / X eyes */}
                <div className="flex items-center gap-5">
                  {[0, 1].map((eye) => (
                    <div key={eye} className="w-5 h-5 relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-full h-0.5 bg-white rounded-full rotate-45" />
                        <div className="w-full h-0.5 bg-white rounded-full -rotate-45" />
                      </div>
                    </div>
                  ))}
                </div>
                {/* Mouth — flat/displeased */}
                <div className="w-8 h-1 bg-white/80 rounded-full" />
              </div>
            </div>
            {/* Lock icon */}
            <motion.div
              className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-brand-yellow flex items-center justify-center text-[#0D0D1A] shadow-lg"
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </motion.div>
          </div>
        </motion.div>

        {/* 403 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
          className="text-[7rem] font-display font-black leading-none mb-2"
          style={{
            background: 'linear-gradient(135deg, #FF4D94, #7766DD)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          403
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.32, ease: EASE }}
          className="text-2xl md:text-3xl font-display font-bold mb-2"
        >
          {isAR ? 'الوصول مرفوض' : 'Access Denied'}
        </motion.h1>

        {/* Bilingual subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: EASE }}
          className="text-white/40 text-base mb-1"
        >
          {isAR ? 'ليس لديك إذن للوصول إلى هذه الصفحة.' : "You don't have permission to access this page."}
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.48 }}
          className="text-white/25 text-sm mb-10"
        >
          {isAR ? "You don't have permission to access this page." : 'ليس لديك إذن للوصول إلى هذه الصفحة.'}
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.56, ease: EASE }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <Link
            to="/"
            className="px-8 py-3.5 rounded-2xl bg-brand-pink text-white font-semibold text-sm hover:bg-brand-pink/90 transition-all duration-200 shadow-[0_0_30px_rgba(255,77,148,0.3)] hover:shadow-[0_0_40px_rgba(255,77,148,0.5)]"
          >
            {isAR ? 'العودة إلى الرئيسية' : 'Back to Home'}
          </Link>
          <Link
            to="/contact"
            className="px-8 py-3.5 rounded-2xl border border-white/15 text-white/70 font-semibold text-sm hover:border-white/30 hover:text-white transition-all duration-200"
          >
            {isAR ? 'تواصل معنا' : 'Contact Us'}
          </Link>
        </motion.div>

        {/* Dot row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex items-center gap-2 mt-12"
        >
          {['#FF4D94', '#7766DD', '#FFCC22', '#3355EE', '#33CC44'].map((c) => (
            <div key={c} className="w-2 h-2 rounded-full" style={{ backgroundColor: c }} />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
