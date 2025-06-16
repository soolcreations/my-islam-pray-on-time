// Internationalization service for multilingual support
import { useState, useEffect } from 'react';

// Available languages
export enum Language {
  ENGLISH = 'en',
  ARABIC = 'ar',
  URDU = 'ur',
  INDONESIAN = 'id',
  TURKISH = 'tr',
  FRENCH = 'fr'
}

// Language direction
export enum Direction {
  LTR = 'ltr',
  RTL = 'rtl'
}

// Interface for translations
export interface Translations {
  [key: string]: string;
}

// Language metadata
export interface LanguageInfo {
  code: Language;
  name: string;
  nativeName: string;
  direction: Direction;
}

// Available languages with metadata
export const LANGUAGES: LanguageInfo[] = [
  { code: Language.ENGLISH, name: 'English', nativeName: 'English', direction: Direction.LTR },
  { code: Language.ARABIC, name: 'Arabic', nativeName: 'العربية', direction: Direction.RTL },
  { code: Language.URDU, name: 'Urdu', nativeName: 'اردو', direction: Direction.RTL },
  { code: Language.INDONESIAN, name: 'Indonesian', nativeName: 'Bahasa Indonesia', direction: Direction.LTR },
  { code: Language.TURKISH, name: 'Turkish', nativeName: 'Türkçe', direction: Direction.LTR },
  { code: Language.FRENCH, name: 'French', nativeName: 'Français', direction: Direction.LTR }
];

