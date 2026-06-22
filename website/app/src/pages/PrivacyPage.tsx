import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useLanguage } from '../LanguageProvider';
import SEO from '../components/SEO';
import { getPageSEO } from '../seo';

const EASE = [0.22, 1, 0.36, 1] as const;

const fade = (delay = 0) => ({
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay, ease: EASE } },
});

const sections = [
  {
    titleEN: '1. Data We Collect',
    titleAR: '١. البيانات التي نجمعها',
    contentEN: [
      "Parent or guardian full name and contact details (phone number, email address).",
      "Child's name, date of birth, gender, and age.",
      "Developmental history, diagnosis notes, and therapy-related medical information.",
      "Booking details including selected service, preferred dates, and session notes.",
      "Messages and enquiries submitted through our contact form.",
    ],
    contentAR: [
      'الاسم الكامل لولي الأمر وبيانات الاتصال (رقم الهاتف، البريد الإلكتروني).',
      'اسم الطفل وتاريخ ميلاده وجنسه وعمره.',
      'التاريخ النمائي وملاحظات التشخيص والمعلومات الطبية المتعلقة بالعلاج.',
      'تفاصيل الحجز بما في ذلك الخدمة المختارة والمواعيد المفضلة وملاحظات الجلسة.',
      'الرسائل والاستفسارات المقدمة عبر نموذج التواصل.',
    ],
    color: '#3355EE',
  },
  {
    titleEN: '2. How We Use Your Data',
    titleAR: '٢. كيفية استخدام بياناتك',
    contentEN: [
      'To schedule, confirm, and manage therapy session bookings.',
      'To match your child with the most suitable therapist and service.',
      'To send booking confirmations and session reminders.',
      'To respond to your enquiries and provide customer support.',
      'To improve our services based on aggregated, anonymised usage patterns.',
      'We do not use your data for marketing without your explicit consent.',
    ],
    contentAR: [
      'لجدولة جلسات العلاج وتأكيدها وإدارتها.',
      'لمطابقة طفلك مع المعالج والخدمة الأنسب.',
      'لإرسال تأكيدات الحجز وتذكيرات الجلسات.',
      'للرد على استفساراتك وتقديم دعم العملاء.',
      'لتحسين خدماتنا بناءً على أنماط الاستخدام المجمّعة وغير الشخصية.',
      'لا نستخدم بياناتك لأغراض تسويقية دون موافقتك الصريحة.',
    ],
    color: '#33CC44',
  },
  {
    titleEN: '3. Data Storage',
    titleAR: '٣. تخزين البيانات',
    contentEN: [
      'All personal data is stored securely in an encrypted PostgreSQL database hosted on Aiven Cloud infrastructure.',
      'Data is stored on servers located within secure, GDPR-compliant data centers.',
      'Access to personal data is restricted to authorised Riyada Center staff only.',
      'We implement industry-standard security measures including SSL encryption and role-based access controls.',
      'Data is retained only for as long as necessary to fulfil the purposes described in this policy.',
    ],
    contentAR: [
      'يتم تخزين جميع البيانات الشخصية بشكل آمن في قاعدة بيانات PostgreSQL مشفرة مستضافة على بنية Aiven السحابية.',
      'يتم تخزين البيانات على خوادم موجودة داخل مراكز بيانات آمنة ومتوافقة مع معايير GDPR.',
      'يقتصر الوصول إلى البيانات الشخصية على موظفي مركز ريادة المخوّلين فقط.',
      'نطبق معايير أمان عالية المستوى تشمل تشفير SSL وضوابط الوصول المبنية على الأدوار.',
      'يتم الاحتفاظ بالبيانات فقط طالما كان ذلك ضروريًا لتحقيق الأغراض الموضحة في هذه السياسة.',
    ],
    color: '#7766DD',
  },
  {
    titleEN: '4. No Third-Party Sharing',
    titleAR: '٤. عدم المشاركة مع أطراف ثالثة',
    contentEN: [
      'We do not sell, rent, or trade your personal data to any third party, ever.',
      'We do not share your data with advertisers, data brokers, or analytics companies.',
      'Data may be shared with our therapists and clinical staff solely for the purpose of delivering your child\'s therapy.',
      'We may disclose data if required by Saudi law or a court order, and only to the extent required.',
    ],
    contentAR: [
      'لا نبيع بياناتك الشخصية أو نؤجرها أو نتاجر بها مع أي طرف ثالث، إطلاقًا.',
      'لا نشارك بياناتك مع المعلنين أو وسطاء البيانات أو شركات التحليلات.',
      'قد تُشارك البيانات مع معالجينا وفريقنا السريري فقط لغرض تقديم علاج طفلك.',
      'قد نُفصح عن البيانات إذا اقتضى ذلك النظام السعودي أو أمر قضائي، وبالقدر المطلوب فقط.',
    ],
    color: '#FF4D94',
  },
  {
    titleEN: '5. Your Rights & Deletion Requests',
    titleAR: '٥. حقوقك وطلبات الحذف',
    contentEN: [
      'You have the right to access, correct, or request deletion of your personal data at any time.',
      'To request deletion of your data, contact us at RC@riyada-ventures.com with the subject "Data Deletion Request".',
      'We will process deletion requests within 14 business days.',
      'Note that some records may be retained if required by Saudi financial or health regulations.',
      'You may also request a copy of all data held about you in a portable format.',
    ],
    contentAR: [
      'يحق لك الوصول إلى بياناتك الشخصية وتصحيحها أو طلب حذفها في أي وقت.',
      'لطلب حذف بياناتك، تواصل معنا على RC@riyada-ventures.com بموضوع "طلب حذف البيانات".',
      'سنعالج طلبات الحذف في غضون 14 يوم عمل.',
      'قد يتم الاحتفاظ ببعض السجلات إذا اقتضت ذلك الأنظمة المالية أو الصحية السعودية.',
      'يمكنك أيضًا طلب نسخة من جميع البيانات المحتفظ بها عنك بتنسيق قابل للنقل.',
    ],
    color: '#FFCC22',
  },
];

