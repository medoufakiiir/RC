import { useState, useEffect, useRef } from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard, CalendarCheck, MessageSquare, Settings2,
  Users, Stethoscope, LogOut, Menu, X, ChevronRight, Bot, Bell,
} from 'lucide-react';
import { adminApi } from '../../services/adminApi';

const NAV = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/bookings',  icon: CalendarCheck,   label: 'Bookings'  },
  { to: '/admin/messages',  icon: MessageSquare,   label: 'Messages'  },
  { to: '/admin/services',  icon: Stethoscope,     label: 'Services'  },
  { to: '/admin/team',      icon: Users,           label: 'Team'      },
  { to: '/admin/chatbot',   icon: Bot,             label: 'Chatbot'   },
  { to: '/admin/settings',  icon: Settings2,       label: 'Settings'  },
];

const IDLE_MS = 10 * 60 * 1000;

export default function AdminLayout() {
  const [open,      setOpen]      = useState(false);
  const [notif,     setNotif]     = useState({ messages: 0, bookings: 0 });
  const [notifOpen, setNotifOpen] = useState(false);
  const navigate  = useNavigate();
  const timerRef  = useRef<ReturnType<typeof setTimeout>>();
  const notifRef  = useRef<HTMLDivElement>(null);

  // 10-minute auto-logout on idle
  useEffect(() => {
    function doLogout() {
      localStorage.removeItem('admin_token');
      navigate('/admin/login');
    }
    function reset() {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(doLogout, IDLE_MS);
    }
    reset();
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'] as const;
    events.forEach(e => window.addEventListener(e, reset, { passive: true }));
    return () => {
      clearTimeout(timerRef.current);
      events.forEach(e => window.removeEventListener(e, reset));
    };
  }, [navigate]);

  // Poll dashboard every 60s for notification counts
  useEffect(() => {
    async function poll() {
      try {
        const data = await adminApi.dashboard();
        setNotif({ messages: data.stats.unreadMessages, bookings: data.stats.pendingBookings });
      } catch { /* silently ignore — token may not be ready yet */ }
    }
    poll();
    const iv = setInterval(poll, 60_000);
    return () => clearInterval(iv);
  }, []);

  // Close notification dropdown when clicking outside
  useEffect(() => {
    function onOutsideClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    if (notifOpen) document.addEventListener('mousedown', onOutsideClick);
    return () => document.removeEventListener('mousedown', onOutsideClick);
  }, [notifOpen]);

  function logout() {
    localStorage.removeItem('admin_token');
    navigate('/admin/login');
  }

  const totalNotif = notif.messages + notif.bookings;

  return (
    <div className="min-h-screen flex bg-[#0a0f1e] text-white" dir="ltr">
      {/* Mobile overlay */}
      {open && <div className="fixed inset-0 bg-black/60 z-30 lg:hidden" onClick={() => setOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0d1428] border-r border-white/8 flex flex-col transition-transform lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-white/8">
          <div className="w-9 h-9 rounded-xl bg-white overflow-hidden flex items-center justify-center shrink-0 mr-3">
            <img src="/logo/Riyada%20Center%20Logo%20Souce-01.png" alt="Riyada Center" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="font-semibold text-sm text-white leading-none">Riyada Admin</div>
            <div className="text-[11px] text-white/40 mt-0.5">Control Panel</div>
          </div>
          <button className="ml-auto lg:hidden text-white/40 hover:text-white" onClick={() => setOpen(false)}><X size={18} /></button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${isActive ? 'bg-brand-blue text-white font-medium' : 'text-white/60 hover:text-white hover:bg-white/5'}`
              }
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-white/8">
          <button onClick={logout} className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors">
            <LogOut size={17} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col lg:ml-64 min-w-0">
        {/* Topbar */}
        <header className="h-16 bg-[#0d1428] border-b border-white/8 flex items-center px-4 lg:px-6 gap-3 sticky top-0 z-20">
          <button className="lg:hidden text-white/60 hover:text-white" onClick={() => setOpen(true)}><Menu size={20} /></button>
          <ChevronRight size={14} className="text-white/20 hidden lg:block" />
          <div className="flex-1" />

          {/* Notification bell */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotifOpen(o => !o)}
              className="relative p-1.5 text-white/60 hover:text-white transition"
              aria-label="Notifications"
            >
              <Bell size={18} />
              {totalNotif > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-brand-pink rounded-full text-[9px] text-white flex items-center justify-center font-bold px-0.5">
                  {totalNotif > 99 ? '99+' : totalNotif}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-[#0d1428] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-white/8">
                  <span className="text-xs font-medium text-white">Notifications</span>
                </div>

                {totalNotif === 0 ? (
                  <div className="px-4 py-6 text-center text-xs text-white/30">All caught up!</div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {notif.bookings > 0 && (
                      <Link
                        to="/admin/bookings"
                        onClick={() => setNotifOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-white/3 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-full bg-yellow-500/15 flex items-center justify-center flex-shrink-0">
                          <CalendarCheck size={15} className="text-yellow-400" />
                        </div>
                        <div>
                          <div className="text-sm text-white font-medium">
                            {notif.bookings} pending booking{notif.bookings !== 1 ? 's' : ''}
                          </div>
                          <div className="text-xs text-white/40">Awaiting confirmation</div>
                        </div>
                      </Link>
                    )}
                    {notif.messages > 0 && (
                      <Link
                        to="/admin/messages"
                        onClick={() => setNotifOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-white/3 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-full bg-brand-blue/15 flex items-center justify-center flex-shrink-0">
                          <MessageSquare size={15} className="text-brand-blue" />
                        </div>
                        <div>
                          <div className="text-sm text-white font-medium">
                            {notif.messages} unread message{notif.messages !== 1 ? 's' : ''}
                          </div>
                          <div className="text-xs text-white/40">Need your attention</div>
                        </div>
                      </Link>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="text-xs text-white/40">admin@riyada.com</div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
