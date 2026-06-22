import { useEffect, useState, useRef, useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import type { EventClickArg, DatesSetArg, DateSelectArg, DateClickArg } from '@fullcalendar/core';
import {
  CalendarDays, ChevronLeft, ChevronRight, X, ExternalLink,
  Phone, Mail, Stethoscope, User, Clock, FileText, Link2, Unlink,
  RefreshCw, CircleDot, Ban, Trash2, Plus, Lock, Unlock,
} from 'lucide-react';
import { adminApi } from '../../services/adminApi';
import type { CalendarEvent, CalendarStatus, BlockedSlot } from '../../services/adminApi';

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

const BLOCK_TIMES = [
  '09:00', '09:45', '10:30', '11:15', '12:00', '13:00', '13:45', '14:30', '15:15',
];

export default function Calendar() {
  const calRef = useRef<FullCalendar>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [blocked, setBlocked] = useState<BlockedSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>('timeGridWeek');
  const [title, setTitle] = useState('');
  const [selected, setSelected] = useState<CalendarEvent['extendedProps'] | null>(null);
  const [calStatus, setCalStatus] = useState<CalendarStatus>({ connected: false, provider: null, lastSynced: null });
  const [syncing, setSyncing] = useState(false);
  const [showPanel, setShowPanel] = useState(true);
  const [blockForm, setBlockForm] = useState<{ date: string; time: string; reason: string } | null>(null);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [evts, blk] = await Promise.all([
        adminApi.calendarBookings(),
        adminApi.calendarBlocked(),
      ]);
      setEvents(evts);
      setBlocked(blk);
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  useEffect(() => {
    adminApi.calendarStatus().then(setCalStatus).catch(() => {});
    loadAll();
  }, [loadAll]);

  // Merge booking events + blocked slot events
  const allEvents = [
    ...events,
    ...blocked.map(b => ({
      id: `blocked-${b.id}`,
      title: b.time
        ? `🔒 ${b.reason || 'Blocked'} (${b.time})`
        : `🔒 ${b.reason || 'Full Day Blocked'}`,
      start: b.time ? `${b.date}T${b.time}:00` : b.date,
      end: b.time
        ? `${b.date}T${String(parseInt(b.time.split(':')[0]) + 1).padStart(2, '0')}:${b.time.split(':')[1] || '00'}:00`
        : undefined,
      allDay: !b.time,
      color: '#991b1b',
      textColor: '#fca5a5',
      extendedProps: { type: 'blocked', blockedId: b.id, reason: b.reason, date: b.date, time: b.time },
    })),
  ];

  function handleDatesSet(arg: DatesSetArg) { setTitle(arg.view.title); }

  // Month view: click a day → go to that day's view
  function handleDateClick(info: DateClickArg) {
    if (view === 'dayGridMonth') {
      setView('timeGridDay');
      const api = calRef.current?.getApi();
      if (api) {
        api.changeView('timeGridDay', info.dateStr);
      }
    }
  }

  function handleEventClick(info: EventClickArg) {
    const props = info.event.extendedProps;
    if (props.type === 'blocked') {
      if (confirm(`Remove block on ${props.date}${props.time ? ' at ' + props.time : ' (full day)'}?`)) {
        removeBlock(props.blockedId);
      }
      return;
    }
    setSelected(props as CalendarEvent['extendedProps']);
    setShowPanel(true);
  }

  // Drag-select a time range in week/day view to block it
  function handleDateSelect(info: DateSelectArg) {
    const dateStr = info.startStr.slice(0, 10);
    const timeStr = info.startStr.includes('T') ? info.startStr.slice(11, 16) : '';
    setBlockForm({ date: dateStr, time: timeStr, reason: '' });
    setShowPanel(true);
  }

  async function submitBlock() {
    if (!blockForm) return;
    try {
      await adminApi.calendarBlock(blockForm.date, blockForm.time || undefined, blockForm.reason || undefined);
      setBlockForm(null);
      await loadAll();
    } catch { alert('Failed to block slot'); }
  }

  async function quickBlockDay(date: string, reason?: string) {
    try {
      await adminApi.calendarBlock(date, undefined, reason || 'Closed');
      await loadAll();
    } catch { alert('Failed to block'); }
  }

  async function quickBlockTime(date: string, time: string, reason?: string) {
    try {
      await adminApi.calendarBlock(date, time, reason || 'External booking');
      await loadAll();
    } catch { alert('Failed to block'); }
  }

  async function removeBlock(id: string) {
    try {
      await adminApi.calendarUnblock(id);
      await loadAll();
    } catch { alert('Failed to unblock'); }
  }

  function changeView(v: View) { setView(v); calRef.current?.getApi().changeView(v); }
  function nav(dir: 'prev' | 'next' | 'today') {
    const api = calRef.current?.getApi();
    if (!api) return;
    if (dir === 'prev') api.prev(); else if (dir === 'next') api.next(); else api.today();
  }

  // Get current date from calendar API for the quick-block panel
  const currentDate = calRef.current?.getApi()?.getDate()?.toISOString().slice(0, 10)
    || new Date().toISOString().slice(0, 10);

  // Which times are already blocked for the current viewed date
  const blockedTimesForDate = new Set(
    blocked.filter(b => b.date === currentDate && b.time).map(b => b.time!)
  );
  const isDayBlocked = blocked.some(b => b.date === currentDate && !b.time);

  async function connectGoogle() {
    try { const { url } = await adminApi.calendarGoogleConnect(); window.location.href = url; }
    catch { alert('Google Calendar not configured.'); }
  }
  async function connectMs() {
    try { const { url } = await adminApi.calendarMsConnect(); window.location.href = url; }
    catch { alert('Outlook Calendar not configured.'); }
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
          <span className="text-sm text-white/40">{title}</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex bg-white/5 rounded-lg p-0.5">
            {VIEW_LABELS.map(v => (
              <button key={v.key} onClick={() => changeView(v.key)}
                className={`px-3 py-1.5 text-xs rounded-md transition ${view === v.key ? 'bg-brand-blue text-white' : 'text-white/50 hover:text-white'}`}>
                {v.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => nav('prev')} className="p-1.5 bg-white/5 rounded-lg text-white/50 hover:text-white hover:bg-white/10"><ChevronLeft size={16} /></button>
            <button onClick={() => nav('today')} className="px-3 py-1.5 bg-white/5 rounded-lg text-xs text-white/50 hover:text-white hover:bg-white/10">Today</button>
            <button onClick={() => nav('next')} className="p-1.5 bg-white/5 rounded-lg text-white/50 hover:text-white hover:bg-white/10"><ChevronRight size={16} /></button>
          </div>
          <button onClick={() => setShowPanel(p => !p)}
            className={`px-3 py-1.5 border rounded-lg text-xs transition ${showPanel ? 'bg-brand-blue/10 border-brand-blue/30 text-brand-blue' : 'bg-white/5 border-white/10 text-white/50 hover:text-white'}`}>
            <Lock size={14} className="inline mr-1" /> Manage Slots
          </button>
        </div>
      </div>

      <div className="flex gap-4 flex-1 min-h-0">
        {/* Calendar */}
        <div className="flex-1 min-w-0 bg-[#0d1428] border border-white/8 rounded-xl p-3 overflow-hidden riyada-calendar">
          {loading ? (
            <div className="flex items-center justify-center h-full text-white/30 text-sm">Loading calendar…</div>
          ) : (
            <FullCalendar
              ref={calRef}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
              initialView={view}
              headerToolbar={false}
              events={allEvents}
              eventClick={handleEventClick}
              dateClick={handleDateClick}
              datesSet={handleDatesSet}
              selectable={view !== 'dayGridMonth'}
              select={handleDateSelect}
              height="100%"
              slotMinTime="08:00:00"
              slotMaxTime="18:00:00"
              allDaySlot={false}
              nowIndicator
              businessHours={{ daysOfWeek: [0, 1, 2, 3, 4], startTime: '09:00', endTime: '16:00' }}
              eventTimeFormat={{ hour: '2-digit', minute: '2-digit', hour12: true }}
              slotLabelFormat={{ hour: '2-digit', minute: '2-digit', hour12: true }}
              dayMaxEventRows={4}
              eventDisplay="block"
              weekends
              hiddenDays={[5, 6]}
              navLinks
              navLinkDayClick={(date) => {
                setView('timeGridDay');
                calRef.current?.getApi().changeView('timeGridDay', date.toISOString());
              }}
            />
          )}
        </div>

        {/* Side panel */}
        {showPanel && (
          <div className="w-80 shrink-0 space-y-3 overflow-y-auto">

            {/* Booking detail */}
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

            {/* Quick block — block whole day or specific time */}
            <div className="bg-[#0d1428] border border-red-500/20 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-white flex items-center gap-1.5"><Ban size={14} className="text-red-400" /> Block / Unblock Slots</span>
              </div>

              {/* Date picker */}
              <div>
                <label className="text-[10px] text-white/40 mb-1 block">Select date</label>
                <input type="date" value={blockForm?.date || currentDate}
                  onChange={e => {
                    const d = e.target.value;
                    setBlockForm(prev => prev ? { ...prev, date: d } : { date: d, time: '', reason: '' });
                    // Also navigate calendar to this date
                    const api = calRef.current?.getApi();
                    if (api) api.gotoDate(d);
                  }}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white" />
              </div>

              {/* Block full day button */}
              <div className="flex gap-2">
                {isDayBlocked ? (
                  <button onClick={() => {
                    const slot = blocked.find(b => b.date === currentDate && !b.time);
                    if (slot) removeBlock(slot.id);
                  }}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-green-500/15 text-green-400 text-xs rounded-lg hover:bg-green-500/25 transition">
                    <Unlock size={13} /> Open This Day
                  </button>
                ) : (
                  <button onClick={() => quickBlockDay(blockForm?.date || currentDate)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-red-500/15 text-red-400 text-xs rounded-lg hover:bg-red-500/25 transition">
                    <Lock size={13} /> Close Full Day
                  </button>
                )}
              </div>

              {/* Individual time slots */}
              <div>
                <label className="text-[10px] text-white/40 mb-1.5 block">Time slots — click to block/unblock</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {BLOCK_TIMES.map(time => {
                    const isBlocked = blockedTimesForDate.has(time);
                    const blockedSlot = blocked.find(b => b.date === (blockForm?.date || currentDate) && b.time === time);
                    return (
                      <button key={time}
                        onClick={() => {
                          if (isBlocked && blockedSlot) removeBlock(blockedSlot.id);
                          else quickBlockTime(blockForm?.date || currentDate, time);
                        }}
                        className={`py-1.5 rounded-lg text-[11px] font-medium transition ${
                          isBlocked
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : 'bg-white/5 text-white/50 border border-white/8 hover:border-red-500/30 hover:text-red-400'
                        }`} dir="ltr">
                        {isBlocked ? '🔒 ' : ''}{time}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom block form */}
              {blockForm && (
                <div className="border-t border-white/5 pt-3 space-y-2">
                  <div className="text-[10px] text-white/40">Custom block</div>
                  <div className="flex gap-2">
                    <input type="time" value={blockForm.time} onChange={e => setBlockForm({ ...blockForm, time: e.target.value })}
                      className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white" />
                    <input type="text" value={blockForm.reason} onChange={e => setBlockForm({ ...blockForm, reason: e.target.value })}
                      placeholder="Reason" className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white placeholder-white/20" />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={submitBlock} className="flex-1 px-3 py-1.5 bg-red-500/20 text-red-400 text-xs rounded-lg hover:bg-red-500/30">Block</button>
                    <button onClick={() => setBlockForm(null)} className="px-3 py-1.5 bg-white/5 text-white/40 text-xs rounded-lg hover:bg-white/10">Cancel</button>
                  </div>
                </div>
              )}
            </div>

            {/* Blocked slots list */}
            {blocked.length > 0 && (
              <div className="bg-[#0d1428] border border-white/8 rounded-xl p-4">
                <div className="text-xs text-white/40 mb-2">All Blocked Slots ({blocked.length})</div>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {blocked.map(b => (
                    <div key={b.id} className="flex items-center justify-between text-[11px] bg-red-500/5 border border-red-500/10 rounded-lg px-2.5 py-1.5">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Lock size={10} className="text-red-400 shrink-0" />
                        <span className="text-white/70">{b.date}</span>
                        {b.time ? <span className="text-red-400/70" dir="ltr">{b.time}</span> : <span className="text-red-400/70">All day</span>}
                        {b.reason && <span className="text-white/25 truncate">· {b.reason}</span>}
                      </div>
                      <button onClick={() => removeBlock(b.id)} className="text-green-400/50 hover:text-green-400 shrink-0 ml-2" title="Unblock">
                        <Unlock size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Connected calendars */}
            <div className="bg-[#0d1428] border border-white/8 rounded-xl p-4 space-y-3">
              <span className="text-xs text-white/40">Connected Calendars</span>
              <CalendarProvider name="Google Calendar" icon="https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg"
                connected={calStatus.connected && calStatus.provider === 'google'} lastSynced={calStatus.provider === 'google' ? calStatus.lastSynced : null}
                onConnect={connectGoogle} onSync={sync} onDisconnect={disconnect} syncing={syncing} />
              <CalendarProvider name="Outlook Calendar" icon="https://upload.wikimedia.org/wikipedia/commons/d/df/Microsoft_Office_Outlook_%282018%E2%80%93present%29.svg"
                connected={calStatus.connected && calStatus.provider === 'microsoft'} lastSynced={calStatus.provider === 'microsoft' ? calStatus.lastSynced : null}
                onConnect={connectMs} onSync={sync} onDisconnect={disconnect} syncing={syncing} />
            </div>

            {/* Legend */}
            <div className="bg-[#0d1428] border border-white/8 rounded-xl p-3">
              <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                {Object.entries(STATUS_COLORS).map(([key, v]) => (
                  <div key={key} className="flex items-center gap-1.5"><CircleDot size={8} className={v.text} /><span className="text-white/50">{v.label}</span></div>
                ))}
                <div className="flex items-center gap-1.5"><Lock size={8} className="text-red-400" /><span className="text-white/50">Blocked</span></div>
              </div>
              <div className="mt-2 pt-2 border-t border-white/5 text-[10px] text-white/20">
                Sun–Thu · 9 AM – 4 PM · Click month day → day view · Drag to block in week/day view
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
      <div><div className="text-[10px] text-white/30">{label}</div><div className="text-xs text-white/80">{value}</div></div>
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
        <img src={icon} alt="" className="w-4 h-4" />
        <span className="text-[11px] text-white font-medium flex-1">{name}</span>
        <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${connected ? 'bg-green-500/15 text-green-400' : 'bg-white/10 text-white/30'}`}>
          {connected ? 'Connected' : 'Not connected'}
        </span>
      </div>
      {connected ? (
        <div className="space-y-1.5">
          {lastSynced && <div className="text-[9px] text-white/30">Last synced: {new Date(lastSynced).toLocaleString()}</div>}
          <div className="flex gap-1.5">
            <button onClick={onSync} disabled={syncing} className="flex-1 flex items-center justify-center gap-1 px-2 py-1 bg-brand-blue text-white text-[10px] rounded-lg disabled:opacity-50">
              <RefreshCw size={10} className={syncing ? 'animate-spin' : ''} />{syncing ? 'Syncing…' : 'Sync'}
            </button>
            <button onClick={onDisconnect} className="flex items-center gap-1 px-2 py-1 bg-red-500/10 text-red-400 text-[10px] rounded-lg hover:bg-red-500/20">
              <Unlink size={10} />
            </button>
          </div>
        </div>
      ) : (
        <button onClick={onConnect} className="w-full flex items-center justify-center gap-1 px-2 py-1.5 bg-white/5 text-white/60 text-[10px] rounded-lg hover:bg-white/10 hover:text-white transition">
          <Link2 size={10} /> Connect
        </button>
      )}
    </div>
  );
}
