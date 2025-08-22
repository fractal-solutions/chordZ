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

export function getDiatonicChordQuality(scaleName: string, degree: number): string {
  const scale = SCALES[scaleName];
  if (!scale) {
    console.warn(`Scale ${scaleName} not found.`);
    return 'major'; // Default to major if scale not found
  }

  // Intervals from the root of the scale to the 1st, 3rd, 5th, and 7th of the chord built on the given degree
  const getInterval = (startDegree: number, targetDegree: number) => {
    const startIndex = (startDegree - 1) % scale.intervals.length;
    const targetIndex = (targetDegree - 1) % scale.intervals.length;
    let interval = scale.intervals[targetIndex] - scale.intervals[startIndex];
    if (interval < 0) interval += 12; // Ensure positive interval within an octave
    return interval;
  };

  const thirdInterval = getInterval(degree, degree + 2);
  const fifthInterval = getInterval(degree, degree + 4);
  const seventhInterval = getInterval(degree, degree + 6);

  if (thirdInterval === 4 && fifthInterval === 7) {
    if (seventhInterval === 11) return 'maj7'; // Major 7th
    if (seventhInterval === 10) return 'dom7'; // Dominant 7th
    return 'major'; // Major triad
  } else if (thirdInterval === 3 && fifthInterval === 7) {
    if (seventhInterval === 10) return 'min7'; // Minor 7th
    return 'minor'; // Minor triad
  } else if (thirdInterval === 3 && fifthInterval === 6) {
    if (seventhInterval === 9) return 'dim7'; // Diminished 7th
    if (seventhInterval === 10) return 'min7b5'; // Half-diminished 7th
    return 'diminished'; // Diminished triad
  }

  return 'major'; // Fallback
}

export function getChordFromScale(root: string, degree: number, scaleName: string, chordType?: string): Chord {
  const scaleNotes = getScaleNotes(root, scaleName);
  const chordRoot = scaleNotes[degree - 1];
  
  let intervals: number[] = [];
  let symbol = '';
  let determinedChordType = chordType;

  if (!determinedChordType) {
    // Determine diatonic chord quality if no specific chordType is provided
    const diatonicQuality = getDiatonicChordQuality(scaleName, degree);
    switch (diatonicQuality) {
      case 'major':
        determinedChordType = 'maj7'; // Default to maj7 for diatonic major
        break;
      case 'minor':
        determinedChordType = 'min7'; // Default to min7 for diatonic minor
        break;
      case 'dom7':
        determinedChordType = 'dom7'; // Default to dom7 for diatonic dominant
        break;
      case 'min7b5':
        determinedChordType = 'min7b5'; // Default to min7b5 for diatonic half-diminished
        break;
      case 'dim7':
        determinedChordType = 'dim7'; // Default to dim7 for diatonic diminished
        break;
      default:
        determinedChordType = 'triad'; // Fallback
    }
  }
  
  switch (determinedChordType) {
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
    case 'min7b5':
      intervals = [0, 3, 6, 10];
      symbol = 'm7b5';
      break;
    case 'dim7':
      intervals = [0, 3, 6, 9];
      symbol = 'dim7';
      break;
    case 'triad': // Default triad
      intervals = [0, 4, 7]; // Major triad as default
      symbol = '';
      // Re-evaluate for diatonic triad
      const diatonicTriadQuality = getDiatonicChordQuality(scaleName, degree);
      if (diatonicTriadQuality === 'minor') {
        intervals = [0, 3, 7];
      } else if (diatonicTriadQuality === 'diminished') {
        intervals = [0, 3, 6];
      }
      break;
    default:
      intervals = [0, 4, 7]; // Fallback to major triad
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
    quality: determinedChordType,
    symbol: chordRoot + symbol,
    notes,
    midi: notes.map(n => n.midi)
  };
}

export function generateProgression(key: string, scaleName: string, genreName: string): Chord[] {
  const genre = GENRES[genreName];
  const pattern = genre.patterns[Math.floor(Math.random() * genre.patterns.length)];
  
  return pattern.map(degree => {
    const diatonicQuality = getDiatonicChordQuality(scaleName, degree);
    let chosenChordType: string | undefined;

    // Prioritize genre-specific chord types that match the diatonic quality
    const compatibleChordTypes = genre.chordTypes.filter(type => {
      if (diatonicQuality.includes('major') && (type.includes('maj') || type === '9' || type === '11' || type === '13' || type === 'add9' || type === '6/9')) return true;
      if (diatonicQuality.includes('minor') && (type.includes('min') || type === '9' || type === '11' || type === '13')) return true;
      if (diatonicQuality.includes('dom') && (type.includes('dom') || type === '9' || type === '11' || type === '13' || type === 'alt')) return true;
      if (diatonicQuality.includes('dim') && (type.includes('dim') || type.includes('min7b5'))) return true;
      return false;
    });

    if (compatibleChordTypes.length > 0 && Math.random() < 0.7) { // 70% chance to use a compatible genre chord type
      chosenChordType = compatibleChordTypes[Math.floor(Math.random() * compatibleChordTypes.length)];
    } else {
      // Fallback to diatonic quality if no compatible genre type or random chance fails
      chosenChordType = diatonicQuality;
    }

    // Optionally add extensions
    if (genre.extensions.length > 0 && Math.random() < 0.3) { // 30% chance to add an extension
      const extension = genre.extensions[Math.floor(Math.random() * genre.extensions.length)];
      // This part needs more sophisticated logic to combine base chord type with extension
      // For now, a simple concatenation or replacement might be too naive.
      // A better approach would be to have a function that takes a base chord and an extension and returns a new chord type.
      // For simplicity, let's just pick a random chord type from genre.chordTypes if an extension is chosen,
      // or ensure the chosenChordType is one that can be extended.
      // For now, I'll keep it simple and just use the chosenChordType.
      // This is an area for future improvement.
    }
    
    return getChordFromScale(key, degree, scaleName, chosenChordType);
  });
}