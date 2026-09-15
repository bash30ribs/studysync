import React, { useState, useEffect, useRef } from 'react';
import { Timer, Play, Pause, RotateCcw, X, Coffee, Brain } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

type Mode = 'pomodoro' | 'shortBreak' | 'longBreak';

const MODE_TIMES: Record<Mode, number> = {
  pomodoro: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

export const FocusTimerModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState<Mode>('pomodoro');
  const [timeLeft, setTimeLeft] = useState(MODE_TIMES.pomodoro);
  const [isActive, setIsActive] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setIsActive(false);
      if (mode === 'pomodoro') {
        setSessionsCompleted((c) => c + 1);
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, timeLeft, mode]);

  if (!isOpen) return null;

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
    setTimeLeft(MODE_TIMES[newMode]);
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setTimeLeft(MODE_TIMES[mode]);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const progressPercent = ((MODE_TIMES[mode] - timeLeft) / MODE_TIMES[mode]) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-teal-500/20 text-teal-400">
              <Timer className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Study Focus Timer</h2>
              <p className="text-xs text-slate-400">Pomodoro focus intervals & deliberate rest breaks</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 text-center">
          {/* Mode Selector */}
          <div className="flex justify-center gap-1.5 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700/60">
            <button
              onClick={() => handleModeChange('pomodoro')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                mode === 'pomodoro'
                  ? 'bg-teal-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Brain className="w-3.5 h-3.5" /> Deep Focus
            </button>
            <button
              onClick={() => handleModeChange('shortBreak')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                mode === 'shortBreak'
                  ? 'bg-teal-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Coffee className="w-3.5 h-3.5" /> Short (5m)
            </button>
            <button
              onClick={() => handleModeChange('longBreak')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                mode === 'longBreak'
                  ? 'bg-teal-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Coffee className="w-3.5 h-3.5" /> Long (15m)
            </button>
          </div>

          {/* Time Display */}
          <div className="py-4">
            <div className="text-6xl font-extrabold font-mono tracking-wider text-white">
              {formattedTime}
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 mt-6 overflow-hidden">
              <div
                className="bg-teal-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setIsActive(!isActive)}
              className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm flex items-center gap-2 transition shadow-lg shadow-teal-500/20"
            >
              {isActive ? (
                <>
                  <Pause className="w-4 h-4 fill-current" /> Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" /> Start Focus
                </>
              )}
            </button>
            <button
              onClick={handleReset}
              className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition border border-slate-700"
              title="Reset Timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Stats */}
          <div className="text-xs text-slate-500 pt-2 border-t border-slate-800/80">
            Sessions completed today: <strong className="text-teal-400">{sessionsCompleted}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
