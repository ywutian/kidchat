import React from 'react';

export default function VoiceInput({ onResult, disabled }) {
  return (
    <button
      disabled
      style={{
        marginLeft: 8,
        padding: '8px 12px',
        borderRadius: 16,
        border: 'none',
        background: '#a5b4fc',
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        cursor: 'not-allowed',
        opacity: 0.5,
      }}
    >
      Voice input not available
    </button>
  );
}
