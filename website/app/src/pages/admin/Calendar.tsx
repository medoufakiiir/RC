import { useEffect, useState, useRef, useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import type { EventClickArg, DatesSetArg } from '@fullcalendar/core';
import {
  CalendarDays, ChevronLeft, ChevronRight, X, ExternalLink,
  Phone, Mail, Stethoscope, User, Clock, FileText, Link2, Unlink,
  RefreshCw, CircleDot,
} from 'lucide-react';
import { adminApi } from '../../services/adminApi';
import type { CalendarEvent, CalendarStatus } from '../../services/adminApi';

type View = 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listWeek';

const VIEW_LABELS: { key: View; label: string }[] = [
  { key: 'dayGridMonth', label: 'Month' },
  { key: 'timeGridWeek', label: 'Week' },
  { key: 'timeGridDay', label: 'Day' },
  { key: 'listWeek', label: 'List' },
];

const STATUS_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  confirmed: { bg: 'bg-green-500/15', text: 'text-green-400', label: 'Confirmed' },
  pending: { bg: 'bg-amber-500/15', text: 'text-amber-400', label: 'Pending' },
  cancelled: { bg: 'bg-red-500/15', text: 'text-red-400', label: 'Cancelled' },
  completed: { bg: 'bg-brand-blue/15', text: 'text-brand-blue', label: 'Completed' },
};

