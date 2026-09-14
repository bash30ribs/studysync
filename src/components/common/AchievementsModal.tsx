import React, { useState } from 'react';
import { Award, Zap, Flame, Vote, BookOpen, Headphones, X, CheckCircle2, Trophy, Star } from 'lucide-react';
import { INITIAL_GAMIFICATION_STATE } from '../../data/achievementsData';
import { AchievementBadge } from '../../types/gamification';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const iconMap: Record<string, React.ElementType> = {
  Zap,
  Flame,
  Vote,
  Award,
  BookOpen,
  Headphones,
};

export const AchievementsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [gameState] = useState(INITIAL_GAMIFICATION_STATE);
  const [activeTab, setActiveTab] = useState<'badges' | 'quests'>('badges');

  if (!isOpen) return null;

  const xpPercentage = Math.round((gameState.currentXp / gameState.nextLevelXp) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[88vh]">
        {/* Header with Level & Streak Stats */}
        <div className="bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-slate-900 px-6 py-5 border-b border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  Academic Milestones & Quests
                </h2>
                <p className="text-xs text-slate-300">Level {gameState.level} Scholar • {gameState.currentXp} total XP</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Level Progress Bar & Streak Stat */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="col-span-2 bg-slate-900/70 border border-slate-800 rounded-xl p-3">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-200">Level {gameState.level} Progress</span>
                <span className="text-indigo-400 font-mono">{gameState.currentXp} / {gameState.nextLevelXp} XP ({xpPercentage}%)</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${xpPercentage}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-500/20 text-orange-400">
                <Flame className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">{gameState.currentStreak} Days</div>
                <div className="text-[11px] text-slate-400">Current Study Streak</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="flex border-b border-slate-800 px-6 bg-slate-950/40">
          <button
            onClick={() => setActiveTab('badges')}
            className={`py-3 px-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition ${
              activeTab === 'badges'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Badges & Trophies ({gameState.badges.filter((b) => b.unlocked).length}/{gameState.badges.length})
          </button>
          <button
            onClick={() => setActiveTab('quests')}
            className={`py-3 px-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition ${
              activeTab === 'quests'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Daily Study Quests ({gameState.dailyQuests.filter((q) => q.completed).length}/{gameState.dailyQuests.length})
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          {activeTab === 'badges' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {gameState.badges.map((badge: AchievementBadge) => {
                const IconComponent = iconMap[badge.icon] || Star;
                return (
                  <div
                    key={badge.id}
                    className={`p-4 rounded-xl border flex items-start gap-3.5 transition-all ${
                      badge.unlocked
                        ? 'bg-slate-800/60 border-indigo-500/30 shadow-md'
                        : 'bg-slate-900/40 border-slate-800/80 opacity-70'
                    }`}
                  >
                    <div
                      className={`p-2.5 rounded-xl flex-shrink-0 ${
                        badge.unlocked
                          ? 'bg-gradient-to-br from-indigo-500/30 to-purple-500/30 text-indigo-300 border border-indigo-500/40'
                          : 'bg-slate-800 text-slate-600'
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-white">{badge.title}</h4>
                        <span className="text-[11px] font-bold text-amber-400 flex items-center gap-0.5">
                          +{badge.xpReward} XP
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{badge.description}</p>
                      
                      {!badge.unlocked ? (
                        <div className="mt-2.5">
                          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                            <span>Progress</span>
                            <span>{badge.progress}%</span>
                          </div>
                          <div className="w-full bg-slate-800 rounded-full h-1.5">
                            <div
                              className="bg-indigo-500 h-1.5 rounded-full"
                              style={{ width: `${badge.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-2 text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Unlocked on {badge.unlockedAt}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-3">
              {gameState.dailyQuests.map((quest) => (
                <div
                  key={quest.id}
                  className={`p-4 rounded-xl border flex items-center justify-between gap-4 transition ${
                    quest.completed
                      ? 'bg-emerald-950/20 border-emerald-500/30'
                      : 'bg-slate-800/40 border-slate-800 hover:bg-slate-800/70'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        quest.completed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className={`text-sm font-medium ${quest.completed ? 'text-slate-300 line-through' : 'text-white'}`}>
                        {quest.title}
                      </h4>
                      <div className="text-xs text-slate-400 mt-0.5">
                        Reward: <span className="text-amber-400 font-semibold">+{quest.xp} XP</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    {quest.completed ? (
                      <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-semibold">
                        Claimed
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 bg-slate-800 text-slate-400 border border-slate-700 rounded-lg text-xs">
                        In Progress
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
