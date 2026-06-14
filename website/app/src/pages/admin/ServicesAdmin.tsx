import { useEffect, useState } from 'react';
import { adminApi, type Service } from '../../services/adminApi';

export default function ServicesAdmin() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    adminApi.services().then(s => { setServices(s); setLoading(false); });
  }, []);

  async function toggle(s: Service) {
    setSaving(s.id);
    const updated = await adminApi.updateService(s.id, { isActive: !s.isActive });
    setServices(prev => prev.map(x => x.id === updated.id ? updated : x));
    setSaving(null);
  }

  if (loading) return <div className="text-white/40 text-sm">Loading…</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-white">Services</h1>

      <div className="bg-[#0d1428] border border-white/8 rounded-xl overflow-hidden divide-y divide-white/5">
        {services.map(s => (
          <div key={s.id} className="flex items-center gap-4 px-4 py-4">
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white">{s.titleEn}</div>
              <div className="text-xs text-white/40 mt-0.5">{s.titleAr}</div>
              {s.descEn && <div className="text-xs text-white/30 mt-1 line-clamp-2">{s.descEn}</div>}
            </div>
            <div className="text-xs text-white/30">Order {s.order}</div>
            <button
              onClick={() => toggle(s)}
              disabled={saving === s.id}
              className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 disabled:opacity-50 ${s.isActive ? 'bg-brand-blue' : 'bg-white/15'}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${s.isActive ? 'translate-x-5' : ''}`} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