export default function PrivacyPage() {
  const { locale } = useLanguage();
  const isAR = locale === 'ar';
  const BackIcon = isAR ? ArrowRight : ArrowLeft;

  const seo = getPageSEO('privacy', locale)!;

  return (
    <div className="min-h-screen bg-[#0D0D1A] text-white">
      <SEO {...seo} noindex />
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 px-6 md:px-12 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(#33CC44 1px, transparent 1px), linear-gradient(90deg, #33CC44 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-brand-green/10 blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto relative">
          <motion.div variants={fade(0)} initial="hidden" animate="visible" className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-brand-green/15 flex items-center justify-center">
              <Shield size={18} className="text-brand-green" />
            </div>
            <span className="text-brand-green text-sm font-semibold tracking-widest uppercase">
              {isAR ? 'حماية بياناتك' : 'Your Data Protection'}
            </span>
          </motion.div>

          <motion.h1
            variants={fade(0.08)}
            initial="hidden"
            animate="visible"
            className="text-4xl md:text-5xl font-display font-bold mb-4"
          >
            {isAR ? 'سياسة الخصوصية' : 'Privacy Policy'}
          </motion.h1>

          <motion.p
            variants={fade(0.16)}
            initial="hidden"
            animate="visible"
            className="text-white/50 text-lg mb-6"
          >
            {isAR
              ? 'نحن نأخذ خصوصيتك وخصوصية طفلك بجدية بالغة. إليك كيفية تعاملنا مع بياناتك.'
              : 'We take your privacy and your child\'s privacy seriously. Here is how we handle your data.'}
          </motion.p>

          <motion.p variants={fade(0.22)} initial="hidden" animate="visible" className="text-white/30 text-sm">
            {isAR ? 'آخر تحديث: يناير 2026' : 'Last updated: June 2026'}
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

          {/* Contact CTA */}
          <motion.div
            variants={fade(0.7)}
            initial="hidden"
            animate="visible"
            className="rounded-2xl border border-brand-green/30 bg-brand-green/5 p-8 text-center"
          >
            <p className="text-white/70 text-sm mb-1">
              {isAR ? 'للتواصل بشأن بياناتك:' : 'To contact us about your data:'}
            </p>
            <a href="mailto:RC@riyada-ventures.com" className="text-brand-green hover:underline font-medium">
              RC@riyada-ventures.com
            </a>
            <p className="text-white/30 text-xs mt-2">
              {isAR ? 'الموضوع: طلب حذف البيانات' : 'Subject: Data Deletion Request'}
            </p>
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
