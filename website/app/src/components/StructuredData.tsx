import { Helmet } from 'react-helmet-async';
import { SITE_URL, OG_IMAGE } from '../seo';

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'MedicalBusiness',
  '@id': `${SITE_URL}/#organization`,
  name: 'Riyada Center',
  alternateName: 'مركز ريادة',
  url: SITE_URL,
  logo: OG_IMAGE,
  image: OG_IMAGE,
  description:
    'A specialized pediatric development center in Riyadh offering ABA therapy, speech therapy, occupational therapy, and developmental assessments for children ages 3–12.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Riyadh',
    addressCountry: 'SA',
  },
  areaServed: {
    '@type': 'City',
    name: 'Riyadh',
  },
  priceRange: '$$',
  medicalSpecialty: 'Pediatric',
  availableService: [
    {
      '@type': 'MedicalTherapy',
      name: 'ABA Therapy',
      alternateName: 'Applied Behavior Analysis',
      description:
        'Evidence-based behavioral interventions for autism, ADHD, and developmental challenges.',
    },
    {
      '@type': 'MedicalTherapy',
      name: 'Speech & Language Therapy',
      description:
        'Treatment for speech delays, stuttering, articulation disorders, and communication challenges.',
    },
    {
      '@type': 'MedicalTherapy',
      name: 'Occupational Therapy',
      description:
        'Sensory integration, fine motor skills, daily living activities, and handwriting support.',
    },
    {
      '@type': 'MedicalProcedure',
      name: 'Developmental Assessments',
      description:
        'Comprehensive cognitive, behavioral, speech, and sensory processing evaluations.',
    },
  ],
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Riyada Center',
  alternateName: 'مركز ريادة',
  url: SITE_URL,
};

export function OrganizationSchema() {
  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
    </Helmet>
  );
}

export function WebsiteSchema() {
  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
    </Helmet>
  );
}

export function BreadcrumbSchema({ items }: { items: { name: string; url: string }[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}

export function ServiceSchema({
  name,
  description,
  url,
}: {
  name: string;
  description: string;
  url: string;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'MedicalTherapy',
    name,
    description,
    url: `${SITE_URL}${url}`,
    provider: {
      '@type': 'MedicalBusiness',
      name: 'Riyada Center',
      url: SITE_URL,
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}

export function FAQSchema({ items }: { items: { question: string; answer: string }[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}
