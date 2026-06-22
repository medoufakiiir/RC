import { lazy, Suspense } from 'react';
import { Analytics } from '@vercel/analytics/react';
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

// Admin — lazy loaded (not included in public site bundle)
const AdminLayout   = lazy(() => import('./components/admin/AdminLayout'));
const AdminLogin    = lazy(() => import('./pages/admin/Login'));
const Dashboard     = lazy(() => import('./pages/admin/Dashboard'));
const Bookings      = lazy(() => import('./pages/admin/Bookings'));
const BookingDetail = lazy(() => import('./pages/admin/BookingDetail'));
const Messages      = lazy(() => import('./pages/admin/Messages'));
const MessageDetail = lazy(() => import('./pages/admin/MessageDetail'));
const ServicesAdmin = lazy(() => import('./pages/admin/ServicesAdmin'));
const TeamAdmin     = lazy(() => import('./pages/admin/TeamAdmin'));
const UsersAdmin    = lazy(() => import('./pages/admin/UsersAdmin'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));
const ChatbotAdmin  = lazy(() => import('./pages/admin/Chatbot'));
const Unauthorized  = lazy(() => import('./pages/admin/Unauthorized'));

function AdminFallback() {
  return <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center text-white/40 text-sm">Loading…</div>;
}

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

          {/* Admin — lazy loaded */}
          <Route path="/admin/login" element={<Suspense fallback={<AdminFallback />}><AdminLogin /></Suspense>} />
          <Route path="/admin" element={<RequireAuth><Suspense fallback={<AdminFallback />}><AdminLayout /></Suspense></RequireAuth>}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="unauthorized" element={<Unauthorized />} />
            <Route path="bookings" element={<Bookings />} />
            <Route path="bookings/:id" element={<BookingDetail />} />
            <Route path="messages" element={<Messages />} />
            <Route path="messages/:id" element={<MessageDetail />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="services" element={<RoleGuard allowed={['services']}><ServicesAdmin /></RoleGuard>} />
            <Route path="team" element={<RoleGuard allowed={['team']}><TeamAdmin /></RoleGuard>} />
            <Route path="chatbot" element={<RoleGuard allowed={['chatbot']}><ChatbotAdmin /></RoleGuard>} />
            <Route path="users" element={<RoleGuard allowed={['users']}><UsersAdmin /></RoleGuard>} />
          </Route>

          {/* Catch-all — must be last */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </LanguageProvider>
      <Analytics />
    </ThemeInitializer>
  );
}
