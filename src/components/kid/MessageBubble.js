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
  const text = message.text !== undefined ? message.text : message.content; // support both {text} and {content}
  const image = message.image;

  const renderContent = (text) =>
    isUser
      ? text && text.split(/\n/).map((line, i) => (
          <span key={i} style={{ display: 'block', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{line}</span>
        ))
      : text
        ? <span dangerouslySetInnerHTML={{ __html: safeMarkdown(text) }} style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }} />
        : null;

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
        <div className={`p-4 rounded-2xl shadow-md transition-all duration-200 flex flex-col gap-2 ${
          isUser
            ? 'bg-gradient-to-br from-indigo-400 to-purple-400 text-white rounded-br-md'
            : 'bg-white text-gray-800 rounded-tl-md border border-gray-100'
        } ${isStreaming ? 'animate-pulse' : ''}`}>
          {image && (
            <img src={image} alt="uploaded" style={{ maxWidth: 240, maxHeight: 180, borderRadius: 12, marginBottom: text ? 8 : 0 }} />
          )}
          {text && (
            <span className="text-base leading-relaxed break-words flex-1">
              {renderContent(text)}
            </span>
          )}
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
