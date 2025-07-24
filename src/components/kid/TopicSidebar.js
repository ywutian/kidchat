import React, { useState } from 'react';
import usePrompts from '../../hooks/useTopics';
import { User, Shield, History, Sparkles, Plus, Trash2, Edit2, Star, StarOff } from 'lucide-react';
import { useAuth } from '../../hooks/AuthContext';

const PROMPT_TYPES = [
  { id: 'topic', label: 'Topics', icon: <Sparkles className="w-4 h-4" /> },
  { id: 'parent', label: 'Parent Guide', icon: <Shield className="w-4 h-4" /> },
];

export default function TopicSidebar({
  onSelect,
  collapsed,
  setCollapsed,
  sessions = [],
  activeSessionId,
  switchSession,
  newSession,
  deleteSession,
  renameSession,
}) {
  const {
    addPrompt,
    removePrompt,
    updatePrompt,
    toggleFavorite,
    getPromptsByType,
    searchPrompts,
  } = usePrompts();
  const [tab, setTab] = useState('topic');
  const { role, switchRole } = useAuth();
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editPrompt, setEditPrompt] = useState({});

  if (collapsed) {
    return (
      <div className="flex flex-col items-center justify-between h-full min-h-0 min-w-[48px] border-r border-indigo-100 bg-gradient-to-br from-indigo-100 to-purple-100 py-4">
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={() => { switchRole('kid'); }}
            className={`rounded-full p-2 mb-2 ${role === 'kid' ? 'bg-white text-indigo-500 shadow' : 'bg-indigo-200 text-indigo-700'}`}
            title="Kid Mode"
          >
            <User className="w-5 h-5" />
          </button>
          <button
            onClick={() => { switchRole('parent'); }}
            className={`rounded-full p-2 ${role === 'parent' ? 'bg-white text-indigo-500 shadow' : 'bg-indigo-200 text-indigo-700'}`}
            title="Parent Mode"
          >
            <Shield className="w-5 h-5" />
          </button>
        </div>
        <button
          className="w-10 h-10 rounded-full bg-indigo-200 text-indigo-700 text-2xl shadow hover:bg-indigo-300 transition-all mt-4"
          title="Expand Sidebar"
          onClick={() => setCollapsed(false)}
        >
          ➡️
        </button>
      </div>
    );
  }

  const filteredPrompts = search
    ? searchPrompts(search).filter(p => p.type === tab)
    : getPromptsByType(tab);

  const handlePromptClick = (prompt) => {
    if (prompt.variables && prompt.variables.length > 0) {
      let filled = prompt.prompt;
      prompt.variables.forEach(v => {
        const val = window.prompt(`Enter ${v}`);
        filled = filled.replaceAll(`{${v}}`, val || '');
      });
      onSelect && onSelect(filled);
    } else {
      onSelect && onSelect(prompt.prompt);
    }
  };

  const handleSavePrompt = () => {
    if (editingId) {
      updatePrompt(editingId, editPrompt);
    } else {
      addPrompt(editPrompt);
    }
    setEditingId(null);
    setEditPrompt({});
  };

  return (
    <aside className="w-72 min-w-[280px] h-full flex flex-col bg-gradient-to-br from-indigo-100 to-purple-100 shadow-lg p-0 relative border-r border-indigo-100">
      <div className="flex items-center gap-4 p-4 border-b border-indigo-200 bg-white justify-center">
        <button
          onClick={() => switchRole('kid')}
          className={`flex flex-col items-center px-4 py-2 rounded-xl font-bold text-lg shadow transition-all border-4 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${role === 'kid' ? 'bg-indigo-100 border-indigo-500 text-indigo-700 scale-110' : 'bg-white border-gray-200 text-gray-400'}`}
          style={{ minWidth: 80, boxShadow: role === 'kid' ? '0 4px 16px #6366f155' : '' }}
          title="Kid Mode"
        >
          <User className="w-7 h-7 mb-1" />
          Kid
        </button>
        <button
          onClick={() => switchRole('parent')}
          className={`flex flex-col items-center px-4 py-2 rounded-xl font-bold text-lg shadow transition-all border-4 focus:outline-none focus:ring-2 focus:ring-pink-400 ${role === 'parent' ? 'bg-pink-100 border-pink-500 text-pink-700 scale-110' : 'bg-white border-gray-200 text-gray-400'}`}
          style={{ minWidth: 80, boxShadow: role === 'parent' ? '0 4px 16px #f472b655' : '' }}
          title="Parent Mode"
        >
          <Shield className="w-7 h-7 mb-1" />
          Parent
        </button>
      </div>
      <div className="flex items-center gap-2 px-4 py-2 border-b border-indigo-100 bg-white">
        {PROMPT_TYPES.map(t => (
          <button
            key={t.id}
            className={`flex-1 flex items-center justify-center gap-1 py-2 font-bold text-indigo-600 ${tab === t.id ? 'border-b-2 border-indigo-500' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.icon} {t.label}
          </button>
        ))}
        <button
          className={`flex-1 flex items-center justify-center gap-1 py-2 font-bold text-indigo-600 ${tab === 'history' ? 'border-b-2 border-indigo-500' : ''}`}
          onClick={() => setTab('history')}
        >
          <History className="w-4 h-4" /> History
        </button>
      </div>
      <div className="px-4 py-2 border-b border-indigo-100 bg-white">
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Search keywords/tags..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <div className="flex-1 overflow-y-auto p-4 pb-8">
        {filteredPrompts.map((p) => (
          <div key={p.id} className="flex items-center gap-2 mb-3 bg-white rounded-xl shadow px-3 py-3 hover:bg-indigo-50 transition-all">
            <button
              onClick={() => handlePromptClick(p)}
              className="flex-1 flex items-center gap-2 text-lg font-bold text-indigo-700 text-left"
              title={p.description}
            >
              <span className="text-2xl">{p.emoji}</span>
              <span>{p.title}</span>
            </button>
            <button onClick={() => toggleFavorite(p.id)} title={p.favorite ? 'Unfavorite' : 'Favorite'}>
              {p.favorite ? <Star className="w-5 h-5 text-yellow-400" /> : <StarOff className="w-5 h-5 text-gray-300" />}
            </button>
            <button onClick={() => { setEditingId(p.id); setEditPrompt(p); }} title="Edit"><Edit2 className="w-5 h-5 text-indigo-400" /></button>
            <button onClick={() => removePrompt(p.id)} title="Delete"><Trash2 className="w-5 h-5 text-red-400" /></button>
          </div>
        ))}
        <button
          className="w-full mt-4 py-3 rounded-lg bg-indigo-400 text-white font-bold text-lg shadow hover:bg-indigo-500 transition-all flex items-center justify-center gap-2"
          onClick={() => { setEditingId(null); setEditPrompt({ type: tab, emoji: '', title: '', description: '', prompt: '', tags: [], variables: [], favorite: false }); }}
        >
          <Plus className="w-5 h-5" /> New {PROMPT_TYPES.find(t => t.id === tab)?.label}
        </button>
        {(editingId !== null || editPrompt.title) && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col gap-4 min-w-[320px]">
              <div className="text-lg font-bold text-indigo-600">{editingId ? 'Edit' : 'New'} Prompt</div>
              <input className="border rounded px-3 py-2" placeholder="Emoji" value={editPrompt.emoji || ''} onChange={e => setEditPrompt(p => ({ ...p, emoji: e.target.value }))} />
              <input className="border rounded px-3 py-2" placeholder="Title" value={editPrompt.title || ''} onChange={e => setEditPrompt(p => ({ ...p, title: e.target.value }))} />
              <input className="border rounded px-3 py-2" placeholder="Description" value={editPrompt.description || ''} onChange={e => setEditPrompt(p => ({ ...p, description: e.target.value }))} />
              <input className="border rounded px-3 py-2" placeholder="Prompt Content" value={editPrompt.prompt || ''} onChange={e => setEditPrompt(p => ({ ...p, prompt: e.target.value }))} />
              <input className="border rounded px-3 py-2" placeholder="Tags (comma separated)" value={editPrompt.tags?.join(',') || ''} onChange={e => setEditPrompt(p => ({ ...p, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) }))} />
              <input className="border rounded px-3 py-2" placeholder="Variables (e.g. age, comma separated)" value={editPrompt.variables?.join(',') || ''} onChange={e => setEditPrompt(p => ({ ...p, variables: e.target.value.split(',').map(t => t.trim()).filter(Boolean) }))} />
              <div className="flex gap-2 mt-2">
                <button className="px-4 py-2 bg-indigo-500 text-white rounded" onClick={handleSavePrompt}>Save</button>
                <button className="px-4 py-2 bg-gray-300 text-gray-700 rounded" onClick={() => { setEditingId(null); setEditPrompt({}); }}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
      {tab === 'history' && (
        <div className="space-y-2">
          {sessions.length === 0 && <div className="text-gray-400 text-center">No history yet</div>}
          {sessions.map((s, i) => (
            <div key={s.id} className={`flex items-center group ${s.id === activeSessionId ? 'bg-indigo-100' : ''} rounded-lg`}>
              <button
                onClick={() => switchSession(s.id)}
                className={`flex-1 text-left px-4 py-3 rounded-l-lg bg-white shadow hover:bg-indigo-50 transition-all font-medium text-indigo-700 ${s.id === activeSessionId ? 'font-bold' : ''}`}
              >
                {s.title || `Session ${i + 1}`}
              </button>
              <button
                className="px-2 py-2 hover:bg-indigo-100 rounded-r-lg"
                onClick={() => {
                  const newTitle = window.prompt('Enter new session title', s.title);
                  if (newTitle && newTitle !== s.title) renameSession(s.id, newTitle);
                }}
              >
                <Edit2 className="w-5 h-5" />
              </button>
              <button className="px-2 py-2 hover:bg-red-100 rounded-r-lg" onClick={() => deleteSession(s.id)}><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
          <button
            className="w-full mt-4 py-3 rounded-lg bg-indigo-400 text-white font-bold text-lg shadow hover:bg-indigo-500 transition-all flex items-center justify-center gap-2"
            onClick={() => newSession()}
          >
            <Plus className="w-5 h-5" /> New Session
          </button>
        </div>
      )}
      <div className="p-4 border-t border-indigo-100 text-xs text-gray-500 text-center">AI Buddy is always with you</div>
    </aside>
  );
}
