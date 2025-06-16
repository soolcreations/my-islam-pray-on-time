/**
 * BadgeService
 * Service for managing badges, tracking progress, and awarding achievements
 */
import { 
  Badge, 
  BadgeCategory, 
  BadgeRarity, 
  UserBadges,
  PrayerStreakCriteria,
  PrayerScoreCriteria,
  QuranReadingCriteria,
  SocialCriteria,
  CompletionCriteria
} from '../models/Badge';

// Initial badge definitions
const BADGE_DEFINITIONS: Badge[] = [
  // Prayer Streak Badges
  {
    id: 'prayer_streak_3',
    name: 'Prayer Beginner',
    description: 'Complete all 5 daily prayers for 3 consecutive days',
    icon: '🕌',
    category: BadgeCategory.STREAK,
    rarity: BadgeRarity.COMMON,
    criteria: {
      type: 'prayer_streak',
      requiredStreak: 3
    },
    points: 10,
    unlocked: false,
    progress: 0
  },
  {
    id: 'prayer_streak_7',
    name: 'Prayer Enthusiast',
    description: 'Complete all 5 daily prayers for 7 consecutive days',
    icon: '🕌🕌',
    category: BadgeCategory.STREAK,
    rarity: BadgeRarity.UNCOMMON,
    criteria: {
      type: 'prayer_streak',
      requiredStreak: 7
    },
    points: 25,
    unlocked: false,
    progress: 0
  },
  {
    id: 'prayer_streak_30',
    name: 'Prayer Master',
    description: 'Complete all 5 daily prayers for 30 consecutive days',
    icon: '🕌✨',
    category: BadgeCategory.STREAK,
    rarity: BadgeRarity.RARE,
    criteria: {
      type: 'prayer_streak',
      requiredStreak: 30
    },
    points: 100,
    unlocked: false,
    progress: 0
  },
  
  // Prayer Score Badges
  {
    id: 'perfect_score_1',
    name: 'Perfect Prayer',
    description: 'Complete a prayer with a perfect 10/10 score',
    icon: '🌟',
    category: BadgeCategory.PRAYER,
    rarity: BadgeRarity.COMMON,
    criteria: {
      type: 'prayer_score',
      requiredScore: 10,
      requiredCount: 1
    },
    points: 5,
    unlocked: false,
    progress: 0
  },
  {
    id: 'perfect_score_10',
    name: 'Prayer Excellence',
    description: 'Complete 10 prayers with a perfect 10/10 score',
    icon: '🌟🌟',
    category: BadgeCategory.PRAYER,
    rarity: BadgeRarity.UNCOMMON,
    criteria: {
      type: 'prayer_score',
      requiredScore: 10,
      requiredCount: 10
    },
    points: 30,
    unlocked: false,
    progress: 0
  },
  
  // Specific Prayer Badges
  {
    id: 'fajr_warrior',
    name: 'Fajr Warrior',
    description: 'Complete Fajr prayer for 10 consecutive days',
    icon: '🌅',
    category: BadgeCategory.PRAYER,
    rarity: BadgeRarity.RARE,
    criteria: {
      type: 'prayer_streak',
      requiredStreak: 10,
      specificPrayer: 'Fajr'
    },
    points: 50,
    unlocked: false,
    progress: 0
  },
  
  // Quran Reading Badges
  {
    id: 'quran_starter',
    name: 'Quran Starter',
    description: 'Read Quran for at least 10 minutes in a day',
    icon: '📖',
    category: BadgeCategory.QURAN,
    rarity: BadgeRarity.COMMON,
    criteria: {
      type: 'quran_reading',
      requiredMinutes: 10
    },
    points: 5,
    unlocked: false,
    progress: 0
  },
  {
    id: 'quran_streak_7',
    name: 'Consistent Reader',
    description: 'Read Quran for 7 consecutive days',
    icon: '📖🔄',
    category: BadgeCategory.QURAN,
    rarity: BadgeRarity.UNCOMMON,
    criteria: {
      type: 'quran_reading',
      requiredStreak: 7
    },
    points: 25,
    unlocked: false,
    progress: 0
  },
  {
    id: 'quran_complete',
    name: 'Quran Completion',
    description: 'Complete reading the entire Quran',
    icon: '📖✨',
    category: BadgeCategory.QURAN,
    rarity: BadgeRarity.LEGENDARY,
    criteria: {
      type: 'completion',
      requiredActions: ['complete_quran'],
      requiredCount: 1
    },
    points: 200,
    unlocked: false,
    progress: 0
  },
  
  // Social Badges
  {
    id: 'helpful_friend',
    name: 'Helpful Friend',
    description: 'Send prayer reminders to 5 different friends',
    icon: '👥',
    category: BadgeCategory.SOCIAL,
    rarity: BadgeRarity.COMMON,
    criteria: {
      type: 'social',
      requiredReminders: 5
    },
    points: 10,
    unlocked: false,
    progress: 0
  },
  {
    id: 'community_pillar',
    name: 'Community Pillar',
    description: 'Interact with 20 posts (likes, comments, or shares)',
    icon: '🤝',
    category: BadgeCategory.SOCIAL,
    rarity: BadgeRarity.UNCOMMON,
    criteria: {
      type: 'social',
      requiredLikes: 10,
      requiredComments: 5,
      requiredShares: 5
    },
    points: 30,
    unlocked: false,
    progress: 0
  },
  
  // Special Badges
  {
    id: 'ramadan_complete',
    name: 'Ramadan Champion',
    description: 'Complete all prayers during the month of Ramadan',
    icon: '🌙✨',
    category: BadgeCategory.SPECIAL,
    rarity: BadgeRarity.EPIC,
    criteria: {
      type: 'completion',
      requiredActions: ['ramadan_prayers'],
      requiredCount: 1
    },
    points: 150,
    unlocked: false,
    progress: 0
  },
  {
    id: 'badge_collector',
    name: 'Badge Collector',
    description: 'Earn 10 different badges',
    icon: '🏆',
    category: BadgeCategory.SPECIAL,
    rarity: BadgeRarity.RARE,
    criteria: {
      type: 'completion',
      requiredCount: 10
    },
    points: 100,
    unlocked: false,
    progress: 0
  }
];