export default function Calendar() {
  const calRef = useRef<FullCalendar>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>('timeGridWeek');
  const [title, setTitle] = useState('');
  const [selected, setSelected] = useState<CalendarEvent['extendedProps'] | null>(null);
  const [calStatus, setCalStatus] = useState<CalendarStatus>({ connected: false, provider: null, lastSynced: null });
  const [syncing, setSyncing] = useState(false);
  const [showPanel, setShowPanel] = useState(false);

  const loadEvents = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminApi.calendarBookings('', '');
      setEvents(data);
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  useEffect(() => {
    adminApi.calendarStatus().then(setCalStatus).catch(() => {});
    loadEvents();
  }, [loadEvents]);

  function handleDatesSet(arg: DatesSetArg) {
    setTitle(arg.view.title);
  }

  function handleEventClick(info: EventClickArg) {
    setSelected(info.event.extendedProps as CalendarEvent['extendedProps']);
  }

  function changeView(v: View) {
    setView(v);
    calRef.current?.getApi().changeView(v);
  }

  function nav(dir: 'prev' | 'next' | 'today') {
    const api = calRef.current?.getApi();
    if (!api) return;
    if (dir === 'prev') api.prev();
    else if (dir === 'next') api.next();
    else api.today();
  }

  async function connectGoogle() {
    try {
      const { url } = await adminApi.calendarGoogleConnect();
      window.location.href = url;
    } catch { alert('Google Calendar is not configured on the server.'); }
  }

  async function connectMs() {
    try {
      const { url } = await adminApi.calendarMsConnect();
      window.location.href = url;
    } catch { alert('Outlook Calendar is not configured on the server.'); }
  }

  async function sync() {
    setSyncing(true);
    try {
      const fn = calStatus.provider === 'google' ? adminApi.calendarGoogleSync : adminApi.calendarMsSync;
      const res = await fn();
      alert(`Synced ${res.synced} bookings`);
      setCalStatus(prev => ({ ...prev, lastSynced: new Date().toISOString() }));
    } catch { alert('Sync failed'); }
    setSyncing(false);
  }

  async function disconnect() {
    if (!confirm('Disconnect calendar?')) return;
    try {
      if (calStatus.provider === 'google') await adminApi.calendarGoogleDisconnect();
      else await adminApi.calendarMsDisconnect();
      setCalStatus({ connected: false, provider: null, lastSynced: null });
    } catch { alert('Failed to disconnect'); }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] gap-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <CalendarDays size={22} className="text-brand-blue" />
          <h1 className="text-xl font-semibold text-white">Calendar</h1>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* View switcher */}
          <div className="flex bg-white/5 rounded-lg p-0.5">
            {VIEW_LABELS.map(v => (
              <button key={v.key} onClick={() => changeView(v.key)}
                className={`px-3 py-1.5 text-xs rounded-md transition ${view === v.key ? 'bg-brand-blue text-white' : 'text-white/50 hover:text-white'}`}>
                {v.label}
              </button>
            ))}
          </div>

          {/* Nav */}
          <div className="flex items-center gap-1">
            <button onClick={() => nav('prev')} className="p-1.5 bg-white/5 rounded-lg text-white/50 hover:text-white hover:bg-white/10"><ChevronLeft size={16} /></button>
            <button onClick={() => nav('today')} className="px-3 py-1.5 bg-white/5 rounded-lg text-xs text-white/50 hover:text-white hover:bg-white/10">Today</button>
            <button onClick={() => nav('next')} className="p-1.5 bg-white/5 rounded-lg text-white/50 hover:text-white hover:bg-white/10"><ChevronRight size={16} /></button>
          </div>

          <span className="text-sm text-white/60 min-w-[120px]">{title}</span>

          <button onClick={() => setShowPanel(p => !p)}
            className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-white/50 hover:text-white transition">
            <Link2 size={14} className="inline mr-1" />
            {calStatus.connected ? calStatus.provider === 'google' ? 'Google' : 'Outlook' : 'Connect'}
          </button>
        </div>
      </div>

      <div className="flex gap-4 flex-1 min-h-0">
        {/* Calendar */}
        <div className="flex-1 min-w-0 bg-[#0d1428] border border-white/8 rounded-xl p-3 overflow-hidden riyada-calendar">
          {loading && events.length === 0 ? (
            <div className="flex items-center justify-center h-full text-white/30 text-sm">Loading calendar…</div>
          ) : (
            <FullCalendar
              ref={calRef}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
              initialView={view}
              headerToolbar={false}
              events={events}
              eventClick={handleEventClick}
              datesSet={handleDatesSet}
              height="100%"
              slotMinTime="07:00:00"
              slotMaxTime="21:00:00"
              allDaySlot={false}
              nowIndicator
              businessHours={{ daysOfWeek: [0, 1, 2, 3, 4], startTime: '08:00', endTime: '18:00' }}
              eventTimeFormat={{ hour: '2-digit', minute: '2-digit', hour12: true }}
              slotLabelFormat={{ hour: '2-digit', minute: '2-digit', hour12: true }}
              dayMaxEventRows={4}
              eventDisplay="block"
            />
          )}
        </div>

        {/* Side panel — Connected calendars + booking detail */}
        {(showPanel || selected) && (
          <div className="w-80 shrink-0 space-y-3 overflow-y-auto">
            {/* Booking detail modal */}
            {selected && (
              <div className="bg-[#0d1428] border border-white/8 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white">Booking Detail</span>
                  <button onClick={() => setSelected(null)} className="text-white/30 hover:text-white"><X size={16} /></button>
                </div>
                <div className="space-y-2.5">
                  <Row icon={User} label="Parent" value={selected.parentName} />
                  <Row icon={User} label="Child" value={`${selected.childName} (${selected.childAge})`} />
                  <Row icon={Phone} label="Phone" value={selected.phone} />
                  {selected.email && <Row icon={Mail} label="Email" value={selected.email} />}
                  <Row icon={Stethoscope} label="Service" value={selected.service} />
                  <Row icon={Clock} label="Ref" value={selected.ref} />
                  {selected.notes && <Row icon={FileText} label="Notes" value={selected.notes} />}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white/40">Status</span>
                    <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[selected.status]?.bg || 'bg-white/10'} ${STATUS_COLORS[selected.status]?.text || 'text-white/50'}`}>
                      {STATUS_COLORS[selected.status]?.label || selected.status}
                    </span>
                  </div>
                </div>
                <a href={`/admin/bookings/${selected.bookingId}`}
                  className="flex items-center justify-center gap-1.5 w-full px-3 py-2 bg-brand-blue text-white text-xs rounded-lg hover:bg-brand-blue/90 transition">
                  <ExternalLink size={13} /> View Full Booking
                </a>
              </div>
            )}

            {/* Connected calendars panel */}
            {showPanel && (
              <div className="bg-[#0d1428] border border-white/8 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white">Connected Calendars</span>
                  <button onClick={() => setShowPanel(false)} className="text-white/30 hover:text-white"><X size={16} /></button>
                </div>

                {/* Google */}
                <CalendarProvider
                  name="Google Calendar"
                  icon="https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg"
                  connected={calStatus.connected && calStatus.provider === 'google'}
                  lastSynced={calStatus.provider === 'google' ? calStatus.lastSynced : null}
                  onConnect={connectGoogle}
                  onSync={sync}
                  onDisconnect={disconnect}
                  syncing={syncing}
                />

                {/* Microsoft */}
                <CalendarProvider
                  name="Outlook Calendar"
                  icon="https://upload.wikimedia.org/wikipedia/commons/d/df/Microsoft_Office_Outlook_%282018%E2%80%93present%29.svg"
                  connected={calStatus.connected && calStatus.provider === 'microsoft'}
                  lastSynced={calStatus.provider === 'microsoft' ? calStatus.lastSynced : null}
                  onConnect={connectMs}
                  onSync={sync}
                  onDisconnect={disconnect}
                  syncing={syncing}
                />
              </div>
            )}

            {/* Legend */}
            <div className="bg-[#0d1428] border border-white/8 rounded-xl p-4">
              <div className="text-xs text-white/40 mb-2">Legend</div>
              <div className="grid grid-cols-2 gap-1.5">
                {Object.entries(STATUS_COLORS).map(([key, v]) => (
                  <div key={key} className="flex items-center gap-1.5">
                    <CircleDot size={10} className={v.text} />
                    <span className="text-[11px] text-white/60">{v.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ icon: Icon, label, value }: { icon: typeof User; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <Icon size={13} className="text-white/30 mt-0.5 shrink-0" />
      <div>
        <div className="text-[10px] text-white/30">{label}</div>
        <div className="text-xs text-white/80">{value}</div>
      </div>
    </div>
  );
}

function CalendarProvider({ name, icon, connected, lastSynced, onConnect, onSync, onDisconnect, syncing }: {
  name: string; icon: string; connected: boolean; lastSynced: string | null;
  onConnect: () => void; onSync: () => void; onDisconnect: () => void; syncing: boolean;
}) {
  return (
    <div className={`border rounded-lg p-3 ${connected ? 'border-green-500/30 bg-green-500/5' : 'border-white/8'}`}>
      <div className="flex items-center gap-2 mb-2">
        <img src={icon} alt="" className="w-5 h-5" />
        <span className="text-xs text-white font-medium flex-1">{name}</span>
        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${connected ? 'bg-green-500/15 text-green-400' : 'bg-white/10 text-white/30'}`}>
          {connected ? 'Connected' : 'Not connected'}
        </span>
      </div>
      {connected ? (
        <div className="space-y-2">
          {lastSynced && <div className="text-[10px] text-white/30">Last synced: {new Date(lastSynced).toLocaleString()}</div>}
          <div className="flex gap-2">
            <button onClick={onSync} disabled={syncing}
              className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-brand-blue text-white text-[11px] rounded-lg disabled:opacity-50">
              <RefreshCw size={11} className={syncing ? 'animate-spin' : ''} />
              {syncing ? 'Syncing…' : 'Sync Now'}
            </button>
            <button onClick={onDisconnect}
              className="flex items-center gap-1 px-2 py-1.5 bg-red-500/10 text-red-400 text-[11px] rounded-lg hover:bg-red-500/20">
              <Unlink size={11} /> Disconnect
            </button>
          </div>
        </div>
      ) : (
        <button onClick={onConnect}
          className="w-full flex items-center justify-center gap-1 px-2 py-1.5 bg-white/5 text-white/60 text-[11px] rounded-lg hover:bg-white/10 hover:text-white transition">
          <Link2 size={11} /> Connect
        </button>
      )}
    </div>
  );
}
