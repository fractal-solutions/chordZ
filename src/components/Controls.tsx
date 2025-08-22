import React from 'react';
import { Play, Pause, Square, Download, Shuffle } from 'lucide-react';
import { SCALES, GENRES } from '../utils/musicTheory';
import { NOTES } from '../utils/musicTheory';

interface ControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onStop: () => void;
  onGenerate: () => void;
  onExportMidi: () => void;
  selectedKey: string;
  selectedScale: string;
  selectedGenre: string;
  tempo: number;
  onKeyChange: (key: string) => void;
  onScaleChange: (scale: string) => void;
  onGenreChange: (genre: string) => void;
  onTempoChange: (tempo: number) => void;
}

export function Controls({
  isPlaying,
  onPlay,
  onStop,
  onGenerate,
  onExportMidi,
  selectedKey,
  selectedScale,
  selectedGenre,
  tempo,
  onKeyChange,
  onScaleChange,
  onGenreChange,
  onTempoChange
}: ControlsProps) {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 space-y-6">
      {/* Selection Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Key</label>
          <select
            value={selectedKey}
            onChange={(e) => onKeyChange(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {NOTES.map(note => (
              <option key={note} value={note}>{note}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Scale</label>
          <select
            value={selectedScale}
            onChange={(e) => onScaleChange(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Object.entries(SCALES).map(([key, scale]) => (
              <option key={key} value={key}>{scale.name}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Genre</label>
          <select
            value={selectedGenre}
            onChange={(e) => onGenreChange(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Object.entries(GENRES).map(([key, genre]) => (
              <option key={key} value={key}>{genre.name}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Tempo Control */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Tempo: {tempo} BPM
        </label>
        <input
          type="range"
          min="60"
          max="200"
          value={tempo}
          onChange={(e) => onTempoChange(parseInt(e.target.value))}
          className="w-full accent-blue-500"
        />
      </div>
      
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={onGenerate}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Shuffle size={18} />
          Generate
        </button>
        
        <button
          onClick={isPlaying ? onStop : onPlay}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          {isPlaying ? 'Playing...' : 'Play'}
        </button>
        
        <button
          onClick={onStop}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        >
          <Square size={18} />
          Stop
        </button>
        
        <button
          onClick={onExportMidi}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
        >
          <Download size={18} />
          Export MIDI
        </button>
      </div>
    </div>
  );
}