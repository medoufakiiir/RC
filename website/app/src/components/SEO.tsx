import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../LanguageProvider';
import { SITE_URL, SITE_NAME, OG_IMAGE } from '../seo';

type SEOProps = {
  title: string;
  description: string;
  canonical: string;
  path: string;
  type?: string;
  image?: string;
  noindex?: boolean;
};

export default function SEO({
  title,
  description,
  canonical,
  path,
  type = 'website',
  image = OG_IMAGE,
  noindex = false,
}: SEOProps) {
  const { locale } = useLanguage();

  return (
    <Helmet>
      <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} />
      <title>{title}</title>
      <meta name="description" content={description} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      <link rel="canonical" href={canonical} />

      {/* hreflang alternates */}
      <link rel="alternate" hrefLang="en" href={`${SITE_URL}${path}`} />
      <link rel="alternate" hrefLang="ar" href={`${SITE_URL}${path}`} />
      <link rel="alternate" hrefLang="x-default" href={`${SITE_URL}${path}`} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content={locale === 'ar' ? 'ar_SA' : 'en_US'} />
      <meta property="og:locale:alternate" content={locale === 'ar' ? 'en_US' : 'ar_SA'} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Geo tags for Riyadh */}
      <meta name="geo.region" content="SA-01" />
      <meta name="geo.placename" content="Riyadh" />
    </Helmet>
  );
}
