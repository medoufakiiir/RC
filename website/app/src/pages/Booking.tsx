import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ClipboardList,
  Brain,
  MessageCircle,
  Hand,
  Check,
  ChevronRight,
  ChevronLeft,
  CalendarDays,
  Clock,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { addBooking } from '../lib/bookingsStore';



const services = [
  {
    id: 'assessment',
    title: 'Assessment',
    titleAR: 'Assessment',
    description: 'Initial evaluation and consultation',
    icon: ClipboardList,
    color: '#FFCC22',
    mascot: null,
  },
  {
    id: 'aba',
    title: 'ABA Therapy',
    titleAR: 'ABA Therapy',
    description: 'Behavior therapy and support',
    icon: Brain,
    color: '#EEFF99',
    mascot: '/assets/mascots/behavior-guide.png',
  },
  {
    id: 'speech',
    title: 'Speech Therapy',
    titleAR: 'Speech Therapy',
    description: 'Language and communication',
    icon: MessageCircle,
    color: '#DDBAE8',
    mascot: '/assets/mascots/language-explorer.png',
  },
  {
    id: 'ot',
    title: 'Occupational Therapy',
    titleAR: 'OT Therapy',
    description: 'Motor skills and sensory integration',
    icon: Hand,
    color: '#C8F5B5',
    mascot: '/assets/mascots/skill-builder.png',
  },
];

const timeSlots = [
  '9:00 AM', '9:45 AM', '10:30 AM', '11:15 AM',
  '12:00 PM', '1:00 PM', '1:45 PM', '2:30 PM', '3:15 PM',
];

const packages = [
  {
    id: 'individual',
    name: 'Individual Sessions',
    description: 'Pay-as-you-go therapy at SAR 350/hour',
    price: '350 SAR/hr',
  },
  {
    id: 'package-a',
    name: 'Package A',
    description: '5 hours/week — 6,650 SAR per month',
    price: '6,650 SAR/mo',
  },
  {
    id: 'package-b',
    name: 'Package B',
    description: '10 hours/week — 12,600 SAR per month',
    price: '12,600 SAR/mo',
  },
  {
    id: 'package-c',
    name: 'Package C',
    description: '15 hours/week — 17,850 SAR per month',
    price: '17,850 SAR/mo',
  },
  {
    id: 'intensive',
    name: 'Intensive Package',
    description: '30 hours/week — 29,400 SAR per month',
    price: '29,400 SAR/mo',
  },
];

const steps = [
  { label: 'Service', labelAR: 'Service' },
  { label: 'Details', labelAR: 'Details' },
  { label: 'Date', labelAR: 'Date' },
  { label: 'Time', labelAR: 'Time' },
  { label: 'Confirm', labelAR: 'Confirm' },
];

export default function Booking() {
  const [step, setStep] = useState(0);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
const [selectedTime, setSelectedTime] = useState<string | null>(null);
const [confirmed, setConfirmed] = useState(false);
  const [bookingRef, setBookingRef] = useState<string | null>(null);
  const [formData, setFormData] = useState({ childName: '', age: '', parentName: '', phone: '', notes: '' });





  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const generateCalendarDays = () => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 28; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const isWeekend = d.getDay() === 5 || d.getDay() === 6;
      days.push({
        date: d.toISOString().split('T')[0],
        day: d.getDate(),
        month: d.toLocaleString('en', { month: 'short' }),
        weekday: d.toLocaleString('en', { weekday: 'short' }),
        available: !isWeekend && Math.random() > 0.2,
        isToday: i === 0,
      });
    }
    return days;
  };

  const calendarDays = generateCalendarDays();

