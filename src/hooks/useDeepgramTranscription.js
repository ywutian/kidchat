import { createClient, LiveTranscriptionEvents } from '@deepgram/sdk';
import { useState, useRef, useCallback } from 'react';

export function useDeepgramTranscription() {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState(null);
  const connectionRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const mediaRecorderRef = useRef(null);

  const cleanup = useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }
    if (connectionRef.current) {
      connectionRef.current.finish();
      setTimeout(() => {
        connectionRef.current = null;
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach(track => track.stop());
          mediaStreamRef.current = null;
        }
        setIsRecording(false);
      }, 100);
    } else {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
        mediaStreamRef.current = null;
      }
      setIsRecording(false);
    }
  }, []);

  const startRecording = useCallback(async (onTranscript, language = 'en-US') => {
    try {
      const deepgramApiKey = "1a0247738c8061917d10303bc0d0fab28dbc5712";
      if (!deepgramApiKey) throw new Error('Deepgram API key is not set');
      const deepgram = createClient(deepgramApiKey);
      const connection = deepgram.listen.live({
        smart_format: true,
        model: 'nova-3',
        language,
        interim_results: true,
        punctuate: true,
      });
      connectionRef.current = connection;

      connection.on(LiveTranscriptionEvents.Open, async () => {
        mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(mediaStreamRef.current);
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0 && connection.getReadyState() === 1) {
            connection.send(event.data);
          }
        };
        mediaRecorder.start(250);
        mediaRecorderRef.current = mediaRecorder;
        setIsRecording(true);
      });

      connection.on(LiveTranscriptionEvents.Transcript, (data) => {
        const transcript = data?.channel?.alternatives?.[0]?.transcript || '';
        onTranscript(transcript, data.is_final);
      });

      connection.on(LiveTranscriptionEvents.Close, cleanup);
      connection.on(LiveTranscriptionEvents.Error, (err) => {
        setError(err.message);
        cleanup();
      });
    } catch (err) {
      setError(err.message);
      cleanup();
    }
  }, [cleanup]);

  const stopRecording = useCallback(() => {
    cleanup();
  }, [cleanup]);

  return { isRecording, error, startRecording, stopRecording };
} 