import React from 'react';

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-gray-900 flex flex-col items-center justify-center z-50 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-950 to-black opacity-75"></div>
      <h1 className="relative text-7xl font-extrabold text-white mb-12 animate-fade-in-up drop-shadow-lg">VibeChordZ</h1>
      <div className="relative w-64 h-64">
        <div className="absolute inset-0 border-8 border-t-8 border-blue-600 rounded-full animate-spin-slow-3d"></div>
        <div className="absolute inset-8 border-8 border-b-8 border-pink-600 rounded-full animate-spin-reverse-slow-3d"></div>
        <div className="absolute inset-16 border-8 border-r-8 border-green-600 rounded-full animate-spin-fast-3d"></div>
      </div>
      <p className="relative text-white text-xl mt-8 animate-fade-in-delay drop-shadow-md">Unlocking sonic possibilities...</p>
    </div>
  );
}