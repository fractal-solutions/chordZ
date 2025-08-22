import React from 'react';
import { Chord } from '../types/music';
import { Music } from 'lucide-react';

interface ChordDisplayProps {
  chord: Chord;
  isActive?: boolean;
}

export function ChordDisplay({ chord, isActive = false }: ChordDisplayProps) {
  return (
    <div className={`
      p-6 rounded-xl border transition-all duration-300 
      ${isActive 
        ? 'bg-blue-600/20 border-blue-400 shadow-lg shadow-blue-500/20' 
        : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
      }
    `}>
      <div className="flex items-center gap-3 mb-4">
        <Music className="text-blue-400" size={20} />
        <h3 className="text-2xl font-bold text-white">{chord.symbol}</h3>
      </div>
      
      <div className="space-y-2">
        <p className="text-sm text-gray-400">Notes:</p>
        <div className="flex flex-wrap gap-2">
          {chord.notes.map((note, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-gray-700 rounded-full text-sm text-white font-medium"
            >
              {note.name}
            </span>
          ))}
        </div>
        
        <div className="mt-3 pt-3 border-t border-gray-700">
          <p className="text-xs text-gray-500">MIDI Notes:</p>
          <p className="text-sm text-gray-300 font-mono">
            {chord.midi.join(', ')}
          </p>
        </div>
      </div>
    </div>
  );
}