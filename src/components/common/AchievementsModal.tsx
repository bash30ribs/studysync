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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-[#121212] border border-[#DBDBDB] dark:border-[#262626] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[88vh]">
        {/* Header with Level & Streak Stats */}
        <div className="px-6 py-5 border-b border-[#DBDBDB] dark:border-[#262626] bg-[#FAFAFA] dark:bg-[#121212]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-full bg-neutral-100 dark:bg-[#262626] text-[#0095F6]">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-black dark:text-white flex items-center gap-2">
                  Academic Milestones & Quests
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Level {gameState.level} Scholar • {gameState.currentXp} total XP</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-black dark:hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Level Progress Bar & Streak Stat */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="col-span-2 bg-white dark:bg-[#1C1C1C] border border-[#DBDBDB] dark:border-[#262626] rounded-xl p-3">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-black dark:text-white">Level {gameState.level} Progress</span>
                <span className="text-[#0095F6] font-mono font-semibold">{gameState.currentXp} / {gameState.nextLevelXp} XP ({xpPercentage}%)</span>
              </div>
              <div className="w-full bg-neutral-100 dark:bg-[#262626] rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#0095F6] h-2 rounded-full transition-all duration-500"
                  style={{ width: `${xpPercentage}%` }}
                />
              </div>
            </div>

            <div className="bg-white dark:bg-[#1C1C1C] border border-[#DBDBDB] dark:border-[#262626] rounded-xl p-3 flex items-center gap-3">
              <div className="p-2 rounded-full bg-orange-500/15 text-orange-500">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-black dark:text-white">{gameState.currentStreak} Days</div>
                <div className="text-[11px] text-neutral-500 dark:text-neutral-400">Current Study Streak</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="flex border-b border-[#DBDBDB] dark:border-[#262626] px-6 bg-[#FAFAFA] dark:bg-[#121212]">
          <button
            onClick={() => setActiveTab('badges')}
            className={`py-3 px-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition ${
              activeTab === 'badges'
                ? 'border-black dark:border-white text-black dark:text-white'
                : 'border-transparent text-neutral-500 hover:text-black dark:hover:text-white'
            }`}
          >
            Badges ({gameState.badges.filter((b) => b.unlocked).length}/{gameState.badges.length})
          </button>
          <button
            onClick={() => setActiveTab('quests')}
            className={`py-3 px-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition ${
              activeTab === 'quests'
                ? 'border-black dark:border-white text-black dark:text-white'
                : 'border-transparent text-neutral-500 hover:text-black dark:hover:text-white'
            }`}
          >
            Daily Quests ({gameState.dailyQuests.filter((q) => q.completed).length}/{gameState.dailyQuests.length})
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
                        ? 'bg-neutral-50 dark:bg-[#1C1C1C] border-[#DBDBDB] dark:border-[#262626]'
                        : 'bg-white dark:bg-[#121212] border-[#DBDBDB] dark:border-[#262626] opacity-60'
                    }`}
                  >
                    <div
                      className={`p-2.5 rounded-full flex-shrink-0 ${
                        badge.unlocked
                          ? 'bg-[#0095F6]/15 text-[#0095F6]'
                          : 'bg-neutral-100 dark:bg-[#262626] text-neutral-400'
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-black dark:text-white">{badge.title}</h4>
                        <span className="text-[11px] font-semibold text-[#0095F6]">
                          +{badge.xpReward} XP
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">{badge.description}</p>
                      
                      {!badge.unlocked ? (
                        <div className="mt-2.5">
                          <div className="flex items-center justify-between text-[11px] text-neutral-500 mb-1">
                            <span>Progress</span>
                            <span>{badge.progress}%</span>
                          </div>
                          <div className="w-full bg-neutral-100 dark:bg-[#262626] rounded-full h-1.5">
                            <div
                              className="bg-[#0095F6] h-1.5 rounded-full"
                              style={{ width: `${badge.progress}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="mt-2 text-[11px] text-[#0095F6] flex items-center gap-1 font-medium">
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
                      ? 'bg-neutral-50 dark:bg-[#1C1C1C] border-[#DBDBDB] dark:border-[#262626]'
                      : 'bg-white dark:bg-[#121212] border-[#DBDBDB] dark:border-[#262626]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-full ${
                        quest.completed ? 'bg-[#0095F6]/15 text-[#0095F6]' : 'bg-neutral-100 dark:bg-[#262626] text-neutral-400'
                      }`}
                    >
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className={`text-sm font-medium ${quest.completed ? 'text-neutral-400 line-through' : 'text-black dark:text-white'}`}>
                        {quest.title}
                      </h4>
                      <div className="text-xs text-neutral-500 mt-0.5">
                        Reward: <span className="text-[#0095F6] font-semibold">+{quest.xp} XP</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    {quest.completed ? (
                      <span className="px-2.5 py-1 bg-[#0095F6]/10 text-[#0095F6] rounded-lg text-xs font-semibold">
                        Claimed
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 bg-neutral-100 dark:bg-[#262626] text-neutral-500 rounded-lg text-xs">
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
