import { Note, Chord, Scale, Genre } from '../types/music';

export const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const SCALES: Record<string, Scale> = {
  major: { name: 'Major', intervals: [0, 2, 4, 5, 7, 9, 11] },
  minor: { name: 'Natural Minor', intervals: [0, 2, 3, 5, 7, 8, 10] },
  dorian: { name: 'Dorian', intervals: [0, 2, 3, 5, 7, 9, 10] },
  mixolydian: { name: 'Mixolydian', intervals: [0, 2, 4, 5, 7, 9, 10] },
  pentatonic: { name: 'Pentatonic', intervals: [0, 2, 4, 7, 9] },
  blues: { name: 'Blues', intervals: [0, 3, 5, 6, 7, 10] },
  harmonic_minor: { name: 'Harmonic Minor', intervals: [0, 2, 3, 5, 7, 8, 11] },
  melodic_minor: { name: 'Melodic Minor', intervals: [0, 2, 3, 5, 7, 9, 11] }
};

export const GENRES: Record<string, Genre> = {
  soul: {
    name: 'Soul',
    patterns: [
      [1, 6, 4, 5], // I-vi-IV-V
      [1, 4, 5, 1], // I-IV-V-I
      [1, 3, 6, 4], // I-iii-vi-IV
      [6, 4, 1, 5],  // vi-IV-I-V
      [1, 5, 6, 4, 2, 5, 1], // I-V-vi-IV-ii-V-I
      [2, 5, 1, 4, 7, 3, 6] // ii-V-I-IV-vii-iii-vi
    ],
    chordTypes: ['maj7', 'min7', 'dom7', '9', 'maj11', 'min11'],
    extensions: ['9', '11', '13', 'sus2', 'sus4']
  },
  neosoul: {
    name: 'Neo Soul',
    patterns: [
      [1, 7, 6, 2], // I-vii-vi-ii
      [1, 5, 6, 3], // I-V-vi-iii
      [2, 5, 1, 4], // ii-V-I-IV
      [6, 2, 5, 1],  // vi-ii-V-I
      [1, 3, 4, 5, 6, 2, 5, 1], // I-iii-IV-V-vi-ii-V-I
      [4, 1, 3, 6, 2, 5, 1] // IV-I-iii-vi-ii-V-I
    ],
    chordTypes: ['maj9', 'min9', 'dom9', '13', 'min11', 'maj13', 'min13'],
    extensions: ['add9', '6/9', 'maj13', 'min13', 'sus2']
  },
  rnb: {
    name: 'R&B',
    patterns: [
      [1, 5, 6, 4], // I-V-vi-IV
      [6, 4, 1, 5], // vi-IV-I-V
      [1, 6, 2, 5], // I-vi-ii-V
      [4, 5, 1, 6],  // IV-V-I-vi
      [1, 4, 6, 5, 1], // I-IV-vi-V-I
      [6, 5, 4, 3, 2, 5, 1] // vi-V-IV-iii-ii-V-I
    ],
    chordTypes: ['maj7', 'min7', '9', '6/9', 'add9', 'sus4'],
    extensions: ['add9', 'maj9', 'min9', 'sus4']
  },
  jazz: {
    name: 'Jazz',
    patterns: [
      [2, 5, 1, 6], // ii-V-I-vi
      [1, 6, 2, 5], // I-vi-ii-V
      [3, 6, 2, 5], // iii-vi-ii-V
      [1, 4, 7, 3],  // I-IV-vii-iii
      [1, 2, 3, 4, 5, 6, 7], // I-ii-iii-IV-V-vi-vii
      [1, 4, 2, 5, 3, 6, 1] // I-IV-ii-V-iii-vi-I
    ],
    chordTypes: ['maj7', 'min7', 'dom7', 'min7b5', 'dim7', 'alt', '#11', 'b13'],
    extensions: ['9', '11', '13', 'alt', 'sus4']
  },
  fusion: {
    name: 'Fusion',
    patterns: [
      [1, 7, 6, 5], // I-vii-vi-V
      [2, 7, 1, 4], // ii-vii-I-IV
      [1, 3, 5, 7], // I-iii-V-vii
      [6, 7, 1, 2],  // vi-vii-I-ii
      [1, 5, 2, 6, 3, 7, 4], // I-V-ii-vi-iii-vii-IV
      [1, 4, 5, 6, 7, 1] // I-IV-V-vi-vii-I
    ],
    chordTypes: ['maj7', 'min7', 'dom7', '9', '11', '13', 'sus2', '#11', 'b13'],
    extensions: ['add9', '#11', 'b13', 'sus2', 'sus4']
  }
};

