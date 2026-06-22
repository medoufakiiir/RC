import { useEffect, useState, useCallback } from 'react';
import { Contact, Search, Download, Filter, Mail, Phone, ChevronLeft, ChevronRight } from 'lucide-react';
import { adminApi } from '../../services/adminApi';
import type { ContactEntry } from '../../services/adminApi';

const SOURCE_BADGE: Record<string, string> = {
  booking: 'bg-brand-blue/15 text-brand-blue',
  message: 'bg-purple-500/15 text-purple-400',
  chatbot: 'bg-green-500/15 text-green-400',
};

export default function Contacts() {
  const [contacts, setContacts] = useState<ContactEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [source, setSource] = useState('all');
  const [searchInput, setSearchInput] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.contacts({ search, source, page: String(page), limit: '50' });
      setContacts(res.contacts);
      setTotal(res.total);
      setPages(res.pages);
    } catch { /* ignore */ }
    setLoading(false);
  }, [search, source, page]);

  useEffect(() => { load(); }, [load]);

  function doSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Contact size={22} className="text-orange-400" />
          <h1 className="text-xl font-semibold text-white">Contacts & Data</h1>
          <span className="text-xs text-white/30">{total} total</span>
        </div>
        <div className="flex items-center gap-2">
          <a href={adminApi.exportContacts(source)} target="_blank" rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-500 transition">
            <Download size={14} /> Export CSV
          </a>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <form onSubmit={doSearch} className="relative flex-1 min-w-[200px] max-w-md">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
          <input
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-white/25 focus:outline-none focus:border-brand-blue/60"
            placeholder="Search name, email, phone, service…"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
          />
        </form>
        <div className="flex items-center gap-1.5">
          <Filter size={14} className="text-white/30" />
          {['all', 'bookings', 'messages', 'chatbot'].map(s => (
            <button key={s} onClick={() => { setSource(s); setPage(1); }}
              className={`px-2.5 py-1.5 text-xs rounded-lg transition ${source === s ? 'bg-brand-blue text-white' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}>
              {s === 'all' ? 'All Sources' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <SummaryCard icon={Contact} label="Total Records" value={total} color="bg-white/5" />
        <SummaryCard icon={Mail} label="With Email"
          value={contacts.filter(c => c.email).length} color="bg-brand-blue/10" note="on this page" />
        <SummaryCard icon={Phone} label="With Phone"
          value={contacts.filter(c => c.phone).length} color="bg-green-500/10" note="on this page" />
        <SourceCount contacts={contacts} source="booking" label="From Bookings" />
        <SourceCount contacts={contacts} source="chatbot" label="From Chatbot" />
      </div>

      {/* Table */}
      <div className="bg-[#0d1428] border border-white/8 rounded-xl overflow-hidden">
        {loading ? (
          <div className="px-4 py-12 text-center text-white/30 text-sm">Loading…</div>
        ) : contacts.length === 0 ? (
          <div className="px-4 py-12 text-center text-white/30 text-sm">No contacts found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8">
                  <th className="text-left text-xs text-white/40 font-medium px-4 py-3">Name</th>
                  <th className="text-left text-xs text-white/40 font-medium px-4 py-3 hidden md:table-cell">Child</th>
                  <th className="text-left text-xs text-white/40 font-medium px-4 py-3">Email</th>
                  <th className="text-left text-xs text-white/40 font-medium px-4 py-3">Phone</th>
                  <th className="text-left text-xs text-white/40 font-medium px-4 py-3 hidden lg:table-cell">Service</th>
                  <th className="text-left text-xs text-white/40 font-medium px-4 py-3">Source</th>
                  <th className="text-left text-xs text-white/40 font-medium px-4 py-3 hidden lg:table-cell">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {contacts.map(c => (
                  <tr key={c.id} className="hover:bg-white/[0.02] transition">
                    <td className="px-4 py-3">
                      <div className="text-white font-medium">{c.name}</div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      {c.childName ? (
                        <div>
                          <span className="text-white/70">{c.childName}</span>
                          {c.childAge && <span className="text-white/30 text-xs ml-1">({c.childAge})</span>}
                        </div>
                      ) : (
                        <span className="text-white/15">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {c.email ? (
                        <a href={`mailto:${c.email}`} className="text-brand-blue hover:underline text-xs">{c.email}</a>
                      ) : (
                        <span className="text-white/15">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {c.phone ? (
                        <a href={`tel:${c.phone}`} className="text-white/70 hover:text-white text-xs">{c.phone}</a>
                      ) : (
                        <span className="text-white/15">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-white/50 text-xs">{c.service || '—'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${SOURCE_BADGE[c.source] || 'bg-white/10 text-white/50'}`}>
                        {c.source}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-white/30 text-xs">{new Date(c.date).toLocaleDateString()}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-white/8">
            <span className="text-xs text-white/30">Page {page} of {pages}</span>
            <div className="flex gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}
                className="p-1.5 rounded-lg bg-white/5 text-white/40 hover:bg-white/10 disabled:opacity-30">
                <ChevronLeft size={14} />
              </button>
              <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page >= pages}
                className="p-1.5 rounded-lg bg-white/5 text-white/40 hover:bg-white/10 disabled:opacity-30">
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value, color, note }: {
  icon: typeof Contact; label: string; value: number; color: string; note?: string;
}) {
  return (
    <div className={`${color} border border-white/8 rounded-xl p-3`}>
      <div className="flex items-center gap-2 mb-1">
        <Icon size={14} className="text-white/40" />
        <span className="text-[11px] text-white/40">{label}</span>
      </div>
      <div className="text-lg font-bold text-white">{value}</div>
      {note && <div className="text-[10px] text-white/20">{note}</div>}
    </div>
  );
}

function SourceCount({ contacts, source, label }: { contacts: ContactEntry[]; source: string; label: string }) {
  const count = contacts.filter(c => c.source === source).length;
  return (
    <div className="bg-white/5 border border-white/8 rounded-xl p-3">
      <div className="text-[11px] text-white/40 mb-1">{label}</div>
      <div className="text-lg font-bold text-white">{count}</div>
      <div className="text-[10px] text-white/20">on this page</div>
    </div>
  );
}
