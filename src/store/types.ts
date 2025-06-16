// src/store/types.ts
export interface QuranState {
  currentPosition: { ayah: number; page: number; juz: number; };
  readingGoals: any[];
  bookmarks: any[];
}
export interface PrayerState {
  prayerTimesToday: any[];
  currentPrayerIndex: number | null;
  missedPrayers: any[];
  dailyLog: any;
}
export interface UserStatisticsState {
  prayerScoreHistory: any[];
  quranPagesPerDay: any[];
  leaderboardData: any[];
}

export const UPDATE_QURAN_POSITION = 'UPDATE_QURAN_POSITION';
// Add more action type constants as placeholders
