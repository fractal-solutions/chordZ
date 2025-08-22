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

  async playChord(chord: any, duration: number = 2000) {
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
        
        // Main oscillator - sine wave
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(note.frequency, now);
        
        // Second oscillator - slightly detuned for richness
        oscillator2.type = 'triangle';
        oscillator2.frequency.setValueAtTime(note.frequency * 1.002, now);
        
        // Low-pass filter for warmth
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2000, now);
        filter.Q.setValueAtTime(1, now);
        
        // Envelope for natural sound
        const noteVolume = 0.15 / chord.notes.length;
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(noteVolume, now + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(noteVolume * 0.7, now + duration / 1000 - 0.2);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration / 1000);
        
        gainNode2.gain.setValueAtTime(0, now);
        gainNode2.gain.linearRampToValueAtTime(noteVolume * 0.3, now + 0.05);
        gainNode2.gain.exponentialRampToValueAtTime(noteVolume * 0.2, now + duration / 1000 - 0.2);
        gainNode2.gain.exponentialRampToValueAtTime(0.001, now + duration / 1000);
        
        // Slight delay between notes for more natural feel
        const startTime = now + (index * 0.02);
        oscillator.start(startTime);
        oscillator2.start(startTime);
        oscillator.stop(startTime + duration / 1000);
        oscillator2.stop(startTime + duration / 1000);
        
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