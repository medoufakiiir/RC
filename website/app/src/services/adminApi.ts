const BASE = import.meta.env.VITE_API_URL ?? 'https://riyada-medical-backend-production.up.railway.app';

function getToken() {
  return localStorage.getItem('admin_token') ?? '';
}

export function getStoredAdmin(): AdminUser | null {
  try {
    const raw = localStorage.getItem('admin_user');
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

async function req<T>(method: string, path: string, body?: unknown, auth = true): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (auth) headers['Authorization'] = `Bearer ${getToken()}`;
  const res = await fetch(`${BASE}${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error ?? res.statusText);
  }
  return res.json();
}

export const adminApi = {
  // Auth
  login: (email: string, password: string) =>
    req<{ token: string; user: AdminUser; mustChangePassword: boolean }>('POST', '/auth/login', { email, password }, false),
  me: () => req<AdminUser>('GET', '/auth/me'),
  changePassword: (currentPassword: string, newPassword: string) =>
    req('POST', '/auth/change-password', { currentPassword, newPassword }),

  // Dashboard
  dashboard: () => req<DashboardData>('GET', '/admin/dashboard'),

  // Bookings
  bookings: (params?: BookingParams) =>
    req<BookingList>('GET', `/admin/bookings?${new URLSearchParams(params as never).toString()}`),
  booking: (id: string) => req<Booking>('GET', `/admin/bookings/${id}`),
  updateBooking: (id: string, data: Partial<Booking>) => req<Booking>('PATCH', `/admin/bookings/${id}`, data),
  deleteBooking: (id: string) => req('DELETE', `/admin/bookings/${id}`),
  bulkDeleteBookings: (ids: string[]) => req('POST', '/admin/bookings/bulk-delete', { ids }),

  // Messages
  messages: (params?: MessageParams) =>
    req<MessageList>('GET', `/admin/messages?${new URLSearchParams(params as never).toString()}`),
  message: (id: string) => req<ContactMessage>('GET', `/admin/messages/${id}`),
  markAllRead: () => req('PATCH', '/admin/messages/mark-all-read', {}),
  updateMessage: (id: string, data: Partial<ContactMessage>) => req<ContactMessage>('PATCH', `/admin/messages/${id}`, data),
  deleteMessage: (id: string) => req('DELETE', `/admin/messages/${id}`),
  bulkDeleteMessages: (ids: string[]) => req('POST', '/admin/messages/bulk-delete', { ids }),

  // Services
  services: () => req<Service[]>('GET', '/admin/services'),
  createService: (data: Omit<Service, 'id'>) => req<Service>('POST', '/admin/services', data),
  updateService: (id: string, data: Partial<Service>) => req<Service>('PATCH', `/admin/services/${id}`, data),
  deleteService: (id: string) => req('DELETE', `/admin/services/${id}`),

  // Team
  team: () => req<TeamMember[]>('GET', '/admin/team'),
  createTeamMember: (data: Omit<TeamMember, 'id' | 'createdAt' | 'updatedAt'>) => req<TeamMember>('POST', '/admin/team', data),
  updateTeamMember: (id: string, data: Partial<TeamMember>) => req<TeamMember>('PATCH', `/admin/team/${id}`, data),
  deleteTeamMember: (id: string) => req('DELETE', `/admin/team/${id}`),

  // Users
  users: () => req<ManagedUser[]>('GET', '/admin/users'),
  createUser: (data: { email: string; name: string; role: string; password?: string }) => req<ManagedUser>('POST', '/admin/users', data),
  updateUser: (id: string, data: Partial<{ name: string; email: string; role: string; isActive: boolean }>) => req<ManagedUser>('PATCH', `/admin/users/${id}`, data),
  resetPassword: (id: string) => req<{ ok: boolean; tempPassword: string }>('POST', `/admin/users/${id}/reset-password`, {}),

  // Settings
  settings: () => req<Record<string, string>>('GET', '/admin/settings'),
  updateSettings: (data: Record<string, string>) => req('PATCH', '/admin/settings', data),

  // Analytics
  analytics: () => req<AnalyticsData>('GET', '/admin/analytics'),
  contactsSummary: () => req<ContactsSummary>('GET', '/admin/analytics/contacts-summary'),

  // Exports
  exportUrl: (type: string) => `${BASE}/admin/analytics/export/${type}?token=${getToken()}`,

  // Contacts
  contacts: (params?: ContactsParams) =>
    req<ContactsList>('GET', `/admin/contacts?${new URLSearchParams(params as never).toString()}`),
  exportContacts: (source?: string) => `${BASE}/admin/contacts/export?source=${source || 'all'}&token=${getToken()}`,

  // Calendar
  calendarBookings: (_start?: string, _end?: string) =>
    req<CalendarEvent[]>('GET', '/admin/calendar/bookings'),
  calendarBookingsUrl: () => `${BASE}/admin/calendar/bookings?token=${getToken()}`,
  calendarStatus: () => req<CalendarStatus>('GET', '/admin/calendar/status'),
  calendarGoogleConnect: () => req<{ url: string }>('GET', '/admin/calendar/google/connect'),
  calendarGoogleSync: () => req<{ synced: number }>('POST', '/admin/calendar/google/sync'),
  calendarGoogleDisconnect: () => req('DELETE', '/admin/calendar/google/disconnect'),
  calendarMsConnect: () => req<{ url: string }>('GET', '/admin/calendar/microsoft/connect'),
  calendarMsSync: () => req<{ synced: number }>('POST', '/admin/calendar/microsoft/sync'),
  calendarMsDisconnect: () => req('DELETE', '/admin/calendar/microsoft/disconnect'),

  // Permissions
  permissions: () => req<{ chatbot: boolean; analytics: boolean; contacts: boolean }>('GET', '/admin/settings/permissions'),
  chatbotPermissions: () => req<{ id: string; name: string; email: string; role: string; isActive: boolean; chatbotEnabled: boolean }[]>('GET', '/admin/settings/permissions/chatbot'),
  toggleChatbotAccess: (userId: string, enabled: boolean) => req('PATCH', `/admin/settings/permissions/chatbot/${userId}`, { enabled }),
};

// Public form submission
export async function submitBooking(data: Record<string, string>) {
  const res = await fetch(`${BASE}/bookings`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error ?? 'Booking failed');
  return res.json();
}

export async function submitContact(data: Record<string, string>) {
  const res = await fetch(`${BASE}/contact`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error ?? 'Message failed');
  return res.json();
}

// Types
export type Role = 'SUPER_ADMIN' | 'MANAGER' | 'RECEPTIONIST' | 'MARKETING';

export interface AdminUser { id: string; email: string; name: string; role: Role }

export interface ManagedUser { id: string; email: string; name: string; role: Role; isActive: boolean; mustChangePassword: boolean; createdAt: string }

export const ROLE_NAV: Record<Role, string[]> = {
  SUPER_ADMIN:  ['dashboard', 'calendar', 'bookings', 'messages', 'services', 'team', 'chatbot', 'analytics', 'contacts', 'users', 'settings'],
  MANAGER:      ['dashboard', 'calendar', 'bookings', 'messages', 'chatbot', 'users', 'settings'],
  RECEPTIONIST: ['dashboard', 'calendar', 'bookings', 'messages', 'settings'],
  MARKETING:    ['dashboard', 'bookings', 'messages', 'chatbot', 'analytics', 'contacts', 'settings'],
};

export interface Booking {
  id: string; ref: string; parentName: string; childName: string; childAge: string;
  phone: string; email: string; service: string;
  date: string; time: string; notes: string; status: string; adminNotes: string;
  createdAt: string; updatedAt: string;
}

export interface ContactMessage {
  id: string; name: string; email: string; phone: string; service: string;
  childAge: string; concern: string; message: string; isRead: boolean; createdAt: string;
}

export interface Service {
  id: string; slug: string; titleEn: string; titleAr: string;
  descEn: string; descAr: string; isActive: boolean; order: number;
}

export interface TeamMember {
  id: string; nameEn: string; nameAr: string; roleEn: string; roleAr: string;
  bio: string; initials: string; color: string; order: number; isActive: boolean;
  createdAt: string; updatedAt: string;
}

export interface DashboardData {
  stats: { totalBookings: number; pendingBookings: number; totalMessages: number; unreadMessages: number };
  recentBookings: Booking[];
  recentMessages: ContactMessage[];
}

export interface BookingList { bookings: Booking[]; total: number; page: number; pages: number }
export interface MessageList { messages: ContactMessage[]; total: number; page: number; pages: number }
export interface BookingParams { status?: string; search?: string; page?: string; limit?: string }
export interface MessageParams { read?: string; page?: string; limit?: string }
export interface ContactsParams { search?: string; source?: string; page?: string; limit?: string }

export interface ContactsList {
  contacts: ContactEntry[];
  total: number;
  page: number;
  pages: number;
}

export interface ContactEntry {
  id: string; name: string; childName: string; childAge: string;
  email: string; phone: string; service: string; source: string; date: string;
}

export interface AnalyticsData {
  overview: {
    totalBookings: number; pendingBookings: number; confirmedBookings: number; cancelledBookings: number;
    weekBookings: number; monthBookings: number;
    totalMessages: number; unreadMessages: number; weekMessages: number; monthMessages: number;
    totalChatSessions: number; weekChatSessions: number; monthChatSessions: number;
    totalChatAppointments: number; pendingChatAppts: number;
    totalVisitors: number; weekVisitors: number; monthVisitors: number; todayVisitors: number;
    conversionRate: number;
  };
  trends: {
    bookingsByWeek: { week: string; count: number }[];
    messagesByWeek: { week: string; count: number }[];
    chatSessionsByWeek: { week: string; count: number }[];
    visitorsByWeek: { week: string; count: number }[];
  };
  topServices: { name: string; count: number }[];
  topPages: { path: string; count: number }[];
  deviceSplit: Record<string, number>;
  statusBreakdown: Record<string, number>;
  chatLanguages: Record<string, number>;
}

export interface ContactsSummary {
  totalUniqueEmails: number;
  totalUniquePhones: number;
  totalBookingLeads: number;
  totalMessageLeads: number;
  totalChatbotLeads: number;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  color: string;
  extendedProps: {
    bookingId: string;
    ref: string;
    parentName: string;
    childName: string;
    childAge: string;
    phone: string;
    email: string;
    service: string;
    status: string;
    notes: string;
    adminNotes: string;
  };
}

export interface CalendarStatus {
  connected: boolean;
  provider: string | null;
  lastSynced: string | null;
  calendarId?: string;
}
