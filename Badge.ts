/**
 * Badge Model
 * Defines the structure and types for achievement badges in the Prayer App
 */

// Badge categories
export enum BadgeCategory {
  PRAYER = 'prayer',
  QURAN = 'quran',
  SOCIAL = 'social',
  STREAK = 'streak',
  SPECIAL = 'special'
}

// Badge rarity levels
export enum BadgeRarity {
  COMMON = 'common',
  UNCOMMON = 'uncommon',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary'
}

// Badge interface
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: BadgeCategory;
  rarity: BadgeRarity;
  criteria: BadgeCriteria;
  points: number;
  unlocked: boolean;
  unlockedAt?: Date;
  progress?: number; // Progress percentage towards unlocking (0-100)
}

// Badge criteria types
export type BadgeCriteria = 
  | PrayerStreakCriteria
  | PrayerScoreCriteria
  | QuranReadingCriteria
  | SocialCriteria
  | CompletionCriteria;

// Prayer streak criteria
export interface PrayerStreakCriteria {
  type: 'prayer_streak';
  requiredStreak: number;
  specificPrayer?: string; // Optional: specific prayer name
}

// Prayer score criteria
export interface PrayerScoreCriteria {
  type: 'prayer_score';
  requiredScore: number;
  requiredCount: number; // How many times this score must be achieved
}

// Quran reading criteria
export interface QuranReadingCriteria {
  type: 'quran_reading';
  requiredMinutes?: number;
  requiredPages?: number;
  requiredSurahs?: string[];
  requiredStreak?: number;
}

// Social interaction criteria
export interface SocialCriteria {
  type: 'social';
  requiredReminders?: number;
  requiredShares?: number;
  requiredComments?: number;
  requiredLikes?: number;
}

// General completion criteria
export interface CompletionCriteria {
  type: 'completion';
  requiredBadges?: string[]; // IDs of badges that must be earned first
  requiredActions?: string[];
  requiredCount?: number;
}

// User badge collection
export interface UserBadges {
  userId: string;
  badges: Badge[];
  totalPoints: number;
  recentlyUnlocked: Badge[];
}
