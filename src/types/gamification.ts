export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'submissions' | 'attendance' | 'collaboration' | 'focus';
  unlocked: boolean;
  progress: number; // 0 to 100
  unlockedAt?: string;
  xpReward: number;
}

export interface DailyQuest {
  id: string;
  title: string;
  xp: number;
  completed: boolean;
  progress: number;
  target: number;
  unit: string;
}

export interface UserGamificationState {
  level: number;
  currentXp: number;
  nextLevelXp: number;
  currentStreak: number;
  longestStreak: number;
  badges: AchievementBadge[];
  dailyQuests: DailyQuest[];
}
