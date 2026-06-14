import { useState, useEffect } from 'react';

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
  pending:   { bg: '#FEF3C7', color: '#92400E' },
  confirmed: { bg: '#D1FAE5', color: '#065F46' },
  cancelled: { bg: '#FEE2E2', color: '#991B1B' },
  active:    { bg: '#DBEAFE', color: '#1E40AF' },
  closed:    { bg: '#F3F4F6', color: '#374151' },
};

function Badge({ status }: { status: string }) {
  const s = STATUS_BADGE[status] ?? STATUS_BADGE.closed;
  return (
    <span style={{ padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 500, background: s.bg, color: s.color }}>
      {status}
    </span>
  );
}

function StatCard({ label, value, sub, color }: { label: string; value: number; sub?: string; color: string }) {
  return (
    <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e5e7eb', flex: 1, minWidth: 150 }}>
      <p style={{ margin: 0, fontSize: 13, color: '#6b7280' }}>{label}</p>
      <p style={{ margin: '6px 0 0', fontSize: 28, fontWeight: 700, color }}>{value}</p>
      {sub && <p style={{ margin: '4px 0 0', fontSize: 11, color: '#9ca3af' }}>{sub}</p>}
    </div>
  );
}

function fmt(d: string) {
  return new Date(d).toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' });
}

