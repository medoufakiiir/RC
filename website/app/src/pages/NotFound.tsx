import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLanguage } from '../LanguageProvider';

const EASE = [0.22, 1, 0.36, 1] as const;

const STARS = [
  { x: '10%', y: '20%', size: 6, color: '#FF4D94', delay: 0 },
  { x: '85%', y: '15%', size: 8, color: '#FFCC22', delay: 0.3 },
  { x: '75%', y: '70%', size: 5, color: '#33CC44', delay: 0.6 },
  { x: '15%', y: '75%', size: 7, color: '#7766DD', delay: 0.9 },
  { x: '50%', y: '10%', size: 4, color: '#3355EE', delay: 1.2 },
  { x: '90%', y: '45%', size: 5, color: '#FF4D94', delay: 0.4 },
  { x: '5%',  y: '50%', size: 6, color: '#FFCC22', delay: 0.7 },
];

export default function NotFound() {
  const { locale } = useLanguage();
  const isAR = locale === 'ar';

  return (
    <div className="min-h-screen bg-[#0D0D1A] text-white flex flex-col items-center justify-center px-6 relative overflow-hidden">

      {/* Floating decorative stars */}
      {STARS.map((star, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{ left: star.x, top: star.y, width: star.size, height: star.size, backgroundColor: star.color }}
          animate={{ y: [0, -12, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 3 + i * 0.4, delay: star.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: 'linear-gradient(#3355EE 1px, transparent 1px), linear-gradient(90deg, #3355EE 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-brand-blue/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-brand-pink/10 blur-3xl pointer-events-none" />

      <div className="relative flex flex-col items-center text-center max-w-lg">

        {/* Mascot — a friendly lost star character */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0, rotate: -15 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mb-8 select-none"
        >
          <div className="relative inline-block">
            {/* Body */}
            <div className="w-36 h-36 rounded-full bg-gradient-to-br from-brand-blue to-brand-purple flex items-center justify-center shadow-[0_0_60px_rgba(51,85,238,0.4)]">
              {/* Face */}
              <div className="flex flex-col items-center gap-2">
                {/* Eyes */}
                <div className="flex items-center gap-4">
                  <motion.div
                    className="w-4 h-4 bg-white rounded-full flex items-center justify-center"
                    animate={{ scaleY: [1, 0.1, 1] }}
                    transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 2 }}
                  >
                    <div className="w-2 h-2 bg-[#0D0D1A] rounded-full" />
                  </motion.div>
                  <motion.div
                    className="w-4 h-4 bg-white rounded-full flex items-center justify-center"
                    animate={{ scaleY: [1, 0.1, 1] }}
                    transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 2, delay: 0.05 }}
                  >
                    <div className="w-2 h-2 bg-[#0D0D1A] rounded-full" />
                  </motion.div>
                </div>
                {/* Mouth — wavy/confused */}
                <svg width="32" height="16" viewBox="0 0 32 16" fill="none">
                  <path d="M4 12 Q10 4 16 12 Q22 20 28 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                </svg>
              </div>
            </div>
            {/* Question mark bubble */}
            <motion.div
              className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-brand-yellow flex items-center justify-center text-[#0D0D1A] font-display font-black text-lg shadow-lg"
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              ?
            </motion.div>
          </div>
        </motion.div>

        {/* 404 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
          className="text-[7rem] font-display font-black leading-none mb-2"
          style={{
            background: 'linear-gradient(135deg, #3355EE, #FF4D94)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          404
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.32, ease: EASE }}
          className="text-2xl md:text-3xl font-display font-bold mb-2"
        >
          {isAR ? 'الصفحة غير موجودة' : 'Page Not Found'}
        </motion.h1>

        {/* Bilingual subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: EASE }}
          className="text-white/40 text-base mb-1"
        >
          {isAR ? 'عذرًا، لا يمكننا العثور على هذه الصفحة.' : "Oops! We couldn't find this page."}
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.48 }}
          className="text-white/25 text-sm mb-10"
        >
          {isAR ? "Oops! We couldn't find this page." : 'عذرًا، لا يمكننا العثور على هذه الصفحة.'}
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
            className="px-8 py-3.5 rounded-2xl bg-brand-blue text-white font-semibold text-sm hover:bg-brand-blue/90 transition-all duration-200 shadow-[0_0_30px_rgba(51,85,238,0.3)] hover:shadow-[0_0_40px_rgba(51,85,238,0.5)]"
          >
            {isAR ? 'العودة إلى الرئيسية' : 'Back to Home'}
          </Link>
          <Link
            to="/booking"
            className="px-8 py-3.5 rounded-2xl border border-white/15 text-white/70 font-semibold text-sm hover:border-white/30 hover:text-white transition-all duration-200"
          >
            {isAR ? 'احجز جلسة' : 'Book a Session'}
          </Link>
        </motion.div>

        {/* Dot row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex items-center gap-2 mt-12"
        >
          {['#3355EE', '#FF4D94', '#FFCC22', '#33CC44', '#7766DD'].map((c) => (
            <div key={c} className="w-2 h-2 rounded-full" style={{ backgroundColor: c }} />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
