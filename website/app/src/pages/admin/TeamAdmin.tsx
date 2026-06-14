import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import { adminApi, type TeamMember } from '../../services/adminApi';

interface FormState { nameEn: string; nameAr: string; roleEn: string; roleAr: string; bio: string; initials: string; color: string; order: string }

const EMPTY: FormState = { nameEn: '', nameAr: '', roleEn: '', roleAr: '', bio: '', initials: '', color: '#3355EE', order: '0' };

const COLORS = ['#3355EE','#FF4D94','#33CC44','#7766DD','#FFCC22'];

function Form({ initial, onSave, onCancel }: { initial: FormState; onSave: (f: FormState) => Promise<void>; onCancel: () => void }) {
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
        <div><label className="block text-xs text-white/40 mb-1">Name (EN)</label><input className={inp} value={f.nameEn} onChange={e => set('nameEn', e.target.value)} required /></div>
        <div><label className="block text-xs text-white/40 mb-1">Name (AR)</label><input className={inp} value={f.nameAr} onChange={e => set('nameAr', e.target.value)} required /></div>
        <div><label className="block text-xs text-white/40 mb-1">Role (EN)</label><input className={inp} value={f.roleEn} onChange={e => set('roleEn', e.target.value)} required /></div>
        <div><label className="block text-xs text-white/40 mb-1">Role (AR)</label><input className={inp} value={f.roleAr} onChange={e => set('roleAr', e.target.value)} required /></div>
        <div><label className="block text-xs text-white/40 mb-1">Initials</label><input className={inp} value={f.initials} onChange={e => set('initials', e.target.value)} maxLength={3} required /></div>
        <div><label className="block text-xs text-white/40 mb-1">Order</label><input type="number" className={inp} value={f.order} onChange={e => set('order', e.target.value)} /></div>
      </div>
      <div><label className="block text-xs text-white/40 mb-1">Bio</label><textarea className={inp} rows={2} value={f.bio} onChange={e => set('bio', e.target.value)} /></div>
      <div>
        <label className="block text-xs text-white/40 mb-2">Avatar Color</label>
        <div className="flex gap-2">
          {COLORS.map(c => (
            <button key={c} type="button" onClick={() => set('color', c)} style={{ backgroundColor: c }}
              className={`w-7 h-7 rounded-full transition-transform ${f.color === c ? 'scale-125 ring-2 ring-white/50' : ''}`} />
          ))}
        </div>
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

export default function TeamAdmin() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);

  useEffect(() => {
    adminApi.team().then(t => { setTeam(t); setLoading(false); });
  }, []);

  async function create(f: FormState) {
    const member = await adminApi.createTeamMember({ ...f, order: parseInt(f.order), isActive: true } as never);
    setTeam(prev => [...prev, member]);
    setCreating(false);
  }

  async function update(id: string, f: FormState) {
    const member = await adminApi.updateTeamMember(id, { ...f, order: parseInt(f.order) } as never);
    setTeam(prev => prev.map(x => x.id === member.id ? member : x));
    setEditing(null);
  }

  async function del(id: string) {
    if (!confirm('Remove this team member?')) return;
    await adminApi.deleteTeamMember(id);
    setTeam(prev => prev.filter(x => x.id !== id));
  }

  if (loading) return <div className="text-white/40 text-sm">Loading…</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-white">Team</h1>
        <button onClick={() => setCreating(true)} className="flex items-center gap-1.5 px-3 py-2 bg-brand-blue text-white text-sm rounded-lg hover:bg-brand-blue/90 transition">
          <Plus size={15} /> Add Member
        </button>
      </div>

      {creating && <Form initial={EMPTY} onSave={create} onCancel={() => setCreating(false)} />}

      <div className="bg-[#0d1428] border border-white/8 rounded-xl overflow-hidden divide-y divide-white/5">
        {team.map(m => (
          editing === m.id ? (
            <div key={m.id} className="p-3">
              <Form initial={{ nameEn: m.nameEn, nameAr: m.nameAr, roleEn: m.roleEn, roleAr: m.roleAr, bio: m.bio, initials: m.initials, color: m.color, order: String(m.order) }}
                onSave={f => update(m.id, f)} onCancel={() => setEditing(null)} />
            </div>
          ) : (
            <div key={m.id} className="flex items-center gap-3 px-4 py-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ backgroundColor: m.color }}>{m.initials}</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white">{m.nameEn}</div>
                <div className="text-xs text-white/40 truncate">{m.roleEn}</div>
              </div>
              {!m.isActive && <span className="text-[10px] bg-white/10 text-white/30 px-1.5 py-0.5 rounded-full">Inactive</span>}
              <div className="flex gap-1 ml-2">
                <button onClick={() => setEditing(m.id)} className="p-1.5 text-white/40 hover:text-white transition"><Pencil size={14} /></button>
                <button onClick={() => del(m.id)} className="p-1.5 text-white/40 hover:text-red-400 transition"><Trash2 size={14} /></button>
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
}
