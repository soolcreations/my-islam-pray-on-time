import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootState } from '../store';
import NetInfo from '@react-native-community/netinfo';

// Mock implementation of offline support service
// In a real app, this would use libraries like redux-persist and proper sync mechanisms

const OfflineService = () => {
  const dispatch = useDispatch();
  const authState = useSelector((state: RootState) => state.auth);
  const prayerState = useSelector((state: RootState) => state.prayer);
  const quranState = useSelector((state: RootState) => state.quran);
  const socialState = useSelector((state: RootState) => state.social);
  const notificationsState = useSelector((state: RootState) => state.notifications);
  
  // Track network status
  const [isConnected, setIsConnected] = React.useState(true);
  const [isSyncing, setIsSyncing] = React.useState(false);
  const [offlineActions, setOfflineActions] = React.useState([]);
  
  // Initialize network listener
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const connected = state.isConnected && state.isInternetReachable;
      setIsConnected(connected);
      
      // If reconnected, sync offline data
      if (connected && !isConnected && offlineActions.length > 0) {
        syncOfflineData();
      }
    });
    
    // Load any pending offline actions
    loadOfflineActions();
    
    return () => {
      unsubscribe();
    };
  }, [isConnected, offlineActions]);
  
  // Save state to AsyncStorage whenever it changes
  useEffect(() => {
    saveStateToStorage();
  }, [prayerState, quranState, socialState, notificationsState]);
  
  // Load offline actions from storage
  const loadOfflineActions = async () => {
    try {
      const actionsJson = await AsyncStorage.getItem('offlineActions');
      if (actionsJson) {
        setOfflineActions(JSON.parse(actionsJson));
      }
    } catch (error) {
      console.error('Error loading offline actions:', error);
    }
  };
  
  // Save current state to AsyncStorage
  const saveStateToStorage = async () => {
    try {
      // Save each slice of state separately
      await AsyncStorage.setItem('prayerState', JSON.stringify(prayerState));
      await AsyncStorage.setItem('quranState', JSON.stringify(quranState));
      
      // Only save essential parts of social state (not the entire feed)
      const essentialSocialState = {
        activeFilter: socialState.activeFilter,
        friends: socialState.friends,
      };
      await AsyncStorage.setItem('socialState', JSON.stringify(essentialSocialState));
      
      // Save notifications
      await AsyncStorage.setItem('notificationsState', JSON.stringify(notificationsState));
    } catch (error) {
      console.error('Error saving state to storage:', error);
    }
  };
  
  // Add an action to the offline queue
  const addOfflineAction = async (action) => {
    try {
      const updatedActions = [...offlineActions, {
        ...action,
        timestamp: Date.now(),
      }];
      setOfflineActions(updatedActions);
      await AsyncStorage.setItem('offlineActions', JSON.stringify(updatedActions));
    } catch (error) {
      console.error('Error adding offline action:', error);
    }
  };
  
  // Sync offline data when back online
  const syncOfflineData = async () => {
    if (isSyncing || offlineActions.length === 0) return;
    
    setIsSyncing(true);
    
    try {
      // Process each offline action in order
      for (const action of offlineActions) {
        // In a real app, this would make API calls to sync with the server
        console.log(`Syncing offline action: ${action.type}`);
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      // Clear offline actions after successful sync
      setOfflineActions([]);
      await AsyncStorage.removeItem('offlineActions');
      
      console.log('Offline data sync completed');
    } catch (error) {
      console.error('Error syncing offline data:', error);
    } finally {
      setIsSyncing(false);
    }
  };
  
  // Create a middleware to intercept actions when offline
  const createOfflineMiddleware = () => {
    return store => next => action => {
      // Always process these actions regardless of connection status
      const alwaysProcessActions = [
        'auth/loginRequest',
        'auth/loginSuccess',
        'auth/loginFailure',
        'auth/logout',
      ];
      
      // Actions that should be queued when offline
      const queueableActions = [
        'prayer/registerPrayer',
        'prayer/markMissedPrayerAsMadeUp',
        'quran/recordReadingSession',
        'quran/addBookmark',
        'quran/removeBookmark',
        'quran/updateBookmark',
        'quran/addReadingGoal',
        'quran/updateReadingGoal',
        'social/addPost',
        'social/likePost',
        'social/unlikePost',
        'social/addComment',
        'social/addStory',
      ];
      
      // If online or action should always be processed, proceed normally
      if (isConnected || alwaysProcessActions.includes(action.type)) {
        return next(action);
      }
      
      // If offline and action is queueable, add to offline queue
      if (queueableActions.includes(action.type)) {
        addOfflineAction(action);
        
        // Still dispatch to update local state
        return next(action);
      }
      
      // For other actions when offline, just dispatch normally
      return next(action);
    };
  };
  
  // This component doesn't render anything
  return null;
};

// Export the middleware creator for use in store configuration
export const offlineMiddleware = createOfflineMiddleware;
export default OfflineService;