class BadgeService {
  private userBadges: UserBadges = {
    userId: 'current_user', // In a real app, this would be the actual user ID
    badges: JSON.parse(JSON.stringify(BADGE_DEFINITIONS)), // Deep copy of badge definitions
    totalPoints: 0,
    recentlyUnlocked: []
  };
  
  private listeners: ((badge: Badge) => void)[] = [];
  
  constructor() {
    // In a real app, this would load badges from storage
    this.initializeBadges();
  }
  
  private initializeBadges() {
    // For demo purposes, we'll unlock a few badges
    this.userBadges.badges.find(b => b.id === 'prayer_streak_3')!.progress = 100;
    this.userBadges.badges.find(b => b.id === 'perfect_score_1')!.progress = 100;
    
    // Unlock these badges
    this.unlockBadge('prayer_streak_3');
    this.unlockBadge('perfect_score_1');
  }
  
  // Get all badges
  public getAllBadges(): Badge[] {
    return this.userBadges.badges;
  }
  
  // Get badges by category
  public getBadgesByCategory(category: BadgeCategory): Badge[] {
    return this.userBadges.badges.filter(badge => badge.category === category);
  }
  
  // Get unlocked badges
  public getUnlockedBadges(): Badge[] {
    return this.userBadges.badges.filter(badge => badge.unlocked);
  }
  
  // Get locked badges
  public getLockedBadges(): Badge[] {
    return this.userBadges.badges.filter(badge => !badge.unlocked);
  }
  
  // Get recently unlocked badges
  public getRecentlyUnlockedBadges(): Badge[] {
    return this.userBadges.recentlyUnlocked;
  }
  
