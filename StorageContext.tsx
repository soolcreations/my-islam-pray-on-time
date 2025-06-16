// Context provider for persistent storage
import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { PersistentStorageService } from '@shared/persistence/storageService';
import { WebStorageProvider } from '@shared/persistence/storageService';
import { PrayerStorageService } from '@shared/services/prayerStorageService';
import { PrayerSettings, DEFAULT_PRAYER_SETTINGS } from '@shared/types';

// Create a storage provider instance
const storageProvider = new WebStorageProvider();
const persistentStorage = new PersistentStorageService(storageProvider);

// Context type definitions
interface StorageContextType {
  prayerStorage: PrayerStorageService;
  userSettings: PrayerSettings;
  setUserSettings: (settings: PrayerSettings) => Promise<void>;
  isLoading: boolean;
  userId: string;
}

// Create the context
const StorageContext = createContext<StorageContextType | undefined>(undefined);

// Provider component
export const StorageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userSettings, setUserSettings] = useState<PrayerSettings>({...DEFAULT_PRAYER_SETTINGS});
  const [isLoading, setIsLoading] = useState(true);
  
  // Mock user ID (would come from authentication in a real app)
  const userId = 'user123';
  
  // Create prayer storage service
  const prayerStorage = new PrayerStorageService(persistentStorage);
  
  // Load user settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await persistentStorage.getUserSettings(userId);
        setUserSettings(settings);
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSettings();
  }, []);
  
  // Save user settings
  const handleSetUserSettings = async (settings: PrayerSettings) => {
    setUserSettings(settings);
    await persistentStorage.saveUserSettings(userId, settings);
  };
  
  return (
    <StorageContext.Provider
      value={{
        prayerStorage,
        userSettings,
        setUserSettings: handleSetUserSettings,
        isLoading,
        userId
      }}
    >
      {children}
    </StorageContext.Provider>
  );
};

// Hook to use the storage context
export const useStorage = () => {
  const context = useContext(StorageContext);
  if (context === undefined) {
    throw new Error('useStorage must be used within a StorageProvider');
  }
  return context;
};
