import React, { useEffect } from 'react';
import ChatWindow from './ChatWindow';

export default function KidView({
  isOverLimit,
  remaining,
  messages,
  sendMessage,
  isLoading,
  showContinue,
  continueSession,
  clearMessages,
  streamingMessage,
  addMinutes
}) {

  useEffect(() => {
    let timer;
    let active = true;
    function startTimer() {
      if (timer) clearInterval(timer);
      timer = setInterval(() => {
        if (active && !isOverLimit) {
          addMinutes && addMinutes(1);
        }
      }, 60000);
    }
    function handleVisibility() {
      active = !document.hidden;
    }
    document.addEventListener('visibilitychange', handleVisibility);
    startTimer();
    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [addMinutes, isOverLimit]);

  return (
    <div className="w-full h-full flex flex-col flex-1 min-h-0">
      <div className="flex-1 min-h-0 flex">
        <ChatWindow
          disabled={isOverLimit}
          messages={messages}
          sendMessage={sendMessage}
          isLoading={isLoading}
          onActivity={sendMessage}
          streamingMessage={streamingMessage}
          isOverLimit={isOverLimit}
          remaining={remaining}
        />
      </div>
    </div>
  );
}
