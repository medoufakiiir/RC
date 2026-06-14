import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { adminApi, type Booking } from '../../services/adminApi';

const STATUSES = ['pending', 'confirmed', 'completed', 'cancelled'];

export default function BookingDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [status, setStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (id) adminApi.booking(id).then(b => { setBooking(b); setStatus(b.status); setNotes(b.adminNotes); });
  }, [id]);

  async function save() {
    if (!id) return;
    setSaving(true);
    try {
      const updated = await adminApi.updateBooking(id, { status, adminNotes: notes });
      setBooking(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }

  async function del() {
    if (!id || !confirm('Delete this booking?')) return;
    await adminApi.deleteBooking(id);
    navigate('/admin/bookings');
  }

  if (!booking) return <div className="text-white/40 text-sm">Loading…</div>;

  const fields: [string, string][] = [
    ['Booking Ref', booking.ref],
    ['Parent Name', booking.parentName],
    ['Child Name',  booking.childName],
    ['Child Age',   booking.childAge],
    ['Phone',       booking.phone],
    ['Email',       booking.email || '—'],
    ['Service',     booking.service],
    ['Package',     booking.package || '—'],
    ['Date',        booking.date],
    ['Time',        booking.time],
    ['Notes',       booking.notes || '—'],
    ['Submitted',   new Date(booking.createdAt).toLocaleString()],
  ];

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link to="/admin/bookings" className="text-white/40 hover:text-white transition"><ArrowLeft size={18} /></Link>
        <h1 className="text-xl font-semibold text-white">Booking {booking.ref}</h1>
      </div>

      <div className="bg-[#0d1428] border border-white/8 rounded-xl divide-y divide-white/5">
        {fields.map(([label, value]) => (
          <div key={label} className="flex items-start px-4 py-3 gap-4">
            <span className="text-xs text-white/40 w-32 flex-shrink-0 pt-0.5">{label}</span>
            <span className="text-sm text-white flex-1">{value}</span>
          </div>
        ))}
      </div>

      <div className="bg-[#0d1428] border border-white/8 rounded-xl p-4 space-y-4">
        <h2 className="text-sm font-medium text-white">Admin Actions</h2>

        <div>
          <label className="block text-xs text-white/40 mb-1.5">Status</label>
          <div className="flex flex-wrap gap-2">
            {STATUSES.map(s => (
              <button key={s} onClick={() => setStatus(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition ${status === s ? 'bg-brand-blue text-white' : 'bg-white/5 text-white/40 hover:text-white'}`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs text-white/40 mb-1.5">Admin Notes</label>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/25 focus:outline-none focus:border-brand-blue/60 resize-none" />
        </div>

        <div className="flex items-center gap-3">
          <button onClick={save} disabled={saving}
            className="px-4 py-2 bg-brand-blue text-white text-sm rounded-lg hover:bg-brand-blue/90 disabled:opacity-50 transition">
            {saving ? 'Saving…' : saved ? 'Saved!' : 'Save Changes'}
          </button>
          <button onClick={del} className="ml-auto p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition">
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
