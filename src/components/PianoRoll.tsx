import React from 'react';
import { Chord } from '../types/music';

interface PianoRollProps {
  chords: Chord[];
  currentChord: number;
}

export function PianoRoll({ chords, currentChord }: PianoRollProps) {
  const midiRange = { min: 48, max: 84 }; // C3 to C6
  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  
  const isBlackKey = (noteIndex: number) => {
    const note = noteIndex % 12;
    return [1, 3, 6, 8, 10].includes(note);
  };
  
  const getNoteColor = (midi: number, chordIndex: number) => {
    if (chordIndex === currentChord) return 'bg-blue-500';
    if (chordIndex < currentChord) return 'bg-green-500/60';
    return 'bg-gray-500/40';
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">FL Studio Piano Roll View</h3>
      
      <div className="relative bg-gray-800 rounded-lg p-4 overflow-x-auto">
        <div className="flex">
          {/* Piano keys */}
          <div className="flex flex-col-reverse mr-2">
            {Array.from({ length: midiRange.max - midiRange.min + 1 }, (_, i) => {
              const midi = midiRange.min + i;
              const noteIndex = midi % 12;
              const octave = Math.floor(midi / 12) - 1;
              const isBlack = isBlackKey(noteIndex);
              
              return (
                <div
                  key={midi}
                  className={`
                    h-4 flex items-center px-2 text-xs font-mono border-b border-gray-700
                    ${isBlack 
                      ? 'bg-gray-900 text-gray-300 w-12' 
                      : 'bg-white text-black w-16'
                    }
                  `}
                >
                  {noteNames[noteIndex]}{octave}
                </div>
              );
            })}
          </div>
          
          {/* Note grid */}
          <div className="flex-1 relative" style={{ minWidth: `${chords.length * 80}px` }}>
            {Array.from({ length: midiRange.max - midiRange.min + 1 }, (_, rowIndex) => {
              const midi = midiRange.min + rowIndex;
              
              return (
                <div key={midi} className="h-4 border-b border-gray-700 relative">
                  {chords.map((chord, chordIndex) => {
                    const hasNote = chord.midi.includes(midi);
                    if (!hasNote) return null;
                    
                    return (
                      <div
                        key={chordIndex}
                        className={`
                          absolute h-3 rounded-sm border border-white/20
                          ${getNoteColor(midi, chordIndex)}
                        `}
                        style={{
                          left: `${chordIndex * 80}px`,
                          width: '70px',
                          top: '2px'
                        }}
                      />
                    );
                  })}
                </div>
              );
            })}
            
            {/* Chord markers */}
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gray-700/50">
              {chords.map((chord, index) => (
                <div
                  key={index}
                  className={`
                    absolute h-full flex items-center justify-center text-xs font-medium
                    border-r border-gray-600
                    ${index === currentChord 
                      ? 'bg-blue-600/30 text-blue-300' 
                      : 'text-gray-400'
                    }
                  `}
                  style={{
                    left: `${index * 80}px`,
                    width: '80px'
                  }}
                >
                  {chord.symbol}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}