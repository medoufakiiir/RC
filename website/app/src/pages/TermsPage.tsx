import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Scale, ArrowLeft, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useLanguage } from '../LanguageProvider';

const EASE = [0.22, 1, 0.36, 1] as const;

const fade = (delay = 0) => ({
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay, ease: EASE } },
});

const sections = [
  {
    titleEN: '1. Booking Policy',
    titleAR: '١. سياسة الحجز',
    contentEN: [
      'All therapy sessions must be booked in advance through our website, phone, or admin portal.',
      'Bookings are subject to availability of therapists and time slots.',
      'A booking confirmation will be sent via phone or email upon successful scheduling.',
      'Each session is scheduled for 60 minutes unless otherwise agreed.',
      'Riyada Center reserves the right to reassign therapists based on clinical availability.',
    ],
    contentAR: [
      'يجب حجز جميع جلسات العلاج مسبقًا عبر الموقع الإلكتروني أو الهاتف أو بوابة الإدارة.',
      'تخضع الحجوزات لتوفر المعالجين والمواعيد المتاحة.',
      'سيتم إرسال تأكيد الحجز عبر الهاتف أو البريد الإلكتروني عند إتمام الجدولة بنجاح.',
      'مدة كل جلسة 60 دقيقة ما لم يُتفق على خلاف ذلك.',
      'يحتفظ مركز ريادة بالحق في إعادة تخصيص المعالجين بناءً على التوافر السريري.',
    ],
    color: '#3355EE',
  },
  {
    titleEN: '2. Cancellation Policy',
    titleAR: '٢. سياسة الإلغاء',
    contentEN: [
      'Cancellations must be made at least 24 hours before the scheduled session.',
      'Late cancellations (less than 24 hours) may incur a cancellation fee of up to 50% of the session cost.',
      'No-shows without prior notice will be charged the full session fee.',
      'In case of emergency, please contact us as soon as possible to reschedule.',
      'Riyada Center reserves the right to cancel sessions due to therapist illness or unforeseen circumstances, with full rescheduling assistance provided.',
    ],
    contentAR: [
      'يجب إجراء الإلغاء قبل 24 ساعة على الأقل من الجلسة المقررة.',
      'قد يترتب على الإلغاء المتأخر (أقل من 24 ساعة) رسوم إلغاء تصل إلى 50% من تكلفة الجلسة.',
      'سيتم احتساب الرسوم الكاملة للجلسة في حالة عدم الحضور دون إشعار مسبق.',
      'في حالات الطوارئ، يرجى التواصل معنا في أقرب وقت ممكن لإعادة الجدولة.',
      'يحتفظ مركز ريادة بالحق في إلغاء الجلسات بسبب مرض المعالج أو الظروف غير المتوقعة، مع تقديم المساعدة الكاملة لإعادة الجدولة.',
    ],
    color: '#FF4D94',
  },
  {
    titleEN: '3. Payment Terms',
    titleAR: '٣. شروط الدفع',
    contentEN: [
      'Payment is due at the time of booking or before the start of the session.',
      'We accept bank transfers, credit/debit cards, and approved payment methods.',
      'All prices are quoted in Saudi Riyal (SAR) and are subject to 15% VAT as per Saudi regulations.',
      'Package payments are non-refundable once sessions have commenced.',
      'Invoices and payment receipts will be provided upon request.',
    ],
    contentAR: [
      'يستحق الدفع عند الحجز أو قبل بدء الجلسة.',
      'نقبل التحويلات البنكية وبطاقات الائتمان/الخصم وطرق الدفع المعتمدة.',
      'جميع الأسعار محددة بالريال السعودي (SAR) وتخضع لضريبة القيمة المضافة بنسبة 15% وفقًا للأنظمة السعودية.',
      'مدفوعات الباقات غير قابلة للاسترداد بعد بدء الجلسات.',
      'سيتم تقديم الفواتير وإيصالات الدفع عند الطلب.',
    ],
    color: '#FFCC22',
  },
  {
    titleEN: '4. Liability',
    titleAR: '٤. المسؤولية',
    contentEN: [
      'Riyada Center provides therapy services delivered by qualified professionals but cannot guarantee specific outcomes.',
      'Parents or guardians are responsible for providing accurate medical and developmental history for their child.',
      'Riyada Center is not liable for any injuries sustained due to failure to disclose relevant medical conditions.',
      'Our liability is limited to the direct cost of the session in question.',
      'We maintain full professional indemnity insurance in accordance with Saudi regulations.',
    ],
    contentAR: [
      'يقدم مركز ريادة خدمات علاجية على يد متخصصين مؤهلين، ولكن لا يمكنه ضمان نتائج محددة.',
      'يتحمل الآباء أو الأوصياء مسؤولية تقديم التاريخ الطبي والنمائي الدقيق لأطفالهم.',
      'لا يتحمل مركز ريادة المسؤولية عن أي إصابات تنشأ عن الإخفاق في الإفصاح عن الحالات الطبية ذات الصلة.',
      'تقتصر مسؤوليتنا على التكلفة المباشرة للجلسة المعنية.',
      'نحتفظ بتأمين مهني كامل وفقًا للأنظمة السعودية.',
    ],
    color: '#33CC44',
  },
  {
    titleEN: '5. Age Requirements',
    titleAR: '٥. متطلبات السن',
    contentEN: [
      'Riyada Center provides therapy services for children between 3 and 12 years of age.',
      'Children outside this age range may be assessed on a case-by-case basis at the discretion of our clinical team.',
      'A parent or legal guardian must be present or reachable during all therapy sessions.',
      'Consent forms signed by a parent or legal guardian are required before any therapy commences.',
    ],
    contentAR: [
      'يقدم مركز ريادة خدمات علاجية للأطفال الذين تتراوح أعمارهم بين 3 و12 سنة.',
      'قد يخضع الأطفال خارج هذا النطاق العمري للتقييم على أساس كل حالة على حدة وفقًا لتقدير فريقنا السريري.',
      'يجب أن يكون أحد الوالدين أو الولي القانوني حاضرًا أو متاحًا للتواصل خلال جميع جلسات العلاج.',
      'يُشترط الحصول على نماذج موافقة موقّعة من أحد الوالدين أو الولي القانوني قبل بدء أي علاج.',
    ],
    color: '#7766DD',
  },
  {
    titleEN: '6. Governing Law',
    titleAR: '٦. القانون الحاكم',
    contentEN: [
      'These Terms & Conditions are governed by the laws of the Kingdom of Saudi Arabia.',
      'Any disputes arising from the use of our services shall be subject to the jurisdiction of the courts of Riyadh, Saudi Arabia.',
      'Riyada Center complies with all applicable Saudi health, data protection, and consumer regulations.',
      'These terms may be updated periodically; continued use of our services constitutes acceptance of the updated terms.',
    ],
    contentAR: [
      'تخضع هذه الشروط والأحكام لقوانين المملكة العربية السعودية.',
      'تخضع أي نزاعات تنشأ عن استخدام خدماتنا لاختصاص محاكم الرياض، المملكة العربية السعودية.',
      'يلتزم مركز ريادة بجميع أنظمة الصحة وحماية البيانات والمستهلك السعودية المعمول بها.',
      'قد تُحدَّث هذه الشروط بشكل دوري؛ واستمرار استخدام خدماتنا يُعدّ قبولًا للشروط المحدّثة.',
    ],
    color: '#3355EE',
  },
];

