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

export function getNoteName(midi: number): string {
  return NOTES[midi % 12];
}

export function getChordName(midiNotes: number[]): string {
  if (midiNotes.length === 0) return 'No Chord';

  const rootMidi = midiNotes[0];
  const rootNote = NOTES[rootMidi % 12];

  const intervals = midiNotes.slice(1).map(note => (note - rootMidi) % 12);
  intervals.sort((a, b) => a - b);

  // Basic chord identification (can be expanded)
  if (intervals.includes(4) && intervals.includes(7)) {
    return `${rootNote} Major`;
  } else if (intervals.includes(3) && intervals.includes(7)) {
    return `${rootNote} Minor`;
  } else if (intervals.includes(4) && intervals.includes(7) && intervals.includes(10)) {
    return `${rootNote} Dominant 7`;
  } else if (intervals.includes(3) && intervals.includes(7) && intervals.includes(10)) {
    return `${rootNote} Minor 7`;
  } else if (intervals.includes(4) && intervals.includes(7) && intervals.includes(11)) {
    return `${rootNote} Major 7`;
  }

  return `${rootNote} Unknown Chord`;
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

export function applyInversion(midiNotes: number[], inversion: string): number[] {
  if (midiNotes.length === 0) return [];

  let invertedNotes = [...midiNotes].sort((a, b) => a - b); // Ensure sorted

  switch (inversion) {
    case 'first':
      if (invertedNotes.length > 1) {
        const root = invertedNotes[0];
        invertedNotes.shift(); // Remove root
        invertedNotes.push(root + 12); // Add root an octave higher
        invertedNotes.sort((a, b) => a - b); // Re-sort
      }
      break;
    case 'second':
      if (invertedNotes.length > 2) {
        const root = invertedNotes[0];
        const third = invertedNotes[1];
        invertedNotes.splice(0, 2); // Remove root and third
        invertedNotes.push(root + 12, third + 12); // Add them an octave higher
        invertedNotes.sort((a, b) => a - b); // Re-sort
      }
      break;
    case 'third': // For 7th chords and beyond
      if (invertedNotes.length > 3) {
        const root = invertedNotes[0];
        const third = invertedNotes[1];
        const fifth = invertedNotes[2];
        invertedNotes.splice(0, 3); // Remove root, third, fifth
        invertedNotes.push(root + 12, third + 12, fifth + 12); // Add them an octave higher
        invertedNotes.sort((a, b) => a - b); // Re-sort
      }
      break;
    case 'drop2': // Example of a voicing (more complex, just for illustration)
      if (invertedNotes.length >= 4) {
        const secondNote = invertedNotes[invertedNotes.length - 2]; // Second from top
        invertedNotes.splice(invertedNotes.length - 2, 1); // Remove it
        invertedNotes.unshift(secondNote - 12); // Place it an octave lower at the beginning
        invertedNotes.sort((a, b) => a - b); // Re-sort
      }
      break;
    case 'root': // Default, no change
    default:
      break;
  }
  return invertedNotes;
}

export function getChordFromScale(root: string, degree: number, scaleName: string, chordType?: string, inversionType?: string, extensionDensity?: string, alterationProbability?: number): Chord {
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
  
  // Base intervals for common chord types
  const baseChordIntervals: Record<string, number[]> = {
    'maj7': [0, 4, 7, 11],
    'min7': [0, 3, 7, 10],
    'dom7': [0, 4, 7, 10],
    '9': [0, 4, 7, 10, 14],
    'maj9': [0, 4, 7, 11, 14],
    'min9': [0, 3, 7, 10, 14],
    '11': [0, 4, 7, 10, 14, 17],
    '13': [0, 4, 7, 10, 14, 17, 21],
    'maj11': [0, 4, 7, 11, 14, 17],
    'min11': [0, 3, 7, 10, 14, 17],
    'maj13': [0, 4, 7, 11, 14, 17, 21],
    'min13': [0, 3, 7, 10, 14, 17, 21],
    'alt': [0, 4, 8, 10, 13, 16], // 1, 3, #5, b7, b9, #11
    'sus2': [0, 2, 7],
    'sus4': [0, 5, 7],
    'add9': [0, 4, 7, 14],
    '6/9': [0, 4, 7, 9, 14],
    '#11': [0, 4, 7, 10, 14, 18],
    'b13': [0, 4, 7, 10, 14, 20],
    'min7b5': [0, 3, 6, 10],
    'dim7': [0, 3, 6, 9],
    'triad': [0, 4, 7] // Default to major triad
  };

  intervals = [...(baseChordIntervals[determinedChordType] || baseChordIntervals['triad'])];
  symbol = determinedChordType; // Start with the determined type as symbol

  // Re-evaluate for diatonic triad if it's the default
  if (determinedChordType === 'triad') {
    const diatonicTriadQuality = getDiatonicChordQuality(scaleName, degree);
    if (diatonicTriadQuality === 'minor') {
      intervals = [0, 3, 7];
      symbol = 'm';
    } else if (diatonicTriadQuality === 'diminished') {
      intervals = [0, 3, 6];
      symbol = 'dim';
    } else {
      symbol = ''; // Major triad
    }
  }

  // Apply extensions based on density
  const extensionProbability = EXTENSION_DENSITIES[extensionDensity || 'none']?.probability || 0;
  if (Math.random() < extensionProbability) {
    // Only add extensions if the base chord is a 7th or higher
    if (intervals.length >= 4) { // Has at least a 7th
      const possibleExtensions: number[] = [];
      if (!intervals.includes(14)) possibleExtensions.push(14); // 9th
      if (!intervals.includes(17)) possibleExtensions.push(17); // 11th
      if (!intervals.includes(21)) possibleExtensions.push(21); // 13th

      if (possibleExtensions.length > 0) {
        const chosenExtension = possibleExtensions[Math.floor(Math.random() * possibleExtensions.length)];
        intervals.push(chosenExtension);
        intervals.sort((a, b) => a - b);
        // Update symbol based on highest extension
        if (chosenExtension === 21) symbol = symbol.replace('7', '13').replace('9', '13').replace('11', '13');
        else if (chosenExtension === 17) symbol = symbol.replace('7', '11').replace('9', '11');
        else if (chosenExtension === 14) symbol = symbol.replace('7', '9');
      }
    }
  }

  // Apply alterations based on probability, primarily for dominant chords
  if (alterationProbability && Math.random() < alterationProbability) {
    const isDominant = determinedChordType.includes('dom') || determinedChordType.includes('7');
    if (isDominant) {
      const possibleAlterations: { interval: number, symbol: string }[] = [];
      // b9 (13), #9 (15), #11 (18), b13 (20)
      // Check if the interval is already present or would clash
      if (!intervals.includes(13)) possibleAlterations.push({ interval: 13, symbol: 'b9' });
      if (!intervals.includes(15)) possibleAlterations.push({ interval: 15, symbol: '#9' });
      if (!intervals.includes(18)) possibleAlterations.push({ interval: 18, symbol: '#11' });
      if (!intervals.includes(20)) possibleAlterations.push({ interval: 20, symbol: 'b13' });

      if (possibleAlterations.length > 0) {
        const chosenAlteration = possibleAlterations[Math.floor(Math.random() * possibleAlterations.length)];
        // Remove existing 9th, 11th, 13th if altered version is added
        intervals = intervals.filter(int => ![14, 17, 21].includes(int)); // Remove natural 9, 11, 13
        intervals.push(chosenAlteration.interval);
        intervals.sort((a, b) => a - b);
        symbol += chosenAlteration.symbol;
      }
    }
  }
  
  const chordRootIndex = NOTES.indexOf(chordRoot);
  let midiNotes = intervals.map(interval => {
    const noteIndex = (chordRootIndex + interval) % 12;
    const octave = 4 + Math.floor((chordRootIndex + interval) / 12);
    const noteName = NOTES[noteIndex];
    return noteToMidi(noteName, octave);
  });

  // Apply inversion if specified
  if (inversionType) {
    midiNotes = applyInversion(midiNotes, inversionType);
  }

  const notes: Note[] = midiNotes.map(midi => ({
    name: getNoteName(midi),
    midi,
    frequency: midiToFrequency(midi)
  }));
  
  return {
    root: chordRoot,
    quality: determinedChordType, // Keep the base quality
    symbol: chordRoot + symbol, // Update symbol with extensions/alterations
    notes,
    midi: notes.map(n => n.midi)
  };
}

export const RHYTHM_PATTERNS: Record<string, RhythmPattern> = {
  quarter: { name: 'Quarter Notes', pattern: [1, 1, 1, 1] }, // 4 quarter notes per measure
  eighth: { name: 'Eighth Notes', pattern: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5] }, // 8 eighth notes
  half: { name: 'Half Notes', pattern: [2, 2] }, // 2 half notes
  syncopated: { name: 'Syncopated', pattern: [0.5, 1, 0.5, 1, 1] }, // eighth, quarter, eighth, quarter, quarter
  waltz: { name: 'Waltz', pattern: [1, 0.5, 0.5, 1, 0.5, 0.5] } // quarter, eighth, eighth (x2)
};

