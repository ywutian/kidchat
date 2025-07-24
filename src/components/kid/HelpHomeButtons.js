import React from 'react';

export default function HelpHomeButtons({ onHome, onHelp }) {
  return (
    <div className="fixed right-6 bottom-6 flex flex-col items-center space-y-3 z-50">
      <button
        className="w-12 h-12 rounded-full bg-indigo-400 text-white shadow-lg flex items-center justify-center text-2xl hover:bg-indigo-500 transition-all"
        onClick={onHome}
        title="Back to home"
      >🏠</button>
      <button
        className="w-12 h-12 rounded-full bg-yellow-400 text-white shadow-lg flex items-center justify-center text-2xl hover:bg-yellow-500 transition-all"
        onClick={onHelp}
        title="Help"
      >?</button>
      <button
        className="w-12 h-12 rounded-full bg-blue-400 text-white shadow-lg flex items-center justify-center text-2xl hover:bg-blue-500 transition-all"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        title="Back to top"
      >⬆️</button>
    </div>
  );
} 