// Storage service implementation with persistence
import { PrayerRecord } from '../services/prayerStorageService';
import { PrayerSettings, DEFAULT_PRAYER_SETTINGS } from '../types';

// Interface for storage provider (to be implemented differently for web and mobile)
export interface StorageProvider {
  setItem(key: string, value: string): Promise<void>;
  getItem(key: string): Promise<string | null>;
  removeItem(key: string): Promise<void>;
}

// Web implementation using localStorage
export class WebStorageProvider implements StorageProvider {
  async setItem(key: string, value: string): Promise<void> {
    localStorage.setItem(key, value);
  }

  async getItem(key: string): Promise<string | null> {
    return localStorage.getItem(key);
  }

  async removeItem(key: string): Promise<void> {
    localStorage.removeItem(key);
  }
}

// Main persistent storage service
export class PersistentStorageService {
  private storageProvider: StorageProvider;
  
  constructor(storageProvider: StorageProvider) {
    this.storageProvider = storageProvider;
  }
  
  // Save prayer records
  async savePrayerRecords(userId: string, records: PrayerRecord[]): Promise<void> {
    const key = `prayer_records_${userId}`;
    await this.storageProvider.setItem(key, JSON.stringify(records));
  }
  
  // Get prayer records
  async getPrayerRecords(userId: string): Promise<PrayerRecord[]> {
    const key = `prayer_records_${userId}`;
    const data = await this.storageProvider.getItem(key);
    
    if (!data) {
      return [];
    }
    
    try {
      return JSON.parse(data) as PrayerRecord[];
    } catch (error) {
      console.error('Error parsing prayer records:', error);
      return [];
    }
  }
  
  // Save user settings
  async saveUserSettings(userId: string, settings: PrayerSettings): Promise<void> {
    const key = `user_settings_${userId}`;
    await this.storageProvider.setItem(key, JSON.stringify(settings));
  }
  
  // Get user settings
  async getUserSettings(userId: string): Promise<PrayerSettings> {
    const key = `user_settings_${userId}`;
    const data = await this.storageProvider.getItem(key);
    
    if (!data) {
      return {...DEFAULT_PRAYER_SETTINGS};
    }
    
    try {
      return JSON.parse(data) as PrayerSettings;
    } catch (error) {
      console.error('Error parsing user settings:', error);
      return {...DEFAULT_PRAYER_SETTINGS};
    }
  }
  
  // Save user profile
  async saveUserProfile(userId: string, profile: any): Promise<void> {
    const key = `user_profile_${userId}`;
    await this.storageProvider.setItem(key, JSON.stringify(profile));
  }
  
  // Get user profile
  async getUserProfile(userId: string): Promise<any | null> {
    const key = `user_profile_${userId}`;
    const data = await this.storageProvider.getItem(key);
    
    if (!data) {
      return null;
    }
    
    try {
      return JSON.parse(data);
    } catch (error) {
      console.error('Error parsing user profile:', error);
      return null;
    }
  }
  
  // Clear all user data
  async clearUserData(userId: string): Promise<void> {
    const keys = [
      `prayer_records_${userId}`,
      `user_settings_${userId}`,
      `user_profile_${userId}`
    ];
    
    for (const key of keys) {
      await this.storageProvider.removeItem(key);
    }
  }
}
