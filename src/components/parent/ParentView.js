import React, { useState } from 'react';
import UsageStats from './UsageStats';
import ConversationHistory from './ConversationHistory';
import BasicSettings from './BasicSettings';
import SafetyControls from './SafetyControls';

export default function ParentView() {
  const [tab, setTab] = useState('overview');
  return (
    <div className="w-full h-full flex flex-col flex-1 min-h-0">
      <div className="flex-1 min-h-0 flex flex-col">
        <div className="flex gap-4 p-4 border-b border-indigo-200 bg-white">
          <button
            className={`px-4 py-2 rounded-lg font-bold text-base transition-all ${tab === 'overview' ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-indigo-700'}`}
            onClick={() => setTab('overview')}
          >Overview</button>
          <button
            className={`px-4 py-2 rounded-lg font-bold text-base transition-all ${tab === 'history' ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-indigo-700'}`}
            onClick={() => setTab('history')}
          >Chat History</button>
          <button
            className={`px-4 py-2 rounded-lg font-bold text-base transition-all ${tab === 'settings' ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-indigo-700'}`}
            onClick={() => setTab('settings')}
          >Settings</button>
          <button
            className={`px-4 py-2 rounded-lg font-bold text-base transition-all ${tab === 'safety' ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-indigo-700'}`}
            onClick={() => setTab('safety')}
          >Safety</button>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto p-6">
          {tab === 'overview' && <UsageStats />}
          {tab === 'history' && <ConversationHistory />}
          {tab === 'settings' && <BasicSettings />}
          {tab === 'safety' && <SafetyControls />}
        </div>
      </div>
    </div>
  );
}
