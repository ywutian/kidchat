import React, { useState, useEffect } from 'react';

const SENSITIVE_KEY = 'kidchat_sensitive_words';
const DEFAULT_WORDS = ['Ghost', 'Horror', 'Violence', 'Blood', 'Pornography', 'Suicide', 'Death', 'Kill', 'Bomb', 'Explosion', 'Drug'];

export default function SafetyControls() {
  const [words, setWords] = useState(() => {
    try {
      const data = localStorage.getItem(SENSITIVE_KEY);
      if (data) return JSON.parse(data);
    } catch {}
    return DEFAULT_WORDS;
  });
  const [input, setInput] = useState('');

  useEffect(() => {
    localStorage.setItem(SENSITIVE_KEY, JSON.stringify(words));
  }, [words]);

  const addWord = () => {
    if (input && !words.includes(input)) setWords([...words, input]);
    setInput('');
  };
  const removeWord = (w) => setWords(words.filter(x => x !== w));
  const resetWords = () => setWords(DEFAULT_WORDS);

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="font-bold mb-2">Sensitive Word Management</div>
        <div className="flex gap-2 mb-2 flex-wrap">
          {words.map(w => (
            <span key={w} className="inline-flex items-center bg-red-100 text-red-600 rounded px-2 py-1 mr-2 mb-2">
              {w}
              <button className="ml-1 text-xs" onClick={() => removeWord(w)}>✕</button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input className="border rounded px-3 py-2 flex-1" placeholder="Add sensitive word..." value={input} onChange={e => setInput(e.target.value)} />
          <button className="px-4 py-2 bg-indigo-500 text-white rounded" onClick={addWord}>Add</button>
          <button className="px-4 py-2 bg-gray-300 text-gray-700 rounded" onClick={resetWords}>Reset</button>
        </div>
      </div>
    </div>
  );
}
