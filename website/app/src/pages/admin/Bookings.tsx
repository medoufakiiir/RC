import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { adminApi, type Booking } from '../../services/adminApi';

const STATUSES = ['all', 'pending', 'confirmed', 'completed', 'cancelled'];

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

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.bookings({ status, search: query, page: String(page) });
      setBookings(res.bookings);
      setTotal(res.total);
      setPages(res.pages);
    } finally {
      setLoading(false);
    }
  }, [status, query, page]);

  useEffect(() => { load(); }, [load]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setQuery(search);
    setPage(1);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-white">Bookings <span className="text-white/30 font-normal text-base ml-1">({total})</span></h1>
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

      {/* Table */}
      <div className="bg-[#0d1428] border border-white/8 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8">
                {['Ref', 'Parent', 'Child', 'Service', 'Date', 'Status', ''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium text-white/40">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading && (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-white/30 text-sm">Loading…</td></tr>
              )}
              {!loading && bookings.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-white/30 text-sm">No bookings found</td></tr>
              )}
              {!loading && bookings.map(b => (
                <tr key={b.id} className="hover:bg-white/2 transition-colors">
                  <td className="px-4 py-3 text-xs font-mono text-white/50">{b.ref}</td>
                  <td className="px-4 py-3 text-white">{b.parentName}</td>
                  <td className="px-4 py-3 text-white/60">{b.childName}</td>
                  <td className="px-4 py-3 text-white/60 max-w-[160px] truncate">{b.service}</td>
                  <td className="px-4 py-3 text-white/60 whitespace-nowrap">{b.date} {b.time}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium capitalize ${STATUS_COLORS[b.status] ?? 'bg-white/10 text-white/50'}`}>{b.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <Link to={`/admin/bookings/${b.id}`} className="text-xs text-brand-blue hover:underline">View</Link>
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
