import { useState, useEffect } from 'react';
import { fetchGeminiResponse } from '../utils/geminiApi';

const SESSIONS_KEY = 'kidchat_sessions';
const ACTIVE_ID_KEY = 'kidchat_activeSessionId';
const SAFE_HINT = 'This topic is not suitable for children, let\'s chat about something interesting and safe!';
const POSITIVE_SUFFIXES = [
  '\nYou are amazing! What else do you want to ask the AI friend? 😊',
  '\nGreat! Keep your curiosity! 🌟',
  '\nGreat question! Do you want to chat about something else? 🤗',
  '\nI like chatting with you! What else do you want to know? 🎉',
  '\nYou learn quickly! Keep up the good work! 👍',
];

function getSensitiveWords() {
  try {
    const data = localStorage.getItem('kidchat_sensitive_words');
    if (data) return JSON.parse(data);
  } catch {}
  return ['ghost', 'horror', 'violence', 'gore', 'pornography', 'suicide', 'death', 'kill', 'bomb', 'explosion', 'drug'];
}

function filterContent(text) {
  if (!text) return '';
  const words = getSensitiveWords();
  for (const word of words) {
    if (text.includes(word)) return SAFE_HINT;
  }
  return text;
}

function getRandomPositiveSuffix() {
  return POSITIVE_SUFFIXES[Math.floor(Math.random() * POSITIVE_SUFFIXES.length)];
}

function getSessionsFromStorage() {
  try {
    const data = localStorage.getItem(SESSIONS_KEY);
    if (data) return JSON.parse(data);
  } catch {}
  // Default to creating a new session, titled "Session 1"
  return [{ id: Date.now(), title: 'Session 1', messages: [] }];
}

function getActiveIdFromStorage(sessions) {
  const id = localStorage.getItem(ACTIVE_ID_KEY);
  if (id && sessions.find(s => String(s.id) === String(id))) return id;
  return sessions[0].id;
}

