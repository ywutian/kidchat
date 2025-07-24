import React, { useRef, useEffect, useState } from 'react';
import MessageBubble from './MessageBubble';

function speak(text) {
  if ('speechSynthesis' in window) {
    const utter = new window.SpeechSynthesisUtterance(text);
    utter.lang = 'zh-CN';
    window.speechSynthesis.speak(utter);
  }
}

export default function MessageList({ messages, onSpeak, streamingMessage, isLoading }) {
  const listRef = useRef(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  // Add a ref to track if user is near the bottom
  const isUserAtBottom = useRef(true);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  };

  // Only auto-scroll if user is at the bottom
  useEffect(() => {
    if (isUserAtBottom.current) {
      scrollToBottom();
    }
  }, [messages, streamingMessage, isLoading]);

  // Listen for scrolling to determine if the scroll-to-bottom button should be shown
  const handleScroll = () => {
    if (!listRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = listRef.current;
    setShowScrollBtn(scrollHeight - scrollTop - clientHeight > 80);
    // Update user scroll position
    isUserAtBottom.current = scrollHeight - scrollTop - clientHeight < 80;
  };

  if ((!messages || messages.length === 0) && !streamingMessage) {
    return <div className="text-gray-400 text-center mt-10 text-lg">No messages yet, let's chat with AI!</div>;
  }
  return (
    <div className="relative h-full min-h-0 flex-1 w-full px-2 md:px-8">
      <div
        ref={listRef}
        onScroll={handleScroll}
        className="space-y-4 overflow-y-auto max-h-full h-full min-h-0 flex-1 w-full pr-2 scrollbar-thin scrollbar-thumb-indigo-400 scrollbar-track-transparent pb-12"
      >
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} onSpeak={m => speak(m.content)} />
        ))}
        {streamingMessage && (
          <MessageBubble
            message={{ type: 'bot', content: streamingMessage }}
            onSpeak={m => speak(m.content)}
            isStreaming
          />
        )}
        {isLoading && !streamingMessage && (
          <div className="flex items-start space-x-3 animate-fade-in">
            <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-md bg-gradient-to-br from-indigo-400 to-purple-400">
              <span className="text-white text-lg font-bold select-none">🤖</span>
            </div>
            <div className="max-w-full lg:max-w-full w-full">
              <div className="p-4 rounded-2xl shadow-md bg-white text-gray-400 border border-gray-100 flex items-center gap-2">
                <span className="animate-pulse">AI is typing...</span>
              </div>
            </div>
          </div>
        )}
      </div>
      {showScrollBtn && (
        <button
          onClick={scrollToBottom}
          className="fixed bottom-28 right-10 z-20 bg-indigo-500 text-white rounded-full shadow-lg p-3 hover:bg-indigo-600 transition-all animate-bounce"
          style={{ boxShadow: '0 4px 16px #6366f155' }}
        >
          ⬇️ Back to bottom
        </button>
      )}
    </div>
  );
}
