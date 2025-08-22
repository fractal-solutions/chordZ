export class AudioEngine {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private activeOscillators: OscillatorNode[] = [];

  constructor() {
    // Initialize audio context lazily to avoid autoplay restrictions
  }

  private async initAudioContext() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.connect(this.audioContext.destination);
      this.masterGain.gain.value = 0.2;
    }

    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  async playNote(midi: number, duration: number, volume: number = 0.5, humanizationAmount: number = 0) {
    try {
      await this.initAudioContext();

      if (!this.audioContext || !this.masterGain) {
        throw new Error('Audio context not initialized');
      }

      const now = this.audioContext.currentTime;
      const frequency = 440 * Math.pow(2, (midi - 69) / 12); // Convert MIDI to frequency

      // Apply humanization to start time and volume
      const humanizedStartTime = now + (Math.random() - 0.5) * humanizationAmount * 0.05; // +/- 25ms
      const humanizedVolume = volume * (1 + (Math.random() - 0.5) * humanizationAmount * 0.5); // +/- 25%

      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.masterGain);

      oscillator.type = 'sine'; // Simple sine wave for melody
      oscillator.frequency.setValueAtTime(frequency, humanizedStartTime);

      // Envelope
      gainNode.gain.setValueAtTime(0, humanizedStartTime);
      gainNode.gain.linearRampToValueAtTime(humanizedVolume, humanizedStartTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(humanizedVolume * 0.7, humanizedStartTime + duration / 1000 - 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.001, humanizedStartTime + duration / 1000);

      oscillator.start(humanizedStartTime);
      oscillator.stop(humanizedStartTime + duration / 1000);

      this.activeOscillators.push(oscillator);

      oscillator.onended = () => {
        this.activeOscillators = this.activeOscillators.filter(osc => osc !== oscillator);
      };

    } catch (error) {
      console.error('Error playing melody note:', error);
      throw error;
    }
  }

  async playChord(chord: any, duration: number = 2000, humanizationAmount: number = 0) {
    try {
      await this.initAudioContext();
      
      if (!this.audioContext || !this.masterGain) {
        throw new Error('Audio context not initialized');
      }

      const now = this.audioContext.currentTime;
      const chordGain = this.audioContext.createGain();
      chordGain.connect(this.masterGain);
      chordGain.gain.setValueAtTime(0.8, now);

      // Stop any currently playing oscillators
      this.stopCurrentChord();

      chord.notes.forEach((note: any, index: number) => {
        const oscillator = this.audioContext!.createOscillator();
        const gainNode = this.audioContext!.createGain();
        const filter = this.audioContext!.createBiquadFilter();
        
        // Create a warmer sound with multiple oscillators
        const oscillator2 = this.audioContext!.createOscillator();
        const gainNode2 = this.audioContext!.createGain();
        
        oscillator.connect(filter);
        oscillator2.connect(filter);
        filter.connect(gainNode);
        filter.connect(gainNode2);
        gainNode.connect(chordGain);
        gainNode2.connect(chordGain);
        
        // Apply humanization to start time and volume for individual notes within chord
        const humanizedNoteStartTime = now + (index * 0.02) + (Math.random() - 0.5) * humanizationAmount * 0.05;
        const humanizedNoteVolume = (0.15 / chord.notes.length) * (1 + (Math.random() - 0.5) * humanizationAmount * 0.5);
        const humanizedNoteVolume2 = (0.3 / chord.notes.length) * (1 + (Math.random() - 0.5) * humanizationAmount * 0.5);
        
        // Main oscillator - sine wave
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(note.frequency, humanizedNoteStartTime);
        
        // Second oscillator - slightly detuned for richness
        oscillator2.type = 'triangle';
        oscillator2.frequency.setValueAtTime(note.frequency * 1.002, humanizedNoteStartTime);
        
        // Low-pass filter for warmth
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2000, humanizedNoteStartTime);
        filter.Q.setValueAtTime(1, humanizedNoteStartTime);
        
        // Envelope for natural sound
        gainNode.gain.setValueAtTime(0, humanizedNoteStartTime);
        gainNode.gain.linearRampToValueAtTime(humanizedNoteVolume, humanizedNoteStartTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(humanizedNoteVolume * 0.7, humanizedNoteStartTime + duration / 1000 - 0.2);
        gainNode.gain.exponentialRampToValueAtTime(0.001, humanizedNoteStartTime + duration / 1000);
        
        gainNode2.gain.setValueAtTime(0, humanizedNoteStartTime);
        gainNode2.gain.linearRampToValueAtTime(humanizedNoteVolume2, humanizedNoteStartTime + 0.05);
        gainNode2.gain.exponentialRampToValueAtTime(humanizedNoteVolume2 * 0.7, humanizedNoteStartTime + duration / 1000 - 0.2);
        gainNode2.gain.exponentialRampToValueAtTime(0.001, humanizedNoteStartTime + duration / 1000);
        
        oscillator.start(humanizedNoteStartTime);
        oscillator2.start(humanizedNoteStartTime);
        oscillator.stop(humanizedNoteStartTime + duration / 1000);
        oscillator2.stop(humanizedNoteStartTime + duration / 1000);
        
        this.activeOscillators.push(oscillator, oscillator2);
        
        // Clean up oscillators when they finish
        oscillator.onended = () => {
          this.activeOscillators = this.activeOscillators.filter(osc => osc !== oscillator);
        };
        oscillator2.onended = () => {
          this.activeOscillators = this.activeOscillators.filter(osc => osc !== oscillator2);
        };
      });

    } catch (error) {
      console.error('Error playing chord:', error);
      throw error;
    }
  }

  private stopCurrentChord() {
    this.activeOscillators.forEach(osc => {
      try {
        osc.stop();
      } catch (e) {
        // Oscillator might already be stopped
      }
    });
    this.activeOscillators = [];
  }

  stop() {
    this.stopCurrentChord();
  }

  async testAudio() {
    try {
      await this.initAudioContext();
      console.log('Audio context initialized successfully');
      return true;
    } catch (error) {
      console.error('Audio test failed:', error);
      return false;
    }
  }
}