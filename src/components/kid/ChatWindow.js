import React, { useEffect } from 'react';
import MessageList from './MessageList';
import InputArea from './InputArea';
import SafetyBanner from '../common/SafetyBanner';

function speak(text) {
  if ('speechSynthesis' in window) {
    const utter = new window.SpeechSynthesisUtterance(text);
    utter.lang = 'zh-CN';
    window.speechSynthesis.speak(utter);
  }
}

function CreativeActivityBar({ onActivity, disabled }) {
  return (
    <div className="flex gap-4 mt-4">
      <button
        className="flex-1 py-3 rounded-xl bg-pink-100 text-pink-700 font-bold text-lg shadow hover:bg-pink-200 transition-all"
        onClick={() => onActivity && onActivity('Give me an interesting drawing topic!')}
        disabled={disabled}
      >🎨 Drawing Topic</button>
      <button
        className="flex-1 py-3 rounded-xl bg-green-100 text-green-700 font-bold text-lg shadow hover:bg-green-200 transition-all"
        onClick={() => onActivity && onActivity('Tell me an interesting children\'s story!')}
        disabled={disabled}
      >📖 Story Time</button>
      <button
        className="flex-1 py-3 rounded-xl bg-yellow-100 text-yellow-700 font-bold text-lg shadow hover:bg-yellow-200 transition-all"
        onClick={() => onActivity && onActivity('Give me a suitable children\'s game!')}
        disabled={disabled}
      >🧩 Game Time</button>
    </div>
  );
}

const ChatWindow = React.forwardRef(({ disabled, messages, sendMessage, isLoading, onActivity, streamingMessage, isOverLimit, remaining }, ref) => {

  useEffect(() => {
    if (messages && messages.length > 0) {
      const last = messages[messages.length - 1];
      if (last.type === 'bot') speak(last.content);
    }
  }, [messages]);

  return (
    <div className="flex flex-col w-full h-full flex-1 min-h-0 bg-white/90 rounded-2xl shadow-2xl overflow-hidden">
      <SafetyBanner isOverLimit={isOverLimit} remaining={remaining} />
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-indigo-400 to-purple-400 text-white px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <span className="text-xl">✨</span>
          </div>
          <div>
            <h2 className="font-bold text-lg">Chat with AI Friend</h2>
            <p className="text-sm opacity-80">Learn anytime, anywhere!</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-xs hidden sm:inline">Online</span>
          <span className={`text-xs rounded px-2 py-1 ml-2 ${isOverLimit ? 'bg-orange-400 text-white' : 'bg-indigo-500 text-white'}`}>{isOverLimit ? 'Limit Reached' : `Remaining ${remaining} minutes`}</span>
        </div>
      </div>
      {/* Messages 区域只负责滚动消息 */}
      <div className="flex-1 min-h-0 h-full p-4 overflow-y-auto">
        <MessageList
          messages={messages}
          onSpeak={msg => speak(msg.content)}
          streamingMessage={streamingMessage}
          isLoading={isLoading}
        />
      </div>
      {/* 输入区始终固定在底部 */}
      <div className="shrink-0 p-3 border-t border-gray-100 bg-gray-50">
        <InputArea onSendMessage={sendMessage} disabled={isOverLimit} isLoading={isLoading} />
        <CreativeActivityBar onActivity={onActivity} disabled={isOverLimit} />
      </div>
    </div>
  );
});

export default ChatWindow;
