// Types for prayer times and calculations
export interface PrayerTime {
  name: string;
  displayName: string;
  time: Date;
  endTime?: Date; // Optional end time for prayer window
}

export interface PrayerDay {
  date: Date;
  prayers: PrayerTime[];
}

export enum CalculationMethod {
  MWL = 'Muslim World League',
  ISNA = 'Islamic Society of North America',
  Egypt = 'Egyptian General Authority of Survey',
  Makkah = 'Umm Al-Qura University, Makkah',
  Karachi = 'University of Islamic Sciences, Karachi',
  Tehran = 'Institute of Geophysics, University of Tehran',
  Jafari = 'Shia Ithna-Ashari, Leva Institute, Qum'
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface PrayerSettings {
  calculationMethod: CalculationMethod;
  adjustments: {
    fajr: number;
    dhuhr: number;
    asr: number;
    maghrib: number;
    isha: number;
  };
  asrMethod: 'Standard' | 'Hanafi';
  highLatitudeRule: 'MiddleOfNight' | 'SeventhOfNight' | 'TwilightAngle';
}

// Default prayer settings
export const DEFAULT_PRAYER_SETTINGS: PrayerSettings = {
  calculationMethod: CalculationMethod.ISNA,
  adjustments: {
    fajr: 0,
    dhuhr: 0,
    asr: 0,
    maghrib: 0,
    isha: 0
  },
  asrMethod: 'Standard',
  highLatitudeRule: 'MiddleOfNight'
};
