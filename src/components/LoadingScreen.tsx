import React from 'react';

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-gray-900 flex flex-col items-center justify-center z-50">
      <h1 className="text-6xl font-bold text-white mb-8">VibeChordZ</h1>
      <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32"></div>
    </div>
  );
}