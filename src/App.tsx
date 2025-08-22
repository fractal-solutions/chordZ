import React, { useState, useRef, useEffect } from 'react';
import { Music4, Sparkles } from 'lucide-react';
import { ChordDisplay } from './components/ChordDisplay';
import { PianoRoll } from './components/PianoRoll';
import { Controls } from './components/Controls';
import { generateProgression, applyVoiceLeading } from './utils/musicTheory';
import { AudioEngine } from './utils/audioEngine';
import { downloadMidi } from './utils/midiExport';
import { Chord, ChordProgression } from './types/music';

function App() {
  const [chords, setChords] = useState<Chord[]>([]);
  const [currentChord, setCurrentChord] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedKey, setSelectedKey] = useState('C');
  const [selectedScale, setSelectedScale] = useState('major');
  const [selectedGenre, setSelectedGenre] = useState('soul');
  const [tempo, setTempo] = useState(120);
  const [selectedInversion, setSelectedInversion] = useState('root');
  const [enableVoiceLeading, setEnableVoiceLeading] = useState(false); // Added
  
  const audioEngine = useRef<AudioEngine>(new AudioEngine());
  const timerId = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Generate initial progression
    handleGenerate(selectedInversion, enableVoiceLeading); // Pass initial inversion and voice leading state
  }, []);

  const handleGenerate = (inversionType: string, voiceLeadingEnabled: boolean) => { // Modified to accept voiceLeadingEnabled
    let newChords = generateProgression(selectedKey, selectedScale, selectedGenre, inversionType);
    if (voiceLeadingEnabled) {
      newChords = applyVoiceLeading(newChords); // Apply voice leading
    }
    setChords(newChords);
    setCurrentChord(-1);
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
    
    const playNextChord = (chordIndex: number) => {
      if (chordIndex >= chords.length) {
        handleStop();
        return;
      }
      
      setCurrentChord(chordIndex);
      const chordDuration = (60 / tempo) * 2 * 1000;
      audioEngine.current.playChord(chords[chordIndex], chordDuration * 0.9);
      
      timerId.current = setTimeout(() => {
        playNextChord(chordIndex + 1);
      }, chordDuration);
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
      tempo
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
            onKeyChange={setSelectedKey}
            onScaleChange={setSelectedScale}
            onGenreChange={setSelectedGenre}
            onTempoChange={setTempo}
            onInversionChange={setSelectedInversion}
            onToggleVoiceLeading={setEnableVoiceLeading}
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