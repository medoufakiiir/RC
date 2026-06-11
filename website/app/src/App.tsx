import { Routes, Route } from 'react-router';
import Home from './pages/Home';
import ServicesDetail from './pages/ServicesDetail';
import Booking from './pages/Booking';
import Packages from './pages/Packages';
import About from './pages/About';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import { ThemeInitializer } from './ThemeInitializer';
import { LanguageProvider } from './LanguageProvider';

export default function App() {
  return (
    <ThemeInitializer>
      <LanguageProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services/speech-language-therapy" element={<ServicesDetail />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin/bookings" element={<Admin />} />
        </Routes>
      </LanguageProvider>
    </ThemeInitializer>
  );
}