export default function TermsPage() {
  const { locale } = useLanguage();
  const isAR = locale === 'ar';
  const BackIcon = isAR ? ArrowRight : ArrowLeft;

  return (
    <div className="min-h-screen bg-[#0D0D1A] text-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 px-6 md:px-12 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(#3355EE 1px, transparent 1px), linear-gradient(90deg, #3355EE 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-brand-blue/10 blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto relative">
          <motion.div variants={fade(0)} initial="hidden" animate="visible" className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-brand-blue/15 flex items-center justify-center">
              <Scale size={18} className="text-brand-blue" />
            </div>
            <span className="text-brand-blue text-sm font-semibold tracking-widest uppercase">
              {isAR ? 'وثيقة قانونية' : 'Legal Document'}
            </span>
          </motion.div>

          <motion.h1
            variants={fade(0.08)}
            initial="hidden"
            animate="visible"
            className="text-4xl md:text-5xl font-display font-bold mb-4"
          >
            {isAR ? 'الشروط والأحكام' : 'Terms & Conditions'}
          </motion.h1>

          <motion.p
            variants={fade(0.16)}
            initial="hidden"
            animate="visible"
            className="text-white/50 text-lg mb-6"
          >
            {isAR
              ? 'يرجى قراءة هذه الشروط بعناية قبل استخدام خدمات مركز ريادة الطبي.'
              : 'Please read these terms carefully before using Riyada Medical Centre services.'}
          </motion.p>

          <motion.p variants={fade(0.22)} initial="hidden" animate="visible" className="text-white/30 text-sm">
            {isAR ? 'آخر تحديث: يناير 2026' : 'Last updated: January 2026'}
          </motion.p>
        </div>
      </section>

      {/* Sections */}
      <section className="pb-24 px-6 md:px-12">
        <div className="max-w-4xl mx-auto space-y-10">
          {sections.map((section, i) => (
            <motion.div
              key={section.titleEN}
              variants={fade(0.1 + i * 0.06)}
              initial="hidden"
              animate="visible"
              className="rounded-2xl border border-white/8 bg-white/[0.03] p-8"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-1.5 h-6 rounded-full" style={{ backgroundColor: section.color }} />
                <h2 className="text-xl font-bold">
                  {isAR ? section.titleAR : section.titleEN}
                </h2>
              </div>
              <ul className="space-y-3">
                {(isAR ? section.contentAR : section.contentEN).map((item, j) => (
                  <li key={j} className="flex items-start gap-3 text-white/65 text-sm leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: section.color }} />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* Contact */}
          <motion.div
            variants={fade(0.7)}
            initial="hidden"
            animate="visible"
            className="rounded-2xl border border-brand-blue/30 bg-brand-blue/5 p-8 text-center"
          >
            <p className="text-white/70 text-sm mb-2">
              {isAR ? 'لأي استفسارات حول هذه الشروط:' : 'For any questions about these terms:'}
            </p>
            <a href="mailto:RC@riyada-ventures.com" className="text-brand-blue hover:underline font-medium">
              RC@riyada-ventures.com
            </a>
          </motion.div>

          <motion.div variants={fade(0.75)} initial="hidden" animate="visible">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors duration-200"
            >
              <BackIcon size={15} />
              {isAR ? 'العودة إلى الرئيسية' : 'Back to Home'}
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
