import { Routes, Route, Navigate } from 'react-router';
import Home from './pages/Home';
import ServicesPage from './pages/ServicesPage';
import ServicesDetail from './pages/ServicesDetail';
import AssessmentsPage from './pages/AssessmentsPage';
import ABATherapyPage from './pages/ABATherapyPage';
import OccupationalTherapyPage from './pages/OccupationalTherapyPage';
import Booking from './pages/Booking';
import About from './pages/About';
import Contact from './pages/Contact';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import NotFound from './pages/NotFound';
import Forbidden from './pages/Forbidden';
import { ThemeInitializer } from './ThemeInitializer';
import { LanguageProvider } from './LanguageProvider';
import ScrollToTop from './components/ScrollToTop';
import ChatWidget from './components/chatbot/ChatWidget';
import { getStoredAdmin, ROLE_NAV } from './services/adminApi';

// Admin
import AdminLayout from './components/admin/AdminLayout';
import AdminLogin from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import Bookings from './pages/admin/Bookings';
import BookingDetail from './pages/admin/BookingDetail';
import Messages from './pages/admin/Messages';
import MessageDetail from './pages/admin/MessageDetail';
import ServicesAdmin from './pages/admin/ServicesAdmin';
import TeamAdmin from './pages/admin/TeamAdmin';
import UsersAdmin from './pages/admin/UsersAdmin';
import AdminSettings from './pages/admin/AdminSettings';
import ChatbotAdmin from './pages/admin/Chatbot';
import Unauthorized from './pages/admin/Unauthorized';

function RequireAuth({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('admin_token');
  if (!token) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
}

function RoleGuard({ allowed, children }: { allowed: string[]; children: React.ReactNode }) {
  const admin = getStoredAdmin();
  if (!admin || !ROLE_NAV[admin.role]?.some(k => allowed.includes(k))) {
    return <Navigate to="/admin/unauthorized" replace />;
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <ThemeInitializer>
      <LanguageProvider>
        <ScrollToTop />
        <ChatWidget />
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
            <Route path="unauthorized" element={<Unauthorized />} />

            {/* All roles */}
            <Route path="bookings" element={<Bookings />} />
            <Route path="bookings/:id" element={<BookingDetail />} />
            <Route path="messages" element={<Messages />} />
            <Route path="messages/:id" element={<MessageDetail />} />
            <Route path="settings" element={<AdminSettings />} />

            {/* SUPER_ADMIN only */}
            <Route path="services" element={<RoleGuard allowed={['services']}><ServicesAdmin /></RoleGuard>} />
            <Route path="team" element={<RoleGuard allowed={['team']}><TeamAdmin /></RoleGuard>} />

            {/* SUPER_ADMIN + MANAGER */}
            <Route path="chatbot" element={<RoleGuard allowed={['chatbot']}><ChatbotAdmin /></RoleGuard>} />
            <Route path="users" element={<RoleGuard allowed={['users']}><UsersAdmin /></RoleGuard>} />
          </Route>
        </Routes>
      </LanguageProvider>
    </ThemeInitializer>
  );
}
