import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ClipboardList, Brain, MessageCircle, Hand, Check,
  ChevronRight, ChevronLeft, CalendarDays, Clock, CheckCircle2, Sparkles,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { addBooking } from '../lib/bookingsStore';
import { submitBooking } from '../services/adminApi';
import { useLanguage } from '../LanguageProvider';
import { useActiveServices } from '../hooks/useActiveServices';
import SEO from '../components/SEO';
import { getPageSEO } from '../seo';

const API = import.meta.env.VITE_API_URL ?? 'https://riyada-medical-backend-production.up.railway.app';

const allServices = [
  { id: 'assessment', slug: 'assessments', title: 'Assessment', titleAR: 'التقييم', description: 'Initial evaluation and consultation', descriptionAR: 'التقييم الأولي والاستشارة', icon: ClipboardList, color: '#FFCC22', mascot: null },
  { id: 'aba', slug: 'aba-therapy', title: 'ABA Therapy', titleAR: 'علاج ABA', description: 'Behavior therapy and support', descriptionAR: 'علاج السلوك والدعم', icon: Brain, color: '#EEFF99', mascot: '/assets/mascots/behavior-guide.png' },
  { id: 'speech', slug: 'speech-language', title: 'Speech Therapy', titleAR: 'علاج النطق', description: 'Language and communication', descriptionAR: 'اللغة والتواصل', icon: MessageCircle, color: '#DDBAE8', mascot: '/assets/mascots/language-explorer.png' },
  { id: 'ot', slug: 'occupational-therapy', title: 'Occupational Therapy', titleAR: 'العلاج الوظيفي', description: 'Motor skills and sensory integration', descriptionAR: 'المهارات الحركية والتكامل الحسي', icon: Hand, color: '#C8F5B5', mascot: '/assets/mascots/skill-builder.png' },
];

// Days off: Friday (5) and Saturday (6)
const DAYS_OFF = [5, 6];
const TIME_SLOTS = [
  '9:00 AM', '9:45 AM', '10:30 AM', '11:15 AM',
  '12:00 PM', '1:00 PM', '1:45 PM', '2:30 PM', '3:15 PM',
];

