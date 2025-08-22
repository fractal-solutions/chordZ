import { ChordProgression } from '../types/music';

export function exportToMidi(progression: ChordProgression): Blob {
  // Simple MIDI file structure
  const header = [
    0x4d, 0x54, 0x68, 0x64, // "MThd"
    0x00, 0x00, 0x00, 0x06, // Header length
    0x00, 0x00, // Format type 0
    0x00, 0x01, // Number of tracks
    0x01, 0xe0  // Ticks per quarter note (480)
  ];

  const tracks: number[] = [];
  const ticksPerBeat = 480;
  const beatsPerChord = 4;
  
  // Track header
  tracks.push(0x4d, 0x54, 0x72, 0x6b); // "MTrk"
  
  const trackData: number[] = [];
  let currentTime = 0;
  
  // Set tempo
  const microsecondsPerQuarter = Math.round(60000000 / progression.tempo);
  trackData.push(
    0x00, 0xff, 0x51, 0x03,
    (microsecondsPerQuarter >> 16) & 0xff,
    (microsecondsPerQuarter >> 8) & 0xff,
    microsecondsPerQuarter & 0xff
  );

  progression.chords.forEach((chord, chordIndex) => {
    const deltaTime = chordIndex === 0 ? 0 : ticksPerBeat * beatsPerChord;
    
    // Note on events
    chord.midi.forEach((note, noteIndex) => {
      const delta = noteIndex === 0 ? deltaTime : 0;
      trackData.push(
        ...variableLengthQuantity(delta),
        0x90, // Note on, channel 0
        note,
        0x7f  // Velocity
      );
    });
    
    // Note off events
    chord.midi.forEach((note, noteIndex) => {
      const delta = noteIndex === 0 ? ticksPerBeat * beatsPerChord : 0;
      trackData.push(
        ...variableLengthQuantity(delta),
        0x80, // Note off, channel 0
        note,
        0x00  // Velocity
      );
    });
  });

  // End of track
  trackData.push(0x00, 0xff, 0x2f, 0x00);

  // Track length
  const trackLength = trackData.length;
  tracks.push(
    (trackLength >> 24) & 0xff,
    (trackLength >> 16) & 0xff,
    (trackLength >> 8) & 0xff,
    trackLength & 0xff
  );

  tracks.push(...trackData);

  const midiData = new Uint8Array([...header, ...tracks]);
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