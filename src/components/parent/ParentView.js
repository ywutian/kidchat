import React, { useState } from 'react';
import Header from '../layout/Header';
import UsageStats from './UsageStats';
import ConversationHistory from './ConversationHistory';
import SafetyControls from './SafetyControls';
import BasicSettings from './BasicSettings';

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'usage', label: 'Usage Statistics' },
  { id: 'history', label: 'Conversation History' },
  { id: 'safety', label: 'Safety Controls' },
  { id: 'settings', label: 'Basic Settings' },
];

export default function ParentView() {
  const [activeTab, setActiveTab] = useState('overview');
  return (
    <div className="min-h-screen bg-gray-50 px-4 md:px-8 lg:px-16">
      <Header />
      <div className="w-full max-w-6xl mx-auto mt-8 bg-white rounded-2xl shadow-xl p-10">
        <div className="flex space-x-6 border-b mb-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-2 px-2 text-lg font-bold border-b-2 transition-all duration-200 ${
                activeTab === tab.id ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-400 hover:text-indigo-400'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {activeTab === 'overview' && <UsageStats overviewMode />}
        {activeTab === 'usage' && <UsageStats />}
        {activeTab === 'history' && <ConversationHistory />}
        {activeTab === 'safety' && <SafetyControls />}
        {activeTab === 'settings' && <BasicSettings />}
      </div>
    </div>
  );
}
