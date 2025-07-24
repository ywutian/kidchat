import React, { useState } from 'react';
import LoadingSpinner from '../common/LoadingSpinner';
import VoiceInput from './VoiceInput';

export default function InputArea({ onSendMessage, disabled, isLoading }) {
  const [value, setValue] = useState('');

  const handleSend = () => {
    if (!value.trim() || disabled || isLoading) return;
    onSendMessage(value.trim());
    setValue('');
  };

  const handleVoiceResult = (text) => {
    if (text) {
      setValue(text);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
        disabled={disabled || isLoading}
        placeholder={disabled ? 'Daily limit reached' : 'Enter your question...'}
        className="flex-1 px-4 py-3 rounded-2xl border-2 border-gray-200 text-base bg-white focus:border-indigo-400 focus:outline-none transition-colors duration-200 shadow-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
      />
      <VoiceInput onResult={handleVoiceResult} disabled={disabled || isLoading} />
      <button
        onClick={handleSend}
        disabled={!value.trim() || disabled || isLoading}
        className={`px-5 py-3 rounded-2xl font-bold text-white text-base transition-all duration-200 shadow-lg ${
          !value.trim() || disabled || isLoading
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-gradient-to-r from-indigo-400 to-purple-400 hover:scale-105 hover:shadow-xl'
        }`}
      >
        Send
      </button>
      {isLoading && <LoadingSpinner size={24} />}
    </div>
  );
}