export function noteToMidi(note: string, octave: number = 4): number {
  const noteIndex = NOTES.indexOf(note);
  return (octave + 1) * 12 + noteIndex;
}

export function midiToFrequency(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

export function getScaleNotes(root: string, scaleName: string): string[] {
  const rootIndex = NOTES.indexOf(root);
  const scale = SCALES[scaleName];
  
  return scale.intervals.map(interval => {
    const noteIndex = (rootIndex + interval) % 12;
    return NOTES[noteIndex];
  });
}

export function getChordFromScale(root: string, degree: number, scaleName: string, chordType: string = 'triad'): Chord {
  const scaleNotes = getScaleNotes(root, scaleName);
  const chordRoot = scaleNotes[degree - 1];
  
  let intervals: number[] = [];
  let symbol = '';
  
  switch (chordType) {
    case 'maj7':
      intervals = [0, 4, 7, 11];
      symbol = 'maj7';
      break;
    case 'min7':
      intervals = [0, 3, 7, 10];
      symbol = 'm7';
      break;
    case 'dom7':
      intervals = [0, 4, 7, 10];
      symbol = '7';
      break;
    case '9':
      intervals = [0, 4, 7, 10, 14];
      symbol = '9';
      break;
    case 'maj9':
      intervals = [0, 4, 7, 11, 14];
      symbol = 'maj9';
      break;
    case 'min9':
      intervals = [0, 3, 7, 10, 14];
      symbol = 'm9';
      break;
    case '11':
      intervals = [0, 4, 7, 10, 14, 17];
      symbol = '11';
      break;
    case '13':
      intervals = [0, 4, 7, 10, 14, 17, 21];
      symbol = '13';
      break;
    case 'maj11':
      intervals = [0, 4, 7, 11, 14, 17];
      symbol = 'maj11';
      break;
    case 'min11':
      intervals = [0, 3, 7, 10, 14, 17];
      symbol = 'm11';
      break;
    case 'maj13':
      intervals = [0, 4, 7, 11, 14, 17, 21];
      symbol = 'maj13';
      break;
    case 'min13':
      intervals = [0, 3, 7, 10, 14, 17, 21];
      symbol = 'm13';
      break;
    case 'alt':
      intervals = [0, 4, 8, 10, 13, 16]; // 1, 3, #5, b7, b9, #11
      symbol = 'alt';
      break;
    case 'sus2':
      intervals = [0, 2, 7];
      symbol = 'sus2';
      break;
    case 'sus4':
      intervals = [0, 5, 7];
      symbol = 'sus4';
      break;
    case 'add9':
      intervals = [0, 4, 7, 14];
      symbol = 'add9';
      break;
    case '6/9':
      intervals = [0, 4, 7, 9, 14];
      symbol = '6/9';
      break;
    case '#11':
      intervals = [0, 4, 7, 10, 14, 18];
      symbol = '#11';
      break;
    case 'b13':
      intervals = [0, 4, 7, 10, 14, 20];
      symbol = 'b13';
      break;
    default:
      intervals = [0, 4, 7];
      symbol = '';
  }
  
  const chordRootIndex = NOTES.indexOf(chordRoot);
  const notes: Note[] = intervals.map(interval => {
    const noteIndex = (chordRootIndex + interval) % 12;
    const octave = 4 + Math.floor((chordRootIndex + interval) / 12);
    const noteName = NOTES[noteIndex];
    const midi = noteToMidi(noteName, octave);
    
    return {
      name: noteName,
      midi,
      frequency: midiToFrequency(midi)
    };
  });
  
  return {
    root: chordRoot,
    quality: chordType,
    symbol: chordRoot + symbol,
    notes,
    midi: notes.map(n => n.midi)
  };
}

export function generateProgression(key: string, scaleName: string, genreName: string): Chord[] {
  const genre = GENRES[genreName];
  const pattern = genre.patterns[Math.floor(Math.random() * genre.patterns.length)];
  const chordType = genre.chordTypes[Math.floor(Math.random() * genre.chordTypes.length)];
  
  return pattern.map(degree => getChordFromScale(key, degree, scaleName, chordType));
}