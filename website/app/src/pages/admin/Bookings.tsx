import { useEffect, useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronLeft, ChevronRight, Radio, Trash2, Calendar, Download } from 'lucide-react';
import { adminApi, type Booking } from '../../services/adminApi';

const BASE = import.meta.env.VITE_API_URL ?? 'https://riyada-medical-backend-production.up.railway.app';

const STATUSES = ['all', 'pending', 'confirmed', 'completed', 'cancelled'];
const POLL_MS = 10_000;

const STATUS_COLORS: Record<string, string> = {
  pending:   'bg-yellow-500/15 text-yellow-400',
  confirmed: 'bg-green-500/15 text-green-400',
  completed: 'bg-blue-500/15 text-blue-400',
  cancelled: 'bg-red-500/15 text-red-400',
};

export default function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [confirm, setConfirm] = useState<{ msg: string; action: () => void } | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const isFirstLoad = useRef(true);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await adminApi.bookings({ status, search: query, page: String(page) });
      setBookings(res.bookings);
      setTotal(res.total);
      setPages(res.pages);
      setLastUpdate(new Date());
    } finally {
      if (!silent) setLoading(false);
      isFirstLoad.current = false;
    }
  }, [status, query, page]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { const iv = setInterval(() => load(true), POLL_MS); return () => clearInterval(iv); }, [load]);

  function handleSearch(e: React.FormEvent) { e.preventDefault(); setQuery(search); setPage(1); }

  function timeAgo() {
    const secs = Math.floor((Date.now() - lastUpdate.getTime()) / 1000);
    if (secs < 5) return 'just now';
    if (secs < 60) return `${secs}s ago`;
    return `${Math.floor(secs / 60)}m ago`;
  }

  function toggleSelect(id: string) {
    setSelected(prev => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  }

  function toggleAll() {
    if (selected.size === bookings.length) setSelected(new Set());
    else setSelected(new Set(bookings.map(b => b.id)));
  }

  async function deleteSelected() {
    const ids = Array.from(selected);
    await adminApi.bulkDeleteBookings(ids);
    setSelected(new Set());
    showToast(`${ids.length} booking${ids.length > 1 ? 's' : ''} deleted`);
    load();
  }

  async function deleteSingle(id: string) {
    await adminApi.deleteBooking(id);
    showToast('Booking deleted');
    load();
  }

  function exportCalendar() {
    const token = localStorage.getItem('admin_token') ?? '';
    window.open(`${BASE}/admin/bookings/export/ics?token=${token}`, '_blank');
    showToast('Calendar file downloading (.ics)');
  }

  function exportCSV() {
    const rows = ['Ref,Parent,Child,Age,Phone,Email,Service,Date,Time,Status,Notes'];
    for (const b of bookings) {
      rows.push(`${b.ref},"${b.parentName}","${b.childName}","${b.childAge}",${b.phone},${b.email},"${b.service}",${b.date},${b.time},${b.status},"${b.notes ?? ''}"`);
    }
    const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'bookings.csv'; a.click();
    URL.revokeObjectURL(url);
    showToast('Bookings exported as CSV');
  }

  return (
    <div className="space-y-4">
      {confirm && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/70">
          <div className="bg-[#131c35] rounded-2xl p-6 border border-white/12 max-w-sm w-[90%] shadow-2xl">
            <p className="text-white text-sm font-medium mb-5">{confirm.msg}</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setConfirm(null)} className="px-4 py-2 text-xs text-white/50 border border-white/10 rounded-lg hover:text-white transition">Cancel</button>
              <button onClick={() => { confirm.action(); setConfirm(null); }} className="px-4 py-2 text-xs text-white bg-red-500 rounded-lg hover:bg-red-600 transition font-medium">Delete</button>
            </div>
          </div>
        </div>
      )}
      {toast && (
        <div className="fixed top-5 right-5 z-[10001] px-4 py-2.5 rounded-xl bg-[#1e293b] border border-green-500/30 text-green-400 text-sm font-medium shadow-xl animate-[fadeIn_0.2s]">
          {toast}
        </div>
      )}

      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-xl font-semibold text-white">
          Bookings <span className="text-white/30 font-normal text-base ml-1">({total})</span>
        </h1>
        <div className="flex items-center gap-2">
          <button onClick={exportCalendar} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-purple-300 bg-purple-500/10 border border-purple-500/20 rounded-lg hover:bg-purple-500/20 transition">
            <Calendar size={13} /> Export to Calendar
          </button>
          <button onClick={exportCSV} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-300 bg-blue-500/10 border border-blue-500/20 rounded-lg hover:bg-blue-500/20 transition">
            <Download size={13} /> Export CSV
          </button>
          <div className="flex items-center gap-1.5 text-[11px] text-green-400/80">
            <Radio size={12} className="animate-pulse" />
            <span>Live · {timeAgo()}</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex gap-1 bg-[#0d1428] border border-white/8 rounded-lg p-1">
          {STATUSES.map(s => (
            <button key={s} onClick={() => { setStatus(s); setPage(1); }}
              className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition ${status === s ? 'bg-brand-blue text-white' : 'text-white/40 hover:text-white'}`}>
              {s}
            </button>
          ))}
        </div>
        <form onSubmit={handleSearch} className="flex gap-2 flex-1 max-w-xs">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Name, ref, phone…"
              className="w-full bg-[#0d1428] border border-white/8 rounded-lg pl-8 pr-3 py-2 text-sm text-white placeholder-white/25 focus:outline-none focus:border-brand-blue/60" />
          </div>
          <button type="submit" className="px-3 py-2 bg-brand-blue text-white text-xs rounded-lg hover:bg-brand-blue/90 transition">Search</button>
        </form>
      </div>

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 px-4 py-2.5 bg-red-500/8 border border-red-500/20 rounded-xl">
          <span className="text-xs font-medium text-red-400">{selected.size} selected</span>
          <button onClick={() => setConfirm({ msg: `Delete ${selected.size} booking${selected.size > 1 ? 's' : ''}? This cannot be undone.`, action: deleteSelected })}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-400 bg-red-500/15 rounded-lg hover:bg-red-500/25 transition">
            <Trash2 size={12} /> Delete Selected
          </button>
          <button onClick={() => setSelected(new Set())} className="ml-auto text-xs text-white/40 hover:text-white transition">Clear</button>
        </div>
      )}

      {/* Table */}
      <div className="bg-[#0d1428] border border-white/8 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8">
                <th className="px-3 py-3 w-10">
                  <input type="checkbox" checked={selected.size === bookings.length && bookings.length > 0} onChange={toggleAll} className="accent-brand-blue cursor-pointer" />
                </th>
                {['Ref', 'Parent', 'Child', 'Service', 'Date', 'Status', ''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium text-white/40">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading && isFirstLoad.current && (
                <tr><td colSpan={8} className="px-4 py-8 text-center text-white/30 text-sm">Loading…</td></tr>
              )}
              {!(loading && isFirstLoad.current) && bookings.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-8 text-center text-white/30 text-sm">No bookings found</td></tr>
              )}
              {!(loading && isFirstLoad.current) && bookings.map(b => (
                <tr key={b.id} className={`hover:bg-white/2 transition-colors ${selected.has(b.id) ? 'bg-red-500/5' : ''}`}>
                  <td className="px-3 py-3">
                    <input type="checkbox" checked={selected.has(b.id)} onChange={() => toggleSelect(b.id)} className="accent-brand-blue cursor-pointer" />
                  </td>
                  <td className="px-4 py-3 text-xs font-mono text-white/50">{b.ref}</td>
                  <td className="px-4 py-3 text-white">{b.parentName}</td>
                  <td className="px-4 py-3 text-white/60">{b.childName}</td>
                  <td className="px-4 py-3 text-white/60 max-w-[160px] truncate">{b.service}</td>
                  <td className="px-4 py-3 text-white/60 whitespace-nowrap">{b.date} {b.time}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium capitalize ${STATUS_COLORS[b.status] ?? 'bg-white/10 text-white/50'}`}>{b.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link to={`/admin/bookings/${b.id}`} className="text-xs text-brand-blue hover:underline">View</Link>
                      <button onClick={() => setConfirm({ msg: `Delete booking ${b.ref}?`, action: () => deleteSingle(b.id) })} className="text-xs text-red-400/60 hover:text-red-400 transition">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-white/8">
            <span className="text-xs text-white/30">Page {page} of {pages}</span>
            <div className="flex gap-2">
              <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="p-1.5 rounded-md bg-white/5 text-white/40 hover:text-white disabled:opacity-30 transition"><ChevronLeft size={15} /></button>
              <button disabled={page >= pages} onClick={() => setPage(p => p + 1)} className="p-1.5 rounded-md bg-white/5 text-white/40 hover:text-white disabled:opacity-30 transition"><ChevronRight size={15} /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
