import { useEffect, useState } from 'react';
import {
  BarChart3, TrendingUp, Users, MessageSquare, Bot, CalendarCheck,
  ArrowUpRight, ArrowDownRight, Minus,
} from 'lucide-react';
import { adminApi } from '../../services/adminApi';
import type { AnalyticsData } from '../../services/adminApi';

function StatCard({ icon: Icon, label, value, sub, color, trend }: {
  icon: typeof BarChart3; label: string; value: string | number; sub?: string;
  color: string; trend?: 'up' | 'down' | 'flat';
}) {
  return (
    <div className="bg-[#0d1428] border border-white/8 rounded-xl p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-9 h-9 rounded-lg ${color} flex items-center justify-center`}>
          <Icon size={17} className="text-white" />
        </div>
        <span className="text-xs text-white/40">{label}</span>
        {trend && (
          <div className="ml-auto">
            {trend === 'up' && <ArrowUpRight size={14} className="text-green-400" />}
            {trend === 'down' && <ArrowDownRight size={14} className="text-red-400" />}
            {trend === 'flat' && <Minus size={14} className="text-white/30" />}
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
      {sub && <div className="text-xs text-white/30 mt-1">{sub}</div>}
    </div>
  );
}

function MiniBar({ data, color }: { data: { week: string; count: number }[]; color: string }) {
  const max = Math.max(...data.map(d => d.count), 1);
  return (
    <div className="flex items-end gap-1 h-16">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div
            className={`w-full rounded-sm ${color} transition-all`}
            style={{ height: `${Math.max((d.count / max) * 100, 4)}%` }}
            title={`${d.week}: ${d.count}`}
          />
        </div>
      ))}
    </div>
  );
}

