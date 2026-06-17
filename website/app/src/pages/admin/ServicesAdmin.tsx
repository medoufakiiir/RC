import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import { adminApi, type Service } from '../../services/adminApi';

interface FormState {
  titleEn: string; titleAr: string;
  descEn: string; descAr: string;
  slug: string; order: string;
}

const EMPTY: FormState = { titleEn: '', titleAr: '', descEn: '', descAr: '', slug: '', order: '0' };

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

function ServiceForm({ initial, onSave, onCancel }: { initial: FormState; onSave: (f: FormState) => Promise<void>; onCancel: () => void }) {
  const [f, setF] = useState(initial);
  const [saving, setSaving] = useState(false);
  const set = (k: keyof FormState, v: string) => setF(prev => ({ ...prev, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try { await onSave(f); } finally { setSaving(false); }
  }

  const inp = 'w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/25 focus:outline-none focus:border-brand-blue/60';

  return (
    <form onSubmit={submit} className="bg-[#131c35] border border-white/10 rounded-xl p-4 space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-white/40 mb-1">Title (EN)</label>
          <input className={inp} value={f.titleEn} onChange={e => {
            const v = e.target.value;
            setF(prev => ({ ...prev, titleEn: v, ...(initial.slug === '' && { slug: slugify(v) }) }));
          }} required />
        </div>
        <div>
          <label className="block text-xs text-white/40 mb-1">Title (AR)</label>
          <input className={inp} value={f.titleAr} onChange={e => set('titleAr', e.target.value)} required dir="rtl" />
        </div>
        <div>
          <label className="block text-xs text-white/40 mb-1">Slug</label>
          <input className={inp} value={f.slug} onChange={e => set('slug', e.target.value)} required placeholder="e.g. speech-therapy" />
        </div>
        <div>
          <label className="block text-xs text-white/40 mb-1">Order</label>
          <input type="number" className={inp} value={f.order} onChange={e => set('order', e.target.value)} />
        </div>
      </div>
      <div>
        <label className="block text-xs text-white/40 mb-1">Description (EN)</label>
        <textarea className={inp} rows={2} value={f.descEn} onChange={e => set('descEn', e.target.value)} />
      </div>
      <div>
        <label className="block text-xs text-white/40 mb-1">Description (AR)</label>
        <textarea className={inp} rows={2} value={f.descAr} onChange={e => set('descAr', e.target.value)} dir="rtl" />
      </div>
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="p-1.5 text-white/40 hover:text-white"><X size={16} /></button>
        <button type="submit" disabled={saving} className="px-3 py-1.5 bg-brand-blue text-white text-xs rounded-lg disabled:opacity-50">
          {saving ? 'Saving…' : <span className="flex items-center gap-1"><Check size={14} /> Save</span>}
        </button>
      </div>
    </form>
  );
}

export default function ServicesAdmin() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);

  useEffect(() => {
    adminApi.services().then(s => { setServices(s); setLoading(false); });
  }, []);

  async function toggle(s: Service) {
    setToggling(s.id);
    try {
      const updated = await adminApi.updateService(s.id, { isActive: !s.isActive });
      setServices(prev => prev.map(x => x.id === updated.id ? updated : x));
    } finally {
      setToggling(null);
    }
  }

  async function create(f: FormState) {
    const svc = await adminApi.createService({
      titleEn: f.titleEn, titleAr: f.titleAr,
      descEn: f.descEn, descAr: f.descAr,
      slug: f.slug, order: parseInt(f.order) || 0, isActive: true,
    });
    setServices(prev => [...prev, svc]);
    setCreating(false);
  }

  async function update(id: string, f: FormState) {
    const svc = await adminApi.updateService(id, {
      titleEn: f.titleEn, titleAr: f.titleAr,
      descEn: f.descEn, descAr: f.descAr,
      slug: f.slug, order: parseInt(f.order) || 0,
    });
    setServices(prev => prev.map(x => x.id === svc.id ? svc : x));
    setEditing(null);
  }

  async function del(id: string) {
    if (!confirm('Delete this service?')) return;
    await adminApi.deleteService(id);
    setServices(prev => prev.filter(x => x.id !== id));
  }

  if (loading) return <div className="text-white/40 text-sm">Loading…</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-white">Services</h1>
        <button
          onClick={() => { setCreating(true); setEditing(null); }}
          className="flex items-center gap-1.5 px-3 py-2 bg-brand-blue text-white text-sm rounded-lg hover:bg-brand-blue/90 transition"
        >
          <Plus size={15} /> Add Service
        </button>
      </div>

      {creating && (
        <ServiceForm initial={EMPTY} onSave={create} onCancel={() => setCreating(false)} />
      )}

      <div className="bg-[#0d1428] border border-white/8 rounded-xl overflow-hidden divide-y divide-white/5">
        {services.length === 0 && (
          <div className="px-4 py-8 text-center text-white/30 text-sm">No services yet</div>
        )}
        {services.map(s => (
          editing === s.id ? (
            <div key={s.id} className="p-3">
              <ServiceForm
                initial={{ titleEn: s.titleEn, titleAr: s.titleAr, descEn: s.descEn, descAr: s.descAr, slug: s.slug, order: String(s.order) }}
                onSave={f => update(s.id, f)}
                onCancel={() => setEditing(null)}
              />
            </div>
          ) : (
            <div key={s.id} className="flex items-center gap-4 px-4 py-4">
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white">{s.titleEn}</div>
                <div className="text-xs text-white/40 mt-0.5">{s.titleAr}</div>
                {s.descEn && <div className="text-xs text-white/30 mt-1 line-clamp-2">{s.descEn}</div>}
              </div>
              <div className="text-xs text-white/25 font-mono hidden sm:block">{s.slug}</div>
              <div className="text-xs text-white/25">#{s.order}</div>
              <button
                onClick={() => toggle(s)}
                disabled={toggling === s.id}
                className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 disabled:opacity-50 ${s.isActive ? 'bg-brand-blue' : 'bg-white/15'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${s.isActive ? 'translate-x-5' : ''}`} />
              </button>
              <div className="flex gap-1">
                <button onClick={() => { setEditing(s.id); setCreating(false); }}
                  className="p-1.5 text-white/40 hover:text-white transition"><Pencil size={14} /></button>
                <button onClick={() => del(s.id)}
                  className="p-1.5 text-white/40 hover:text-red-400 transition"><Trash2 size={14} /></button>
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
}
