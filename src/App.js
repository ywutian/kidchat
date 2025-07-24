import React, { useState, useEffect } from 'react';
import KidView from './components/kid/KidView';
import ParentView from './components/parent/ParentView';
import TopicSidebar from './components/kid/TopicSidebar';
import HelpHomeButtons from './components/kid/HelpHomeButtons';
import useUsageLimit from './hooks/useUsageLimit';
import useChat from './hooks/useChat';
import { AuthProvider, useAuth } from './hooks/AuthContext';
import ErrorBoundary from './components/common/ErrorBoundary';

function getProfile() {
  try {
    const data = localStorage.getItem('kidchat_profile');
    if (data) return JSON.parse(data);
  } catch {}
  return null;
}
function setProfile(profile) {
  localStorage.setItem('kidchat_profile', JSON.stringify(profile));
}
function calcAge(birth) {
  if (!birth) return '';
  const d = new Date(birth);
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  if (now.getMonth() < d.getMonth() || (now.getMonth() === d.getMonth() && now.getDate() < d.getDate())) age--;
  return age;
}

function ProfilePrompt({ onSave }) {
  const [gender, setGender] = useState('男');
  const [birth, setBirth] = useState('');
  const [show, setShow] = useState(() => !getProfile());
  const [error, setError] = useState('');
  if (!show) return null;
  const today = new Date().toISOString().slice(0, 10);
  const handleSave = () => {
    if (!birth) {
      setError('Please select a birth date.');
      return;
    }
    if (birth > today) {
      setError('Birth date cannot be later than today.');
      return;
    }
    setError('');
    onSave({ gender, birth });
    setShow(false);
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: 'linear-gradient(135deg, #fceabb 0%, #f8b6e0 100%)' }}>
      <div className="bg-white rounded-3xl shadow-2xl p-10 flex flex-col gap-6 min-w-[340px] border-4 border-pink-100 relative animate-bounce-in">
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-5xl select-none">🧸</div>
        <div className="text-2xl font-extrabold text-pink-500 text-center mb-2 tracking-wide drop-shadow">Welcome, little one!</div>
        <div className="text-lg font-bold text-indigo-600 text-center mb-2">Please complete your child's information</div>
        <div className="flex gap-4 items-center justify-center">
          <label className="font-bold text-lg">Gender<span className="text-red-500">*</span>：</label>
          <div className="flex gap-3">
            <button
              type="button"
              className={`flex flex-col items-center gap-1 px-5 py-3 rounded-2xl text-xl font-bold shadow transition-all border-4 ${gender === '男' ? 'bg-blue-200 border-blue-400 text-blue-700 scale-110' : 'bg-white border-gray-200 text-gray-400'}`}
              onClick={() => setGender('男')}
              style={{ transition: 'transform 0.15s', boxShadow: gender === '男' ? '0 4px 16px #60a5fa55' : '' }}
            >
              <span className="text-3xl">🚹</span> Male
            </button>
            <button
              type="button"
              className={`flex flex-col items-center gap-1 px-5 py-3 rounded-2xl text-xl font-bold shadow transition-all border-4 ${gender === '女' ? 'bg-pink-200 border-pink-400 text-pink-700 scale-110' : 'bg-white border-gray-200 text-gray-400'}`}
              onClick={() => setGender('女')}
              style={{ transition: 'transform 0.15s', boxShadow: gender === '女' ? '0 4px 16px #f472b655' : '' }}
            >
              <span className="text-3xl">🚺</span> Female
            </button>
            <button
              type="button"
              className={`flex flex-col items-center gap-1 px-5 py-3 rounded-2xl text-xl font-bold shadow transition-all border-4 ${gender === '其他' ? 'bg-purple-200 border-purple-400 text-purple-700 scale-110' : 'bg-white border-gray-200 text-gray-400'}`}
              onClick={() => setGender('其他')}
              style={{ transition: 'transform 0.15s', boxShadow: gender === '其他' ? '0 4px 16px #a78bfa55' : '' }}
            >
              <span className="text-3xl">⚧️</span> Other
            </button>
          </div>
        </div>
        <div className="flex gap-4 items-center justify-center">
          <label className="font-bold text-lg">Birth Date<span className="text-red-500">*</span>：</label>
          <div className="relative flex-1">
            <input
              type="date"
              className="border-4 border-pink-200 rounded-2xl px-6 py-3 w-full text-lg focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all placeholder-pink-300 pr-12 bg-pink-50 shadow"
              value={birth}
              max={today}
              onChange={e => setBirth(e.target.value)}
              placeholder="Please select a birth date"
              style={{ minWidth: 180 }}
              id="profile-birth-input"
            />
            <span
              className="absolute right-4 top-1/2 -translate-y-1/2 text-pink-300 cursor-pointer hover:scale-125 transition-transform"
              onClick={() => document.getElementById('profile-birth-input')?.focus()}
              tabIndex={0}
              role="button"
            >
              <svg width="26" height="26" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2Z"/></svg>
            </span>
          </div>
        </div>
        {error && <div className="text-red-500 text-base text-center font-bold animate-shake">{error}</div>}
        <button className="px-6 py-3 bg-gradient-to-r from-pink-400 to-indigo-400 text-white rounded-2xl text-lg font-bold mt-2 shadow-lg hover:scale-105 transition-all disabled:bg-gray-300" onClick={handleSave} disabled={!birth || birth > today}>Save</button>
        <div className="absolute left-4 bottom-4 text-2xl select-none opacity-30">☁️</div>
        <div className="absolute right-4 top-4 text-2xl select-none opacity-30">⭐️</div>
      </div>
    </div>
  );
}

