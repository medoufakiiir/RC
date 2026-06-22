import { useEffect, useState } from 'react';
import { adminApi, getStoredAdmin } from '../../services/adminApi';

interface PermUser { id: string; name: string; email: string; role: string; isActive: boolean; chatbotEnabled: boolean }

function ChatbotPermissions() {
  const [users, setUsers] = useState<PermUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.chatbotPermissions().then(u => { setUsers(u); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  async function toggle(userId: string, enabled: boolean) {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, chatbotEnabled: enabled } : u));
    await adminApi.toggleChatbotAccess(userId, enabled);
  }

  if (loading) return <div className="text-white/30 text-sm py-4">Loading permissions...</div>;
  if (users.length === 0) return null;

  return (
    <div className="bg-[#0d1428] border border-white/8 rounded-xl p-5 space-y-3">
      <div className="mb-3">
        <h2 className="text-sm font-medium text-white">Chatbot Access Control</h2>
        <p className="text-xs text-white/40 mt-1">Enable or disable chatbot panel access for each user</p>
      </div>
      {users.map(u => (
        <label key={u.id} className="flex items-center justify-between py-3 px-4 bg-white/3 rounded-lg cursor-pointer border border-white/5 hover:border-white/10 transition">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-blue/20 flex items-center justify-center text-xs font-bold text-brand-blue">
              {u.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="text-sm text-white font-medium">{u.name}</div>
              <div className="text-xs text-white/40">{u.email} · {u.role}{!u.isActive ? ' · Inactive' : ''}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-medium ${u.chatbotEnabled ? 'text-green-400' : 'text-red-400'}`}>
              {u.chatbotEnabled ? 'Enabled' : 'Disabled'}
            </span>
            <input
              type="checkbox"
              className="accent-brand-blue w-4 h-4"
              checked={u.chatbotEnabled}
              onChange={e => toggle(u.id, e.target.checked)}
            />
          </div>
        </label>
      ))}
    </div>
  );
}

export default function AdminSettings() {
  const admin = getStoredAdmin();
  const isSuperAdmin = admin?.role === 'SUPER_ADMIN';

  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(isSuperAdmin);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [curPwd, setCurPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [pwdMsg, setPwdMsg] = useState('');
  const [pwdSaving, setPwdSaving] = useState(false);

  useEffect(() => {
    if (isSuperAdmin) {
      adminApi.settings().then(s => { setSettings(s); setLoading(false); }).catch(() => setLoading(false));
    }
  }, [isSuperAdmin]);

  async function saveSettings(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await adminApi.updateSettings(settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }

  const mustChange = localStorage.getItem('must_change_password') === 'true';

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwdMsg('');
    if (newPwd !== confirmPwd) {
      setPwdMsg('New passwords do not match.');
      return;
    }
    setPwdSaving(true);
    try {
      await adminApi.changePassword(curPwd, newPwd);
      localStorage.removeItem('must_change_password');
      setPwdMsg('Password updated successfully.');
      setCurPwd(''); setNewPwd(''); setConfirmPwd('');
    } catch (err: unknown) {
      setPwdMsg(err instanceof Error ? err.message : 'Failed to update password');
    } finally {
      setPwdSaving(false);
    }
  }

  if (loading) return <div className="text-white/40 text-sm">Loading…</div>;

  const inp = 'w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/25 focus:outline-none focus:border-brand-blue/60';

  const SITE_FIELDS: [string, string, string][] = [
    ['siteName',    'Site Name (EN)',       'Riyada Medical Centre'],
    ['siteNameAr',  'Site Name (AR)',       'مركز ريادة الطبي'],
    ['phone',       'Phone',               '+966 11 234 5678'],
    ['email',       'Contact Email',        'info@riyada.com'],
    ['address',     'Address (EN)',         'Al Olaya District, Riyadh'],
    ['addressAr',   'Address (AR)',         'حي العليا، الرياض'],
    ['instagram',   'Instagram URL',        ''],
    ['twitter',     'Twitter / X URL',      ''],
  ];

  return (
    <div className="space-y-8 max-w-2xl">
      <h1 className="text-xl font-semibold text-white">Settings</h1>

      {/* User Permissions — SUPER_ADMIN only */}
      {isSuperAdmin && <ChatbotPermissions />}

      {/* Site Settings — SUPER_ADMIN only */}
      {isSuperAdmin && (
        <form onSubmit={saveSettings} className="bg-[#0d1428] border border-white/8 rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-medium text-white mb-2">Site Information</h2>
          {SITE_FIELDS.map(([key, label, placeholder]) => (
            <div key={key}>
              <label className="block text-xs text-white/40 mb-1.5">{label}</label>
              <input className={inp} value={settings[key] ?? ''} placeholder={placeholder}
                onChange={e => setSettings(prev => ({ ...prev, [key]: e.target.value }))} />
            </div>
          ))}
          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 text-sm text-white/60 cursor-pointer">
              <input type="checkbox" checked={settings.maintenanceMode === 'true'} className="accent-brand-blue"
                onChange={e => setSettings(prev => ({ ...prev, maintenanceMode: e.target.checked ? 'true' : 'false' }))} />
              Maintenance Mode
            </label>
            <button type="submit" disabled={saving} className="px-4 py-2 bg-brand-blue text-white text-sm rounded-lg hover:bg-brand-blue/90 disabled:opacity-50 transition">
              {saving ? 'Saving…' : saved ? 'Saved!' : 'Save Settings'}
            </button>
          </div>
        </form>
      )}

      {/* Change Password — all roles */}
      {mustChange && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex items-center gap-3">
          <span className="text-yellow-400 text-lg">⚠</span>
          <div>
            <div className="text-sm font-medium text-yellow-300">Password change required</div>
            <div className="text-xs text-yellow-400/70 mt-0.5">You must set a new password before accessing the admin panel.</div>
          </div>
        </div>
      )}
      <form onSubmit={changePassword} className="bg-[#0d1428] border border-white/8 rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-medium text-white mb-2">Change Password</h2>
        <div>
          <label className="block text-xs text-white/40 mb-1.5">Current Password</label>
          <input type="password" className={inp} value={curPwd} onChange={e => setCurPwd(e.target.value)} required />
        </div>
        <div>
          <label className="block text-xs text-white/40 mb-1.5">New Password (min 8 characters)</label>
          <input type="password" className={inp} value={newPwd} onChange={e => setNewPwd(e.target.value)} minLength={8} required />
        </div>
        <div>
          <label className="block text-xs text-white/40 mb-1.5">Confirm New Password</label>
          <input type="password" className={inp} value={confirmPwd} onChange={e => setConfirmPwd(e.target.value)} minLength={8} required />
        </div>
        {pwdMsg && (
          <div className={`text-sm px-3 py-2 rounded-lg ${pwdMsg.includes('success') ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>{pwdMsg}</div>
        )}
        <button type="submit" disabled={pwdSaving} className="px-4 py-2 bg-white/10 text-white text-sm rounded-lg hover:bg-white/15 disabled:opacity-50 transition">
          {pwdSaving ? 'Updating…' : 'Change Password'}
        </button>
      </form>
    </div>
  );
}