export const EXTENSION_DENSITIES = {
  none: { name: 'None', probability: 0 },
  some: { name: 'Some', probability: 0.3 },
  lots: { name: 'Lots', probability: 0.6 },
  all: { name: 'All', probability: 1 }
};

export function generateProgression(key: string, scaleName: string, genreName: string, inversionType?: string, rhythmPatternName?: string, extensionDensity?: string, alterationProbability?: number): Chord[] {
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

    // Optionally add extensions (more sophisticated logic will be in getChordFromScale)
    // This part is now handled by passing extensionDensity and alterationProbability to getChordFromScale
    
    return getChordFromScale(key, degree, scaleName, chosenChordType, inversionType, extensionDensity, alterationProbability);
  });
}

export function applyVoiceLeading(chords: Chord[]): Chord[] {
  if (chords.length <= 1) return chords;

  const voiceLedChords: Chord[] = [chords[0]]; // Start with the first chord as is

  for (let i = 1; i < chords.length; i++) {
    const prevChord = voiceLedChords[i - 1];
    const currentChord = chords[i];

    let bestChord: Chord = currentChord;
    let minMovement = Infinity;

    // Generate all possible inversions/octave shifts for the current chord
    // For simplicity, let's consider root, first, second, third inversions,
    // and also shifting the entire chord up/down an octave.
    const possibleInversions = ['root', 'first', 'second', 'third']; // Add 'drop2' if needed

    let candidateMidiNotes: number[][] = [];

    // Add original chord notes
    candidateMidiNotes.push(currentChord.midi);

    // Add inversions
    possibleInversions.forEach(inv => {
      if (inv !== 'root') { // 'root' is already added
        candidateMidiNotes.push(applyInversion(currentChord.midi, inv));
      }
    });

    // Add octave shifts for all candidates
    const originalCandidatesCount = candidateMidiNotes.length;
    for (let j = 0; j < originalCandidatesCount; j++) {
      const notes = candidateMidiNotes[j];
      candidateMidiNotes.push(notes.map(note => note + 12)); // Octave up
      candidateMidiNotes.push(notes.map(note => note - 12)); // Octave down
    }

    // Find the best voicing
    candidateMidiNotes.forEach(candidateNotes => {
      // Ensure candidateNotes are sorted for consistent comparison
      candidateNotes.sort((a, b) => a - b);

      let currentMovement = 0;
      // Calculate total movement (sum of absolute differences for each voice)
      // This is a simplified approach. A more robust solution would involve
      // matching voices (e.g., closest note in the next chord).
      for (let k = 0; k < Math.min(prevChord.midi.length, candidateNotes.length); k++) {
        currentMovement += Math.abs(prevChord.midi[k] - candidateNotes[k]);
      }

      if (currentMovement < minMovement) {
        minMovement = currentMovement;
        // Create a new Chord object with the voice-led MIDI notes
        const newNotes: Note[] = candidateNotes.map(midi => ({
          name: getNoteName(midi),
          midi,
          frequency: midiToFrequency(midi)
        }));
        bestChord = {
          ...currentChord,
          notes: newNotes,
          midi: newNotes.map(n => n.midi)
        };
      }
    });
    voiceLedChords.push(bestChord);
  }
  return voiceLedChords;
}

