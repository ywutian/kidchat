import { useState, useEffect } from 'react';
import { storage } from '../utils/storage';

const USAGE_KEY = 'kidchat_usage';
const DAILY_LIMIT = 60; // DAILY_LIMIT is the default daily usage limit in minutes

function getTodayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function getDailyLimit() {
  try {
    const data = localStorage.getItem('kidchat_settings');
    if (data) return JSON.parse(data).dailyMinutes || DAILY_LIMIT;
  } catch {}
  return DAILY_LIMIT;
}

export default function useUsageLimit() {
  const todayKey = getTodayKey();
  const [usage, setUsage] = useState(() => storage.get(USAGE_KEY, {}));
  const [minutes, setMinutes] = useState(usage[todayKey] || 0);
  const [limit, setLimit] = useState(getDailyLimit());

  useEffect(() => {
    setMinutes(usage[todayKey] || 0);
    setLimit(getDailyLimit());
  }, [usage, todayKey]);

  // 增加使用时长
  const addMinutes = (min) => {
    const newUsage = { ...usage, [todayKey]: (usage[todayKey] || 0) + min };
    setUsage(newUsage);
    storage.set(USAGE_KEY, newUsage);
  };

  // 重置今日时长
  const resetToday = () => {
    const newUsage = { ...usage, [todayKey]: 0 };
    setUsage(newUsage);
    storage.set(USAGE_KEY, newUsage);
  };

  const isOverLimit = minutes >= limit;
  const remaining = Math.max(0, limit - minutes);

  return { minutes, addMinutes, resetToday, isOverLimit, remaining, DAILY_LIMIT: limit };
}
