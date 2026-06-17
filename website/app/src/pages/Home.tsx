import HeroSection from '../sections/HeroSection';
import StatsBar from '../sections/StatsBar';
import ServicesSection from '../sections/ServicesSection';
import WhoWeServe from '../sections/WhoWeServe';
import WhyRiyada from '../sections/WhyRiyada';
import MarqueeSection from '../sections/MarqueeSection';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

export default function Home() {
  return (
    <div className="min-h-screen">
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

