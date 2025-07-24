import React from 'react';
import StatCard from './StatCard';
import useChat from '../../hooks/useChat';

export default function UsageStats({ overviewMode }) {
  const { sessions } = useChat();
  const today = new Date().toISOString().slice(0, 10);
  let msgCount = 0;
  let activeDays = new Set();
  let topicSet = new Set();
  let totalMinutes = 0;
  sessions.forEach(s => {
    s.messages.forEach(m => {
      if (m.timestamp && m.timestamp.startsWith(today)) msgCount++;
      if (m.timestamp) activeDays.add(m.timestamp.slice(0, 10));
      if (m.topic) topicSet.add(m.topic);
    });
  });
  totalMinutes = sessions.reduce((sum, s) => sum + s.messages.length, 0);
  const stats = [
    { title: "Today's Message Count", value: msgCount, icon: '💬', trend: '' },
    { title: 'Active Days', value: activeDays.size, icon: '📅', trend: '' },
    { title: 'Learning Topics', value: topicSet.size, icon: '📚', trend: '' },
    { title: 'Learning Duration', value: `${totalMinutes} minutes`, icon: '⏰', trend: '' },
  ];
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((s, i) => (
          <StatCard key={i} {...s} />
        ))}
      </div>
      {!overviewMode && (
        <div className="bg-gray-50 rounded-xl p-6 text-gray-500 text-center">
          <div>Charts and trends for the last 7 days can be displayed here.</div>
        </div>
      )}
    </div>
  );
}