  // Clear recently unlocked badges
  public clearRecentlyUnlocked() {
    this.userBadges.recentlyUnlocked = [];
  }
  
  // Get total badge points
  public getTotalPoints(): number {
    return this.userBadges.totalPoints;
  }
  
  // Unlock a badge
  private unlockBadge(badgeId: string): Badge | null {
    const badge = this.userBadges.badges.find(b => b.id === badgeId);
    
    if (!badge || badge.unlocked) {
      return null;
    }
    
    badge.unlocked = true;
    badge.unlockedAt = new Date();
    badge.progress = 100;
    this.userBadges.totalPoints += badge.points;
    this.userBadges.recentlyUnlocked.push(badge);
    
    // Notify listeners
    this.notifyBadgeUnlocked(badge);
    
    // Check if this unlocks the Badge Collector badge
    this.checkBadgeCollectorProgress();
    
    return badge;
  }
  
  // Update badge progress
  public updateBadgeProgress(badgeId: string, progress: number): void {
    const badge = this.userBadges.badges.find(b => b.id === badgeId);
    
    if (!badge || badge.unlocked) {
      return;
    }
    
    badge.progress = Math.min(progress, 100);
    
    if (badge.progress >= 100) {
      this.unlockBadge(badgeId);
    }
  }
  
  // Check prayer streak badges
  public checkPrayerStreakBadges(currentStreak: number): void {
    const streakBadges = this.userBadges.badges.filter(
      badge => !badge.unlocked && 
      badge.criteria.type === 'prayer_streak' && 
      !(badge.criteria as PrayerStreakCriteria).specificPrayer
    );
    
    for (const badge of streakBadges) {
      const criteria = badge.criteria as PrayerStreakCriteria;
      const progress = (currentStreak / criteria.requiredStreak) * 100;
      this.updateBadgeProgress(badge.id, progress);
    }
  }
  
  // Check specific prayer streak badges
  public checkSpecificPrayerStreakBadges(prayerName: string, currentStreak: number): void {
    const specificStreakBadges = this.userBadges.badges.filter(
      badge => !badge.unlocked && 
      badge.criteria.type === 'prayer_streak' && 
      (badge.criteria as PrayerStreakCriteria).specificPrayer === prayerName
    );
    
    for (const badge of specificStreakBadges) {
      const criteria = badge.criteria as PrayerStreakCriteria;
      const progress = (currentStreak / criteria.requiredStreak) * 100;
      this.updateBadgeProgress(badge.id, progress);
    }
  }
  
  // Check prayer score badges
  public checkPrayerScoreBadges(score: number, currentCount: number): void {
    const scoreBadges = this.userBadges.badges.filter(
      badge => !badge.unlocked && 
      badge.criteria.type === 'prayer_score' && 
      (badge.criteria as PrayerScoreCriteria).requiredScore <= score
    );
    
    for (const badge of scoreBadges) {
      const criteria = badge.criteria as PrayerScoreCriteria;
      const progress = (currentCount / criteria.requiredCount) * 100;
      this.updateBadgeProgress(badge.id, progress);
    }
  }
  
  // Check Quran reading badges
  public checkQuranReadingBadges(minutes: number, pages: number, streak: number): void {
    const quranBadges = this.userBadges.badges.filter(
      badge => !badge.unlocked && badge.criteria.type === 'quran_reading'
    );
    
    for (const badge of quranBadges) {
      const criteria = badge.criteria as QuranReadingCriteria;
      let progress = 0;
      
      if (criteria.requiredMinutes && minutes >= criteria.requiredMinutes) {
        progress = 100;
      } else if (criteria.requiredPages && pages >= criteria.requiredPages) {
        progress = 100;
      } else if (criteria.requiredStreak) {
        progress = (streak / criteria.requiredStreak) * 100;
      }
      
      if (progress > 0) {
        this.updateBadgeProgress(badge.id, progress);
      }
    }
  }
  