export default function useChat() {
  const [sessions, setSessions] = useState(getSessionsFromStorage());
  const [activeSessionId, setActiveSessionId] = useState(() => getActiveIdFromStorage(getSessionsFromStorage()));
  const [isLoading, setIsLoading] = useState(false);
  const [showContinue, setShowContinue] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState('');

  useEffect(() => {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  }, [sessions]);
  useEffect(() => {
    localStorage.setItem(ACTIVE_ID_KEY, activeSessionId);
  }, [activeSessionId]);

  // Auto-generate session title (only if not manually renamed)
  const sessionLengths = sessions.map(s => s.messages.length).join(',');
  useEffect(() => {
    setSessions(sessions => sessions.map((s, idx) => {
      // Only process sessions with messages, titled "Session N" or empty
      if (s.messages && s.messages.length > 0 && (/^Session\d+$/.test(s.title) || !s.title)) {
        // Use the content of the first user message (first 20 characters) as the title
        const firstUserMsg = s.messages.find(m => m.type === 'user');
        if (firstUserMsg) {
          return { ...s, title: firstUserMsg.content.slice(0, 20) };
        }
      }
      return s;
    }));
  }, [sessions.length, sessionLengths]);

  const activeSession = sessions.find(s => String(s.id) === String(activeSessionId)) || sessions[0];
  const messages = activeSession?.messages || [];

  // Stream AI response
  const streamAIContent = (fullText, topic) => {
    setStreamingMessage('');
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setStreamingMessage(fullText.slice(0, i));
      if (i >= fullText.length) {
        clearInterval(interval);
        setSessions(sessions => sessions.map(s =>
          s.id === activeSessionId
            ? { ...s, messages: [...s.messages, {
                id: Date.now() + Math.random(),
                content: fullText,
                type: 'bot',
                topic,
                timestamp: new Date().toISOString(),
              }] }
            : s
        ));
        setStreamingMessage('');
        setIsLoading(false);
      }
    }, 18);
  };

  const sendMessage = async (content, topic = null) => {
    // 兼容 { text, image } 或 string
    let userMsgObj;
    if (typeof content === 'object' && (content.text || content.image)) {
      userMsgObj = {
        id: Date.now() + Math.random(),
        ...content,
        type: 'user',
        topic,
        timestamp: new Date().toISOString(),
      };
    } else {
      userMsgObj = {
        id: Date.now() + Math.random(),
        content: content,
        type: 'user',
        topic,
        timestamp: new Date().toISOString(),
      };
    }
    setSessions(sessions => sessions.map(s =>
      s.id === activeSessionId
        ? { ...s, messages: [...s.messages, userMsgObj] }
        : s
    ));
    setIsLoading(true);
    try {
      // 只将文本部分发给 AI
      let aiContent;
      if (typeof content === 'object' && content.text) {
        aiContent = await fetchGeminiResponse(content.text);
        aiContent = filterContent(aiContent) + getRandomPositiveSuffix();
        streamAIContent(aiContent, topic);
      } else if (typeof content === 'object' && content.image && !content.text) {
        // 只有图片没有文本，AI无法识别
        aiContent = "Sorry, I can't recognize images yet. Please enter text for me to help you!";
        streamAIContent(aiContent, topic);
      } else {
        aiContent = await fetchGeminiResponse(content);
        aiContent = filterContent(aiContent) + getRandomPositiveSuffix();
        streamAIContent(aiContent, topic);
      }
    } catch {
      setSessions(sessions => sessions.map(s =>
        s.id === activeSessionId
          ? { ...s, messages: [...s.messages, {
              id: Date.now() + Math.random(),
              content: "Sorry, I can't recognize images yet. Please enter text for me to help you!",
              type: 'bot',
              topic,
              timestamp: new Date().toISOString(),
            }] }
          : s
      ));
      setIsLoading(false);
    }
  };

  const clearMessages = () => setSessions(sessions => sessions.map(s =>
    s.id === activeSessionId ? { ...s, messages: [] } : s
  ));

  const continueSession = () => setShowContinue(false);

  // Multi-session management
  const newSession = () => {
    // Auto-number "Session N"
    return setSessions(sessions => {
      const nums = sessions
        .map(s => (s.title && s.title.startsWith('Session')) ? parseInt(s.title.replace('Session', '')) : 0)
        .filter(n => !isNaN(n));
      const nextNum = nums.length > 0 ? Math.max(...nums) + 1 : 1;
      const id = Date.now() + Math.random();
      setActiveSessionId(id);
      return [...sessions, { id, title: `Session${nextNum}`, messages: [] }];
    });
  };
  const switchSession = (id) => setActiveSessionId(id);
  const deleteSession = (id) => {
    setSessions(sessions => {
      const filtered = sessions.filter(s => s.id !== id);
      if (filtered.length === 0) {
        // Keep at least one empty session
        const newId = Date.now() + Math.random();
        setActiveSessionId(newId);
        return [{ id: newId, title: 'New Session', messages: [] }];
      }
      if (id === activeSessionId) setActiveSessionId(filtered[0].id);
      return filtered;
    });
  };
  const renameSession = (id, title) => setSessions(sessions => sessions.map(s =>
    s.id === id ? { ...s, title } : s
  ));

  // Auto-generate current session interest/memory point summary
  const getSessionSummary = (sessionArg) => {
    const session = sessionArg || sessions.find(s => String(s.id) === String(activeSessionId)) || sessions[0];
    if (!session || !session.messages || session.messages.length === 0) return 'You are amazing today, keep your curiosity!';
    // Simple interest point extraction: count the most frequent keywords/topics
    const allText = session.messages.map(m => m.content).join(' ');
    const keywords = ['Science', 'Story', 'Animal', 'Space', 'Game', 'Drawing', 'Experiment', 'Learning', 'Question', 'Interest'];
    let fav = '';
    let maxCount = 0;
    keywords.forEach(k => {
      const count = (allText.match(new RegExp(k, 'g')) || []).length;
      if (count > maxCount) { fav = k; maxCount = count; }
    });
    if (fav && maxCount > 0) {
      return `You are particularly interested in the topic of "${fav}", keep your curiosity!`;
    }
    // Default encouragement
    return 'You are amazing today, keep your curiosity!';
  };

  return {
    sessions,
    activeSessionId,
    messages,
    sendMessage,
    isLoading,
    clearMessages,
    showContinue,
    continueSession,
    streamingMessage,
    newSession,
    switchSession,
    deleteSession,
    renameSession,
    getSessionSummary,
  };
}
