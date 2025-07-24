import React from 'react';
import { marked } from 'marked';

function safeMarkdown(text) {
  // Only allow basic tags to prevent XSS
  const html = marked.parse(text || '', {
    mangle: false,
    headerIds: false,
    breaks: true,
  });
  // Image adaptive
  return html.replace(/<img /g, '<img style="max-width:100%;height:auto;" ');
}

export default function MessageBubble({ message, onSpeak, isStreaming }) {
  const isUser = message.type === 'user';
  // AI message uses Markdown rendering, user messages still use plain text
  const renderContent = (text) =>
    isUser
      ? text.split(/\n/).map((line, i) => (
          <span key={i} style={{ display: 'block', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{line}</span>
        ))
      : <span dangerouslySetInnerHTML={{ __html: safeMarkdown(text) }} style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }} />;

  return (
    <div className={`flex items-start ${isUser ? 'flex-row-reverse space-x-reverse' : ''} space-x-3 animate-fade-in`}>
      {/* Avatar */}
      <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md ${
        isUser ? 'bg-gradient-to-br from-yellow-400 to-pink-400' : 'bg-gradient-to-br from-indigo-400 to-purple-400'
      }`}>
        <span className="text-white text-lg font-bold select-none">{isUser ? 'I' : '🤖'}</span>
      </div>
      {/* Bubble */}
      <div className={`max-w-2xl mx-2 ${isUser ? 'text-right' : ''}`}>
        <div className={`p-4 rounded-2xl shadow-md transition-all duration-200 flex items-center gap-2 ${
          isUser
            ? 'bg-gradient-to-br from-indigo-400 to-purple-400 text-white rounded-br-md'
            : 'bg-white text-gray-800 rounded-tl-md border border-gray-100'
        } ${isStreaming ? 'animate-pulse' : ''}`}>
          <span className="text-base leading-relaxed break-words flex-1">
            {renderContent(message.content)}
          </span>
          {!isUser && !isStreaming && (
            <button
              onClick={() => onSpeak && onSpeak(message)}
              className="ml-2 text-indigo-400 hover:text-indigo-600 text-xl"
              title="Voice reading"
            >
              🔊
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
