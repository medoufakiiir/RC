import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { CheckCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import { adminApi, type ContactMessage } from '../../services/adminApi';

export default function Messages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const read = filter === 'all' ? undefined : filter === 'read' ? 'true' : 'false';
      const res = await adminApi.messages({ read, page: String(page) });
      setMessages(res.messages);
      setTotal(res.total);
      setPages(res.pages);
    } finally {
      setLoading(false);
    }
  }, [filter, page]);

  useEffect(() => { load(); }, [load]);

  async function markAll() {
    await adminApi.markAllRead();
    load();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-white">Messages <span className="text-white/30 font-normal text-base ml-1">({total})</span></h1>
        <button onClick={markAll} className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white transition">
          <CheckCheck size={14} /> Mark all read
        </button>
      </div>

      <div className="flex gap-1 bg-[#0d1428] border border-white/8 rounded-lg p-1 w-fit">
        {['all', 'unread', 'read'].map(f => (
          <button key={f} onClick={() => { setFilter(f); setPage(1); }}
            className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition ${filter === f ? 'bg-brand-blue text-white' : 'text-white/40 hover:text-white'}`}>
            {f}
          </button>
        ))}
      </div>

      <div className="bg-[#0d1428] border border-white/8 rounded-xl overflow-hidden divide-y divide-white/5">
        {loading && <div className="px-4 py-8 text-center text-white/30 text-sm">Loading…</div>}
        {!loading && messages.length === 0 && <div className="px-4 py-8 text-center text-white/30 text-sm">No messages found</div>}
        {!loading && messages.map(m => (
          <Link key={m.id} to={`/admin/messages/${m.id}`} className="flex items-center gap-3 px-4 py-3.5 hover:bg-white/2 transition-colors">
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${m.isRead ? 'bg-transparent' : 'bg-brand-blue'}`} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className={`text-sm ${m.isRead ? 'text-white/60' : 'text-white font-medium'}`}>{m.name}</span>
                <span className="text-xs text-white/25 whitespace-nowrap">{new Date(m.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="text-xs text-white/30 truncate mt-0.5">{m.email} {m.service ? `· ${m.service}` : ''}</div>
              <div className="text-xs text-white/40 truncate mt-0.5">{m.message}</div>
            </div>
          </Link>
        ))}
      </div>

      {pages > 1 && (
        <div className="flex items-center justify-between px-1">
          <span className="text-xs text-white/30">Page {page} of {pages}</span>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="p-1.5 rounded-md bg-white/5 text-white/40 hover:text-white disabled:opacity-30 transition"><ChevronLeft size={15} /></button>
            <button disabled={page >= pages} onClick={() => setPage(p => p + 1)} className="p-1.5 rounded-md bg-white/5 text-white/40 hover:text-white disabled:opacity-30 transition"><ChevronRight size={15} /></button>
          </div>
        </div>
      )}
    </div>
  );
}
