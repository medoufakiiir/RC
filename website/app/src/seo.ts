import type { Locale } from './i18n';

export const SITE_URL = 'https://rc.riyada-ventures.com';
export const SITE_NAME = 'Riyada Center';
export const OG_IMAGE = `${SITE_URL}/logo/Riyada Center Logo Souce-01.png`;

type PageSEO = {
  title: { en: string; ar: string };
  description: { en: string; ar: string };
  path: string;
};

export const pageSEO: Record<string, PageSEO> = {
  home: {
    title: {
      en: 'Riyada Center | Pediatric Therapy & Child Development in Riyadh',
      ar: 'مركز ريادة | علاج الأطفال وتنمية المهارات في الرياض',
    },
    description: {
      en: 'Riyada Center is a specialized pediatric development center in Riyadh offering ABA therapy, speech therapy, occupational therapy, and developmental assessments for children ages 3–12.',
      ar: 'مركز ريادة هو مركز متخصص لتنمية الأطفال في الرياض يقدم علاج ABA، علاج النطق، العلاج الوظيفي، والتقييمات التنموية للأطفال من عمر 3 إلى 12 سنة.',
    },
    path: '/',
  },
  services: {
    title: {
      en: 'Our Services | Riyada Center',
      ar: 'خدماتنا | مركز ريادة',
    },
    description: {
      en: 'Explore therapy services at Riyada Center: developmental assessments, ABA therapy, speech & language therapy, and occupational therapy for children in Riyadh.',
      ar: 'اكتشف الخدمات العلاجية في مركز ريادة: التقييمات التنموية، علاج ABA، علاج النطق واللغة، والعلاج الوظيفي للأطفال في الرياض.',
    },
    path: '/services',
  },
  assessments: {
    title: {
      en: 'Assessments & Consultations | Riyada Center',
      ar: 'التقييمات والاستشارات | مركز ريادة',
    },
    description: {
      en: 'Comprehensive developmental evaluations for children in Riyadh. Cognitive, behavioral, speech, and sensory processing assessments with personalized therapy roadmaps.',
      ar: 'تقييمات تنموية شاملة للأطفال في الرياض. تقييمات معرفية وسلوكية ونطقية وحسية مع خطط علاجية مخصصة.',
    },
    path: '/services/assessments',
  },
  abaTherapy: {
    title: {
      en: 'ABA Therapy | Riyada Center',
      ar: 'علاج ABA | مركز ريادة',
    },
    description: {
      en: 'Applied Behavior Analysis (ABA) therapy for children in Riyadh. Evidence-based behavioral interventions for autism, ADHD, and developmental challenges at Riyada Center.',
      ar: 'علاج تحليل السلوك التطبيقي (ABA) للأطفال في الرياض. تدخلات سلوكية مبنية على الأدلة للتوحد وفرط الحركة والتحديات التنموية في مركز ريادة.',
    },
    path: '/services/aba-therapy',
  },
  speechTherapy: {
    title: {
      en: 'Speech & Language Therapy | Riyada Center',
      ar: 'علاج النطق واللغة | مركز ريادة',
    },
    description: {
      en: 'Speech and language therapy for children in Riyadh. Treatment for speech delays, stuttering, articulation disorders, and communication challenges at Riyada Center.',
      ar: 'علاج النطق واللغة للأطفال في الرياض. علاج تأخر الكلام والتلعثم واضطرابات النطق وتحديات التواصل في مركز ريادة.',
    },
    path: '/services/speech-language-therapy',
  },
  occupationalTherapy: {
    title: {
      en: 'Occupational Therapy | Riyada Center',
      ar: 'العلاج الوظيفي | مركز ريادة',
    },
    description: {
      en: 'Occupational therapy for children in Riyadh. Sensory integration, fine motor skills, daily living activities, and handwriting support at Riyada Center.',
      ar: 'العلاج الوظيفي للأطفال في الرياض. التكامل الحسي والمهارات الحركية الدقيقة وأنشطة الحياة اليومية ودعم الكتابة في مركز ريادة.',
    },
    path: '/services/occupational-therapy',
  },
  booking: {
    title: {
      en: 'Book an Appointment | Riyada Center',
      ar: 'احجز موعد | مركز ريادة',
    },
    description: {
      en: 'Book a therapy session for your child at Riyada Center in Riyadh. Schedule assessments, ABA therapy, speech therapy, or occupational therapy appointments online.',
      ar: 'احجز جلسة علاجية لطفلك في مركز ريادة بالرياض. جدولة مواعيد التقييم وعلاج ABA وعلاج النطق والعلاج الوظيفي عبر الإنترنت.',
    },
    path: '/booking',
  },
  about: {
    title: {
      en: 'About Us | Riyada Center',
      ar: 'من نحن | مركز ريادة',
    },
    description: {
      en: 'Learn about Riyada Center, a specialized pediatric therapy center in Riyadh. Our vision, mission, team of certified therapists, and child-centered approach.',
      ar: 'تعرف على مركز ريادة، المركز المتخصص في علاج الأطفال في الرياض. رؤيتنا ومهمتنا وفريقنا من المعالجين المعتمدين ونهجنا المتمحور حول الطفل.',
    },
    path: '/about',
  },
  contact: {
    title: {
      en: 'Contact Us | Riyada Center',
      ar: 'تواصل معنا | مركز ريادة',
    },
    description: {
      en: 'Contact Riyada Center in Riyadh for pediatric therapy inquiries. Reach out for assessments, therapy services, and personalized support plans for your child.',
      ar: 'تواصل مع مركز ريادة في الرياض لاستفسارات علاج الأطفال. تواصل معنا للتقييمات والخدمات العلاجية وخطط الدعم المخصصة لطفلك.',
    },
    path: '/contact',
  },
  terms: {
    title: {
      en: 'Terms & Conditions | Riyada Center',
      ar: 'الشروط والأحكام | مركز ريادة',
    },
    description: {
      en: 'Terms and conditions for using Riyada Center services and website.',
      ar: 'الشروط والأحكام لاستخدام خدمات وموقع مركز ريادة.',
    },
    path: '/terms',
  },
  privacy: {
    title: {
      en: 'Privacy Policy | Riyada Center',
      ar: 'سياسة الخصوصية | مركز ريادة',
    },
    description: {
      en: 'Privacy policy for Riyada Center. Learn how we collect, use, and protect your personal information.',
      ar: 'سياسة الخصوصية لمركز ريادة. تعرف على كيفية جمعنا واستخدامنا وحمايتنا لمعلوماتك الشخصية.',
    },
    path: '/privacy',
  },
};

export function getPageSEO(page: string, locale: Locale) {
  const seo = pageSEO[page];
  if (!seo) return null;
  return {
    title: seo.title[locale],
    description: seo.description[locale],
    canonical: `${SITE_URL}${seo.path}`,
    path: seo.path,
  };
}