// Translation data
const translationData: Record<Language, Translations> = {
  [Language.ENGLISH]: {
    // General
    'app.name': 'Prayer Times App',
    'app.welcome': 'Welcome to Prayer Times App',
    
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.missed': 'Missed Prayers',
    'nav.community': 'Community',
    'nav.leaderboard': 'Leaderboard',
    'nav.mosques': 'Mosques',
    'nav.settings': 'Settings',
    
    // Prayer names
    'prayer.fajr': 'Fajr',
    'prayer.dhuhr': 'Dhuhr',
    'prayer.asr': 'Asr',
    'prayer.maghrib': 'Maghrib',
    'prayer.isha': 'Isha',
    
    // Dashboard
    'dashboard.title': 'Prayer Dashboard',
    'dashboard.today': 'Today',
    'dashboard.upcoming': 'Upcoming',
    'dashboard.active': 'Register',
    'dashboard.missed': 'Missed',
    'dashboard.completed': 'Completed',
    'dashboard.stats': 'Today\'s Statistics',
    'dashboard.prayers.completed': 'Prayers completed',
    'dashboard.average.score': 'Average score',
    
    // Prayer Registration
    'register.title': 'Register Prayer',
    'register.scheduled': 'Scheduled Time',
    'register.current': 'Current Time',
    'register.mosque': 'Prayer performed at mosque',
    'register.mosque.info': 'Prayers at mosque automatically receive a score of 10/10!',
    'register.score.info': 'Your score will be calculated based on how promptly you prayed.',
    'register.cancel': 'Cancel',
    'register.submit': 'Register Prayer',
    'register.success': 'Prayer Registered!',
    'register.score': 'Your Score',
    'register.close': 'Close',
    
    // Missed Prayers
    'missed.title': 'Missed Prayers',
    'missed.empty': 'No missed prayers! Keep up the good work.',
    'missed.scheduled': 'Scheduled',
    'missed.makeup': 'Mark as Made Up',
    'missed.confirm': 'Are you sure you want to mark this prayer as made up?',
    'missed.success': 'Prayer marked as made up successfully.',
    'missed.error': 'Failed to mark prayer as made up.',
    
    // Community
    'community.title': 'Community Feed',
    'community.filter.all': 'All Posts',
    'community.filter.friends': 'Friends',
    'community.filter.mosque': 'Mosque Prayers',
    'community.share.title': 'Share Your Prayer',
    'community.share.prayer': 'Prayer',
    'community.share.public': 'Public',
    'community.share.placeholder': 'Share your thoughts about this prayer...',
    'community.share.button': 'Share',
    'community.empty': 'No posts to display. Be the first to share your prayer!',
    'community.like': 'Like',
    'community.likes': 'Likes',
    'community.comment': 'Comment',
    'community.comments': 'Comments',
    'community.at.mosque': 'At Mosque',
    'community.score': 'Score',
    
    // Leaderboard
    'leaderboard.title': 'Leaderboard',
    'leaderboard.global': 'Global',
    'leaderboard.friends': 'Friends',
    'leaderboard.daily': 'Daily',
    'leaderboard.weekly': 'Weekly',
    'leaderboard.monthly': 'Monthly',
    'leaderboard.your.rank': 'Your Rank',
    'leaderboard.rank': 'Rank',
    'leaderboard.user': 'User',
    'leaderboard.score': 'Score',
    'leaderboard.mosque': 'Mosque',
    'leaderboard.streak': 'Streak',
    'leaderboard.days': 'days',
    'leaderboard.you': 'You',
    
    // Mosque Locator
    'mosque.title': 'Nearby Mosques',
    'mosque.radius': 'Search Radius',
    'mosque.km': 'km',
    'mosque.searching': 'Searching for mosques...',
    'mosque.empty': 'No mosques found within',
    'mosque.try.again': 'Try increasing your search radius.',
    'mosque.away': 'km away',
    'mosque.directions': 'Get Directions',
    'mosque.prayer.times': 'Prayer Times',
    'mosque.no.times': 'Prayer times not available for this mosque.',
    'mosque.note': 'Remember: Prayers performed at the mosque automatically receive a 10/10 score!',
    'mosque.location.error': 'Location Error',
    'mosque.enable.location': 'Please enable location services to find nearby mosques.',
    'mosque.getting.location': 'Getting your location...',
    
    // Settings
    'settings.title': 'Settings',
    'settings.prayer.calculation': 'Prayer Calculation',
    'settings.calculation.method': 'Calculation Method',
    'settings.asr.calculation': 'Asr Calculation',
    'settings.standard': 'Standard (Shafi, Maliki, Hanbali)',
    'settings.hanafi': 'Hanafi',
    'settings.notifications': 'Notifications',
    'settings.prayer.reminders': 'Prayer Time Reminders',
    'settings.reminder.time': 'Reminder Time',
    'settings.before': 'minutes before',
    'settings.appearance': 'Appearance',
    'settings.dark.mode': 'Dark Mode',
    'settings.language': 'Language',
    'settings.about': 'About',
    'settings.version': 'Version',
    'settings.save': 'Save Settings',
    'settings.success': 'Settings saved successfully!',
    
    // Authentication
    'auth.login': 'Login',
    'auth.register': 'Create Account',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirm.password': 'Confirm Password',
    'auth.name': 'Name',
    'auth.login.button': 'Login',
    'auth.register.button': 'Register',
    'auth.google': 'Continue with Google',
    'auth.forgot': 'Forgot Password?',
    'auth.no.account': 'Don\'t have an account? Register',
    'auth.has.account': 'Already have an account? Login',
    'auth.reset.password': 'Reset Password',
    'auth.reset.description': 'Enter your email address and we\'ll send you a link to reset your password.',
    'auth.reset.button': 'Send Reset Link',
    'auth.back.to.login': 'Back to Login',
    'auth.logout': 'Logout',
    
    // Errors
    'error.required': 'Please fill in all fields',
    'error.password.match': 'Passwords do not match',
    'error.password.length': 'Password must be at least 6 characters',
    'error.login.failed': 'Failed to log in. Please try again.',
    'error.register.failed': 'Failed to register. Please try again.',
    'error.reset.failed': 'Failed to send reset email. Please try again.',
    'error.unknown': 'An unknown error occurred'
  },
  
  // Arabic translations
  [Language.ARABIC]: {
    // General
    'app.name': 'تطبيق أوقات الصلاة',
    'app.welcome': 'مرحبًا بك في تطبيق أوقات الصلاة',
    
    // Navigation
    'nav.dashboard': 'لوحة التحكم',
    'nav.missed': 'الصلوات الفائتة',
    'nav.community': 'المجتمع',
    'nav.leaderboard': 'المتصدرين',
    'nav.mosques': 'المساجد',
    'nav.settings': 'الإعدادات',
    
    // Prayer names
    'prayer.fajr': 'الفجر',
    'prayer.dhuhr': 'الظهر',
    'prayer.asr': 'العصر',
    'prayer.maghrib': 'المغرب',
    'prayer.isha': 'العشاء',
    
    // Dashboard
    'dashboard.title': 'لوحة الصلاة',
    'dashboard.today': 'اليوم',
    'dashboard.upcoming': 'قادم',
    'dashboard.active': 'تسجيل',
    'dashboard.missed': 'فائتة',
    'dashboard.completed': 'مكتملة',
    'dashboard.stats': 'إحصائيات اليوم',
    'dashboard.prayers.completed': 'الصلوات المكتملة',
    'dashboard.average.score': 'متوسط النقاط',
    
    // More Arabic translations would follow the same pattern
    // This is a subset for demonstration purposes
  },
  
  // Placeholder for other languages
  // In a real app, these would be complete translations
  [Language.URDU]: {
    'app.name': 'نماز کے اوقات ایپ',
    // Other translations would be added here
  },
  [Language.INDONESIAN]: {
    'app.name': 'Aplikasi Waktu Sholat',
    // Other translations would be added here
  },
  [Language.TURKISH]: {
    'app.name': 'Namaz Vakitleri Uygulaması',
    // Other translations would be added here
  },
  [Language.FRENCH]: {
    'app.name': 'Application des Heures de Prière',
    // Other translations would be added here
  }
};

