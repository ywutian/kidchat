// Gemini API utility with multi-key rotation and custom model support.
const GEMINI_API_KEYS = [
  'AIzaSyAYkZ9Kw18BTsxzwMAVCajLjxbU9OInjVQ',
  'AIzaSyDsm7MsVHEJBO10SBNy11wg6eAqq-s63Bs',
  'AIzaSyB8IkzmPQdow6dKu5rn_ywK5fMDAnyQd5s',
  'AIzaSyDAVTtwtk3FqFzmJC7xYB7n4v-hGbD0JLE',
  'AIzaSyBx0O2nJ395IOmwZs1TsFV_k4b-UPZLkrw',
  'AIzaSyAw0SizbU2D7fwxUetA0SiNu5TX5A1BbtM',
];
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com';
const GEMINI_MODEL = 'gemini-2.5-flash-preview-05-20';

export async function fetchGeminiResponse(prompt, model = GEMINI_MODEL) {
  let lastError = null;
  for (const key of GEMINI_API_KEYS) {
    try {
      const url = `${GEMINI_BASE_URL}/v1beta/models/${model}:generateContent?key=${key}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });
      if (res.status === 403 || res.status === 429) {
        lastError = new Error('Key quota exceeded or rate limited');
        continue; // Try next key
      }
      if (!res.ok) throw new Error('Gemini API request failed');
      const data = await res.json();
      return data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    } catch (err) {
      lastError = err;
      continue;
    }
  }
  throw lastError || new Error('All Gemini API Keys are unavailable');
}
