export interface Note {
  name: string;
  midi: number;
  frequency: number;
}

export interface Chord {
  root: string;
  quality: string;
  symbol: string;
  notes: Note[];
  midi: number[];
}

export interface RhythmPattern {
  name: string;
  pattern: number[]; // Array of durations (e.g., [1, 0.5, 0.5] for quarter, eighth, eighth)
}

export interface ChordProgression {
  chords: Chord[];
  key: string;
  scale: string;
  genre: string;
  tempo: number;
  voicing?: string; // Added for chord voicings/inversions
  rhythmPattern?: string; // Added for rhythmic patterns
  extensionDensity?: string; // Added for chord extension control
  alterationProbability?: number; // Added for alteration control (0-1)
  melodyNotes?: Note[]; // Added for melody generation
  enableMelody?: boolean; // Added to control melody generation
  enableHumanization?: boolean; // Added for humanization control
  humanizationAmount?: number; // Added for humanization intensity (0-1)
}

export interface Scale {
  name: string;
  intervals: number[];
  modes?: string[];
}

export interface Genre {
  name: string;
  patterns: number[][];
  chordTypes: string[];
  extensions: string[];
}