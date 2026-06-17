import { useEffect, useState } from 'react';
import { Plus, Pencil, X, Check, KeyRound } from 'lucide-react';
import { adminApi, getStoredAdmin } from '../../services/adminApi';
import type { ManagedUser, Role } from '../../services/adminApi';

interface FormState { name: string; email: string; role: string; password: string }

const EMPTY: FormState = { name: '', email: '', role: 'RECEPTIONIST', password: '' };

const ROLE_BADGE: Record<string, string> = {
  SUPER_ADMIN:  'bg-purple-500/15 text-purple-400',
  MANAGER:      'bg-brand-blue/15 text-brand-blue',
  RECEPTIONIST: 'bg-green-500/15 text-green-400',
};

function UserForm({ initial, availableRoles, onSave, onCancel }: {
  initial: FormState;
  availableRoles: string[];
  onSave: (f: FormState) => Promise<void>;
  onCancel: () => void;
}) {
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
          <label className="block text-xs text-white/40 mb-1">Name</label>
          <input className={inp} value={f.name} onChange={e => set('name', e.target.value)} required />
        </div>
        <div>
          <label className="block text-xs text-white/40 mb-1">Email</label>
          <input type="email" className={inp} value={f.email} onChange={e => set('email', e.target.value)} required />
        </div>
        <div>
          <label className="block text-xs text-white/40 mb-1">Role</label>
          <select className={inp} value={f.role} onChange={e => set('role', e.target.value)}>
            {availableRoles.map(r => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-white/40 mb-1">Password {initial.email ? '(leave blank)' : ''}</label>
          <input type="password" className={inp} value={f.password} onChange={e => set('password', e.target.value)}
            placeholder={initial.email ? 'Unchanged' : 'Riyada@2025'} />
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

export default function UsersAdmin() {
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [resetting, setResetting] = useState<string | null>(null);

  const admin = getStoredAdmin();
  const myRole = admin?.role ?? 'RECEPTIONIST';
  const availableRoles: string[] = myRole === 'SUPER_ADMIN'
    ? ['SUPER_ADMIN', 'MANAGER', 'RECEPTIONIST']
    : ['RECEPTIONIST'];

  useEffect(() => {
    adminApi.users().then(u => { setUsers(u); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  async function create(f: FormState) {
    const user = await adminApi.createUser({ email: f.email, name: f.name, role: f.role, password: f.password || undefined });
    setUsers(prev => [...prev, user]);
    setCreating(false);
  }

  async function update(id: string, f: FormState) {
    const user = await adminApi.updateUser(id, { name: f.name, email: f.email, role: f.role as Role });
    setUsers(prev => prev.map(u => u.id === id ? user : u));
    setEditing(null);
  }

  async function toggleActive(u: ManagedUser) {
    const updated = await adminApi.updateUser(u.id, { isActive: !u.isActive });
    setUsers(prev => prev.map(x => x.id === updated.id ? updated : x));
  }

  async function resetPwd(id: string) {
    if (!confirm('Reset password to Riyada@2025?')) return;
    setResetting(id);
    await adminApi.resetPassword(id);
    setResetting(null);
    alert('Password reset to Riyada@2025');
  }

  if (loading) return <div className="text-white/40 text-sm">Loading…</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-white">User Management</h1>
        <button onClick={() => { setCreating(true); setEditing(null); }}
          className="flex items-center gap-1.5 px-3 py-2 bg-brand-blue text-white text-sm rounded-lg hover:bg-brand-blue/90 transition">
          <Plus size={15} /> Add User
        </button>
      </div>

      {creating && <UserForm initial={EMPTY} availableRoles={availableRoles} onSave={create} onCancel={() => setCreating(false)} />}

      <div className="bg-[#0d1428] border border-white/8 rounded-xl overflow-hidden divide-y divide-white/5">
        {users.length === 0 && <div className="px-4 py-8 text-center text-white/30 text-sm">No users found</div>}
        {users.map(u => (
          editing === u.id ? (
            <div key={u.id} className="p-3">
              <UserForm initial={{ name: u.name, email: u.email, role: u.role, password: '' }} availableRoles={availableRoles}
                onSave={f => update(u.id, f)} onCancel={() => setEditing(null)} />
            </div>
          ) : (
            <div key={u.id} className="flex items-center gap-4 px-4 py-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white">{u.name}</span>
                  {!u.isActive && <span className="text-[10px] bg-red-500/15 text-red-400 px-1.5 py-0.5 rounded-full">Inactive</span>}
                </div>
                <div className="text-xs text-white/40 mt-0.5">{u.email}</div>
              </div>
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${ROLE_BADGE[u.role] ?? 'bg-white/10 text-white/50'}`}>
                {u.role.replace('_', ' ')}
              </span>
              {u.id !== admin?.id && (
                <div className="flex gap-1">
                  <button onClick={() => toggleActive(u)}
                    className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${u.isActive ? 'bg-brand-blue' : 'bg-white/15'}`}>
                    <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${u.isActive ? 'translate-x-5' : ''}`} />
                  </button>
                  <button onClick={() => { setEditing(u.id); setCreating(false); }}
                    className="p-1.5 text-white/40 hover:text-white transition"><Pencil size={14} /></button>
                  <button onClick={() => resetPwd(u.id)} disabled={resetting === u.id}
                    className="p-1.5 text-white/40 hover:text-yellow-400 transition disabled:opacity-50"><KeyRound size={14} /></button>
                </div>
              )}
            </div>
          )
        ))}
      </div>
    </div>
  );
}