// Internationalization service
export class I18nService {
  private static instance: I18nService;
  private currentLanguage: Language = Language.ENGLISH;
  
  private constructor() {
    // Initialize with browser language or stored preference
    this.initLanguage();
  }
  
  // Singleton pattern
  public static getInstance(): I18nService {
    if (!I18nService.instance) {
      I18nService.instance = new I18nService();
    }
    return I18nService.instance;
  }
  
  // Initialize language
  private initLanguage(): void {
    // Try to get from localStorage
    const storedLanguage = localStorage.getItem('language') as Language;
    
    if (storedLanguage && Object.values(Language).includes(storedLanguage)) {
      this.currentLanguage = storedLanguage;
    } else {
      // Try to detect from browser
      const browserLanguage = navigator.language.split('-')[0] as Language;
      
      if (Object.values(Language).includes(browserLanguage)) {
        this.currentLanguage = browserLanguage;
      }
    }
    
    // Set document direction
    this.setDocumentDirection();
  }
  
  // Get translation
  public translate(key: string, params?: Record<string, string>): string {
    const translation = translationData[this.currentLanguage][key] || translationData[Language.ENGLISH][key] || key;
    
    if (params) {
      return Object.entries(params).reduce((result, [param, value]) => {
        return result.replace(`{${param}}`, value);
      }, translation);
    }
    
    return translation;
  }
  
  // Get current language
  public getLanguage(): Language {
    return this.currentLanguage;
  }
  
  // Get language info
  public getLanguageInfo(): LanguageInfo {
    return LANGUAGES.find(lang => lang.code === this.currentLanguage) || LANGUAGES[0];
  }
  
  // Set language
  public setLanguage(language: Language): void {
    this.currentLanguage = language;
    localStorage.setItem('language', language);
    this.setDocumentDirection();
  }
  
  // Set document direction based on language
  private setDocumentDirection(): void {
    const languageInfo = this.getLanguageInfo();
    document.documentElement.dir = languageInfo.direction;
    document.documentElement.lang = languageInfo.code;
  }
}

// React hook for using translations
export function useTranslation() {
  const i18n = I18nService.getInstance();
  const [language, setLanguage] = useState<Language>(i18n.getLanguage());
  
  // Function to translate a key
  const t = (key: string, params?: Record<string, string>): string => {
    return i18n.translate(key, params);
  };
  
  // Function to change language
  const changeLanguage = (newLanguage: Language): void => {
    i18n.setLanguage(newLanguage);
    setLanguage(newLanguage);
  };
  
  // Get current language info
  const languageInfo = i18n.getLanguageInfo();
  
  return { t, language, changeLanguage, languageInfo, languages: LANGUAGES };
}