  // Check social badges
  public checkSocialBadges(reminders: number, likes: number, comments: number, shares: number): void {
    const socialBadges = this.userBadges.badges.filter(
      badge => !badge.unlocked && badge.criteria.type === 'social'
    );
    
    for (const badge of socialBadges) {
      const criteria = badge.criteria as SocialCriteria;
      let totalRequired = 0;
      let totalCompleted = 0;
      
      if (criteria.requiredReminders) {
        totalRequired += criteria.requiredReminders;
        totalCompleted += Math.min(reminders, criteria.requiredReminders);
      }
      
      if (criteria.requiredLikes) {
        totalRequired += criteria.requiredLikes;
        totalCompleted += Math.min(likes, criteria.requiredLikes);
      }
      
      if (criteria.requiredComments) {
        totalRequired += criteria.requiredComments;
        totalCompleted += Math.min(comments, criteria.requiredComments);
      }
      
      if (criteria.requiredShares) {
        totalRequired += criteria.requiredShares;
        totalCompleted += Math.min(shares, criteria.requiredShares);
      }
      
      if (totalRequired > 0) {
        const progress = (totalCompleted / totalRequired) * 100;
        this.updateBadgeProgress(badge.id, progress);
      }
    }
  }
  
  // Complete a specific action (for completion badges)
  public completeAction(actionName: string): void {
    const completionBadges = this.userBadges.badges.filter(
      badge => !badge.unlocked && 
      badge.criteria.type === 'completion' && 
      (badge.criteria as CompletionCriteria).requiredActions?.includes(actionName)
    );
    
    for (const badge of completionBadges) {
      this.unlockBadge(badge.id);
    }
  }
  
  // Check Badge Collector progress
  private checkBadgeCollectorProgress(): void {
    const badgeCollector = this.userBadges.badges.find(b => b.id === 'badge_collector');
    
    if (!badgeCollector || badgeCollector.unlocked) {
      return;
    }
    
    const unlockedCount = this.getUnlockedBadges().length;
    const criteria = badgeCollector.criteria as CompletionCriteria;
    const requiredCount = criteria.requiredCount || 10;
    
    const progress = (unlockedCount / requiredCount) * 100;
    this.updateBadgeProgress('badge_collector', progress);
  }
  
  // Register a badge unlock listener
  public onBadgeUnlocked(callback: (badge: Badge) => void): void {
    this.listeners.push(callback);
  }
  
  // Notify listeners when a badge is unlocked
  private notifyBadgeUnlocked(badge: Badge): void {
    for (const listener of this.listeners) {
      listener(badge);
    }
  }
  
  // Handle prayer registration
  public handlePrayerRegistration(prayerName: string, score: number): Badge[] {
    // In a real app, this would update streak counters and other stats
    const unlockedBadges: Badge[] = [];
    
    // For demo purposes, we'll simulate some badge unlocks
    if (score === 10) {
      // Check perfect score badges
      this.checkPrayerScoreBadges(score, 1);
      
      // For demo, unlock the Perfect Prayer badge if not already unlocked
      if (!this.userBadges.badges.find(b => b.id === 'perfect_score_1')?.unlocked) {
        const badge = this.unlockBadge('perfect_score_1');
        if (badge) unlockedBadges.push(badge);
      }
    }
    
    // Simulate streak progress
    if (prayerName === 'Fajr') {
      this.checkSpecificPrayerStreakBadges('Fajr', 5); // Simulate 5 days of Fajr
    }
    
    // Simulate general prayer streak
    this.checkPrayerStreakBadges(5); // Simulate 5 days streak
    
    return unlockedBadges;
  }
  
  // Handle social interactions
  public handleSocialInteraction(type: 'reminder' | 'like' | 'comment' | 'share'): void {
    // In a real app, this would update counters for each interaction type
    // For demo purposes, we'll simulate some progress
    this.checkSocialBadges(3, 8, 4, 2); // Simulate current counts
  }
}

// Create and export a singleton instance
const badgeService = new BadgeService();
export default badgeService;
