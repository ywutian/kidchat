import React from 'react';

export default function LoadingSpinner({ size = 32, color = '#6366f1' }) {
  return (
    <div style={{ display: 'inline-block', width: size, height: size }}>
      <svg
        style={{ animation: 'spin 1s linear infinite' }}
        width={size}
        height={size}
        viewBox="0 0 50 50"
      >
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeDasharray="31.4 31.4"
        />
      </svg>
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
