import HeroSection from '../sections/HeroSection';
import StatsBar from '../sections/StatsBar';
import ServicesSection from '../sections/ServicesSection';
import WhoWeServe from '../sections/WhoWeServe';
import WhyRiyada from '../sections/WhyRiyada';
import MarqueeSection from '../sections/MarqueeSection';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import SEO from '../components/SEO';
import { OrganizationSchema, WebsiteSchema } from '../components/StructuredData';
import { useLanguage } from '../LanguageProvider';
import { getPageSEO } from '../seo';

export default function Home() {
  const { locale } = useLanguage();
  const seo = getPageSEO('home', locale)!;

  return (
    <div className="min-h-screen">
      <SEO {...seo} />
      <OrganizationSchema />
      <WebsiteSchema />
      <Navbar />
      <HeroSection />
      <StatsBar />
      <MarqueeSection />
      <ServicesSection />
      <WhoWeServe />
      <WhyRiyada />
      <Footer />
    </div>
  );
}