export function generateMelody(progression: Chord[], scaleName: string, tempo: number): Note[] {
  const melody: Note[] = [];
  const scaleNotes = getScaleNotes(progression[0].root, scaleName); // Get scale notes for the key

  let lastMelodyMidi: number | null = null;

  progression.forEach((chord, chordIndex) => {
    // For simplicity, let's generate one melody note per chord
    // Choose a note from the chord that is also in the scale
    const possibleMelodyNotes = chord.notes.filter(note => 
      scaleNotes.includes(note.name)
    );

    let chosenMelodyNote: Note | null = null;

    if (possibleMelodyNotes.length > 0) {
      if (lastMelodyMidi !== null) {
        // Try to find a note close to the last melody note (basic voice leading)
        let minDistance = Infinity;
        possibleMelodyNotes.forEach(note => {
          const distance = Math.abs(note.midi - lastMelodyMidi!);
          if (distance < minDistance) {
            minDistance = distance;
            chosenMelodyNote = note;
          }
        });
      } else {
        // For the first note, pick a random note from the possible notes
        chosenMelodyNote = possibleMelodyNotes[Math.floor(Math.random() * possibleMelodyNotes.length)];
      }
    }

    if (chosenMelodyNote) {
      melody.push(chosenMelodyNote);
      lastMelodyMidi = chosenMelodyNote.midi;
    } else {
      // Fallback if no suitable note found (e.g., pick root of the chord)
      const fallbackNote = chord.notes[0]; // Root of the chord
      melody.push(fallbackNote);
      lastMelodyMidi = fallbackNote.midi;
    }
  });

  return melody;
}
