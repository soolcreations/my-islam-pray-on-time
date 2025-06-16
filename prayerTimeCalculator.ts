// Prayer time calculation service
import { PrayerTime, PrayerDay, CalculationMethod, Coordinates, PrayerSettings, DEFAULT_PRAYER_SETTINGS } from '../types';

// This is a simplified implementation for the prototype
// In a production app, we would use a library like Adhan.js for accurate calculations
export class PrayerTimeCalculator {
  private coordinates: Coordinates;
  private settings: PrayerSettings;

  constructor(coordinates: Coordinates, settings: PrayerSettings = DEFAULT_PRAYER_SETTINGS) {
    this.coordinates = coordinates;
    this.settings = settings;
  }

  // Calculate prayer times for a specific date
  calculatePrayerTimes(date: Date = new Date()): PrayerDay {
    // For the prototype, we'll use fixed times with slight randomization
    // In a real implementation, we would use proper astronomical calculations
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    
    // Base times (would be calculated based on sun position in real implementation)
    const fajrBase = new Date(year, month, day, 5, 0);
    const dhuhrBase = new Date(year, month, day, 12, 0);
    const asrBase = new Date(year, month, day, 15, 30);
    const maghribBase = new Date(year, month, day, 18, 0);
    const ishaBase = new Date(year, month, day, 19, 30);
    
    // Apply method-specific adjustments (simplified)
    const methodAdjustment = this.getMethodAdjustment();
    
    // Apply location-based adjustments (simplified)
    const locationAdjustment = this.getLocationAdjustment();
    
    // Calculate prayer end times (simplified)
    // In reality, each prayer's end time would be the start of the next prayer
    // except for Isha which ends at midnight or Fajr of the next day
    const fajrEndTime = new Date(fajrBase);
    fajrEndTime.setHours(fajrEndTime.getHours() + 2); // Fajr window is 2 hours
    
    const dhuhrEndTime = new Date(dhuhrBase);
    dhuhrEndTime.setHours(dhuhrEndTime.getHours() + 3); // Dhuhr window is 3 hours
    
    const asrEndTime = new Date(asrBase);
    asrEndTime.setHours(asrEndTime.getHours() + 2.5); // Asr window is 2.5 hours
    
    const maghribEndTime = new Date(maghribBase);
    maghribEndTime.setHours(maghribEndTime.getHours() + 1.5); // Maghrib window is 1.5 hours
    
    const ishaEndTime = new Date(ishaBase);
    ishaEndTime.setHours(ishaEndTime.getHours() + 9); // Isha window until next Fajr (simplified)
    
    // Create prayer times with adjusted times
    const prayers: PrayerTime[] = [
      {
        name: 'fajr',
        displayName: 'Fajr',
        time: this.adjustTime(fajrBase, methodAdjustment.fajr, locationAdjustment, this.settings.adjustments.fajr),
        endTime: this.adjustTime(fajrEndTime, methodAdjustment.fajr, locationAdjustment, this.settings.adjustments.fajr)
      },
      {
        name: 'dhuhr',
        displayName: 'Dhuhr',
        time: this.adjustTime(dhuhrBase, methodAdjustment.dhuhr, locationAdjustment, this.settings.adjustments.dhuhr),
        endTime: this.adjustTime(dhuhrEndTime, methodAdjustment.dhuhr, locationAdjustment, this.settings.adjustments.dhuhr)
      },
      {
        name: 'asr',
        displayName: 'Asr',
        time: this.adjustTime(asrBase, methodAdjustment.asr, locationAdjustment, this.settings.adjustments.asr),
        endTime: this.adjustTime(asrEndTime, methodAdjustment.asr, locationAdjustment, this.settings.adjustments.asr)
      },
      {
        name: 'maghrib',
        displayName: 'Maghrib',
        time: this.adjustTime(maghribBase, methodAdjustment.maghrib, locationAdjustment, this.settings.adjustments.maghrib),
        endTime: this.adjustTime(maghribEndTime, methodAdjustment.maghrib, locationAdjustment, this.settings.adjustments.maghrib)
      },
      {
        name: 'isha',
        displayName: 'Isha',
        time: this.adjustTime(ishaBase, methodAdjustment.isha, locationAdjustment, this.settings.adjustments.isha),
        endTime: this.adjustTime(ishaEndTime, methodAdjustment.isha, locationAdjustment, this.settings.adjustments.isha)
      }
    ];
    
    return {
      date: new Date(year, month, day),
      prayers
    };
  }
  
  // Get adjustments based on calculation method (simplified)
  private getMethodAdjustment() {
    // In a real implementation, these would be based on actual calculation methods
    switch (this.settings.calculationMethod) {
      case CalculationMethod.ISNA:
        return {
          fajr: 0,
          dhuhr: 0,
          asr: 0,
          maghrib: 0,
          isha: 0
        };
      case CalculationMethod.MWL:
        return {
          fajr: -15, // 15 minutes earlier
          dhuhr: 0,
          asr: 0,
          maghrib: 0,
          isha: 15 // 15 minutes later
        };
      // Other methods would have their own adjustments
      default:
        return {
          fajr: 0,
          dhuhr: 0,
          asr: 0,
          maghrib: 0,
          isha: 0
        };
    }
  }
  
  // Get adjustments based on location (simplified)
  private getLocationAdjustment(): number {
    // In a real implementation, this would be based on latitude/longitude
    // For now, we'll use a simple adjustment based on latitude
    const latitudeAdjustment = Math.abs(this.coordinates.latitude) > 45 ? 30 : 0;
    return latitudeAdjustment;
  }
  
  // Apply time adjustments in minutes
  private adjustTime(time: Date, methodAdjustment: number, locationAdjustment: number, userAdjustment: number): Date {
    const adjustedTime = new Date(time);
    const totalAdjustment = methodAdjustment + locationAdjustment + userAdjustment;
    adjustedTime.setMinutes(adjustedTime.getMinutes() + totalAdjustment);
    return adjustedTime;
  }
  
  // Update calculator settings
  updateSettings(settings: Partial<PrayerSettings>) {
    this.settings = { ...this.settings, ...settings };
  }
  
  // Update location
  updateLocation(coordinates: Coordinates) {
    this.coordinates = coordinates;
  }
}
