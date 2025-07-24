import React, { useState, useRef } from 'react';

export default function VoiceInput({ onResult, disabled }) {
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);
  const timeoutRef = useRef(null);

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  const cleanupRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.onend = null;
      recognitionRef.current.onerror = null;
      recognitionRef.current.onresult = null;
      try { recognitionRef.current.abort(); } catch {}
      recognitionRef.current = null;
    }
    clearTimeout(timeoutRef.current);
  };

  const handleClick = () => {
    if (disabled || !SpeechRecognition) return;
    if (!isRecording) {
      cleanupRecognition();
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        onResult && onResult(transcript);
      };
      recognition.onerror = () => {
        setIsRecording(false);
        cleanupRecognition();
      };
      recognition.onend = () => {
        setIsRecording(false);
        cleanupRecognition();
      };
      recognitionRef.current = recognition;
      recognition.start();
      setIsRecording(true);
      timeoutRef.current = setTimeout(() => {
        setIsRecording(val => {
          if (val) {
            cleanupRecognition();
            return false;
          }
          return val;
        });
      }, 3000);
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
      <button
        onClick={handleClick}
        disabled={disabled || !SpeechRecognition}
        style={{
          marginLeft: 8,
          padding: '8px 16px',
          borderRadius: 16,
          border: 'none',
          background: isRecording ? '#ef4444' : '#6366f1',
          color: '#fff',
          fontWeight: 'bold',
          fontSize: 18,
          cursor: disabled || !SpeechRecognition ? 'not-allowed' : 'pointer',
          opacity: disabled || !SpeechRecognition ? 0.5 : 1,
          boxShadow: isRecording ? '0 0 0 3px #ef444455' : '',
          transition: 'background 0.2s',
        }}
        title={disabled ? 'Voice input disabled' : !SpeechRecognition ? 'Browser not supported' : isRecording ? 'Click to stop recording' : 'Click to start recording'}
      >
        {isRecording ? 'Stop Recording' : 'Start Recording'}
        {!SpeechRecognition && <span style={{ color: 'red', marginLeft: 8 }}>Not supported</span>}
      </button>
    </div>
  );
}
