import React, { useState, useRef, useEffect } from 'react';
import { Music4, Sparkles } from 'lucide-react';
import { ChordDisplay } from './components/ChordDisplay';
import { PianoRoll } from './components/PianoRoll';
import { Controls } from './components/Controls';
import { generateProgression } from './utils/musicTheory';
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
  
  const audioEngine = useRef<AudioEngine>(new AudioEngine());
  const timerId = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Generate initial progression
    handleGenerate();
  }, []);

  const handleGenerate = () => {
    const newChords = generateProgression(selectedKey, selectedScale, selectedGenre);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Music4 className="text-blue-400" size={40} />
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              ChordZ
            </h1>
            <Sparkles className="text-purple-400" size={32} />
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Generate cutting-edge chord progressions for soul, neo soul, R&B, jazz, and fusion. 
            Perfect for FL Studio and professional music production.
          </p>
        </div>

        {/* Controls */}
        <div className="mb-8">
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
            onKeyChange={setSelectedKey}
            onScaleChange={setSelectedScale}
            onGenreChange={setSelectedGenre}
            onTempoChange={setTempo}
          />
        </div>

        {/* Chord Display */}
        {chords.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
              <Music4 className="text-blue-400" size={24} />
              Current Progression
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

        {/* Piano Roll */}
        {chords.length > 0 && (
          <div className="mb-8">
            <PianoRoll chords={chords} currentChord={currentChord} />
          </div>
        )}

        {/* Info Panel */}
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Pro Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
            <div>
              <h4 className="font-medium text-blue-400 mb-2">For FL Studio:</h4>
              <ul className="text-sm space-y-1">
                <li>• Use the MIDI notes shown above each chord</li>
                <li>• Import the exported MIDI file directly</li>
                <li>• Adjust velocities for more human feel</li>
                <li>• Add extensions and variations</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-purple-400 mb-2">Genre Characteristics:</h4>
              <ul className="text-sm space-y-1">
                <li>• <strong>Soul:</strong> Classic progressions with 7th, 9th, and 11th chords</li>
                <li>• <strong>Neo Soul:</strong> Extended harmonies, 9ths, 11ths, and 13ths</li>
                <li>• <strong>R&B:</strong> Smooth voice leading, added tensions and suspensions</li>
                <li>• <strong>Jazz:</strong> Complex harmony, ii-V-I patterns, and altered chords</li>
                <li>• <strong>Fusion:</strong> Modern extensions, altered chords, and complex voicings</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;