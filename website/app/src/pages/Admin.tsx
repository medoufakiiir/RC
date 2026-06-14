import { useState, useEffect, useMemo } from 'react';

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Package,
  Settings,
  LogOut,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Plus,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  MessageCircle,
  AlertCircle,
} from 'lucide-react';

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', active: true },
  { icon: CalendarDays, label: 'Bookings', active: false },
  { icon: MessageCircle, label: 'Messages', active: false },
  { icon: Users, label: 'Patients', active: false },
  { icon: Package, label: 'Packages', active: false },
  { icon: Settings, label: 'Settings', active: false },
];

const statusConfig: Record<string, { bg: string; text: string; icon: typeof CheckCircle2 }> = {
  Confirmed: { bg: 'bg-[#C8F5B5]', text: 'text-[#1A7A2A]', icon: CheckCircle2 },
  Pending: { bg: 'bg-[#FFCC22]', text: 'text-[#7A5A00]', icon: Clock },
  Cancelled: { bg: 'bg-[#FFD6E8]', text: 'text-[#A00040]', icon: XCircle },
  Completed: { bg: 'bg-[#DDBAE8]', text: 'text-[#4A1A7A]', icon: CheckCircle2 },
};

import { getBookings } from '../lib/bookingsStore';
import type { Booking } from '../lib/bookingsStore';
import type { ContactMessage } from '../lib/contactStore';
import { getContactMessages, setContactMessages } from '../lib/contactStore';



const bookingStats = (bookings: { status: string; date: string }[]) => {
  const total = bookings.length;
  const pending = bookings.filter((booking) => booking.status === 'Pending').length;
  const completed = bookings.filter((booking) => booking.status === 'Completed').length;
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const thisWeek = bookings.filter((booking) => {
    const bookingDate = new Date(booking.date);
    return bookingDate >= weekAgo;
  }).length;

  return [
    { label: 'Total Bookings', value: total.toString(), change: total > 0 ? '+0%' : '0%', color: '#3355EE', icon: CalendarDays },
    { label: 'This Week', value: thisWeek.toString(), change: '+0%', color: '#33CC44', icon: TrendingUp },
    { label: 'Pending', value: pending.toString(), change: pending > 0 ? '-0' : '0', color: '#FFCC22', icon: Clock },
    { label: 'Completed', value: completed.toString(), change: '+0%', color: '#FF4D94', icon: CheckCircle2 },
  ];
};

const messageStats = (total: number, unread: number) => [
  { label: 'Total Messages', value: total.toString(), change: '+0%', color: '#3355EE', icon: MessageCircle },
  { label: 'Unread Messages', value: unread.toString(), change: '+0', color: '#33CC44', icon: Users },
  { label: 'Contact Types', value: '4', change: '+0', color: '#FFCC22', icon: Package },
  { label: 'Last Message', value: 'Today', change: '+0', color: '#FF4D94', icon: Clock },
];

