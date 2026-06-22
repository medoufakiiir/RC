import { useState, useEffect, useCallback } from 'react';

const BASE = import.meta.env.VITE_API_URL ?? 'https://riyada-medical-backend-production.up.railway.app';

function authHeaders() {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('admin_token') ?? ''}` };
}

interface Stats {
  totalSessions: number;
  totalMessages: number;
  totalAppointments: number;
  pendingAppointments: number;
  todaySessions: number;
  weekSessions: number;
  confirmedAppointments: number;
}

interface Session {
  id: string;
  sessionId: string;
  language: string;
  pageUrl: string;
  status: string;
  startedAt: string;
  _count?: { messages: number };
}

interface Message {
  id: string;
  role: string;
  content: string;
  createdAt: string;
}

interface Appointment {
  id: string;
  parentName: string;
  childName: string;
  childAge: string;
  service: string;
  phone: string;
  preferredTime?: string;
  notes?: string;
  language: string;
  status: string;
  createdAt: string;
}

const STATUS_BADGE: Record<string, { bg: string; color: string }> = {
  pending:   { bg: 'rgba(234,179,8,0.15)',   color: '#FBBF24' },
  confirmed: { bg: 'rgba(34,197,94,0.15)',   color: '#4ADE80' },
  cancelled: { bg: 'rgba(239,68,68,0.15)',   color: '#F87171' },
  active:    { bg: 'rgba(51,85,238,0.15)',   color: '#60A5FA' },
  closed:    { bg: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' },
};

function Badge({ status }: { status: string }) {
  const s = STATUS_BADGE[status] ?? STATUS_BADGE.closed;
  return (
    <span style={{ padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 500, background: s.bg, color: s.color }}>
      {status}
    </span>
  );
}

function StatCard({ label, value, sub, color, icon }: { label: string; value: number; sub?: string; color: string; icon: string }) {
  return (
    <div style={{ background: '#0d1428', borderRadius: 12, padding: '16px 20px', border: '1px solid rgba(255,255,255,0.08)', flex: 1, minWidth: 140 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{label}</p>
          <p style={{ margin: '6px 0 0', fontSize: 26, fontWeight: 700, color }}>{value}</p>
        </div>
        <span style={{ fontSize: 20, opacity: 0.6 }}>{icon}</span>
      </div>
      {sub && <p style={{ margin: '4px 0 0', fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{sub}</p>}
    </div>
  );
}

function fmt(d: string) {
  return new Date(d).toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' });
}

function ConfirmModal({ message, onConfirm, onCancel }: { message: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.7)' }}>
      <div style={{ background: '#131c35', borderRadius: 16, padding: 32, border: '1px solid rgba(255,255,255,0.12)', maxWidth: 400, width: '90%', boxShadow: '0 20px 50px rgba(0,0,0,0.6)' }}>
        <p style={{ margin: 0, fontSize: 15, color: '#fff', fontWeight: 600, lineHeight: 1.5 }}>{message}</p>
        <div style={{ display: 'flex', gap: 10, marginTop: 24, justifyContent: 'flex-end' }}>
          <button onClick={onCancel} style={{ padding: '8px 20px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', color: 'rgba(255,255,255,0.6)', fontSize: 13, cursor: 'pointer', fontWeight: 500 }}>Cancel</button>
          <button onClick={onConfirm} style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: '#EF4444', color: '#fff', fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>Confirm</button>
        </div>
      </div>
    </div>
  );
}

function ActionButton({ label, icon, color, bg, onClick, disabled }: { label: string; icon: string; color: string; bg: string; onClick: () => void; disabled?: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      padding: '6px 14px', borderRadius: 8, border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
      fontSize: 12, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 5,
      background: disabled ? 'rgba(255,255,255,0.05)' : bg, color: disabled ? 'rgba(255,255,255,0.3)' : color,
      opacity: disabled ? 0.5 : 1, transition: 'all 0.15s',
    }}>
      <span style={{ fontSize: 13 }}>{icon}</span> {label}
    </button>
  );
}

export default function ChatbotAdmin() {
  const [tab, setTab] = useState<'sessions' | 'appointments' | 'contacts'>('sessions');
  const [stats, setStats] = useState<Stats | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [appts, setAppts] = useState<Appointment[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeSid, setActiveSid] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [msgLoading, setMsgLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [langFilter, setLangFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedSessions, setSelectedSessions] = useState<Set<string>>(new Set());
  const [selectedAppts, setSelectedAppts] = useState<Set<string>>(new Set());
  const [confirm, setConfirm] = useState<{ message: string; action: () => void } | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const loadData = useCallback(async () => {
    setLoading(true);
    const [s, sess, a] = await Promise.all([
      fetch(`${BASE}/admin/chatbot/stats`, { headers: authHeaders() }).then(r => r.json()),
      fetch(`${BASE}/admin/chatbot/sessions?language=${langFilter}&status=${statusFilter}`, { headers: authHeaders() }).then(r => r.json()),
      fetch(`${BASE}/admin/chatbot/appointments`, { headers: authHeaders() }).then(r => r.json()),
    ]);
    setStats(s);
    setSessions(sess.sessions ?? []);
    setAppts(a.appointments ?? []);
    setLoading(false);
  }, [langFilter, statusFilter]);

  useEffect(() => { loadData(); }, [loadData]);

  async function viewSession(sid: string) {
    setActiveSid(sid);
    setMsgLoading(true);
    const data = await fetch(`${BASE}/admin/chatbot/sessions/${sid}/messages`, { headers: authHeaders() }).then(r => r.json());
    setMessages(data.messages ?? []);
    setMsgLoading(false);
  }

  async function deleteSession(sid: string) {
    await fetch(`${BASE}/admin/chatbot/sessions/${sid}`, { method: 'DELETE', headers: authHeaders() });
    setSessions(prev => prev.filter(s => s.sessionId !== sid));
    if (activeSid === sid) { setActiveSid(null); setMessages([]); }
    showToast('Conversation deleted');
  }

  async function deleteBulkSessions() {
    const ids = Array.from(selectedSessions);
    await fetch(`${BASE}/admin/chatbot/sessions`, { method: 'DELETE', headers: authHeaders(), body: JSON.stringify({ ids }) });
    setSessions(prev => prev.filter(s => !selectedSessions.has(s.sessionId)));
    setSelectedSessions(new Set());
    if (activeSid && selectedSessions.has(activeSid)) { setActiveSid(null); setMessages([]); }
    showToast(`${ids.length} conversations deleted`);
    loadData();
  }

  async function deleteAppt(id: string) {
    await fetch(`${BASE}/admin/chatbot/appointments/${id}`, { method: 'DELETE', headers: authHeaders() });
    setAppts(prev => prev.filter(a => a.id !== id));
    showToast('Appointment deleted');
  }

  async function deleteBulkAppts() {
    const ids = Array.from(selectedAppts);
    await fetch(`${BASE}/admin/chatbot/appointments`, { method: 'DELETE', headers: authHeaders(), body: JSON.stringify({ ids }) });
    setAppts(prev => prev.filter(a => !selectedAppts.has(a.id)));
    setSelectedAppts(new Set());
    showToast(`${ids.length} appointments deleted`);
    loadData();
  }

  async function updateAppt(id: string, status: string) {
    await fetch(`${BASE}/admin/chatbot/appointments/${id}`, { method: 'PATCH', headers: authHeaders(), body: JSON.stringify({ status }) });
    setAppts(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    showToast(`Status updated to ${status}`);
  }

  async function clearAll() {
    await fetch(`${BASE}/admin/chatbot/clear-all`, { method: 'DELETE', headers: authHeaders() });
    setSessions([]); setAppts([]); setMessages([]); setActiveSid(null);
    showToast('All chatbot data cleared');
    loadData();
  }

  function downloadCSVLocal(data: string, filename: string) {
    const blob = new Blob([data], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  }

  function exportContactsLocal() {
    const seen = new Set<string>();
    const rows = ['Name,Phone,Service,Language,Date'];
    for (const a of appts) {
      if (seen.has(a.phone)) continue;
      seen.add(a.phone);
      rows.push(`"${a.parentName}",${a.phone},"${a.service}",${a.language},${a.createdAt}`);
    }
    downloadCSVLocal(rows.join('\n'), 'contacts.csv');
    showToast('Contacts exported');
  }

  function exportPhonesLocal() {
    const seen = new Set<string>();
    const rows = ['Phone,Name'];
    for (const a of appts) {
      if (seen.has(a.phone)) continue;
      seen.add(a.phone);
      rows.push(`${a.phone},"${a.parentName}"`);
    }
    downloadCSVLocal(rows.join('\n'), 'phones.csv');
    showToast('Phone numbers exported');
  }

  function exportApptsLocal() {
    const rows = ['Parent Name,Child Name,Child Age,Service,Phone,Preferred Time,Language,Status,Date'];
    for (const a of appts) {
      rows.push(`"${a.parentName}","${a.childName}",${a.childAge},"${a.service}",${a.phone},"${a.preferredTime ?? ''}",${a.language},${a.status},${a.createdAt}`);
    }
    downloadCSVLocal(rows.join('\n'), 'appointments.csv');
    showToast('Appointments exported');
  }

  function exportConversationsLocal() {
    const rows = ['Session ID,Language,Status,Started,Messages'];
    for (const s of sessions) {
      rows.push(`${s.sessionId},${s.language},${s.status},${s.startedAt},${s._count?.messages ?? 0}`);
    }
    downloadCSVLocal(rows.join('\n'), 'conversations.csv');
    showToast('Conversations exported');
  }

  function toggleSessionSelect(sid: string) {
    setSelectedSessions(prev => {
      const next = new Set(prev);
      if (next.has(sid)) next.delete(sid); else next.add(sid);
      return next;
    });
  }

  function toggleApptSelect(id: string) {
    setSelectedAppts(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function toggleAllSessions() {
    if (selectedSessions.size === filtSessions.length) {
      setSelectedSessions(new Set());
    } else {
      setSelectedSessions(new Set(filtSessions.map(s => s.sessionId)));
    }
  }

  function toggleAllAppts() {
    if (selectedAppts.size === filtAppts.length) {
      setSelectedAppts(new Set());
    } else {
      setSelectedAppts(new Set(filtAppts.map(a => a.id)));
    }
  }

  const filtSessions = sessions.filter(s =>
    !search || s.sessionId.includes(search) || s.pageUrl?.includes(search)
  );
  const filtAppts = appts.filter(a =>
    !search ||
    a.parentName.toLowerCase().includes(search.toLowerCase()) ||
    a.childName.toLowerCase().includes(search.toLowerCase()) ||
    a.phone.includes(search) ||
    a.service.toLowerCase().includes(search.toLowerCase())
  );

  const uniquePhones = new Set(appts.map(a => a.phone)).size;

  if (loading) return <div style={{ padding: 32, color: 'rgba(255,255,255,0.4)' }}>Loading...</div>;

  const panelBg = '#0d1428';
  const border = 'rgba(255,255,255,0.08)';
  const divider = 'rgba(255,255,255,0.05)';
  const thBg = '#131c35';
  const white = '#ffffff';
  const muted = 'rgba(255,255,255,0.4)';
  const dim = 'rgba(255,255,255,0.7)';

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto' }}>
      {confirm && <ConfirmModal message={confirm.message} onConfirm={() => { confirm.action(); setConfirm(null); }} onCancel={() => setConfirm(null)} />}
      {toast && (
        <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 10001, padding: '10px 20px', borderRadius: 10, background: '#1e293b', border: '1px solid rgba(74,222,128,0.3)', color: '#4ADE80', fontSize: 13, fontWeight: 500, boxShadow: '0 8px 24px rgba(0,0,0,0.4)', animation: 'fadeIn 0.2s' }}>
          {toast}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: white }}>Khadija Chatbot</h1>
          <p style={{ margin: '4px 0 0', color: muted, fontSize: 13 }}>Full control over conversations, appointments & contacts</p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <ActionButton label="Export Conversations" icon="💬" color="#60A5FA" bg="rgba(51,85,238,0.15)" onClick={exportConversationsLocal} />
          <ActionButton label="Export Bookings" icon="📅" color="#4ADE80" bg="rgba(34,197,94,0.15)" onClick={exportApptsLocal} />
          <ActionButton label="Export Phones" icon="📱" color="#FBBF24" bg="rgba(234,179,8,0.15)" onClick={exportPhonesLocal} />
          <ActionButton label="Export Contacts" icon="👤" color="#A78BFA" bg="rgba(139,92,246,0.15)" onClick={exportContactsLocal} />
          <ActionButton label="Clear All" icon="🗑️" color="#F87171" bg="rgba(239,68,68,0.12)" onClick={() => setConfirm({ message: 'Delete ALL chatbot data? This cannot be undone.', action: clearAll })} />
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 24 }}>
          <StatCard label="Conversations" value={stats.totalSessions} color="#3355EE" icon="💬" sub={`${stats.todaySessions} today · ${stats.weekSessions} this week`} />
          <StatCard label="Messages" value={stats.totalMessages} color="#A78BFA" icon="✉️" />
          <StatCard label="Appointments" value={stats.totalAppointments} color="#4ADE80" icon="📅" sub={`${stats.confirmedAppointments} confirmed`} />
          <StatCard label="Pending" value={stats.pendingAppointments} color="#FBBF24" icon="⏳" sub="Need action" />
          <StatCard label="Unique Contacts" value={uniquePhones} color="#F472B6" icon="👤" />
        </div>
      )}

      {/* Toolbar: Search + Filters + Tabs */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search..."
          style={{ flex: 1, minWidth: 180, padding: '8px 14px', borderRadius: 8, border: `1.5px solid ${border}`, fontSize: 13, outline: 'none', background: 'rgba(255,255,255,0.05)', color: white }}
        />
        <select value={langFilter} onChange={e => setLangFilter(e.target.value)} style={{ padding: '8px 12px', borderRadius: 8, border: `1px solid ${border}`, fontSize: 12, background: '#131c35', color: white, cursor: 'pointer' }}>
          <option value="all">All Languages</option>
          <option value="ar">Arabic</option>
          <option value="en">English</option>
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ padding: '8px 12px', borderRadius: 8, border: `1px solid ${border}`, fontSize: 12, background: '#131c35', color: white, cursor: 'pointer' }}>
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="closed">Closed</option>
        </select>
        <div style={{ display: 'flex', gap: 3, background: 'rgba(255,255,255,0.05)', borderRadius: 8, padding: 3 }}>
          {(['sessions', 'appointments', 'contacts'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '6px 14px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 500,
              background: tab === t ? panelBg : 'transparent',
              color: tab === t ? '#3355EE' : muted,
              boxShadow: tab === t ? '0 1px 3px rgba(0,0,0,0.5)' : 'none',
            }}>
              {t === 'sessions' ? `💬 Conversations` : t === 'appointments' ? `📅 Bookings` : `👤 Contacts`}
            </button>
          ))}
        </div>
      </div>

      {/* Bulk action bar */}
      {tab === 'sessions' && selectedSessions.size > 0 && (
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '10px 16px', marginBottom: 12, background: 'rgba(239,68,68,0.08)', borderRadius: 10, border: '1px solid rgba(239,68,68,0.2)' }}>
          <span style={{ fontSize: 13, color: '#F87171', fontWeight: 500 }}>{selectedSessions.size} selected</span>
          <ActionButton label="Delete Selected" icon="🗑️" color="#F87171" bg="rgba(239,68,68,0.2)" onClick={() => setConfirm({ message: `Delete ${selectedSessions.size} conversations? This cannot be undone.`, action: deleteBulkSessions })} />
          <button onClick={() => setSelectedSessions(new Set())} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: muted, fontSize: 12, cursor: 'pointer' }}>Clear selection</button>
        </div>
      )}
      {tab === 'appointments' && selectedAppts.size > 0 && (
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '10px 16px', marginBottom: 12, background: 'rgba(239,68,68,0.08)', borderRadius: 10, border: '1px solid rgba(239,68,68,0.2)' }}>
          <span style={{ fontSize: 13, color: '#F87171', fontWeight: 500 }}>{selectedAppts.size} selected</span>
          <ActionButton label="Delete Selected" icon="🗑️" color="#F87171" bg="rgba(239,68,68,0.2)" onClick={() => setConfirm({ message: `Delete ${selectedAppts.size} appointments? This cannot be undone.`, action: deleteBulkAppts })} />
          <button onClick={() => setSelectedAppts(new Set())} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: muted, fontSize: 12, cursor: 'pointer' }}>Clear selection</button>
        </div>
      )}

      {/* ═══ SESSIONS TAB ═══ */}
      {tab === 'sessions' && (
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ flex: 1, background: panelBg, borderRadius: 12, border: `1px solid ${border}`, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: thBg, borderBottom: `1px solid ${border}` }}>
                  <th style={{ padding: '10px 12px', width: 32 }}>
                    <input type="checkbox" checked={selectedSessions.size === filtSessions.length && filtSessions.length > 0} onChange={toggleAllSessions} style={{ cursor: 'pointer' }} />
                  </th>
                  {['Session ID', 'Lang', 'Msgs', 'Status', 'Started', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 500, color: muted, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtSessions.map((s, i) => (
                  <tr key={s.id} style={{
                    borderBottom: i < filtSessions.length - 1 ? `1px solid ${divider}` : 'none',
                    background: activeSid === s.sessionId ? 'rgba(51,85,238,0.1)' : selectedSessions.has(s.sessionId) ? 'rgba(239,68,68,0.05)' : 'transparent',
                  }}>
                    <td style={{ padding: '10px 12px' }}>
                      <input type="checkbox" checked={selectedSessions.has(s.sessionId)} onChange={() => toggleSessionSelect(s.sessionId)} style={{ cursor: 'pointer' }} />
                    </td>
                    <td style={{ padding: '10px 12px', fontFamily: 'monospace', fontSize: 11, color: dim }}>
                      {s.sessionId.slice(0, 18)}...
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{ padding: '2px 7px', borderRadius: 20, fontSize: 10, background: 'rgba(51,85,238,0.15)', color: '#60A5FA', fontWeight: 500 }}>
                        {s.language === 'ar' ? 'AR' : s.language === 'en' ? 'EN' : s.language || '—'}
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px', color: dim, fontWeight: 600 }}>{s._count?.messages ?? '—'}</td>
                    <td style={{ padding: '10px 12px' }}><Badge status={s.status} /></td>
                    <td style={{ padding: '10px 12px', color: muted, fontSize: 11 }}>{fmt(s.startedAt)}</td>
                    <td style={{ padding: '10px 12px' }}>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button onClick={() => viewSession(s.sessionId)} title="View" style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid #3355EE', background: 'transparent', color: '#3355EE', fontSize: 11, cursor: 'pointer', fontWeight: 500 }}>View</button>
                        <button onClick={() => setConfirm({ message: 'Delete this conversation?', action: () => deleteSession(s.sessionId) })} title="Delete" style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid rgba(239,68,68,0.4)', background: 'transparent', color: '#F87171', fontSize: 11, cursor: 'pointer' }}>Del</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtSessions.length === 0 && (
                  <tr><td colSpan={7} style={{ padding: 40, textAlign: 'center', color: muted, fontSize: 13 }}>No conversations found.</td></tr>
                )}
              </tbody>
            </table>
            <div style={{ padding: '10px 16px', borderTop: `1px solid ${border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: muted }}>{filtSessions.length} conversations</span>
              <button onClick={() => { exportConversationsLocal(); }} style={{ background: 'none', border: 'none', color: '#60A5FA', fontSize: 11, cursor: 'pointer' }}>Export all as CSV</button>
            </div>
          </div>

          {/* Conversation viewer */}
          {activeSid && (
            <div style={{ width: 380, flexShrink: 0, background: panelBg, borderRadius: 12, border: `1px solid ${border}`, display: 'flex', flexDirection: 'column', overflow: 'hidden', maxHeight: 600 }}>
              <div style={{ padding: '12px 16px', borderBottom: `1px solid ${border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: 13, color: white }}>Conversation</p>
                  <p style={{ margin: '2px 0 0', fontSize: 10, color: muted, fontFamily: 'monospace' }}>{activeSid.slice(0, 24)}</p>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => setConfirm({ message: 'Delete this conversation?', action: () => { deleteSession(activeSid); } })} style={{ background: 'rgba(239,68,68,0.15)', border: 'none', borderRadius: 6, padding: '4px 8px', color: '#F87171', fontSize: 11, cursor: 'pointer' }}>Delete</button>
                  <button onClick={() => setActiveSid(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: muted, fontSize: 16 }}>✕</button>
                </div>
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {msgLoading
                  ? <p style={{ textAlign: 'center', color: muted, fontSize: 13, marginTop: 20 }}>Loading...</p>
                  : messages.map((m, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                      <div style={{
                        maxWidth: '85%', padding: '8px 12px',
                        borderRadius: m.role === 'user' ? '12px 12px 3px 12px' : '12px 12px 12px 3px',
                        background: m.role === 'user' ? '#3355EE' : 'rgba(255,255,255,0.08)',
                        color: m.role === 'user' ? '#fff' : 'rgba(255,255,255,0.85)',
                        fontSize: 12, lineHeight: 1.5, whiteSpace: 'pre-wrap',
                      }}>
                        {m.content}
                        <p style={{ margin: '4px 0 0', fontSize: 10, opacity: 0.5 }}>{fmt(m.createdAt)}</p>
                      </div>
                    </div>
                  ))
                }
              </div>
              <div style={{ padding: '8px 12px', borderTop: `1px solid ${border}`, textAlign: 'center' }}>
                <span style={{ fontSize: 11, color: muted }}>{messages.length} messages</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ═══ APPOINTMENTS TAB ═══ */}
      {tab === 'appointments' && (
        <div style={{ background: panelBg, borderRadius: 12, border: `1px solid ${border}`, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: thBg, borderBottom: `1px solid ${border}` }}>
                <th style={{ padding: '10px 10px', width: 32 }}>
                  <input type="checkbox" checked={selectedAppts.size === filtAppts.length && filtAppts.length > 0} onChange={toggleAllAppts} style={{ cursor: 'pointer' }} />
                </th>
                {['Parent', 'Child', 'Age', 'Service', 'Phone', 'Time', 'Lang', 'Status', 'Date', ''].map(h => (
                  <th key={h} style={{ padding: '10px 10px', textAlign: 'left', fontWeight: 500, color: muted, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtAppts.map((a, i) => (
                <tr key={a.id} style={{
                  borderBottom: i < filtAppts.length - 1 ? `1px solid ${divider}` : 'none',
                  background: selectedAppts.has(a.id) ? 'rgba(239,68,68,0.05)' : 'transparent',
                }}>
                  <td style={{ padding: '10px 10px' }}>
                    <input type="checkbox" checked={selectedAppts.has(a.id)} onChange={() => toggleApptSelect(a.id)} style={{ cursor: 'pointer' }} />
                  </td>
                  <td style={{ padding: '10px 10px', fontWeight: 500, color: white }}>{a.parentName}</td>
                  <td style={{ padding: '10px 10px', color: dim }}>{a.childName}</td>
                  <td style={{ padding: '10px 10px', color: muted }}>{a.childAge}</td>
                  <td style={{ padding: '10px 10px' }}>
                    <span style={{ padding: '2px 8px', borderRadius: 20, fontSize: 10, background: 'rgba(51,85,238,0.15)', color: '#60A5FA', fontWeight: 500 }}>{a.service}</span>
                  </td>
                  <td style={{ padding: '10px 10px' }}>
                    <a href={`https://wa.me/${a.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" style={{ color: '#4ADE80', textDecoration: 'none', fontFamily: 'monospace', fontSize: 11 }}>
                      {a.phone}
                    </a>
                  </td>
                  <td style={{ padding: '10px 10px', color: muted, fontSize: 11 }}>{a.preferredTime ?? '—'}</td>
                  <td style={{ padding: '10px 10px' }}>
                    <span style={{ padding: '2px 7px', borderRadius: 20, fontSize: 10, background: 'rgba(51,85,238,0.15)', color: '#60A5FA' }}>
                      {a.language === 'ar' ? 'AR' : 'EN'}
                    </span>
                  </td>
                  <td style={{ padding: '10px 10px' }}>
                    <select value={a.status} onChange={e => updateAppt(a.id, e.target.value)} style={{ padding: '3px 8px', borderRadius: 6, border: `1px solid ${border}`, fontSize: 11, cursor: 'pointer', background: '#131c35', color: white }}>
                      {['pending', 'confirmed', 'cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td style={{ padding: '10px 10px', color: muted, fontSize: 11, whiteSpace: 'nowrap' }}>{fmt(a.createdAt)}</td>
                  <td style={{ padding: '10px 10px' }}>
                    <button onClick={() => setConfirm({ message: `Delete appointment for ${a.childName}?`, action: () => deleteAppt(a.id) })} style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid rgba(239,68,68,0.4)', background: 'transparent', color: '#F87171', fontSize: 10, cursor: 'pointer' }}>Del</button>
                  </td>
                </tr>
              ))}
              {filtAppts.length === 0 && (
                <tr><td colSpan={11} style={{ padding: 40, textAlign: 'center', color: muted, fontSize: 13 }}>No appointments yet.</td></tr>
              )}
            </tbody>
          </table>
          <div style={{ padding: '10px 16px', borderTop: `1px solid ${border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: muted }}>{filtAppts.length} appointments</span>
            <button onClick={exportApptsLocal} style={{ background: 'none', border: 'none', color: '#60A5FA', fontSize: 11, cursor: 'pointer' }}>Export all as CSV</button>
          </div>
        </div>
      )}

      {/* ═══ CONTACTS TAB ═══ */}
      {tab === 'contacts' && (
        <div style={{ background: panelBg, borderRadius: 12, border: `1px solid ${border}`, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: `1px solid ${border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: white }}>Contact Directory</p>
              <p style={{ margin: '2px 0 0', fontSize: 11, color: muted }}>Unique contacts from chatbot bookings</p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <ActionButton label="Export Contacts" icon="📋" color="#4ADE80" bg="rgba(34,197,94,0.15)" onClick={exportContactsLocal} />
              <ActionButton label="Phones Only" icon="📱" color="#FBBF24" bg="rgba(234,179,8,0.15)" onClick={exportPhonesLocal} />
            </div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: thBg, borderBottom: `1px solid ${border}` }}>
                {['Name', 'Phone', 'Service', 'Language', 'First Contact'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 500, color: muted, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(() => {
                const seen = new Set<string>();
                const contacts: Appointment[] = [];
                for (const a of appts) {
                  if (seen.has(a.phone)) continue;
                  seen.add(a.phone);
                  contacts.push(a);
                }
                if (contacts.length === 0) {
                  return <tr><td colSpan={5} style={{ padding: 40, textAlign: 'center', color: muted, fontSize: 13 }}>No contacts yet.</td></tr>;
                }
                return contacts.filter(c => !search || c.parentName.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search)).map((c, i) => (
                  <tr key={c.id} style={{ borderBottom: i < contacts.length - 1 ? `1px solid ${divider}` : 'none' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 500, color: white }}>{c.parentName}</td>
                    <td style={{ padding: '10px 14px' }}>
                      <a href={`https://wa.me/${c.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" style={{ color: '#4ADE80', textDecoration: 'none', fontFamily: 'monospace', fontSize: 12 }}>
                        {c.phone}
                      </a>
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <span style={{ padding: '2px 8px', borderRadius: 20, fontSize: 10, background: 'rgba(51,85,238,0.15)', color: '#60A5FA', fontWeight: 500 }}>{c.service}</span>
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <span style={{ padding: '2px 7px', borderRadius: 20, fontSize: 10, background: 'rgba(51,85,238,0.15)', color: '#60A5FA' }}>
                        {c.language === 'ar' ? 'AR' : 'EN'}
                      </span>
                    </td>
                    <td style={{ padding: '10px 14px', color: muted, fontSize: 11 }}>{fmt(c.createdAt)}</td>
                  </tr>
                ));
              })()}
            </tbody>
          </table>
          <div style={{ padding: '10px 16px', borderTop: `1px solid ${border}` }}>
            <span style={{ fontSize: 11, color: muted }}>{uniquePhones} unique contacts</span>
          </div>
        </div>
      )}

      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}
