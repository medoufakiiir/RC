import { Routes, Route, Navigate } from 'react-router';
import Home from './pages/Home';
import ServicesPage from './pages/ServicesPage';
import ServicesDetail from './pages/ServicesDetail';
import AssessmentsPage from './pages/AssessmentsPage';
import ABATherapyPage from './pages/ABATherapyPage';
import OccupationalTherapyPage from './pages/OccupationalTherapyPage';
import Booking from './pages/Booking';
import Packages from './pages/Packages';
import About from './pages/About';
import Contact from './pages/Contact';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import NotFound from './pages/NotFound';
import Forbidden from './pages/Forbidden';
import { ThemeInitializer } from './ThemeInitializer';
import { LanguageProvider } from './LanguageProvider';
import ScrollToTop from './components/ScrollToTop';

// Admin
import AdminLayout from './components/admin/AdminLayout';
import AdminLogin from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import Bookings from './pages/admin/Bookings';
import BookingDetail from './pages/admin/BookingDetail';
import Messages from './pages/admin/Messages';
import MessageDetail from './pages/admin/MessageDetail';
import ServicesAdmin from './pages/admin/ServicesAdmin';
import PackagesAdmin from './pages/admin/PackagesAdmin';
import TeamAdmin from './pages/admin/TeamAdmin';
import AdminSettings from './pages/admin/AdminSettings';

function RequireAuth({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('admin_token');
  if (!token) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <ThemeInitializer>
      <LanguageProvider>
        <ScrollToTop />
        <Routes>
          {/* Public site */}
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/assessments" element={<AssessmentsPage />} />
          <Route path="/services/aba-therapy" element={<ABATherapyPage />} />
          <Route path="/services/speech-language-therapy" element={<ServicesDetail />} />
          <Route path="/services/speech-language" element={<ServicesDetail />} />
          <Route path="/services/occupational-therapy" element={<OccupationalTherapyPage />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/403" element={<Forbidden />} />
          <Route path="*" element={<NotFound />} />

          {/* Admin */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<RequireAuth><AdminLayout /></RequireAuth>}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="bookings" element={<Bookings />} />
            <Route path="bookings/:id" element={<BookingDetail />} />
            <Route path="messages" element={<Messages />} />
            <Route path="messages/:id" element={<MessageDetail />} />
            <Route path="services" element={<ServicesAdmin />} />
            <Route path="packages" element={<PackagesAdmin />} />
            <Route path="team" element={<TeamAdmin />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </LanguageProvider>
    </ThemeInitializer>
  );
}



