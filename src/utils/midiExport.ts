import { ChordProgression } from '../types/music';

export function exportToMidi(progression: ChordProgression): Blob {
  // Simple MIDI file structure
  const header = [
    0x4d, 0x54, 0x68, 0x64, // "MThd"
    0x00, 0x00, 0x00, 0x06, // Header length
    0x00, 0x01, // Format type 1 (multiple tracks)
    0x00, 0x02, // Number of tracks (chord track + melody track)
    0x01, 0xe0  // Ticks per quarter note (480)
  ];

  const allTracks: number[][] = [];
  const ticksPerBeat = 480;
  const beatsPerChord = 4; // Assuming 4 beats per chord for now, will be adjusted by rhythm pattern

  // --- Chord Track (Track 0) ---
  const chordTrackData: number[] = [];
  
  // Set tempo
  const microsecondsPerQuarter = Math.round(60000000 / progression.tempo);
  chordTrackData.push(
    0x00, 0xff, 0x51, 0x03,
    (microsecondsPerQuarter >> 16) & 0xff,
    (microsecondsPerQuarter >> 8) & 0xff,
    microsecondsPerQuarter & 0xff
  );

  progression.chords.forEach((chord, chordIndex) => {
    const deltaTime = chordIndex === 0 ? 0 : ticksPerBeat * beatsPerChord;
    
    // Note on events (Channel 0)
    chord.midi.forEach((note, noteIndex) => {
      const delta = noteIndex === 0 ? deltaTime : 0;
      chordTrackData.push(
        ...variableLengthQuantity(delta),
        0x90, // Note on, channel 0
        note,
        0x7f  // Velocity
      );
    });
    
    // Note off events (Channel 0)
    chord.midi.forEach((note, noteIndex) => {
      const delta = noteIndex === 0 ? ticksPerBeat * beatsPerChord : 0;
      chordTrackData.push(
        ...variableLengthQuantity(delta),
        0x80, // Note off, channel 0
        note,
        0x00  // Velocity
      );
    });
  });

  // End of chord track
  chordTrackData.push(0x00, 0xff, 0x2f, 0x00);
  allTracks.push(chordTrackData);

  // --- Melody Track (Track 1) ---
  if (progression.enableMelody && progression.melodyNotes && progression.melodyNotes.length > 0) {
    const melodyTrackData: number[] = [];
    
    // Set tempo (optional, but good practice for each track)
    melodyTrackData.push(
      0x00, 0xff, 0x51, 0x03,
      (microsecondsPerQuarter >> 16) & 0xff,
      (microsecondsPerQuarter >> 8) & 0xff,
      microsecondsPerQuarter & 0xff
    );

    // Assuming one melody note per chord for simplicity, and each is a quarter note
    progression.melodyNotes.forEach((note, index) => {
      const deltaTime = index === 0 ? 0 : ticksPerBeat; // Each melody note is a quarter note
      
      // Note on event (Channel 1)
      melodyTrackData.push(
        ...variableLengthQuantity(deltaTime),
        0x91, // Note on, channel 1
        note.midi,
        0x60  // Velocity (slightly lower for melody)
      );
      
      // Note off event (Channel 1)
      melodyTrackData.push(
        ...variableLengthQuantity(ticksPerBeat), // Duration of a quarter note
        0x81, // Note off, channel 1
        note.midi,
        0x00  // Velocity
      );
    });

    // End of melody track
    melodyTrackData.push(0x00, 0xff, 0x2f, 0x00);
    allTracks.push(melodyTrackData);
  }

  // Combine all tracks
  const midiDataParts: number[] = [...header];
  allTracks.forEach(track => {
    midiDataParts.push(0x4d, 0x54, 0x72, 0x6b); // "MTrk" header for each track
    const trackLength = track.length;
    midiDataParts.push(
      (trackLength >> 24) & 0xff,
      (trackLength >> 16) & 0xff,
      (trackLength >> 8) & 0xff,
      trackLength & 0xff
    );
    midiDataParts.push(...track);
  });

  const midiData = new Uint8Array(midiDataParts);
  return new Blob([midiData], { type: 'audio/midi' });
}

function variableLengthQuantity(value: number): number[] {
  if (value === 0) return [0];
  
  const result: number[] = [];
  let temp = value;
  
  result.unshift(temp & 0x7f);
  temp >>= 7;
  
  while (temp > 0) {
    result.unshift((temp & 0x7f) | 0x80);
    temp >>= 7;
  }
  
  return result;
}

export function downloadMidi(progression: ChordProgression, filename: string = 'chord-progression.mid') {
  const blob = exportToMidi(progression);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}