export default function Admin() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [view, setView] = useState<'bookings' | 'messages'>('bookings');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [messages, setMessages] = useState<ContactMessage[]>(() => getContactMessages());
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
  }, []);

  const bookings = useMemo(() => getBookings(), []);

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch = b.patient.toLowerCase().includes(search.toLowerCase()) || b.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredMessages = messages.filter((message) => {
    const lowerSearch = search.toLowerCase();
    return (
      message.name.toLowerCase().includes(lowerSearch) ||
      message.email.toLowerCase().includes(lowerSearch) ||
      message.phone.toLowerCase().includes(lowerSearch) ||
      message.service.toLowerCase().includes(lowerSearch) ||
      message.concern.toLowerCase().includes(lowerSearch) ||
      message.message.toLowerCase().includes(lowerSearch)
    );
  });

  const unreadCount = messages.filter((message) => !message.reviewed).length;

  const markMessageReviewed = (id: string) => {
    const updated = messages.map((message) =>
      message.id === id ? { ...message, reviewed: true } : message
    );
    setMessages(updated);
    setContactMessages(updated);
    if (selectedMessage?.id === id) {
      setSelectedMessage(updated.find((message) => message.id === id) ?? null);
    }
  };

  return (
    <div className="min-h-screen bg-bg-base flex">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-[#0A0F2E] text-white z-40 transition-all duration-300 ${
          sidebarOpen ? 'w-60' : 'w-16'
        }`}
      >
        {/* Logo */}
        <div className={`h-16 flex items-center ${sidebarOpen ? 'px-6' : 'justify-center'} border-b border-white/10`}>
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 overflow-hidden">
            <img
              src="/logo/Riyada%20Center%20Logo%20Souce-01.png"
              alt="Riyada Center"
              className="w-full h-full object-contain"
            />
          </div>
          {sidebarOpen && (
            <span className="ml-3 font-display font-bold text-sm">Riyada Admin</span>
          )}
        </div>

        {/* Nav items */}
        <nav className="p-3 space-y-1 flex-1">
          {sidebarItems.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                if (item.label === 'Bookings') setView('bookings');
                if (item.label === 'Messages') setView('messages');
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                (item.label === 'Bookings' && view === 'bookings') || (item.label === 'Messages' && view === 'messages')
                  ? 'bg-brand-blue/20 text-white border-l-2 border-brand-blue'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon size={18} />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Bottom: user */}
        <div className={`p-4 border-t border-white/10 ${sidebarOpen ? '' : 'flex justify-center'}`}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-brand-blue flex items-center justify-center text-sm font-bold shrink-0">
              A
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Admin User</p>
                <p className="text-xs text-white/40 truncate">admin@riyada.center</p>
              </div>
            )}
            <button className="text-white/40 hover:text-white transition-colors">
              <LogOut size={16} />
            </button>
          </div>
        </div>

        {/* Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3 top-20 w-6 h-6 bg-brand-blue rounded-full flex items-center justify-center text-white shadow-lg"
        >
          {sidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        </button>
      </aside>

      {/* Main content */}
      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-60' : 'ml-16'}`}>
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-30">
          <h1 className="font-display font-bold text-xl text-text-primary">
            {view === 'bookings' ? 'Bookings' : 'Contact Messages'}
          </h1>
          <Link
            to={view === 'bookings' ? '/booking' : '/contact'}
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-blue text-white font-medium text-sm rounded-pill hover:brightness-110 transition-all"
          >
            <Plus size={16} />
            {view === 'bookings' ? 'New Booking' : 'New Message'}
          </Link>
        </header>

        <div className="p-6">
          {/* Stats cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {(view === 'bookings' ? bookingStats(bookings) : messageStats(messages.length, unreadCount)).map((stat, i) => (
              <motion.div
                key={stat.label}
                className="bg-white rounded-card p-5 shadow-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: stat.color + '15' }}
                  >
                    <stat.icon size={18} style={{ color: stat.color }} />
                  </div>
                  <span className="text-xs font-medium text-brand-green bg-brand-green/10 px-2 py-0.5 rounded-full">
                    {stat.change}
                  </span>
                </div>
                <p className="font-display font-bold text-2xl text-text-primary">{stat.value}</p>
                <p className="text-xs text-text-secondary mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Filters */}
          <div className="bg-white rounded-card shadow-card p-4 mb-4 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={view === 'bookings' ? 'Search bookings...' : 'Search messages...'}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none text-sm"
              />
            </div>
            {view === 'bookings' && (
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-text-secondary" />
                {['All', 'Confirmed', 'Pending', 'Completed', 'Cancelled'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-1.5 rounded-pill text-xs font-medium transition-colors ${
                      statusFilter === status
                        ? 'bg-brand-blue text-white'
                        : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Table */}
          <div className="bg-white rounded-card shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    {view === 'bookings' ? (
                      <>
                        <th className="text-left px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Booking ID</th>
                        <th className="text-left px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Patient</th>
                        <th className="text-left px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Service</th>
                        <th className="text-left px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Date</th>
                        <th className="text-left px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Time</th>
                        <th className="text-left px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Status</th>
                      </>
                    ) : (
                      <>
                        <th className="text-left px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Message ID</th>
                        <th className="text-left px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Name</th>
                        <th className="text-left px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Email</th>
                        <th className="text-left px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Service</th>
                        <th className="text-left px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Child Age</th>
                        <th className="text-left px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Status</th>
                        <th className="text-left px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Action</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {view === 'bookings'
                    ? filteredBookings.map((booking, i) => {
                        const status = statusConfig[booking.status] || statusConfig.Pending;
                        const StatusIcon = status.icon;
                        return (
                          <motion.tr
                            key={booking.id}
                            onClick={() => setSelectedBooking(booking)}
                            className={`border-b border-gray-50 hover:bg-[#F0F4FF] transition-colors cursor-pointer ${selectedBooking?.id === booking.id ? 'bg-[#EEF7FF]' : ''}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: i * 0.03 }}
                          >
                            <td className="px-6 py-4 text-sm font-mono text-brand-blue">{booking.id}</td>
                            <td className="px-6 py-4 text-sm font-medium text-text-primary">{booking.patient}</td>
                            <td className="px-6 py-4 text-sm text-text-secondary">{booking.service}</td>
                            <td className="px-6 py-4 text-sm text-text-secondary">{booking.date}</td>
                            <td className="px-6 py-4 text-sm text-text-secondary">{booking.time}</td>
                            <td className="px-6 py-4">
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}
                              >
                                <StatusIcon size={12} />
                                {booking.status}
                              </span>
                            </td>
                          </motion.tr>
                        );
                      }) : filteredMessages.map((message, i) => (
                        <motion.tr
                          key={message.id}
                          className="border-b border-gray-50 hover:bg-[#F0F4FF] transition-colors"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.03 }}
                        >
                          <td className="px-6 py-4 text-sm font-mono text-brand-blue">{message.id}</td>
                          <td className="px-6 py-4 text-sm font-medium text-text-primary">{message.name}</td>
                          <td className="px-6 py-4 text-sm text-text-secondary">{message.email}</td>
                          <td className="px-6 py-4 text-sm text-text-secondary">{message.service}</td>
                          <td className="px-6 py-4 text-sm text-text-secondary">{message.childAge}</td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                                message.reviewed ? 'bg-[#DDBAE8] text-[#4A1A7A]' : 'bg-[#FFCC22] text-[#7A5A00]'
                              }`}
                            >
                              {message.reviewed ? 'Reviewed' : 'New'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              type="button"
                              onClick={() => setSelectedMessage(message)}
                              className="rounded-pill bg-brand-blue/10 px-3 py-1 text-xs font-medium text-brand-blue hover:bg-brand-blue/20 transition-colors"
                            >
                              View
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                </tbody>
              </table>
            </div>

              {/* Booking details panel */}
              {view === 'bookings' && selectedBooking && (
                <div className="p-6 border-t">
                  <div className="rounded-card bg-white p-6 shadow-card">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.35em] text-brand-blue font-semibold mb-2">Booking details</p>
                        <h2 className="font-display text-2xl font-bold text-text-primary">{selectedBooking.patient}</h2>
                        <p className="mt-1 text-sm text-text-secondary">Reference {selectedBooking.id}</p>
                      </div>
                      <div className="inline-flex items-center gap-2 rounded-pill bg-white/90 px-4 py-2 text-sm font-semibold text-text-primary ring-1 ring-border">
                        <span>{selectedBooking.status}</span>
                      </div>
                    </div>

                    <div className="mt-6 grid gap-6 lg:grid-cols-2">
                      <div className="space-y-4 rounded-[2rem] bg-[#F8FBFF] p-6">
                        <div>
                          <p className="text-xs uppercase tracking-[0.35em] text-text-secondary mb-2">Service</p>
                          <p className="text-sm text-text-primary">{selectedBooking.service}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.35em] text-text-secondary mb-2">Package</p>
                          <p className="text-sm text-text-primary">{(selectedBooking as any).package ?? '—'}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.35em] text-text-secondary mb-2">Parent</p>
                          <p className="text-sm text-text-primary">{(selectedBooking as any).parentName ?? '—'}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.35em] text-text-secondary mb-2">Phone</p>
                          <p className="text-sm text-text-primary" dir="ltr">{(selectedBooking as any).phone ?? '—'}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.35em] text-text-secondary mb-2">Age</p>
                          <p className="text-sm text-text-primary">{(selectedBooking as any).age ?? '—'}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.35em] text-text-secondary mb-2">Date</p>
                          <p className="text-sm text-text-primary">{selectedBooking.date}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.35em] text-text-secondary mb-2">Time</p>
                          <p className="text-sm text-text-primary">{selectedBooking.time}</p>
                        </div>
                      </div>
                      <div className="space-y-4 rounded-[2rem] bg-[#F8FBFF] p-6">
                        <div>
                          <p className="text-xs uppercase tracking-[0.35em] text-text-secondary mb-2">Notes</p>
                          <p className="text-sm text-text-primary">{(selectedBooking as any).notes ?? '—'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            {/* Empty state */}
            {view === 'bookings' && filteredBookings.length === 0 && (
              <div className="py-16 text-center">
                <AlertCircle size={40} className="text-gray-300 mx-auto mb-3" />
                <p className="text-text-secondary text-sm">No bookings found</p>
              </div>
            )}
            {view === 'messages' && filteredMessages.length === 0 && (
              <div className="py-16 text-center">
                <AlertCircle size={40} className="text-gray-300 mx-auto mb-3" />
                <p className="text-text-secondary text-sm">No messages found</p>
              </div>
            )}
          </div>

          {view === 'messages' && selectedMessage && (
            <div className="mt-6 rounded-card bg-white p-6 shadow-card">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-brand-blue font-semibold mb-2">
                    Message details
                  </p>
                  <h2 className="font-display text-2xl font-bold text-text-primary">
                    {selectedMessage.name}
                  </h2>
                  <p className="mt-1 text-sm text-text-secondary">Received {new Date(selectedMessage.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-pill bg-white/90 px-4 py-2 text-sm font-semibold text-text-primary ring-1 ring-border">
                  <span>{selectedMessage.reviewed ? 'Reviewed' : 'New'}</span>
                  <button
                    type="button"
                    onClick={() => markMessageReviewed(selectedMessage.id)}
                    className="rounded-pill bg-brand-blue px-3 py-1 text-xs font-semibold text-white hover:bg-brand-blue/90 transition-colors"
                  >
                    Mark reviewed
                  </button>
                </div>
              </div>

              <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <div className="space-y-4 rounded-[2rem] bg-[#F8FBFF] p-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-text-secondary mb-2">Email</p>
                    <p className="text-sm text-text-primary">{selectedMessage.email}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-text-secondary mb-2">Phone</p>
                    <p className="text-sm text-text-primary" dir="ltr">{selectedMessage.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-text-secondary mb-2">Service</p>
                    <p className="text-sm text-text-primary">{selectedMessage.service}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-text-secondary mb-2">Child Age</p>
                    <p className="text-sm text-text-primary">{selectedMessage.childAge}</p>
                  </div>
                </div>
                <div className="space-y-4 rounded-[2rem] bg-[#F8FBFF] p-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-text-secondary mb-2">Primary Concern</p>
                    <p className="text-sm text-text-primary">{selectedMessage.concern}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-text-secondary mb-2">Message</p>
                    <p className="text-sm text-text-primary leading-7">{selectedMessage.message}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