export default function Analytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.analytics()
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-white/40 text-sm">Loading analytics…</div>;
  if (!data) return <div className="text-red-400 text-sm">Failed to load analytics</div>;

  const { overview: o, trends, topServices, statusBreakdown, chatLanguages } = data;

  const totalStatus = (statusBreakdown.pending || 0) + (statusBreakdown.confirmed || 0) + (statusBreakdown.cancelled || 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <BarChart3 size={22} className="text-brand-blue" />
        <h1 className="text-xl font-semibold text-white">Analytics & Insights</h1>
      </div>

      {/* Overview cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={CalendarCheck} label="Total Bookings" value={o.totalBookings}
          sub={`${o.weekBookings} this week · ${o.monthBookings} this month`}
          color="bg-brand-blue/20" trend={o.weekBookings > 0 ? 'up' : 'flat'} />
        <StatCard icon={MessageSquare} label="Total Messages" value={o.totalMessages}
          sub={`${o.unreadMessages} unread · ${o.weekMessages} this week`}
          color="bg-purple-500/20" trend={o.weekMessages > 0 ? 'up' : 'flat'} />
        <StatCard icon={Bot} label="Chatbot Sessions" value={o.totalChatSessions}
          sub={`${o.weekChatSessions} this week · ${o.monthChatSessions} this month`}
          color="bg-green-500/20" trend={o.weekChatSessions > 0 ? 'up' : 'flat'} />
        <StatCard icon={TrendingUp} label="Conversion Rate" value={`${o.conversionRate}%`}
          sub={`${o.totalChatAppointments} appointments from ${o.totalChatSessions} sessions`}
          color="bg-orange-500/20" />
      </div>

      {/* Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-[#0d1428] border border-white/8 rounded-xl p-4">
          <div className="text-sm text-white/60 mb-3">Bookings (12 weeks)</div>
          <MiniBar data={trends.bookingsByWeek} color="bg-brand-blue" />
          <div className="flex justify-between text-[10px] text-white/20 mt-2">
            <span>{trends.bookingsByWeek[0]?.week}</span>
            <span>Now</span>
          </div>
        </div>
        <div className="bg-[#0d1428] border border-white/8 rounded-xl p-4">
          <div className="text-sm text-white/60 mb-3">Messages (12 weeks)</div>
          <MiniBar data={trends.messagesByWeek} color="bg-purple-500" />
          <div className="flex justify-between text-[10px] text-white/20 mt-2">
            <span>{trends.messagesByWeek[0]?.week}</span>
            <span>Now</span>
          </div>
        </div>
        <div className="bg-[#0d1428] border border-white/8 rounded-xl p-4">
          <div className="text-sm text-white/60 mb-3">Chat Sessions (12 weeks)</div>
          <MiniBar data={trends.chatSessionsByWeek} color="bg-green-500" />
          <div className="flex justify-between text-[10px] text-white/20 mt-2">
            <span>{trends.chatSessionsByWeek[0]?.week}</span>
            <span>Now</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Top Services */}
        <div className="bg-[#0d1428] border border-white/8 rounded-xl p-4 lg:col-span-1">
          <div className="text-sm text-white/60 mb-3">Top Services (by bookings)</div>
          {topServices.length === 0 && <div className="text-xs text-white/20">No data yet</div>}
          <div className="space-y-2">
            {topServices.map((s, i) => {
              const pct = topServices[0] ? (s.count / topServices[0].count) * 100 : 0;
              return (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white/70 truncate mr-2">{s.name}</span>
                    <span className="text-white/40 shrink-0">{s.count}</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-blue rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Booking Status Breakdown */}
        <div className="bg-[#0d1428] border border-white/8 rounded-xl p-4">
          <div className="text-sm text-white/60 mb-3">Booking Status</div>
          <div className="space-y-3">
            {[
              { label: 'Pending', key: 'pending', color: 'bg-yellow-500', text: 'text-yellow-400' },
              { label: 'Confirmed', key: 'confirmed', color: 'bg-green-500', text: 'text-green-400' },
              { label: 'Cancelled', key: 'cancelled', color: 'bg-red-500', text: 'text-red-400' },
            ].map(s => {
              const count = statusBreakdown[s.key] || 0;
              const pct = totalStatus > 0 ? ((count / totalStatus) * 100).toFixed(1) : '0';
              return (
                <div key={s.key}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className={s.text}>{s.label}</span>
                    <span className="text-white/40">{count} ({pct}%)</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full ${s.color} rounded-full`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chatbot Languages */}
        <div className="bg-[#0d1428] border border-white/8 rounded-xl p-4">
          <div className="text-sm text-white/60 mb-3">Chatbot Languages</div>
          {Object.keys(chatLanguages).length === 0 && <div className="text-xs text-white/20">No data yet</div>}
          <div className="space-y-3">
            {Object.entries(chatLanguages)
              .sort((a, b) => b[1] - a[1])
              .map(([lang, count]) => {
                const total = Object.values(chatLanguages).reduce((a, b) => a + b, 0);
                const pct = total > 0 ? ((count / total) * 100).toFixed(1) : '0';
                const label = lang === 'ar' ? 'Arabic' : lang === 'en' ? 'English' : lang;
                return (
                  <div key={lang}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-white/70">{label}</span>
                      <span className="text-white/40">{count} ({pct}%)</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* Marketing KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={Users} label="Pending Bookings" value={o.pendingBookings}
          sub="Awaiting confirmation" color="bg-yellow-500/20" />
        <StatCard icon={Users} label="Confirmed Bookings" value={o.confirmedBookings}
          sub={`${totalStatus > 0 ? ((o.confirmedBookings / totalStatus) * 100).toFixed(0) : 0}% confirmation rate`}
          color="bg-green-500/20" />
        <StatCard icon={Bot} label="Chatbot Appointments" value={o.totalChatAppointments}
          sub={`${o.pendingChatAppts} pending`} color="bg-brand-blue/20" />
        <StatCard icon={MessageSquare} label="Month Messages" value={o.monthMessages}
          sub={`${o.weekMessages} this week`} color="bg-purple-500/20" />
      </div>
    </div>
  );
}
