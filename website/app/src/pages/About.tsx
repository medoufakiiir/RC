import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Target, Heart, Lightbulb, ArrowRight, MapPin, Phone, Mail } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';




const values = [
  {
    icon: Target,
    title: 'Our Vision',
    description: 'To be the leading pediatric development center in the region, where every child discovers their potential and every family finds support.',
    color: '#FFCC22',
    bg: '#FEF7CD',
  },
  {
    icon: Heart,
    title: 'Our Mission',
    description: 'To provide exceptional, evidence-based therapeutic services that nurture each child\'s unique abilities in a warm, inclusive environment.',
    color: '#FF4D94',
    bg: '#FFDEF6',
  },
  {
    icon: Lightbulb,
    title: 'Our Values',
    description: 'Compassion, excellence, innovation, and family-centered care guide every decision we make and every interaction we have.',
    color: '#33CC44',
    bg: '#CFFFD9',
  },
];

const team = [
  {
    name: 'Mohammed Al Harthi',
    role: 'Founders',
    image: null,
    initial: 'M',
    color: '#3355EE',
  },
  {
    name: 'Bader Al Harthi',
    role: 'Founders',
    image: null,
    initial: 'B',
    color: '#FF4D94',
  },
  {
    name: 'Dua Atieh',
    role: 'Chief Executive Officer',
    image: null,
    initial: 'D',
    color: '#33CC44',
  },
  {
    name: 'Our Team',
    role: 'Behavior Specialists',
    image: null,
    initial: 'O',
    color: '#7766DD',
  },
  {
    name: 'Our Team',
    role: 'Speech & Language Therapists',
    image: null,
    initial: 'O',
    color: '#3355EE',
  },
  {
    name: 'Our Team',
    role: 'Occupational Therapists',
    image: null,
    initial: 'O',
    color: '#FF4D94',
  },
  {
    name: 'Shaden Alhamdan',
    role: 'Behavior Therapist',
    image: null,
    initial: 'S',
    color: '#7766DD',
  },
];

export default function About() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-bg-base">
      <Navbar />

      {/* Hero with diagonal split */}
      <section className="pt-20 min-h-[70vh] relative overflow-hidden">
        <div className="absolute inset-0 grid grid-cols-1 lg:grid-cols-2">
          {/* Left: cobalt bg with wordmark */}
          <div className="bg-brand-blue flex items-center justify-center relative overflow-hidden">

            {/* Decorative shapes */}
            <div className="absolute top-20 left-20 w-24 h-24 rounded-full bg-white/5" />
            <div className="absolute bottom-32 right-16 w-16 h-16 rounded-full bg-white/10" />
            <div className="absolute top-1/3 right-1/3 w-8 h-8 rounded-full bg-white/10" />

            <motion.div
              className="text-center relative z-10 px-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mx-auto mb-6 overflow-hidden">
                <img
                  src="/logo/Riyada%20Center%20Logo%20Souce-01.png"
                  alt="Riyada Center"
                  className="w-full h-full object-contain"
                />
              </div>
              <h1 className="font-display font-bold text-4xl md:text-5xl text-white mb-3">
                Riyada Center
              </h1>
              <p className="text-brand-yellow font-semibold text-sm tracking-[0.3em] uppercase">
                Connect. Develop. Rise.
              </p>
            </motion.div>
          </div>

          {/* Right: image */}
          <div className="relative">
            <img
              src="/assets/images/sensory-room.jpg"

              alt="Riyada Center facility"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-blue/20 to-transparent" />
          </div>
        </div>

        {/* Diagonal overlay on mobile */}
        <div className="lg:hidden absolute inset-0 bg-brand-blue" />
      </section>

      {/* Vision / Mission / Values */}
      <section className="py-24 bg-card">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.h2
            className="font-display font-bold text-3xl text-text-primary text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            What Drives Us
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((item, i) => (
              <motion.div
                key={item.title}
                className="rounded-card p-8 transition-all duration-300 hover:-translate-y-1"
                style={{ backgroundColor: item.bg }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                  style={{ backgroundColor: item.color + '20' }}
                >
                  <item.icon size={26} style={{ color: item.color }} />
                </div>
                <h3 className="font-display font-bold text-xl text-text-primary mb-3">
                  {item.title}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-bg-base">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.h2
            className="font-display font-bold text-3xl text-text-primary text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Meet Our Team
          </motion.h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                className="text-center group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <div
                  className="w-24 h-24 md:w-28 md:h-28 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-2xl transition-transform duration-300 group-hover:scale-105"
                  style={{ backgroundColor: member.color }}
                >
                  {member.initial}
                </div>
                <h3 className="font-semibold text-sm text-text-primary mb-1">
                  {member.name}
                </h3>
                <p className="text-xs text-text-secondary">{member.role}</p>
              </motion.div>
            ))}
          </div>

          {/* Mascot between team members */}
          <motion.div
            className="flex justify-center mt-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <img
              src="/assets/mascots/language-explorer.png"
              alt=""
              className="w-16 h-20 object-contain animate-float opacity-60"
            />
          </motion.div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-24 bg-[#0A0F2E] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-brand-blue" />
          <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full bg-brand-pink" />
        </div>

        {/* Watermark (background decoration) */}
        <img
          src="/logo/Riyada%20Center%20Logo%20Souce-05.png"
          alt=""
          className="pointer-events-none absolute left-8 bottom-0 w-[500px] opacity-[0.04] z-0 select-none"
        />

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">




          <motion.h2
            className="font-display font-bold text-3xl md:text-4xl mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Visit Our Center
          </motion.h2>
          <p className="text-white/60 mb-10 max-w-lg mx-auto">
            Come see our facility and meet our team. We&apos;d love to show you around and answer any questions.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                <MapPin size={20} className="text-brand-blue" />
              </div>
                <span className="text-sm text-white/70" dir="rtl">طريق مكة المكرمة، حي سليمان، الرياض، المملكة العربية السعودية</span>

            </div>


            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                <Phone size={20} className="text-brand-green" />
              </div>
              <span className="text-sm text-white/70" dir="ltr">+966 555 019 224</span>

            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                <Mail size={20} className="text-brand-pink" />
              </div>
              <span className="text-sm text-white/70">RC@riyada-ventures.com</span>


            </div>
          </div>

          <Link to="/booking" className="inline-flex items-center gap-2 px-8 py-4 bg-brand-blue text-white font-bold rounded-pill shadow-button hover:scale-105 transition-transform">
            Book a Visit
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