const handleNext = () => {

    if (step === 4) {
      if (!selectedService || !selectedDate || !selectedTime) return;

      const booking = addBooking({
        patient: formData.childName,
        service: services.find((s) => s.id === selectedService)?.title ?? '',
        package: packages.find((pkg) => pkg.id === selectedPackage)?.name ?? '',
        date: selectedDate,
        time: selectedTime,
        status: 'Confirmed',
        parentName: formData.parentName,
        phone: formData.phone,
        age: formData.age,
        notes: formData.notes,
      });

      setBookingRef(booking.id);
      setConfirmed(true);
    } else {
      setStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const handleBack = () => setStep((prev) => Math.max(prev - 1, 0));

  const canProceed = () => {
    switch (step) {
      case 0: return selectedService !== null && selectedPackage !== null;
      case 1: return formData.childName && formData.age && formData.parentName && formData.phone;
      case 2: return selectedDate !== null;
      case 3: return selectedTime !== null;
      case 4: return true;
      default: return false;
    }
  };

  if (confirmed) {
    return (
      <div className="min-h-screen bg-bg-base">
        <Navbar />
        <div className="pt-28 pb-16 flex items-center justify-center min-h-[80vh]">
          <motion.div
            className="max-w-lg mx-auto px-6 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: [0.5, 1.05, 1] }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <img
                src="/assets/mascots/language-explorer.png"
                alt="Celebrating mascot"
                className="w-40 h-52 object-contain mx-auto mb-6"
              />
            </motion.div>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-pill bg-brand-green/10 text-brand-green font-semibold text-sm mb-4">
              <CheckCircle2 size={16} />
              Booking Confirmed!
            </div>

            <h2 className="font-display font-bold text-2xl text-text-primary mb-2">
              Your Session is Booked
            </h2>
            <p className="text-text-secondary text-sm mb-6">
              We&apos;ve sent a confirmation to your phone. See you soon!
            </p>

            <div className="bg-card rounded-card p-6 shadow-card mb-8 text-left">
              <div className="text-center mb-4">
                <span className="text-xs text-text-secondary uppercase tracking-wider">Reference</span>
                <p className="font-display font-bold text-2xl text-brand-blue">{bookingRef ?? '—'}</p>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Service</span>
                  <span className="font-medium">{services.find(s => s.id === selectedService)?.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Package</span>
                  <span className="font-medium">{packages.find((pkg) => pkg.id === selectedPackage)?.name ?? '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Parent</span>
                  <span className="font-medium">{formData.parentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Phone</span>
                  <span className="font-medium">{formData.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Date</span>
                  <span className="font-medium">{selectedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Time</span>
                  <span className="font-medium">{selectedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Child</span>
                  <span className="font-medium">{formData.childName}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/" className="btn-primary">Back to Home</Link>
              <Link to="/packages" className="btn-secondary">View Packages</Link>
            </div>

            {/* Confetti dots */}
            <div className="flex justify-center gap-2 mt-8">
              {['#3355EE', '#FF4D94', '#FFCC22', '#33CC44', '#7766DD'].map((color, i) => (
                <motion.div
                  key={i}
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: color }}
                  animate={{ y: [0, -12, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
                />
              ))}
            </div>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-base">
      <Navbar />

      <div className="pt-28 pb-16">
        <div className="max-w-3xl mx-auto px-6">
          {/* Step indicator */}
          <div className="mb-10">
            <div className="flex items-center justify-between relative pb-8">
              {/* Connecting line */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-border/40" />
              <div
                className="absolute bottom-0 left-0 h-1 bg-brand-blue transition-all duration-500"
                style={{ width: `${(step / 4) * 100}%` }}
              />

              {steps.map((s, i) => (
                <div key={i} className="relative flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                      i < step
                        ? 'bg-brand-blue text-white'
                        : i === step
                        ? 'bg-brand-blue text-white ring-4 ring-brand-blue/20'
                        : 'bg-surface text-text-secondary border-2 border-border/40'
                    }`}
                  >
                    {i < step ? <Check size={18} /> : i + 1}
                  </div>
                  <span className={`text-xs mt-2 font-medium ${i === step ? 'text-brand-blue' : 'text-text-secondary'}`}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Step content */}
          <div className="bg-card rounded-card shadow-card p-6 md:p-10 min-h-[400px]">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div
                  key="step0"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="font-display font-bold text-xl text-text-primary mb-2">
                    Choose a Service
                  </h2>
                  <p className="text-text-secondary text-sm mb-6">
                    Select the therapy service your child needs.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {services.map((service) => (
                      <button
                        key={service.id}
                        onClick={() => setSelectedService(service.id)}
                        className={`relative p-5 rounded-2xl border-2 text-left transition-all duration-200 ${
                          selectedService === service.id
                            ? 'border-brand-blue bg-brand-blue/10'
                            : 'border-border bg-surface hover:border-brand-blue'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                            style={{ backgroundColor: service.color + '40' }}
                          >
                            {service.mascot ? (
                              <img src={service.mascot} alt="" className="w-8 h-8 object-contain" />
                            ) : (
                              <service.icon size={22} style={{ color: service.color === '#EEFF99' ? '#7A8A3A' : '#5A4A00' }} />
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-sm text-text-primary mb-1">
                              {service.title}
                            </h3>
                            <p className="text-xs text-text-secondary">{service.description}</p>
                          </div>
                        </div>
                        {selectedService === service.id && (
                          <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-brand-blue flex items-center justify-center">
                            <Check size={12} className="text-white" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>

              <div className="mt-10">
                <h3 className="font-display font-semibold text-lg text-text-primary mb-4">Choose a package</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {packages.map((pkg) => (
                    <button
                      key={pkg.id}
                      type="button"
                      onClick={() => setSelectedPackage(pkg.id)}
                      className={`group w-full rounded-3xl border p-5 text-left transition-all duration-200 ${
                        selectedPackage === pkg.id
                          ? 'border-brand-blue bg-brand-blue/10 shadow-lg'
                          : 'border-border bg-surface hover:border-brand-blue'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <h4 className="font-semibold text-text-primary">{pkg.name}</h4>
                          <p className="text-sm text-text-secondary mt-1">{pkg.description}</p>
                        </div>
                        <span className="text-sm font-semibold text-brand-blue">{pkg.price}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="font-display font-bold text-xl text-text-primary mb-2">
                    Child Information
                  </h2>
                  <p className="text-text-secondary text-sm mb-6">
                    Tell us about your child so we can prepare.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1.5">
                        Child&apos;s Name
                      </label>
                      <input
                        type="text"
                        value={formData.childName}
                        onChange={(e) => setFormData({ ...formData, childName: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-border focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all text-sm bg-surface text-text-primary"
                        placeholder="Enter name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1.5">
                        Age
                      </label>
                      <input
                        type="number"
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-border focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all text-sm bg-surface text-text-primary"
                        placeholder="Years"
                        min="3"
                        max="12"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1.5">
                        Parent&apos;s Name
                      </label>
                      <input
                        type="text"
                        value={formData.parentName}
                        onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-border focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all text-sm bg-surface text-text-primary"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1.5">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-border focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all text-sm bg-surface text-text-primary"
                        placeholder="+966 5X XXX XXXX"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-text-primary mb-1.5">
                        Additional Notes (Optional)
                      </label>
                      <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-border focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all text-sm resize-none bg-surface text-text-primary"
                        placeholder="Any specific concerns or information..."
                        rows={3}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="font-display font-bold text-xl text-text-primary mb-2 flex items-center gap-2">
                    <CalendarDays size={22} className="text-brand-blue" />
                    Select Date
                  </h2>
                  <p className="text-text-secondary text-sm mb-6">
                    Choose an available date for the session.
                  </p>

                  <div className="grid grid-cols-7 gap-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                      <div key={d} className="text-center text-xs font-medium text-text-secondary py-2">
                        {d}
                      </div>
                    ))}
                    {calendarDays.map((day) => {
                      const isSelected = selectedDate === day.date;
                      const dayOfWeek = new Date(day.date).getDay();
                      const isWeekend = dayOfWeek === 5 || dayOfWeek === 6;
                      return (
                        <button
                          key={day.date}
                          onClick={() => day.available && setSelectedDate(day.date)}
                          disabled={!day.available || isWeekend}
                          className={`aspect-square rounded-xl flex flex-col items-center justify-center text-xs transition-all duration-200 ${
                            isSelected
                              ? 'bg-brand-blue text-white shadow-md'
                              : day.isToday
                              ? 'bg-brand-yellow/20 text-text-primary ring-2 ring-brand-yellow'
                              : !day.available || isWeekend
                              ? 'bg-surface text-text-secondary/70 cursor-not-allowed'
                              : 'bg-surface text-text-primary hover:bg-brand-blue/10'
                          }`}
                        >
                          <span className="font-semibold">{day.day}</span>
                          {day.isToday && <span className="text-[9px] mt-0.5 opacity-70">Today</span>}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="font-display font-bold text-xl text-text-primary mb-2 flex items-center gap-2">
                    <Clock size={22} className="text-brand-blue" />
                    Select Time
                  </h2>
                  <p className="text-text-secondary text-sm mb-6">
                    Choose your preferred time slot.
                  </p>

                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {timeSlots.map((slot) => {
                      const isSelected = selectedTime === slot;
                      const isUnavailable = Math.random() < 0.15;
                      return (
                        <button
                          key={slot}
                          onClick={() => !isUnavailable && setSelectedTime(slot)}
                          disabled={isUnavailable}
                          className={`py-3 rounded-pill text-sm font-medium transition-all duration-200 ${
                            isSelected
                              ? 'bg-brand-blue text-white shadow-md'
                              : isUnavailable
                              ? 'bg-surface text-text-secondary/70 line-through cursor-not-allowed'
                              : 'bg-surface border border-border text-text-primary hover:border-brand-blue hover:text-brand-blue'
                          }`}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-center mb-6">
                    <div className="w-14 h-14 rounded-full bg-brand-blue/10 flex items-center justify-center mx-auto mb-4">
                      <Sparkles size={28} className="text-brand-blue" />
                    </div>
                    <h2 className="font-display font-bold text-xl text-text-primary">
                      Confirm Your Booking
                    </h2>
                    <p className="text-text-secondary text-sm mt-1">
                      Review the details below
                    </p>
                  </div>

                  <div className="bg-surface rounded-2xl p-6 space-y-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Service</span>
                      <span className="font-medium">{services.find(s => s.id === selectedService)?.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Child</span>
                      <span className="font-medium">{formData.childName} ({formData.age} yrs)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Parent</span>
                      <span className="font-medium">{formData.parentName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Phone</span>
                      <span className="font-medium">{formData.phone}</span>
                    </div>
                    <div className="border-t border-border pt-4 flex justify-between">
                      <span className="text-text-secondary">Date</span>
                      <span className="font-medium">{selectedDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Time</span>
                      <span className="font-medium">{selectedTime}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
              <button
                onClick={handleBack}
                disabled={step === 0}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-pill text-sm font-medium transition-all ${
                  step === 0
                    ? 'text-text-secondary/50 cursor-not-allowed'
                    : 'text-text-secondary hover:bg-surface'
                }`}
              >
                <ChevronLeft size={16} />
                Back
              </button>

              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-pill font-semibold text-sm transition-all ${
                  canProceed()
                    ? 'bg-brand-blue text-white hover:brightness-110 shadow-button'
                    : 'bg-border/30 text-text-secondary/70 cursor-not-allowed'
                }`}
              >
                {step === 4 ? 'Confirm Booking' : 'Continue'}
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
