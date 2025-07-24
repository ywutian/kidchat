import React from 'react';

export default function StatCard({ title, value, icon, trend, onClick }) {
  return (
    <div
      className="bg-white rounded-xl shadow p-6 flex flex-col items-start gap-2 cursor-pointer hover:shadow-lg transition-all duration-200"
      onClick={onClick}
    >
      <div className="flex items-center gap-2 text-2xl">{icon}<span className="text-lg font-bold">{title}</span></div>
      <div className="text-3xl font-extrabold text-indigo-600">{value}</div>
      {trend && <div className="text-sm text-green-500">{trend}</div>}
    </div>
  );
}
