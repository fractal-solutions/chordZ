import React, { useState } from 'react';
import * as Select from '@radix-ui/react-select';
import { Play, Pause, Square, Download, Shuffle } from 'lucide-react';
import { SCALES, GENRES, NOTES } from '../utils/musicTheory';

interface ControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onStop: () => void;
  onGenerate: (inversionType: string, voiceLeadingEnabled: boolean) => void; // Modified
  onExportMidi: () => void;
  selectedKey: string;
  selectedScale: string;
  selectedGenre: string;
  tempo: number;
  selectedInversion: string;
  enableVoiceLeading: boolean; // Added
  onKeyChange: (key: string) => void;
  onScaleChange: (scale: string) => void;
  onGenreChange: (genre: string) => void;
  onTempoChange: (tempo: number) => void;
  onInversionChange: (inversion: string) => void;
  onToggleVoiceLeading: (enabled: boolean) => void; // Added
}

export function Controls({
  isPlaying,
  onPlay,
  onStop,
  onGenerate,
  onExportMidi,
  selectedKey,
  selectedScale,
  selectedGenre,
  tempo,
  selectedInversion,
  enableVoiceLeading, // Added
  onKeyChange,
  onScaleChange,
  onGenreChange,
  onTempoChange,
  onInversionChange,
  onToggleVoiceLeading // Added
}: ControlsProps) {
  return (
    <div className="bg-gray-800 rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <CustomSelect label="Key" value={selectedKey} onChange={onKeyChange} options={NOTES.map(n => ({ value: n, label: n }))} />
          <CustomSelect label="Scale" value={selectedScale} onChange={onScaleChange} options={Object.entries(SCALES).map(([key, scale]) => ({ value: key, label: scale.name }))} />
          <CustomSelect label="Genre" value={selectedGenre} onChange={onGenreChange} options={Object.entries(GENRES).map(([key, genre]) => ({ value: key, label: genre.name }))} />
          <CustomSelect
            label="Inversion"
            value={selectedInversion}
            onChange={onInversionChange}
            options={[
              { value: 'root', label: 'Root Position' },
              { value: 'first', label: 'First Inversion' },
              { value: 'second', label: 'Second Inversion' },
              { value: 'third', label: 'Third Inversion' },
              { value: 'drop2', label: 'Drop 2 Voicing' },
            ]}
          />
        </div>
        <TempoControl tempo={tempo} onTempoChange={onTempoChange} />
      </div>
      <div className="flex items-center justify-between mt-4"> {/* Added a new row for voice leading */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="voiceLeadingToggle"
            checked={enableVoiceLeading}
            onChange={(e) => onToggleVoiceLeading(e.target.checked)}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <label htmlFor="voiceLeadingToggle" className="text-white">Enable Voice Leading</label>
        </div>
      </div>
      <div className="flex items-center justify-center space-x-2">
        <ActionButton onClick={() => onGenerate(selectedInversion, enableVoiceLeading)} icon={<Shuffle size={18} />} />
        <ActionButton onClick={isPlaying ? onStop : onPlay} icon={isPlaying ? <Pause size={18} /> : <Play size={18} />} />
        <ActionButton onClick={onStop} icon={<Square size={18} />} />
        <ActionButton onClick={onExportMidi} icon={<Download size={18} />} />
      </div>
    </div>
  );
}

const CustomSelect = ({ label, value, onChange, options }) => (
  <div className="space-y-1">
    <label className="block text-xs font-medium text-gray-400">{label}</label>
    <Select.Root value={value} onValueChange={onChange}>
      <Select.Trigger className="w-32 bg-gray-700 border border-gray-600 rounded-md px-3 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
        <Select.Value />
      </Select.Trigger>
      <Select.Content className="bg-gray-700 border border-gray-600 rounded-md text-white">
        <Select.Viewport>
          {options.map(option => (
            <Select.Item key={option.value} value={option.value} className="px-3 py-1 text-sm hover:bg-gray-600">
              <Select.ItemText>{option.label}</Select.ItemText>
            </Select.Item>
          ))}
        </Select.Viewport>
      </Select.Content>
    </Select.Root>
  </div>
);

const TempoControl = ({ tempo, onTempoChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startTempo, setStartTempo] = useState(0);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartY(e.clientY);
    setStartTempo(tempo);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const deltaY = startY - e.clientY;
    const newTempo = startTempo + deltaY;
    onTempoChange(Math.max(60, Math.min(200, newTempo)));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      className="flex flex-col items-center space-y-1"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <label className="block text-xs font-medium text-gray-400">Tempo</label>
      <div
        className="w-24 h-12 bg-gray-900 rounded-md flex items-center justify-center text-2xl font-mono text-white select-none cursor-ns-resize"
        onMouseDown={handleMouseDown}
      >
        {tempo}
      </div>
    </div>
  );
};

const ActionButton = ({ onClick, icon }) => (
  <button
    onClick={onClick}
    className="w-12 h-12 flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors shadow-md"
  >
    {icon}
  </button>
);