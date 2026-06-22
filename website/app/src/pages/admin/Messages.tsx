import { useEffect, useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { CheckCheck, ChevronLeft, ChevronRight, Radio, Trash2 } from 'lucide-react';
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
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [confirm, setConfirm] = useState<{ msg: string; action: () => void } | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const isFirstLoad = useRef(true);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

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
  useEffect(() => { const iv = setInterval(() => load(true), POLL_MS); return () => clearInterval(iv); }, [load]);

  async function markAll() { await adminApi.markAllRead(); load(); }

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
    if (selected.size === messages.length) setSelected(new Set());
    else setSelected(new Set(messages.map(m => m.id)));
  }

  async function deleteSelected() {
    const ids = Array.from(selected);
    await adminApi.bulkDeleteMessages(ids);
    setSelected(new Set());
    showToast(`${ids.length} message${ids.length > 1 ? 's' : ''} deleted`);
    load();
  }

  async function deleteSingle(id: string) {
    await adminApi.deleteMessage(id);
    showToast('Message deleted');
    load();
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

      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex gap-1 bg-[#0d1428] border border-white/8 rounded-lg p-1 w-fit">
          {['all', 'unread', 'read'].map(f => (
            <button key={f} onClick={() => { setFilter(f); setPage(1); }}
              className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition ${filter === f ? 'bg-brand-blue text-white' : 'text-white/40 hover:text-white'}`}>
              {f}
            </button>
          ))}
        </div>
        {selected.size > 0 && (
          <div className="flex items-center gap-3 px-3 py-1.5 bg-red-500/8 border border-red-500/20 rounded-lg">
            <span className="text-xs font-medium text-red-400">{selected.size} selected</span>
            <button onClick={() => setConfirm({ msg: `Delete ${selected.size} message${selected.size > 1 ? 's' : ''}? This cannot be undone.`, action: deleteSelected })}
              className="flex items-center gap-1 text-xs font-medium text-red-400 hover:text-red-300 transition">
              <Trash2 size={12} /> Delete
            </button>
            <button onClick={() => setSelected(new Set())} className="text-xs text-white/40 hover:text-white transition">Clear</button>
          </div>
        )}
      </div>

      <div className="bg-[#0d1428] border border-white/8 rounded-xl overflow-hidden">
        {/* Select all header */}
        <div className="flex items-center gap-3 px-4 py-2.5 border-b border-white/5">
          <input type="checkbox" checked={selected.size === messages.length && messages.length > 0} onChange={toggleAll} className="accent-brand-blue cursor-pointer" />
          <span className="text-xs text-white/30">Select all</span>
        </div>

        <div className="divide-y divide-white/5">
          {loading && isFirstLoad.current && <div className="px-4 py-8 text-center text-white/30 text-sm">Loading…</div>}
          {!(loading && isFirstLoad.current) && messages.length === 0 && <div className="px-4 py-8 text-center text-white/30 text-sm">No messages found</div>}
          {!(loading && isFirstLoad.current) && messages.map(m => (
            <div key={m.id} className={`flex items-center gap-3 px-4 py-3.5 hover:bg-white/2 transition-colors ${selected.has(m.id) ? 'bg-red-500/5' : ''}`}>
              <input type="checkbox" checked={selected.has(m.id)} onChange={() => toggleSelect(m.id)} className="accent-brand-blue cursor-pointer flex-shrink-0" />
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${m.isRead ? 'bg-transparent' : 'bg-brand-blue'}`} />
              <Link to={`/admin/messages/${m.id}`} className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-sm ${m.isRead ? 'text-white/60' : 'text-white font-medium'}`}>{m.name}</span>
                  <span className="text-xs text-white/25 whitespace-nowrap">{new Date(m.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="text-xs text-white/30 truncate mt-0.5">{m.email} {m.service ? `· ${m.service}` : ''}</div>
                <div className="text-xs text-white/40 truncate mt-0.5">{m.message}</div>
              </Link>
              <button onClick={() => setConfirm({ msg: `Delete message from ${m.name}?`, action: () => deleteSingle(m.id) })} className="text-white/20 hover:text-red-400 transition flex-shrink-0 p-1">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
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
