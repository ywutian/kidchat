import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/AuthContext';

const SETTINGS_KEY = 'kidchat_settings';
const DEFAULT_SETTINGS = {
  dailyMinutes: 60,
  notify: true,
  theme: 'light',
};

export default function BasicSettings() {
  const [settings, setSettings] = useState(() => {
    try {
      const data = localStorage.getItem(SETTINGS_KEY);
      if (data) return JSON.parse(data);
    } catch {}
    return DEFAULT_SETTINGS;
  });
  const { setParentPwd } = useAuth();
  const [oldPwd, setOldPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  const handleChangePwd = () => {
    const current = localStorage.getItem('kidchat_parent_pwd') || '';
    if (current && oldPwd !== current) {
      setMsg('Original password incorrect');
      return;
    }
    if (!newPwd) {
      setMsg('New password cannot be empty');
      return;
    }
    setParentPwd(newPwd);
    setMsg('Password changed successfully');
    setOldPwd('');
    setNewPwd('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="font-bold mb-2">Daily usage time limit</div>
        <input type="number" className="border rounded px-3 py-2 w-32" placeholder="Minutes" value={settings.dailyMinutes} min={1}
          onChange={e => setSettings(s => ({ ...s, dailyMinutes: Math.max(1, Number(e.target.value)) }))} />
      </div>
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="font-bold mb-2">Notification settings</div>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={settings.notify} onChange={e => setSettings(s => ({ ...s, notify: e.target.checked }))} /> Message reminder
        </label>
      </div>
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="font-bold mb-2">Appearance customization</div>
        <select className="border rounded px-3 py-2" value={settings.theme} onChange={e => setSettings(s => ({ ...s, theme: e.target.value }))}>
          <option value="light">Light mode</option>
          <option value="dark">Dark mode</option>
        </select>
      </div>
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="font-bold mb-2">Change parent password</div>
        <div className="flex flex-col gap-2 max-w-xs">
          <input type="password" className="border rounded px-3 py-2" placeholder="Original password (can be left empty for first time)" value={oldPwd} onChange={e => setOldPwd(e.target.value)} />
          <input type="password" className="border rounded px-3 py-2" placeholder="New password" value={newPwd} onChange={e => setNewPwd(e.target.value)} />
          <button className="px-4 py-2 bg-indigo-500 text-white rounded mt-2" onClick={handleChangePwd}>Change password</button>
          {msg && <div className="text-sm text-green-600 mt-1">{msg}</div>}
        </div>
      </div>
      <div className="bg-gray-50 rounded-xl p-6 flex items-center gap-4">
        <button className="px-4 py-2 bg-indigo-500 text-white rounded" onClick={() => alert('Export function under development')}>Export settings</button>
        <button className="px-4 py-2 bg-gray-300 text-gray-700 rounded" onClick={() => setSettings(DEFAULT_SETTINGS)}>Clear history</button>
      </div>
    </div>
  );
}
