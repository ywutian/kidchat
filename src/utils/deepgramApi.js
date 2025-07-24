// Deepgram API wrapper, frontend fetch method
const DEEPGRAM_API_KEY = '1a0247738c8061917d10303bc0d0fab28dbc5712';
const DEEPGRAM_API_URL = 'https://api.deepgram.com/v1/listen';

export async function transcribeAudio(audioBlob, { model = 'nova-3', language = 'zh-CN', mimeType } = {}) {
  const url = `${DEEPGRAM_API_URL}?model=${model}&language=${language}&smart_format=true`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Token ${DEEPGRAM_API_KEY}`,
      'Content-Type': mimeType || audioBlob.type || 'audio/webm',
    },
    body: audioBlob
  });
  if (!res.ok) throw new Error('Deepgram API request failed');
  const data = await res.json();
  return data?.results?.channels?.[0]?.alternatives?.[0]?.transcript || '';
}
