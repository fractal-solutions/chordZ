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

export interface ChordProgression {
  chords: Chord[];
  key: string;
  scale: string;
  genre: string;
  tempo: number;
  voicing?: string; // Added for chord voicings/inversions
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