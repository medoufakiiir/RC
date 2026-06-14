import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import { adminApi, type Package } from '../../services/adminApi';

interface FormState {
  nameEn: string; nameAr: string; price: string; period: string;
  featuresEn: string; featuresAr: string; isPopular: boolean; isActive: boolean; order: string;
}

const EMPTY: FormState = { nameEn: '', nameAr: '', price: '', period: 'monthly', featuresEn: '', featuresAr: '', isPopular: false, isActive: true, order: '0' };

function Form({ initial, onSave, onCancel }: { initial: FormState; onSave: (f: FormState) => Promise<void>; onCancel: () => void }) {
  const [f, setF] = useState(initial);
  const [saving, setSaving] = useState(false);
  const set = (k: keyof FormState, v: string | boolean) => setF(prev => ({ ...prev, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try { await onSave(f); } finally { setSaving(false); }
  }

  const inp = 'w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/25 focus:outline-none focus:border-brand-blue/60';

  return (
    <form onSubmit={submit} className="bg-[#131c35] border border-white/10 rounded-xl p-4 space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div><label className="block text-xs text-white/40 mb-1">Name (EN)</label><input className={inp} value={f.nameEn} onChange={e => set('nameEn', e.target.value)} required /></div>
        <div><label className="block text-xs text-white/40 mb-1">Name (AR)</label><input className={inp} value={f.nameAr} onChange={e => set('nameAr', e.target.value)} required /></div>
        <div><label className="block text-xs text-white/40 mb-1">Price (SAR)</label><input type="number" className={inp} value={f.price} onChange={e => set('price', e.target.value)} required /></div>
        <div><label className="block text-xs text-white/40 mb-1">Period</label>
          <select className={inp} value={f.period} onChange={e => set('period', e.target.value)}>
            {['monthly','yearly','per-session'].map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>
      <div><label className="block text-xs text-white/40 mb-1">Features (EN) — one per line</label><textarea className={inp} rows={3} value={f.featuresEn} onChange={e => set('featuresEn', e.target.value)} /></div>
      <div><label className="block text-xs text-white/40 mb-1">Features (AR) — one per line</label><textarea className={inp} rows={3} value={f.featuresAr} onChange={e => set('featuresAr', e.target.value)} /></div>
      <div className="flex gap-4">
        <label className="flex items-center gap-2 text-sm text-white/60 cursor-pointer"><input type="checkbox" checked={f.isPopular} onChange={e => set('isPopular', e.target.checked)} className="accent-brand-blue" /> Popular</label>
        <label className="flex items-center gap-2 text-sm text-white/60 cursor-pointer"><input type="checkbox" checked={f.isActive} onChange={e => set('isActive', e.target.checked)} className="accent-brand-blue" /> Active</label>
        <div className="ml-auto flex gap-2">
          <button type="button" onClick={onCancel} className="p-1.5 text-white/40 hover:text-white"><X size={16} /></button>
          <button type="submit" disabled={saving} className="px-3 py-1.5 bg-brand-blue text-white text-xs rounded-lg disabled:opacity-50">
            {saving ? 'Saving…' : <span className="flex items-center gap-1"><Check size={14} /> Save</span>}
          </button>
        </div>
      </div>
    </form>
  );
}

export default function PackagesAdmin() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);

  useEffect(() => {
    adminApi.packages().then(p => { setPackages(p); setLoading(false); });
  }, []);

  async function create(f: FormState) {
    const pkg = await adminApi.createPackage({ ...f, price: parseFloat(f.price), order: parseInt(f.order) } as never);
    setPackages(prev => [...prev, pkg]);
    setCreating(false);
  }

  async function update(id: string, f: FormState) {
    const pkg = await adminApi.updatePackage(id, { ...f, price: parseFloat(f.price), order: parseInt(f.order) } as never);
    setPackages(prev => prev.map(x => x.id === pkg.id ? pkg : x));
    setEditing(null);
  }

  async function del(id: string) {
    if (!confirm('Delete this package?')) return;
    await adminApi.deletePackage(id);
    setPackages(prev => prev.filter(x => x.id !== id));
  }

  if (loading) return <div className="text-white/40 text-sm">Loading…</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-white">Packages</h1>
        <button onClick={() => setCreating(true)} className="flex items-center gap-1.5 px-3 py-2 bg-brand-blue text-white text-sm rounded-lg hover:bg-brand-blue/90 transition">
          <Plus size={15} /> New Package
        </button>
      </div>

      {creating && <Form initial={EMPTY} onSave={create} onCancel={() => setCreating(false)} />}

      <div className="space-y-3">
        {packages.map(pkg => (
          editing === pkg.id ? (
            <Form key={pkg.id} initial={{ nameEn: pkg.nameEn, nameAr: pkg.nameAr, price: String(pkg.price), period: pkg.period, featuresEn: pkg.featuresEn, featuresAr: pkg.featuresAr, isPopular: pkg.isPopular, isActive: pkg.isActive, order: String(pkg.order) }}
              onSave={f => update(pkg.id, f)} onCancel={() => setEditing(null)} />
          ) : (
            <div key={pkg.id} className="bg-[#0d1428] border border-white/8 rounded-xl p-4 flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white">{pkg.nameEn}</span>
                  <span className="text-xs text-white/40">{pkg.nameAr}</span>
                  {pkg.isPopular && <span className="text-[10px] bg-brand-pink/20 text-brand-pink px-1.5 py-0.5 rounded-full">Popular</span>}
                  {!pkg.isActive && <span className="text-[10px] bg-white/10 text-white/30 px-1.5 py-0.5 rounded-full">Inactive</span>}
                </div>
                <div className="text-lg font-bold text-white mt-1">{pkg.price.toLocaleString()} SAR <span className="text-xs font-normal text-white/40">/{pkg.period}</span></div>
                <div className="text-xs text-white/30 mt-1 line-clamp-2">{pkg.featuresEn.split('\n').slice(0,3).join(' · ')}</div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => setEditing(pkg.id)} className="p-1.5 text-white/40 hover:text-white transition"><Pencil size={14} /></button>
                <button onClick={() => del(pkg.id)} className="p-1.5 text-white/40 hover:text-red-400 transition"><Trash2 size={14} /></button>
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
}
