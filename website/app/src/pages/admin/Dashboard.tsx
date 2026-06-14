import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarCheck, MessageSquare, Clock, Mail } from 'lucide-react';
import { adminApi, type DashboardData } from '../../services/adminApi';

const STATUS_COLORS: Record<string, string> = {
  pending:   'bg-yellow-500/15 text-yellow-400',
  confirmed: 'bg-green-500/15 text-green-400',
  completed: 'bg-blue-500/15 text-blue-400',
  cancelled: 'bg-red-500/15 text-red-400',
};

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    adminApi.dashboard().then(setData).catch(e => setError(e.message));
  }, []);

  if (error) return <div className="text-red-400 text-sm">{error}</div>;
  if (!data) return <div className="text-white/40 text-sm">Loading…</div>;

  const { stats, recentBookings, recentMessages } = data;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-white">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Bookings',   value: stats.totalBookings,   icon: CalendarCheck, color: 'text-brand-blue',   bg: 'bg-brand-blue/10' },
          { label: 'Pending',          value: stats.pendingBookings, icon: Clock,          color: 'text-yellow-400',  bg: 'bg-yellow-400/10' },
          { label: 'Total Messages',   value: stats.totalMessages,   icon: MessageSquare, color: 'text-brand-green',  bg: 'bg-brand-green/10' },
          { label: 'Unread Messages',  value: stats.unreadMessages,  icon: Mail,           color: 'text-brand-pink',  bg: 'bg-brand-pink/10' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-[#0d1428] border border-white/8 rounded-xl p-4">
            <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center mb-3`}>
              <Icon size={18} className={color} />
            </div>
            <div className="text-2xl font-bold text-white">{value}</div>
            <div className="text-xs text-white/40 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="bg-[#0d1428] border border-white/8 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/8">
            <span className="text-sm font-medium text-white">Recent Bookings</span>
            <Link to="/admin/bookings" className="text-xs text-brand-blue hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-white/5">
            {recentBookings.length === 0 && <div className="px-4 py-6 text-sm text-white/30 text-center">No bookings yet</div>}
            {recentBookings.map(b => (
              <Link key={b.id} to={`/admin/bookings/${b.id}`} className="flex items-center justify-between px-4 py-3 hover:bg-white/3 transition-colors">
                <div>
                  <div className="text-sm font-medium text-white">{b.parentName}</div>
                  <div className="text-xs text-white/40">{b.ref} · {b.service}</div>
                </div>
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[b.status] ?? 'bg-white/10 text-white/50'}`}>{b.status}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Messages */}
        <div className="bg-[#0d1428] border border-white/8 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/8">
            <span className="text-sm font-medium text-white">Recent Messages</span>
            <Link to="/admin/messages" className="text-xs text-brand-blue hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-white/5">
            {recentMessages.length === 0 && <div className="px-4 py-6 text-sm text-white/30 text-center">No messages yet</div>}
            {recentMessages.map(m => (
              <Link key={m.id} to={`/admin/messages/${m.id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-white/3 transition-colors">
                {!m.isRead && <span className="w-1.5 h-1.5 rounded-full bg-brand-blue flex-shrink-0" />}
                <div className={`min-w-0 flex-1 ${m.isRead ? 'pl-3' : ''}`}>
                  <div className={`text-sm truncate ${m.isRead ? 'text-white/60' : 'text-white font-medium'}`}>{m.name}</div>
                  <div className="text-xs text-white/30 truncate">{m.message}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
