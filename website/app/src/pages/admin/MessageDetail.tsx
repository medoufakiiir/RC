import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { adminApi, type ContactMessage } from '../../services/adminApi';
import { useNavigate } from 'react-router-dom';

export default function MessageDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [msg, setMsg] = useState<ContactMessage | null>(null);

  useEffect(() => {
    if (id) adminApi.message(id).then(setMsg);
  }, [id]);

  async function del() {
    if (!id || !confirm('Delete this message?')) return;
    await adminApi.deleteMessage(id);
    navigate('/admin/messages');
  }

  if (!msg) return <div className="text-white/40 text-sm">Loading…</div>;

  const fields: [string, string][] = [
    ['From',        msg.name],
    ['Email',       msg.email],
    ['Phone',       msg.phone || '—'],
    ['Service',     msg.service || '—'],
    ['Child Age',   msg.childAge || '—'],
    ['Concern',     msg.concern || '—'],
    ['Received',    new Date(msg.createdAt).toLocaleString()],
  ];

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link to="/admin/messages" className="text-white/40 hover:text-white transition"><ArrowLeft size={18} /></Link>
        <h1 className="text-xl font-semibold text-white">Message from {msg.name}</h1>
        {!msg.isRead && <span className="text-[11px] bg-brand-blue/20 text-brand-blue px-2 py-0.5 rounded-full">Unread</span>}
      </div>

      <div className="bg-[#0d1428] border border-white/8 rounded-xl divide-y divide-white/5">
        {fields.map(([label, value]) => (
          <div key={label} className="flex items-start px-4 py-3 gap-4">
            <span className="text-xs text-white/40 w-28 flex-shrink-0 pt-0.5">{label}</span>
            <span className="text-sm text-white flex-1">{value}</span>
          </div>
        ))}
        <div className="px-4 py-4">
          <div className="text-xs text-white/40 mb-2">Message</div>
          <div className="text-sm text-white/80 whitespace-pre-wrap leading-relaxed">{msg.message}</div>
        </div>
      </div>

      <div className="flex gap-3">
        <a href={`mailto:${msg.email}`} className="px-4 py-2 bg-brand-blue text-white text-sm rounded-lg hover:bg-brand-blue/90 transition">
          Reply via Email
        </a>
        <button onClick={del} className="ml-auto p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
