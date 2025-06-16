// Updated PrayerStorageService to use persistent storage
import { PersistentStorageService } from '../persistence/storageService';
import { PrayerScore } from './prayerScoringService';

export interface PrayerRecord {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD format
  prayerName: string;
  scheduledTime: string; // ISO string
  registeredTime: string; // ISO string
  score: number;
  atMosque: boolean;
  madeUp: boolean;
}

export class PrayerStorageService {
  private persistentStorage: PersistentStorageService;
  
  constructor(persistentStorage: PersistentStorageService) {
    this.persistentStorage = persistentStorage;
  }
  
  // Store a prayer record
  async storePrayerRecord(userId: string, score: PrayerScore): Promise<PrayerRecord> {
    const record: PrayerRecord = {
      id: this.generateId(),
      userId,
      date: this.formatDate(score.registeredTime),
      prayerName: score.prayerName,
      scheduledTime: score.scheduledTime.toISOString(),
      registeredTime: score.registeredTime.toISOString(),
      score: score.score,
      atMosque: score.atMosque,
      madeUp: false
    };
    
    // Get existing records
    const existingRecords = await this.getAllRecords(userId);
    
    // Add new record
    existingRecords.push(record);
    
    // Save updated records
    await this.persistentStorage.savePrayerRecords(userId, existingRecords);
    
    return record;
  }
  
  // Get prayer records for a specific date
  async getPrayerRecordsForDate(userId: string, date: Date): Promise<PrayerRecord[]> {
    const dateString = this.formatDate(date);
    const allRecords = await this.getAllRecords(userId);
    
    return allRecords.filter(record => record.date === dateString);
  }
  
  // Get missed prayers
  async getMissedPrayers(userId: string): Promise<PrayerRecord[]> {
    const allRecords = await this.getAllRecords(userId);
    
    return allRecords.filter(record => record.score === 0 && !record.madeUp);
  }
  
  // Mark a missed prayer as made up
  async markPrayerAsMadeUp(userId: string, prayerId: string): Promise<boolean> {
    const allRecords = await this.getAllRecords(userId);
    const recordIndex = allRecords.findIndex(record => record.id === prayerId);
    
    if (recordIndex === -1) return false;
    
    allRecords[recordIndex].madeUp = true;
    await this.persistentStorage.savePrayerRecords(userId, allRecords);
    
    return true;
  }
  
  // Helper methods
  private generateId(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }
  
  private formatDate(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }
  
  // Get all records for a user
  private async getAllRecords(userId: string): Promise<PrayerRecord[]> {
    return await this.persistentStorage.getPrayerRecords(userId);
  }
}
