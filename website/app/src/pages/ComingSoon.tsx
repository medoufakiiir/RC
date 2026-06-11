import { motion } from 'framer-motion';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

export default function ComingSoon() {
  return (
    <div className="min-h-screen bg-bg-base">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 md:px-12 pt-28 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-pill glass-pill text-brand-blue text-xs font-semibold tracking-wider uppercase mb-5">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-blue animate-pulse" />
            Coming Soon
          </div>

          <h1 className="font-display font-bold text-3xl md:text-5xl text-text-primary mb-4">
            Riyada Center is getting ready
          </h1>

          <p className="text-text-secondary text-base md:text-lg max-w-2xl mx-auto">
            We’re building an improved experience for parents and therapists. Our full website
            will be live soon.
          </p>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="card-surface p-5">
              <div className="text-text-primary font-bold text-sm">Launch</div>
              <div className="text-text-secondary text-xs mt-1">Soon</div>
            </div>
            <div className="card-surface p-5">
              <div className="text-text-primary font-bold text-sm">Services</div>
              <div className="text-text-secondary text-xs mt-1">Speech • OT • ABA</div>
            </div>
            <div className="card-surface p-5">
              <div className="text-text-primary font-bold text-sm">Support</div>
              <div className="text-text-secondary text-xs mt-1">We’ll be in touch</div>
            </div>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="/booking"
              className="btn-primary"
              onClick={() => {
                // Keep the placeholder behavior: booking route might not be ready.
                // If it exists, the link will work; if not, the visitor still sees the page.
                // No-op.
              }}
            >
              Request a Consultation
            </a>
            <a href="/about" className="btn-secondary">
              Learn About Us
            </a>
          </div>

          <p className="text-text-secondary text-xs mt-8">
            Tip: If a page doesn’t load yet, check back later—we’re deploying improvements.
          </p>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}

