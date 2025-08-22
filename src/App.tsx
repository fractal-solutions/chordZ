import React, { useState, useRef, useEffect } from 'react';
import { Music4, Sparkles } from 'lucide-react';
import { ChordDisplay } from './components/ChordDisplay';
import { PianoRoll } from './components/PianoRoll';
import { Controls } from './components/Controls';

import { AudioEngine } from './utils/audioEngine';
import { downloadMidi } from './utils/midiExport';
import { Chord, ChordProgression } from './types/music';

import { generateProgression, applyVoiceLeading, RHYTHM_PATTERNS, generateMelody } from './utils/musicTheory'; // Added generateMelody

function App() {
  const [chords, setChords] = useState<Chord[]>([]);
  const [currentChord, setCurrentChord] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedKey, setSelectedKey] = useState('C');
  const [selectedScale, setSelectedScale] = useState('major');
  const [selectedGenre, setSelectedGenre] = useState('soul');
  const [tempo, setTempo] = useState(120);
  const [selectedInversion, setSelectedInversion] = useState('root');
  const [enableVoiceLeading, setEnableVoiceLeading] = useState(false);
  const [enableRhythm, setEnableRhythm] = useState(false);
  const [selectedRhythmPattern, setSelectedRhythmPattern] = useState('quarter');
  const [selectedExtensionDensity, setSelectedExtensionDensity] = useState('none');
  const [alterationProbability, setAlterationProbability] = useState(0);
  const [enableMelody, setEnableMelody] = useState(false);
  const [melodyNotes, setMelodyNotes] = useState<Note[]>([]);
  const [enableHumanization, setEnableHumanization] = useState(false); // Added
  const [humanizationAmount, setHumanizationAmount] = useState(0); // Added

  const audioEngine = useRef<AudioEngine>(new AudioEngine());
  const timerId = useRef<NodeJS.Timeout | null>(null);
  const currentRhythmIndex = useRef(0);

  useEffect(() => {
    // Generate initial progression
    handleGenerate(selectedInversion, enableVoiceLeading, selectedRhythmPattern, enableRhythm, selectedExtensionDensity, alterationProbability, enableMelody, enableHumanization, humanizationAmount); // Pass all initial states
  }, []);

  const handleGenerate = (inversionType: string, voiceLeadingEnabled: boolean, rhythmPatternName: string, enableRhythm: boolean, extensionDensity: string, alterationProbability: number, enableMelody: boolean, enableHumanization: boolean, humanizationAmount: number) => { // Modified
    let newChords = generateProgression(selectedKey, selectedScale, selectedGenre, inversionType, rhythmPatternName, extensionDensity, alterationProbability);
    if (voiceLeadingEnabled) {
      newChords = applyVoiceLeading(newChords);
    }
    setChords(newChords);
    setCurrentChord(-1);

    if (enableMelody) {
      const newMelody = generateMelody(newChords, selectedScale, tempo);
      setMelodyNotes(newMelody);
    } else {
      setMelodyNotes([]);
    }
  };

  const handlePlay = async () => {
    if (chords.length === 0 || isPlaying) return;

    const audioTest = await audioEngine.current.testAudio();
    if (!audioTest) {
      alert('Audio initialization failed. Please check your browser settings and try again.');
      return;
    }

    setIsPlaying(true);
    setCurrentChord(0);
    currentRhythmIndex.current = 0;

    const rhythmPattern = enableRhythm ? RHYTHM_PATTERNS[selectedRhythmPattern].pattern : [1];
    
    const playNextChord = (chordIndex: number) => {
      if (chordIndex >= chords.length) {
        handleStop();
        return;
      }
      
      setCurrentChord(chordIndex);
      
      // Calculate chord duration based on rhythm pattern
      const rhythmUnitDuration = (60 / tempo) * 1000;
      const currentBeatDuration = rhythmPattern[currentRhythmIndex.current % rhythmPattern.length] * rhythmUnitDuration;
      
      audioEngine.current.playChord(chords[chordIndex], currentBeatDuration * 0.9, humanizationAmount); // Pass humanizationAmount

      if (enableMelody && melodyNotes[chordIndex]) {
        audioEngine.current.playNote(melodyNotes[chordIndex].midi, currentBeatDuration * 0.9, 0.7, humanizationAmount); // Pass humanizationAmount
      }
      
      timerId.current = setTimeout(() => {
        currentRhythmIndex.current = (currentRhythmIndex.current + 1) % rhythmPattern.length;
        playNextChord(chordIndex + 1);
      }, currentBeatDuration);
    };
    
    playNextChord(0);
  };

  const handleStop = () => {
    if (timerId.current) {
      clearTimeout(timerId.current);
      timerId.current = null;
    }
    setIsPlaying(false);
    setCurrentChord(-1);
    audioEngine.current.stop();
  };

  const handleExportMidi = () => {
    if (chords.length === 0) return;
    
    const progression: ChordProgression = {
      chords,
      key: selectedKey,
      scale: selectedScale,
      genre: selectedGenre,
      tempo,
      voicing: selectedInversion,
      rhythmPattern: enableRhythm ? selectedRhythmPattern : undefined,
      extensionDensity: selectedExtensionDensity,
      alterationProbability: alterationProbability,
      melodyNotes: enableMelody ? melodyNotes : undefined,
      enableMelody: enableMelody,
      enableHumanization: enableHumanization, // Added
      humanizationAmount: humanizationAmount // Added
    };
    
    const filename = `${selectedKey}_${selectedScale}_${selectedGenre}_progression.mid`;
    downloadMidi(progression, filename);
  };

  

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <div className="text-center py-4 border-b border-gray-800">
        <h1 className="text-3xl font-bold text-white">ChordZ</h1>
      </div>

      <div className="flex-grow flex">
        {/* Left Column */}
        <div className="w-2/3 flex flex-col p-4 space-y-4 border-r border-gray-800">
          <Controls
            isPlaying={isPlaying}
            onPlay={handlePlay}
            onStop={handleStop}
            onGenerate={handleGenerate}
            onExportMidi={handleExportMidi}
            selectedKey={selectedKey}
            selectedScale={selectedScale}
            selectedGenre={selectedGenre}
            tempo={tempo}
            selectedInversion={selectedInversion}
            enableVoiceLeading={enableVoiceLeading}
            enableRhythm={enableRhythm}
            selectedRhythmPattern={selectedRhythmPattern}
            selectedExtensionDensity={selectedExtensionDensity}
            alterationProbability={alterationProbability}
            enableMelody={enableMelody}
            enableHumanization={enableHumanization} // Added
            humanizationAmount={humanizationAmount} // Added
            onKeyChange={setSelectedKey}
            onScaleChange={setSelectedScale}
            onGenreChange={setSelectedGenre}
            onTempoChange={setTempo}
            onInversionChange={setSelectedInversion}
            onToggleVoiceLeading={setEnableVoiceLeading}
            onToggleRhythm={setEnableRhythm}
            onRhythmPatternChange={setSelectedRhythmPattern}
            onExtensionDensityChange={setSelectedExtensionDensity}
            onAlterationProbabilityChange={setAlterationProbability}
            onToggleMelody={setEnableMelody}
            onToggleHumanization={setEnableHumanization} // Added
            onHumanizationAmountChange={setHumanizationAmount} // Added
          />
          {chords.length > 0 && (
            <div className="flex-grow">
              <h2 className="text-xl font-semibold text-white mb-2">Current Progression</h2>
              <div className="grid grid-cols-4 gap-2">
                {chords.map((chord, index) => (
                  <ChordDisplay
                    key={index}
                    chord={chord}
                    isActive={currentChord === index}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (Piano Roll) */}
        <div className="w-1/3 flex-grow p-4">
          {chords.length > 0 && (
            <PianoRoll chords={chords} currentChord={currentChord} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;