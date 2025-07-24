import { useState, useEffect } from 'react';

const STORAGE_KEY = 'kidchat_prompts';
const DEFAULT_PROMPTS = [
  // Topics
  {
    id: 1,
    type: 'topic',
    emoji: '🐾',
    title: 'Animals',
    description: 'Tell me a fun fact about animals',
    prompt: 'Please use simple and interesting language to tell me a fun fact about animals, suitable for {age} year olds.',
    tags: ['Knowledge', 'Animals'],
    variables: ['age'],
    favorite: true,
  },
  {
    id: 2,
    type: 'topic',
    emoji: '🚀',
    title: 'Space',
    description: 'Tell me a fun story about space and planets',
    prompt: 'Tell me a fun story about space and planets in a way children can understand.',
    tags: ['Story', 'Space'],
    variables: [],
    favorite: false,
  },
  {
    id: 3,
    type: 'topic',
    emoji: '🔬',
    title: 'Science Fun',
    description: 'Explain a cool science fact or experiment',
    prompt: 'Explain a cool science fact or experiment for kids aged {age}.',
    tags: ['Science', 'Experiment'],
    variables: ['age'],
    favorite: false,
  },
  {
    id: 4,
    type: 'topic',
    emoji: '📚',
    title: 'Story Time',
    description: 'Tell me a short, inspiring story',
    prompt: 'Tell me a short, inspiring story for children.',
    tags: ['Story', 'Inspiration'],
    variables: [],
    favorite: false,
  },
  // Creative Activities
  {
    id: 5,
    type: 'activity',
    emoji: '🎨',
    title: 'Drawing Prompt',
    description: 'Give me an interesting drawing prompt',
    prompt: 'Give me an interesting drawing prompt, suitable for {age} year olds.',
    tags: ['Creative', 'Drawing'],
    variables: ['age'],
    favorite: false,
  },
  {
    id: 6,
    type: 'activity',
    emoji: '🧩',
    title: 'Riddle Time',
    description: 'Share a fun riddle for kids',
    prompt: 'Share a fun and age-appropriate riddle for a child aged {age}.',
    tags: ['Riddle', 'Game'],
    variables: ['age'],
    favorite: false,
  },
  {
    id: 7,
    type: 'activity',
    emoji: '🎵',
    title: 'Sing a Song',
    description: 'Suggest a simple song or rhyme',
    prompt: 'Suggest a simple, fun song or rhyme for children.',
    tags: ['Music', 'Song'],
    variables: [],
    favorite: false,
  },
  {
    id: 8,
    type: 'activity',
    emoji: '🧪',
    title: 'Mini Experiment',
    description: 'Describe a safe science experiment to try at home',
    prompt: 'Describe a safe and easy science experiment for kids to try at home.',
    tags: ['Science', 'Experiment'],
    variables: [],
    favorite: false,
  },
  // Parent Guides
  {
    id: 9,
    type: 'parent',
    emoji: '🛡️',
    title: 'Parent Guidance',
    description: 'How to guide children safely online',
    prompt: 'Please use clear language to tell parents how to guide {age} year olds safely online.',
    tags: ['Parent', 'Safety'],
    variables: ['age'],
    favorite: false,
  },
  {
    id: 10,
    type: 'parent',
    emoji: '⏰',
    title: 'Screen Time Tips',
    description: 'Advice for managing children’s screen time',
    prompt: 'Give parents practical tips for managing healthy screen time for children aged {age}.',
    tags: ['Parent', 'Screen Time'],
    variables: ['age'],
    favorite: false,
  },
  {
    id: 11,
    type: 'parent',
    emoji: '💬',
    title: 'Encouraging Curiosity',
    description: 'How to encourage kids to ask questions',
    prompt: 'How can parents encourage curiosity and questions in children?',
    tags: ['Parent', 'Curiosity'],
    variables: [],
    favorite: false,
  },
  {
    id: 12,
    type: 'parent',
    emoji: '🤝',
    title: 'Positive Reinforcement',
    description: 'Ways to praise and motivate children',
    prompt: 'Share effective ways for parents to praise and motivate their children.',
    tags: ['Parent', 'Motivation'],
    variables: [],
    favorite: false,
  },
];

function getPromptsFromStorage() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch {}
  return DEFAULT_PROMPTS;
}

export default function usePrompts() {
  const [prompts, setPrompts] = useState(getPromptsFromStorage());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prompts));
  }, [prompts]);

  const addPrompt = (prompt) => setPrompts((prev) => [...prev, { ...prompt, id: Date.now() + Math.random() }]);
  const removePrompt = (id) => setPrompts((prev) => prev.filter((p) => p.id !== id));
  const updatePrompt = (id, newPrompt) => setPrompts((prev) => prev.map((p) => (p.id === id ? { ...p, ...newPrompt } : p)));
  const toggleFavorite = (id) => setPrompts((prev) => prev.map((p) => (p.id === id ? { ...p, favorite: !p.favorite } : p)));
  const getPromptsByType = (type) => prompts.filter((p) => p.type === type);
  const searchPrompts = (keyword) => prompts.filter((p) => p.title.includes(keyword) || p.description.includes(keyword) || p.tags.some(t => t.includes(keyword)));

  return {
    prompts,
    addPrompt,
    removePrompt,
    updatePrompt,
    toggleFavorite,
    getPromptsByType,
    searchPrompts,
  };
}
