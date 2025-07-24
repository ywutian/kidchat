import React, { useEffect, useState } from 'react';

export default function SafetyBanner({ isOverLimit, remaining }) {
  const [showBreak, setShowBreak] = useState(false);

  useEffect(() => {
    if (isOverLimit) {
      setShowBreak(true);
    }
  }, [isOverLimit]);

  return (
    <>
      {isOverLimit ? (
        <div className="bg-gradient-to-r from-orange-100 to-yellow-100 border-b border-orange-200 px-4 py-2 text-center text-orange-700 font-bold animate-pulse rounded-t-xl">
          Today's usage time has reached the limit, please take a break!🌟
        </div>
      ) : (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border-b border-green-200 px-4 py-2 text-center text-green-700 font-bold rounded-t-xl">
          Safety mode is enabled, today's remaining {remaining} minutes. Keep up the good work! Ask more, learn more, AI companion is always with you!
        </div>
      )}
      {showBreak && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
            <div className="text-2xl font-bold mb-4">Take a break!</div>
            <div className="mb-6 text-gray-500">You've done a great job today, remember to rest more and protect your eyes!</div>
            <button className="px-6 py-2 rounded bg-indigo-500 text-white font-bold shadow hover:bg-indigo-600" onClick={() => setShowBreak(false)}>
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}