export default function Booking() {
  const { locale, t } = useLanguage();
  const isRTL = locale === 'ar';
  const { slugs, loaded } = useActiveServices();
  const services = loaded && slugs.length > 0
    ? allServices.filter(s => slugs.includes(s.slug))
    : allServices;

  const steps = [
    { label: t('booking.stepService') },
    { label: t('booking.stepDetails') },
    { label: t('booking.stepDate') },
    { label: t('booking.stepTime') },
    { label: t('booking.stepConfirm') },
  ];

  const [step, setStep] = useState(0);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [bookingRef, setBookingRef] = useState<string | null>(null);
  const [formData, setFormData] = useState({ childName: '', age: '', parentName: '', phone: '', notes: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Availability from backend
  const [blockedDates, setBlockedDates] = useState<Set<string>>(new Set());
  const [blockedTimeSlots, setBlockedTimeSlots] = useState<Record<string, Set<string>>>({});
  const [bookedSlots, setBookedSlots] = useState<Record<string, Set<string>>>({});

  useEffect(() => {
    fetch(`${API}/availability`)
      .then(r => r.json())
      .then(data => {
        const dates = new Set<string>();
        const times: Record<string, Set<string>> = {};
        const booked: Record<string, Set<string>> = {};

        for (const b of data.blocked || []) {
          if (!b.time) {
            dates.add(b.date);
          } else {
            if (!times[b.date]) times[b.date] = new Set();
            times[b.date].add(b.time);
          }
        }
        for (const bk of data.bookings || []) {
          if (!booked[bk.date]) booked[bk.date] = new Set();
          booked[bk.date].add(bk.time);
        }

        setBlockedDates(dates);
        setBlockedTimeSlots(times);
        setBookedSlots(booked);
      })
      .catch(() => {});
  }, []);

  const calendarGrid = useMemo(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    // Use local date parts to avoid UTC timezone shift
    function localDateStr(d: Date) {
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }

    // Start from the Sunday of the week that contains tomorrow
    const gridStart = new Date(tomorrow);
    gridStart.setDate(gridStart.getDate() - gridStart.getDay());

    const cells: { date: string; day: number; month: string; available: boolean; inRange: boolean }[] = [];
    for (let i = 0; i < 35; i++) {
      const d = new Date(gridStart);
      d.setDate(gridStart.getDate() + i);
      const dateStr = localDateStr(d);
      const dow = d.getDay();
      const isDayOff = DAYS_OFF.includes(dow);
      const isPast = d < tomorrow;
      const tooFar = d.getTime() > tomorrow.getTime() + 28 * 86400000;
      const isBlocked = blockedDates.has(dateStr);
      const inRange = !isPast && !tooFar;

      cells.push({
        date: dateStr,
        day: d.getDate(),
        month: d.toLocaleString(locale, { month: 'short' }),
        available: inRange && !isDayOff && !isBlocked,
        inRange,
      });
    }
    return cells;
  }, [locale, blockedDates]);

  function isTimeAvailable(slot: string): boolean {
    if (!selectedDate) return true;
    if (blockedTimeSlots[selectedDate]?.has(slot)) return false;
    if (bookedSlots[selectedDate]?.has(slot)) return false;
    return true;
  }

  function validateForm(): boolean {
    const e: Record<string, string> = {};
    const nameRegex = /^[\p{L}\s'-]{2,50}$/u;
    const phoneRegex = /^(\+966|05|5)\d{8}$/;

    const childName = formData.childName.trim();
    const parentName = formData.parentName.trim();
    const phone = formData.phone.replace(/[\s\-()]/g, '');
    const age = parseInt(formData.age);

    if (!childName || !nameRegex.test(childName)) {
      e.childName = isRTL ? 'أدخل اسم الطفل الحقيقي (حروف فقط، حرفين على الأقل)' : 'Enter a real child name (letters only, at least 2 characters)';
    }
    if (!parentName || !nameRegex.test(parentName)) {
      e.parentName = isRTL ? 'أدخل اسم ولي الأمر الحقيقي (حروف فقط)' : 'Enter a real parent name (letters only, at least 2 characters)';
    }
    if (!phone || !phoneRegex.test(phone)) {
      e.phone = isRTL ? 'أدخل رقم هاتف سعودي صحيح (مثال: 05XXXXXXXX)' : 'Enter a valid Saudi phone number (e.g. 05XXXXXXXX or +966XXXXXXXXX)';
    }
    if (isNaN(age) || age < 1 || age > 18) {
      e.age = isRTL ? 'أدخل عمر صحيح (١ - ١٨)' : 'Enter a valid age (1 - 18)';
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  const handleNext = async () => {
    if (step === 1 && !validateForm()) return;
    if (step === 4) {
      if (!selectedService || !selectedDate || !selectedTime) return;
      const serviceTitle = services.find((s) => s.id === selectedService)?.title ?? '';
      let ref: string;
      try {
        const result = await submitBooking({
          parentName: formData.parentName, childName: formData.childName,
          childAge: formData.age, phone: formData.phone, service: serviceTitle,
          date: selectedDate, time: selectedTime, notes: formData.notes,
        });
        ref = result.ref;
      } catch {
        const booking = addBooking({
          patient: formData.childName, service: serviceTitle,
          date: selectedDate, time: selectedTime, status: 'Confirmed',
          parentName: formData.parentName, phone: formData.phone,
          age: formData.age, notes: formData.notes,
        });
        ref = booking.id;
      }
      setBookingRef(ref);
      setConfirmed(true);
    } else {
      setStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const handleBack = () => setStep((prev) => Math.max(prev - 1, 0));

  const canProceed = () => {
    switch (step) {
      case 0: return selectedService !== null;
      case 1: return formData.childName && formData.age && formData.parentName && formData.phone;
      case 2: return selectedDate !== null;
      case 3: return selectedTime !== null;
      case 4: return true;
      default: return false;
    }
  };

  const weekdayHeaders = isRTL
    ? ['أحد', 'إثن', 'ثلث', 'أرب', 'خمس', 'جمع', 'سبت']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const seo = getPageSEO('booking', locale)!;

  if (confirmed) {
    return (
      <div className="min-h-screen bg-bg-base">
        <SEO {...seo} />
        <Navbar />
        <div className="pt-28 pb-16 flex items-center justify-center min-h-[80vh]">
          <motion.div className="max-w-lg mx-auto px-6 text-center" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
            <motion.div initial={{ scale: 0.5 }} animate={{ scale: [0.5, 1.05, 1] }} transition={{ duration: 0.5, delay: 0.1 }}>
              <img src="/assets/mascots/language-explorer.png" alt="Celebrating mascot" className="w-40 h-52 object-contain mx-auto mb-6" />
            </motion.div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-pill bg-brand-green/10 text-brand-green font-semibold text-sm mb-4">
              <CheckCircle2 size={16} />{t('booking.bookingConfirmed')}
            </div>
            <h2 className="font-display font-bold text-2xl text-text-primary mb-2">{t('booking.bookingTitle')}</h2>
            <p className="text-text-secondary text-sm mb-6">{t('booking.bookingCopy')}</p>
            <div className="bg-card rounded-card p-6 shadow-card mb-8 text-left">
              <div className="text-center mb-4">
                <span className="text-xs text-text-secondary uppercase tracking-wider">{t('booking.reference')}</span>
                <p className="font-display font-bold text-2xl text-brand-blue">{bookingRef ?? '—'}</p>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-text-secondary">{t('booking.service')}</span><span className="font-medium">{isRTL ? services.find(s => s.id === selectedService)?.titleAR : services.find(s => s.id === selectedService)?.title}</span></div>
                <div className="flex justify-between"><span className="text-text-secondary">{t('booking.parent')}</span><span className="font-medium">{formData.parentName}</span></div>
                <div className="flex justify-between"><span className="text-text-secondary">{t('booking.phone')}</span><span className="font-medium">{formData.phone}</span></div>
                <div className="flex justify-between"><span className="text-text-secondary">{t('booking.date')}</span><span className="font-medium">{selectedDate}</span></div>
                <div className="flex justify-between"><span className="text-text-secondary">{t('booking.time')}</span><span className="font-medium">{selectedTime}</span></div>
                <div className="flex justify-between"><span className="text-text-secondary">{t('booking.child')}</span><span className="font-medium">{formData.childName}</span></div>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/" className="btn-primary">{t('booking.backHome')}</Link>
            </div>
            <div className="flex justify-center gap-2 mt-8">
              {['#3355EE', '#FF4D94', '#FFCC22', '#33CC44', '#7766DD'].map((color, i) => (
                <motion.div key={i} className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} animate={{ y: [0, -12, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }} />
              ))}
            </div>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  // calendarGrid is already aligned to 7-column grid

  return (
    <div className="min-h-screen bg-bg-base">
      <SEO {...seo} />
      <Navbar />
      <div className="pt-28 pb-16">
        <div className="max-w-3xl mx-auto px-6">
          {/* Step indicator */}
          <div className="mb-10">
            <div className="flex items-center justify-between relative pb-8">
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-border/40" />
              <div className={`absolute bottom-0 h-1 bg-brand-blue transition-all duration-500 ${isRTL ? 'right-0' : 'left-0'}`} style={{ width: `${(step / 4) * 100}%` }} />
              {steps.map((s, i) => (
                <div key={i} className="relative flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${i < step ? 'bg-brand-blue text-white' : i === step ? 'bg-brand-blue text-white ring-4 ring-brand-blue/20' : 'bg-surface text-text-secondary border-2 border-border/40'}`}>
                    {i < step ? <Check size={18} /> : i + 1}
                  </div>
                  <span className={`text-xs mt-2 font-medium ${i === step ? 'text-brand-blue' : 'text-text-secondary'}`}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Step content */}
          <div className="bg-card rounded-card shadow-card p-6 md:p-10 min-h-[400px]">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div key="step0" initial={{ opacity: 0, x: isRTL ? -20 : 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: isRTL ? 20 : -20 }} transition={{ duration: 0.3 }}>
                  <h2 className="font-display font-bold text-xl text-text-primary mb-2">{t('booking.chooseService')}</h2>
                  <p className="text-text-secondary text-sm mb-6">{t('booking.serviceDescription')}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {services.map((service) => (
                      <button key={service.id} onClick={() => setSelectedService(service.id)}
                        className={`relative p-5 rounded-2xl border-2 text-left transition-all duration-200 ${selectedService === service.id ? 'border-brand-blue bg-brand-blue/10' : 'border-border bg-surface hover:border-brand-blue'}`}>
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: service.color + '40' }}>
                            {service.mascot ? <img src={service.mascot} alt="" className="w-8 h-8 object-contain" /> : <service.icon size={22} style={{ color: service.color === '#EEFF99' ? '#7A8A3A' : '#5A4A00' }} />}
                          </div>
                          <div>
                            <h3 className="font-semibold text-sm text-text-primary mb-1">{isRTL ? service.titleAR : service.title}</h3>
                            <p className="text-xs text-text-secondary">{isRTL ? service.descriptionAR : service.description}</p>
                          </div>
                        </div>
                        {selectedService === service.id && (
                          <div className={`absolute top-3 ${isRTL ? 'left-3' : 'right-3'} w-5 h-5 rounded-full bg-brand-blue flex items-center justify-center`}><Check size={12} className="text-white" /></div>
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: isRTL ? -20 : 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: isRTL ? 20 : -20 }} transition={{ duration: 0.3 }}>
                  <h2 className="font-display font-bold text-xl text-text-primary mb-2">{t('booking.childInformation')}</h2>
                  <p className="text-text-secondary text-sm mb-6">{t('booking.childDescription')}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1.5">{t('booking.childName')} <span className="text-red-400">*</span></label>
                      <input type="text" value={formData.childName}
                        onChange={(e) => { setFormData({ ...formData, childName: e.target.value }); setErrors(prev => ({ ...prev, childName: '' })); }}
                        className={`w-full px-4 py-3 rounded-xl border ${errors.childName ? 'border-red-400 ring-2 ring-red-400/20' : 'border-border'} focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all text-sm bg-surface text-text-primary placeholder:text-text-secondary`}
                        placeholder={t('booking.enterName')} maxLength={50} />
                      {errors.childName && <p className="text-red-400 text-xs mt-1">{errors.childName}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1.5">{t('booking.age')} <span className="text-red-400">*</span></label>
                      <input type="number" value={formData.age}
                        onChange={(e) => { setFormData({ ...formData, age: e.target.value }); setErrors(prev => ({ ...prev, age: '' })); }}
                        className={`w-full px-4 py-3 rounded-xl border ${errors.age ? 'border-red-400 ring-2 ring-red-400/20' : 'border-border'} focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all text-sm bg-surface text-text-primary placeholder:text-text-secondary`}
                        placeholder={t('booking.years')} min="1" max="18" />
                      {errors.age && <p className="text-red-400 text-xs mt-1">{errors.age}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1.5">{t('booking.parentName')} <span className="text-red-400">*</span></label>
                      <input type="text" value={formData.parentName}
                        onChange={(e) => { setFormData({ ...formData, parentName: e.target.value }); setErrors(prev => ({ ...prev, parentName: '' })); }}
                        className={`w-full px-4 py-3 rounded-xl border ${errors.parentName ? 'border-red-400 ring-2 ring-red-400/20' : 'border-border'} focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all text-sm bg-surface text-text-primary placeholder:text-text-secondary`}
                        placeholder={t('booking.yourName')} maxLength={50} />
                      {errors.parentName && <p className="text-red-400 text-xs mt-1">{errors.parentName}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1.5">{t('booking.phoneNumber')} <span className="text-red-400">*</span></label>
                      <input type="tel" value={formData.phone}
                        onChange={(e) => { setFormData({ ...formData, phone: e.target.value }); setErrors(prev => ({ ...prev, phone: '' })); }}
                        className={`w-full px-4 py-3 rounded-xl border ${errors.phone ? 'border-red-400 ring-2 ring-red-400/20' : 'border-border'} focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all text-sm bg-surface text-text-primary placeholder:text-text-secondary`}
                        placeholder="05XXXXXXXX" dir="ltr" maxLength={15} />
                      {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-text-primary mb-1.5">{t('booking.notes')}</label>
                      <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-border focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all text-sm resize-none bg-surface text-text-primary placeholder:text-text-secondary"
                        placeholder={t('booking.notesPlaceholder')} rows={3} maxLength={500} />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: isRTL ? -20 : 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: isRTL ? 20 : -20 }} transition={{ duration: 0.3 }}>
                  <h2 className="font-display font-bold text-xl text-text-primary mb-2 flex items-center gap-2">
                    <CalendarDays size={22} className="text-brand-blue" />{t('booking.selectDate')}
                  </h2>
                  <p className="text-text-secondary text-sm mb-2">{t('booking.selectDateDescription')}</p>
                  <p className="text-xs text-text-secondary/60 mb-4">
                    {isRTL ? 'أيام العمل: الأحد – الخميس · الجمعة والسبت إجازة' : 'Working days: Sun – Thu · Fri & Sat off'}
                  </p>
                  <div className="grid grid-cols-7 gap-2">
                    {weekdayHeaders.map((d, i) => (
                      <div key={d} className={`text-center text-xs font-medium py-2 ${DAYS_OFF.includes(i) ? 'text-red-400/50' : 'text-text-secondary'}`}>{d}</div>
                    ))}
                    {calendarGrid.map((cell, i) => {
                      if (!cell) return <div key={`e-${i}`} />;
                      const isSelected = selectedDate === cell.date;
                      const isDayOff = DAYS_OFF.includes(new Date(cell.date).getDay());
                      return (
                        <button key={cell.date} onClick={() => cell.available && setSelectedDate(cell.date)} disabled={!cell.available}
                          className={`aspect-square rounded-xl flex flex-col items-center justify-center text-xs transition-all duration-200 ${
                            isSelected ? 'bg-brand-blue text-white shadow-md'
                            : isDayOff ? 'bg-red-500/5 text-red-400/30 cursor-not-allowed'
                            : !cell.inRange ? 'bg-surface/50 text-text-secondary/20 cursor-not-allowed'
                            : !cell.available ? 'bg-surface text-text-secondary/40 cursor-not-allowed'
                            : 'bg-surface text-text-primary hover:bg-brand-blue/10'
                          }`}>
                          <span className="font-semibold">{cell.day}</span>
                          <span className="text-[9px] opacity-60">{cell.month}</span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: isRTL ? -20 : 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: isRTL ? 20 : -20 }} transition={{ duration: 0.3 }}>
                  <h2 className="font-display font-bold text-xl text-text-primary mb-2 flex items-center gap-2">
                    <Clock size={22} className="text-brand-blue" />{t('booking.selectTime')}
                  </h2>
                  <p className="text-text-secondary text-sm mb-2">{t('booking.selectTimeDescription')}</p>
                  <p className="text-xs text-text-secondary/60 mb-4">
                    {isRTL ? 'ساعات العمل: ٩:٠٠ ص – ٤:٠٠ م' : 'Working hours: 9:00 AM – 4:00 PM'}
                  </p>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {TIME_SLOTS.map((slot) => {
                      const isSelected = selectedTime === slot;
                      const available = isTimeAvailable(slot);
                      return (
                        <button key={slot} onClick={() => available && setSelectedTime(slot)} disabled={!available}
                          className={`py-3 rounded-pill text-sm font-medium transition-all duration-200 ${
                            isSelected ? 'bg-brand-blue text-white shadow-md'
                            : !available ? 'bg-surface text-text-secondary/40 line-through cursor-not-allowed'
                            : 'bg-surface border border-border text-text-primary hover:border-brand-blue hover:text-brand-blue'
                          }`} dir="ltr">
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div key="step4" initial={{ opacity: 0, x: isRTL ? -20 : 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: isRTL ? 20 : -20 }} transition={{ duration: 0.3 }}>
                  <div className="text-center mb-6">
                    <div className="w-14 h-14 rounded-full bg-brand-blue/10 flex items-center justify-center mx-auto mb-4"><Sparkles size={28} className="text-brand-blue" /></div>
                    <h2 className="font-display font-bold text-xl text-text-primary">{t('booking.confirmYourBooking')}</h2>
                    <p className="text-text-secondary text-sm mt-1">{t('booking.review')}</p>
                  </div>
                  <div className="bg-surface rounded-2xl p-6 space-y-4 text-sm">
                    <div className="flex justify-between"><span className="text-text-secondary">{t('booking.service')}</span><span className="font-medium">{isRTL ? services.find(s => s.id === selectedService)?.titleAR : services.find(s => s.id === selectedService)?.title}</span></div>
                    <div className="flex justify-between"><span className="text-text-secondary">{t('booking.child')}</span><span className="font-medium">{formData.childName} ({formData.age} {t('booking.yrs')})</span></div>
                    <div className="flex justify-between"><span className="text-text-secondary">{t('booking.parent')}</span><span className="font-medium">{formData.parentName}</span></div>
                    <div className="flex justify-between"><span className="text-text-secondary">{t('booking.phone')}</span><span className="font-medium" dir="ltr">{formData.phone}</span></div>
                    <div className="border-t border-border pt-4 flex justify-between"><span className="text-text-secondary">{t('booking.date')}</span><span className="font-medium">{selectedDate}</span></div>
                    <div className="flex justify-between"><span className="text-text-secondary">{t('booking.time')}</span><span className="font-medium" dir="ltr">{selectedTime}</span></div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
              <button onClick={handleBack} disabled={step === 0}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-pill text-sm font-medium transition-all ${step === 0 ? 'text-text-secondary/50 cursor-not-allowed' : 'text-text-secondary hover:bg-surface'}`}>
                {isRTL ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}{t('booking.back')}
              </button>
              <button onClick={handleNext} disabled={!canProceed()}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-pill font-semibold text-sm transition-all ${canProceed() ? 'bg-brand-blue text-white hover:brightness-110 shadow-button' : 'bg-border/30 text-text-secondary/70 cursor-not-allowed'}`}>
                {step === 4 ? t('booking.confirmBooking') : t('booking.continue')}
                {isRTL ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
