import { useEffect, useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { CheckCheck, ChevronLeft, ChevronRight, Radio } from 'lucide-react';
import { adminApi, type ContactMessage } from '../../services/adminApi';

const POLL_MS = 10_000;

export default function Messages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const isFirstLoad = useRef(true);

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const read = filter === 'all' ? undefined : filter === 'read' ? 'true' : 'false';
      const res = await adminApi.messages({ read, page: String(page) });
      setMessages(res.messages);
      setTotal(res.total);
      setPages(res.pages);
      setLastUpdate(new Date());
    } finally {
      if (!silent) setLoading(false);
      isFirstLoad.current = false;
    }
  }, [filter, page]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    const iv = setInterval(() => load(true), POLL_MS);
    return () => clearInterval(iv);
  }, [load]);

  async function markAll() {
    await adminApi.markAllRead();
    load();
  }

  function timeAgo() {
    const secs = Math.floor((Date.now() - lastUpdate.getTime()) / 1000);
    if (secs < 5) return 'just now';
    if (secs < 60) return `${secs}s ago`;
    return `${Math.floor(secs / 60)}m ago`;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold text-white">
            Messages <span className="text-white/30 font-normal text-base ml-1">({total})</span>
          </h1>
          <div className="flex items-center gap-1.5 text-[11px] text-green-400/80">
            <Radio size={12} className="animate-pulse" />
            <span>Live · {timeAgo()}</span>
          </div>
        </div>
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
        {loading && isFirstLoad.current && <div className="px-4 py-8 text-center text-white/30 text-sm">Loading…</div>}
        {!(loading && isFirstLoad.current) && messages.length === 0 && <div className="px-4 py-8 text-center text-white/30 text-sm">No messages found</div>}
        {!(loading && isFirstLoad.current) && messages.map(m => (
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