function ParentPwdPrompt() {
  const { showPwdPrompt, setShowPwdPrompt, verifyParentPwd } = useAuth();
  const [pwd, setPwd] = useState('');
  const [msg, setMsg] = useState('');
  if (!showPwdPrompt) return null;
  const handleSubmit = (e) => {
    e.preventDefault();
    if (verifyParentPwd(pwd)) {
      setPwd('');
      setMsg('');
    } else {
      setMsg('Incorrect password, please try again.');
      setPwd('');
    }
  };
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <form className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col gap-4 min-w-[320px]" onSubmit={handleSubmit}>
        <div className="text-lg font-bold text-indigo-600">Please enter parent password</div>
        <input
          type="password"
          className="border rounded px-3 py-2"
          placeholder="Parent password"
          value={pwd}
          onChange={e => setPwd(e.target.value)}
          autoFocus
        />
        {msg && <div className="text-red-500 text-sm">{msg}</div>}
        <div className="flex gap-2 mt-2">
          <button type="submit" className="px-4 py-2 bg-indigo-500 text-white rounded">Confirm</button>
          <button type="button" className="px-4 py-2 bg-gray-300 text-gray-700 rounded" onClick={() => { setShowPwdPrompt(false); setPwd(''); setMsg(''); }}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

function App() {
  const { isOverLimit, remaining } = useUsageLimit();
  const chat = useChat();
  const [collapsed, setCollapsed] = useState(false);
  const { role } = useAuth();
  const [profile, setProfileState] = useState(getProfile());
  // 保存资料
  const handleProfileSave = (p) => {
    setProfile(p);
    setProfileState(p);
  };
  // prompt变量自动替换
  const fillPromptVars = (prompt) => {
    if (!profile) return prompt;
    let res = prompt;
    const age = calcAge(profile.birth);
    res = res.replaceAll('{age}', age);
    res = res.replaceAll('{gender}', profile.gender);
    if (typeof chat.getSessionSummary === 'function') {
      res = res.replaceAll('{memory}', chat.getSessionSummary());
    }
    return res;
  };
  // 包装 sendMessage
  const sendMessageWithVars = (content) => chat.sendMessage(fillPromptVars(content));
  return (
    <div className="h-screen w-screen flex bg-gradient-to-br from-blue-50 to-purple-100 overflow-hidden">
      <ProfilePrompt onSave={handleProfileSave} />
      <ParentPwdPrompt />
      <div className={
        collapsed
          ? 'h-full flex flex-col w-12 min-w-[48px] bg-gradient-to-br from-indigo-100 to-purple-100 border-r border-indigo-200 z-10'
          : 'h-full flex flex-col md:w-72 min-w-[280px] bg-gradient-to-br from-indigo-100 to-purple-100 border-r border-indigo-200 z-10 shadow-lg'
      }>
        <TopicSidebar
          onSelect={sendMessageWithVars}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          sessions={chat.sessions}
          activeSessionId={chat.activeSessionId}
          switchSession={chat.switchSession}
          newSession={chat.newSession}
          deleteSession={chat.deleteSession}
          renameSession={chat.renameSession}
        />
      </div>
      <div className={`flex-1 min-w-0 h-full w-full flex flex-col relative bg-transparent overflow-x-hidden z-20 ${collapsed ? 'rounded-2xl' : 'rounded-r-2xl'} shadow-2xl`}>
        {role === 'parent' ? (
          <ParentView />
        ) : (
          <KidView
            isOverLimit={isOverLimit}
            remaining={remaining}
            {...chat}
            sendMessage={sendMessageWithVars}
          />
        )}
      </div>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <AuthProvider>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </AuthProvider>
  );
}
