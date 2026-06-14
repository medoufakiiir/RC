import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, CalendarCheck, MessageSquare, Settings2,
  Package, Users, Stethoscope, LogOut, Menu, X, ChevronRight, Bot,
} from 'lucide-react';

const NAV = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/bookings',  icon: CalendarCheck,   label: 'Bookings'  },
  { to: '/admin/messages',  icon: MessageSquare,   label: 'Messages'  },
  { to: '/admin/services',  icon: Stethoscope,     label: 'Services'  },
  { to: '/admin/packages',  icon: Package,         label: 'Packages'  },
  { to: '/admin/team',      icon: Users,           label: 'Team'      },
  { to: '/admin/chatbot',   icon: Bot,             label: 'Chatbot'   },
  { to: '/admin/settings',  icon: Settings2,       label: 'Settings'  },
];

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem('admin_token');
    navigate('/admin/login');
  }

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
