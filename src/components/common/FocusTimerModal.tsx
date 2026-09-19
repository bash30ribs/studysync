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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-[#121212] border border-[#DBDBDB] dark:border-[#262626] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#DBDBDB] dark:border-[#262626] bg-[#FAFAFA] dark:bg-[#121212]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-full bg-neutral-100 dark:bg-[#262626] text-[#0095F6]">
              <Timer className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-black dark:text-white">Study Focus Timer</h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Pomodoro focus intervals & rest breaks</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-black dark:hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 text-center">
          {/* Mode Selector */}
          <div className="flex justify-center gap-1.5 bg-neutral-100 dark:bg-[#1C1C1C] p-1.5 rounded-xl border border-[#DBDBDB] dark:border-[#262626]">
            <button
              onClick={() => handleModeChange('pomodoro')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                mode === 'pomodoro'
                  ? 'bg-black dark:bg-white text-white dark:text-black shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
              }`}
            >
              <Brain className="w-3.5 h-3.5" /> Deep Focus
            </button>
            <button
              onClick={() => handleModeChange('shortBreak')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                mode === 'shortBreak'
                  ? 'bg-black dark:bg-white text-white dark:text-black shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
              }`}
            >
              <Coffee className="w-3.5 h-3.5" /> Short (5m)
            </button>
            <button
              onClick={() => handleModeChange('longBreak')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                mode === 'longBreak'
                  ? 'bg-black dark:bg-white text-white dark:text-black shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
              }`}
            >
              <Coffee className="w-3.5 h-3.5" /> Long (15m)
            </button>
          </div>

          {/* Time Display */}
          <div className="py-4">
            <div className="text-6xl font-bold font-mono tracking-wider text-black dark:text-white">
              {formattedTime}
            </div>
            <div className="w-full bg-neutral-100 dark:bg-[#262626] rounded-full h-2 mt-6 overflow-hidden">
              <div
                className="bg-[#0095F6] h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setIsActive(!isActive)}
              className="btn-primary px-6 py-2.5 text-sm"
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
              className="btn-secondary p-2.5"
              title="Reset Timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Stats */}
          <div className="text-xs text-neutral-500 dark:text-neutral-400 pt-2 border-t border-[#DBDBDB] dark:border-[#262626]">
            Sessions completed today: <strong className="text-[#0095F6]">{sessionsCompleted}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
