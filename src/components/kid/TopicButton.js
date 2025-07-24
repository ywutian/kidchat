import React from 'react';

export default function TopicButton({ emoji, title, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 12px',
        borderRadius: 12,
        border: 'none',
        background: '#fff',
        color: '#6366f1',
        fontWeight: 'bold',
        fontSize: 15,
        cursor: 'pointer',
        marginBottom: 8,
      }}
    >
      <span style={{ fontSize: 18 }}>{emoji}</span>
      {title}
    </button>
  );
}
