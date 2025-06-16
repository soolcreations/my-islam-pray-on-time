// Prayer scoring service
import { PrayerTime } from '../types';

export interface PrayerScore {
  score: number;
  prayerName: string;
  registeredTime: Date;
  scheduledTime: Date;
  atMosque: boolean;
}

export class PrayerScoringService {
  // Calculate prayer score based on registration time
  calculateScore(prayer: PrayerTime, registrationTime: Date, atMosque: boolean = false): PrayerScore {
    // If prayer was performed at a mosque, it's an automatic 10
    if (atMosque) {
      return {
        score: 10,
        prayerName: prayer.name,
        registeredTime: registrationTime,
        scheduledTime: prayer.time,
        atMosque: true
      };
    }
    
    // If prayer time hasn't started yet, invalid registration
    if (registrationTime < prayer.time) {
      return {
        score: 0,
        prayerName: prayer.name,
        registeredTime: registrationTime,
        scheduledTime: prayer.time,
        atMosque: false
      };
    }
    
    // If prayer time has ended, it's a missed prayer (score 0)
    if (prayer.endTime && registrationTime > prayer.endTime) {
      return {
        score: 0,
        prayerName: prayer.name,
        registeredTime: registrationTime,
        scheduledTime: prayer.time,
        atMosque: false
      };
    }
    
    // Calculate score based on how early in the prayer window the prayer was performed
    // Formula: 10 - [(registration_time - prayer_start_time) / (prayer_end_time - prayer_start_time) * 10]
    const startTime = prayer.time.getTime();
    const endTime = prayer.endTime ? prayer.endTime.getTime() : startTime + (2 * 60 * 60 * 1000); // Default 2 hour window
    const regTime = registrationTime.getTime();
    
    const timeRatio = (regTime - startTime) / (endTime - startTime);
    const score = 10 - (timeRatio * 10);
    
    // Ensure score is between 0 and 10
    const finalScore = Math.max(0, Math.min(10, score));
    
    return {
      score: Math.round(finalScore * 10) / 10, // Round to 1 decimal place
      prayerName: prayer.name,
      registeredTime: registrationTime,
      scheduledTime: prayer.time,
      atMosque: false
    };
  }
  
  // Calculate daily average score
  calculateDailyAverage(scores: PrayerScore[]): number {
    if (scores.length === 0) return 0;
    
    const totalScore = scores.reduce((sum, score) => sum + score.score, 0);
    const averageScore = totalScore / 5; // Always divide by 5 (total prayers)
    
    return Math.round(averageScore * 10) / 10; // Round to 1 decimal place
  }
}