export default function ChatbotAdmin() {
  const [tab,         setTab]         = useState<'sessions' | 'appointments'>('sessions');
  const [stats,       setStats]       = useState<Stats | null>(null);
  const [sessions,    setSessions]    = useState<Session[]>([]);
  const [appts,       setAppts]       = useState<Appointment[]>([]);
  const [messages,    setMessages]    = useState<Message[]>([]);
  const [activeSid,   setActiveSid]   = useState<string | null>(null);
  const [loading,     setLoading]     = useState(true);
  const [msgLoading,  setMsgLoading]  = useState(false);
  const [search,      setSearch]      = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [s, sess, a] = await Promise.all([
        fetch(`${BASE}/admin/chatbot/stats`,        { headers: authHeaders() }).then(r => r.json()),
        fetch(`${BASE}/admin/chatbot/sessions`,     { headers: authHeaders() }).then(r => r.json()),
        fetch(`${BASE}/admin/chatbot/appointments`, { headers: authHeaders() }).then(r => r.json()),
      ]);
      setStats(s);
      setSessions(sess.sessions ?? []);
      setAppts(a.appointments ?? []);
      setLoading(false);
    }
    load();
  }, []);

  async function viewSession(sid: string) {
    setActiveSid(sid);
    setMsgLoading(true);
    const data = await fetch(`${BASE}/admin/chatbot/sessions/${sid}/messages`, { headers: authHeaders() }).then(r => r.json());
    setMessages(data.messages ?? []);
    setMsgLoading(false);
  }

  async function updateAppt(id: string, status: string) {
    await fetch(`${BASE}/admin/chatbot/appointments/${id}`, {
      method: 'PATCH', headers: authHeaders(), body: JSON.stringify({ status }),
    });
    setAppts(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  }

  const filtSessions = sessions.filter(s =>
    !search || s.sessionId.includes(search) || s.pageUrl?.includes(search)
  );
  const filtAppts = appts.filter(a =>
    !search ||
    a.parentName.toLowerCase().includes(search.toLowerCase()) ||
    a.childName.toLowerCase().includes(search.toLowerCase()) ||
    a.phone.includes(search)
  );

  if (loading) return <div style={{ padding: 32, color: '#6b7280', fontFamily: 'system-ui,sans-serif' }}>Loading…</div>;

  return (
    <div style={{ padding: 24, fontFamily: 'system-ui,sans-serif', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#111827' }}>🤖 Raya Chatbot</h1>
        <p style={{ margin: '4px 0 0', color: '#6b7280', fontSize: 13 }}>Conversations, appointments, and analytics</p>
      </div>

      {/* Stats */}
      {stats && (
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
          <StatCard label="Total Conversations"  value={stats.totalSessions}       color="#3355EE" sub={`${stats.todaySessions} today`} />
          <StatCard label="Total Messages"       value={stats.totalMessages}       color="#7c3aed" />
          <StatCard label="Appointments"         value={stats.totalAppointments}   color="#059669" />
          <StatCard label="Pending Follow-up"    value={stats.pendingAppointments} color="#d97706" sub="Need action" />
        </div>
      )}

      {/* Search + Tabs */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search sessions, names, phone…"
          style={{ flex: 1, minWidth: 200, padding: '8px 14px', borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 13, outline: 'none' }}
        />
        <div style={{ display: 'flex', gap: 4, background: '#f3f4f6', borderRadius: 8, padding: 3 }}>
          {(['sessions', 'appointments'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '6px 16px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500,
              background: tab === t ? '#fff' : 'transparent',
              color: tab === t ? '#3355EE' : '#6b7280',
              boxShadow: tab === t ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            }}>
              {t === 'sessions' ? `💬 Conversations (${sessions.length})` : `📅 Appointments (${appts.length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Sessions tab */}
      {tab === 'sessions' && (
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ flex: 1, background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                  {['Session ID', 'Lang', 'Messages', 'Status', 'Started', ''].map(h => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 500, color: '#6b7280' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtSessions.map((s, i) => (
                  <tr key={s.id} style={{
                    borderBottom: i < filtSessions.length - 1 ? '1px solid #f3f4f6' : 'none',
                    background: activeSid === s.sessionId ? '#EFF6FF' : 'transparent',
                  }}>
                    <td style={{ padding: '10px 14px', fontFamily: 'monospace', fontSize: 11, color: '#374151' }}>
                      {s.sessionId.slice(0, 20)}…
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <span style={{ padding: '2px 8px', borderRadius: 20, fontSize: 11, background: '#E6F1FB', color: '#185FA5', fontWeight: 500 }}>
                        {s.language === 'ar' ? '🇸🇦 AR' : s.language === 'en' ? '🇬🇧 EN' : '🌐'}
                      </span>
                    </td>
                    <td style={{ padding: '10px 14px', color: '#374151' }}>{s._count?.messages ?? '—'}</td>
                    <td style={{ padding: '10px 14px' }}><Badge status={s.status} /></td>
                    <td style={{ padding: '10px 14px', color: '#6b7280', fontSize: 11 }}>{fmt(s.startedAt)}</td>
                    <td style={{ padding: '10px 14px' }}>
                      <button onClick={() => viewSession(s.sessionId)} style={{
                        padding: '4px 10px', borderRadius: 6, border: '1px solid #3355EE',
                        background: 'transparent', color: '#3355EE', fontSize: 11, cursor: 'pointer', fontWeight: 500,
                      }}>View</button>
                    </td>
                  </tr>
                ))}
                {filtSessions.length === 0 && (
                  <tr><td colSpan={6} style={{ padding: 32, textAlign: 'center', color: '#9ca3af', fontSize: 13 }}>No conversations yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Conversation viewer */}
          {activeSid && (
            <div style={{ width: 380, flexShrink: 0, background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ margin: 0, fontWeight: 600, fontSize: 13 }}>Conversation</p>
                <button onClick={() => setActiveSid(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', fontSize: 16 }}>✕</button>
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: 12, display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 500 }}>
                {msgLoading
                  ? <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: 13, marginTop: 20 }}>Loading…</p>
                  : messages.map((m, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                      <div style={{
                        maxWidth: '85%', padding: '8px 12px',
                        borderRadius: m.role === 'user' ? '12px 12px 3px 12px' : '12px 12px 12px 3px',
                        background: m.role === 'user' ? '#3355EE' : '#f3f4f6',
                        color: m.role === 'user' ? '#fff' : '#111827',
                        fontSize: 12, lineHeight: 1.5, whiteSpace: 'pre-wrap',
                      }}>
                        {m.content}
                        <p style={{ margin: '4px 0 0', fontSize: 10, opacity: 0.6 }}>{fmt(m.createdAt)}</p>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          )}
        </div>
      )}

      {/* Appointments tab */}
      {tab === 'appointments' && (
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                {['Parent', 'Child', 'Age', 'Service', 'Phone', 'Preferred Time', 'Lang', 'Status', 'Date'].map(h => (
                  <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 500, color: '#6b7280', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtAppts.map((a, i) => (
                <tr key={a.id} style={{ borderBottom: i < filtAppts.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                  <td style={{ padding: '10px 12px', fontWeight: 500 }}>{a.parentName}</td>
                  <td style={{ padding: '10px 12px' }}>{a.childName}</td>
                  <td style={{ padding: '10px 12px', color: '#6b7280' }}>{a.childAge}</td>
                  <td style={{ padding: '10px 12px' }}>
                    <span style={{ padding: '2px 8px', borderRadius: 20, fontSize: 11, background: '#E6F1FB', color: '#185FA5', fontWeight: 500 }}>{a.service}</span>
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <a href={`https://wa.me/${a.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" style={{ color: '#059669', textDecoration: 'none', fontFamily: 'monospace', fontSize: 12 }}>
                      📱 {a.phone}
                    </a>
                  </td>
                  <td style={{ padding: '10px 12px', color: '#6b7280', fontSize: 11 }}>{a.preferredTime ?? '—'}</td>
                  <td style={{ padding: '10px 12px' }}>
                    <span style={{ padding: '2px 8px', borderRadius: 20, fontSize: 11, background: '#E6F1FB', color: '#185FA5' }}>
                      {a.language === 'ar' ? '🇸🇦 AR' : '🇬🇧 EN'}
                    </span>
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <select value={a.status} onChange={e => updateAppt(a.id, e.target.value)} style={{
                      padding: '3px 8px', borderRadius: 6, border: '1px solid #d1d5db', fontSize: 11, cursor: 'pointer',
                    }}>
                      {['pending', 'confirmed', 'cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td style={{ padding: '10px 12px', color: '#6b7280', fontSize: 11, whiteSpace: 'nowrap' }}>{fmt(a.createdAt)}</td>
                </tr>
              ))}
              {filtAppts.length === 0 && (
                <tr><td colSpan={9} style={{ padding: 32, textAlign: 'center', color: '#9ca3af', fontSize: 13 }}>No appointments yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
