import React, { useState } from 'react';
import useChat from '../../hooks/useChat';
import { marked } from 'marked';

function MarkdownContent({ text }) {
  return (
    <span
      className="block whitespace-pre-wrap break-words"
      dangerouslySetInnerHTML={{ __html: marked.parse(text || '', { mangle: false, headerIds: false, breaks: true }) }}
    />
  );
}

function TruncatedMessage({ content }) {
  const [expanded, setExpanded] = useState(false);
  const limit = 200;
  if (!content || content.length <= limit) {
    return <MarkdownContent text={content} />;
  }
  return (
    <>
      <MarkdownContent text={expanded ? content : content.slice(0, limit) + '...'} />
      <button
        className="text-xs text-indigo-500 underline ml-2"
        onClick={() => setExpanded(e => !e)}
      >
        {expanded ? 'Show less' : 'Show more'}
      </button>
    </>
  );
}

export default function ConversationHistory() {
  const { sessions, deleteSession, getSessionSummary } = useChat();
  const [search, setSearch] = useState('');

  // Export all history as txt
  const handleExport = () => {
    const lines = sessions.map(s => {
      const msgs = s.messages.map(m => `[${m.type === 'user' ? 'Child' : 'AI'}] ${m.content}`).join('\n');
      const summary = getSessionSummary ? getSessionSummary.call({ sessions, activeSessionId: s.id }) : '';
      return `【${s.title}】\n${msgs}\nGrowth Points: ${summary}`;
    }).join('\n\n');
    const blob = new Blob([lines], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'kidchat_history.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Clear all history in one click
  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear all conversation history?')) {
      sessions.forEach(s => deleteSession(s.id));
    }
  };

  // Get growth points for a single session
  const getSummaryForSession = (session) => {
    if (!session || !session.messages || session.messages.length === 0) return 'No growth points yet';
    if (getSessionSummary) {
      return getSessionSummary(session);
    }
    return 'No growth points yet';
  };

  // Filter sessions and messages
  const filteredSessions = sessions
    .map(s => ({
      ...s,
      filteredMessages: s.messages.filter(m => m.content.includes(search)),
    }))
    .filter(s => s.filteredMessages.length > 0 || !search);

  return (
    <div>
      <div className="flex mb-4 gap-2">
        <input
          className="border rounded px-3 py-2 flex-1"
          placeholder="Search message content..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button className="px-4 py-2 bg-indigo-500 text-white rounded" onClick={handleExport}>Export All History</button>
        <button className="px-4 py-2 bg-red-400 text-white rounded" onClick={handleClear}>Clear All History</button>
      </div>
      <div className="space-y-6">
        {filteredSessions.map((s, i) => (
          <div key={s.id} className="bg-white rounded-xl shadow p-4">
            <div className="font-bold text-indigo-600 text-lg mb-1">{s.title || `Conversation ${i + 1}`}</div>
            <div className="text-sm text-gray-500 mb-2">Growth Points: {getSummaryForSession(s)}</div>
            <div className="space-y-2">
              {s.filteredMessages.map(m => (
                <div key={m.id} className="flex items-start gap-2 p-2 rounded-lg bg-gray-50">
                  <span className="font-bold text-indigo-500 mt-1">{m.type === 'user' ? 'Child' : 'AI'}</span>
                  <span className="flex-1">
                    <TruncatedMessage content={m.content} />
                  </span>
                  {m.content.includes('不适合') && <span className="text-xs text-red-500 bg-red-100 rounded px-2 py-1">⚠️ Filtered</span>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
