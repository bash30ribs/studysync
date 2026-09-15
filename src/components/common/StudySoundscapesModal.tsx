import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Headphones, CloudRain, Wind, Sparkles, Activity, X } from 'lucide-react';
import { soundscapes } from '../../utils/soundscapes';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

type SoundPreset = 'brown' | 'rain' | 'pink' | 'white' | 'binaural';

export const StudySoundscapesModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<SoundPreset>('brown');
  const [volume, setVolume] = useState(0.6);

  useEffect(() => {
    return () => {
      // Cleanup when unmounting or modal closes
    };
  }, []);

  if (!isOpen) return null;

  const handleTogglePlay = () => {
    if (isPlaying) {
      soundscapes.stop();
      setIsPlaying(false);
    } else {
      soundscapes.play(selectedPreset, volume);
      setIsPlaying(true);
    }
  };

  const handlePresetSelect = (preset: SoundPreset) => {
    setSelectedPreset(preset);
    if (isPlaying) {
      soundscapes.play(preset, volume);
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    soundscapes.setVolume(newVol);
  };

  const presets = [
    { id: 'brown' as const, name: 'Deep Focus (Brown Noise)', desc: 'Low-frequency rumble for deep concentration', icon: Wind },
    { id: 'rain' as const, name: 'Soft Rain & Storm', desc: 'Gentle raindrops hitting study window pane', icon: CloudRain },
    { id: 'binaural' as const, name: '10Hz Alpha Waves', desc: 'Binaural beats tuned for cognitive flow state', icon: Activity },
    { id: 'pink' as const, name: 'Pink Noise Waterfall', desc: 'Balanced frequencies ideal for reading & memory', icon: Headphones },
    { id: 'white' as const, name: 'Crisp White Noise', desc: 'Masks background campus and dorm chatter', icon: Sparkles },
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="soundscapes-title"
    >
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h2 id="soundscapes-title" className="text-base font-semibold text-white">Study Soundscapes</h2>
              <p className="text-xs text-slate-400">Procedural Web Audio ambience for distraction-free focus</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Sound Presets List */}
          <div className="space-y-2.5">
            {presets.map((preset) => {
              const Icon = preset.icon;
              const isSelected = selectedPreset === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => handlePresetSelect(preset.id)}
                  className={`w-full flex items-center gap-3.5 p-3.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-indigo-600/20 border-indigo-500/50 text-white shadow-sm ring-1 ring-indigo-500/30'
                      : 'bg-slate-800/40 border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg ${
                      isSelected ? 'bg-indigo-500/30 text-indigo-300' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">{preset.name}</h4>
                      {isSelected && isPlaying && (
                        <span className="flex h-2 w-2 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 truncate mt-0.5">{preset.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Volume Control */}
          <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
              <span className="flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-slate-400" /> Master Volume
              </span>
              <span>{Math.round(volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

          {/* Main Action Bar */}
          <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-slate-500">
              Zero battery drain • Pure client-side synthesis
            </div>
            <button
              onClick={handleTogglePlay}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all shadow-lg ${
                isPlaying
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/25'
              }`}
            >
              {isPlaying ? (
                <>
                  <VolumeX className="w-4 h-4" /> Stop Audio
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4" /> Start Ambient Audio
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
