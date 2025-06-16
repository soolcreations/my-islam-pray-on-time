import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define types
export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'prayer' | 'quran' | 'social' | 'streak';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
  progress: number;
  threshold: number;
  dateUnlocked?: string;
}

export interface Notification {
  id: string;
  type: 'prayer' | 'quran' | 'badge' | 'friend' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionable: boolean;
  action?: {
    type: string;
    payload: any;
  };
}

interface NotificationsState {
  badges: Badge[];
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: NotificationsState = {
  badges: [],
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
};

// Create slice
const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    fetchBadgesRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchBadgesSuccess: (state, action: PayloadAction<Badge[]>) => {
      state.loading = false;
      state.badges = action.payload;
      state.error = null;
    },
    fetchBadgesFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateBadgeProgress: (state, action: PayloadAction<{ id: string; progress: number }>) => {
      const badge = state.badges.find(b => b.id === action.payload.id);
      if (badge) {
        badge.progress = action.payload.progress;
        
        // Check if badge should be unlocked
        if (!badge.unlocked && badge.progress >= badge.threshold) {
          badge.unlocked = true;
          badge.dateUnlocked = new Date().toISOString();
          
          // Add notification for unlocked badge
          const notification: Notification = {
            id: `badge-${badge.id}-${Date.now()}`,
            type: 'badge',
            title: 'New Badge Unlocked!',
            message: `Congratulations! You've earned the "${badge.title}" badge.`,
            timestamp: new Date().toISOString(),
            read: false,
            actionable: true,
            action: {
              type: 'VIEW_BADGE',
              payload: badge.id,
            },
          };
          
          state.notifications.unshift(notification);
          state.unreadCount += 1;
        }
      }
    },
    fetchNotificationsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchNotificationsSuccess: (state, action: PayloadAction<Notification[]>) => {
      state.loading = false;
      state.notifications = action.payload;
      state.unreadCount = action.payload.filter(n => !n.read).length;
      state.error = null;
    },
    fetchNotificationsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.unshift(action.payload);
      if (!action.payload.read) {
        state.unreadCount += 1;
      }
    },
    markNotificationAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount -= 1;
      }
    },
    markAllNotificationsAsRead: (state) => {
      state.notifications.forEach(notification => {
        notification.read = true;
      });
      state.unreadCount = 0;
    },
    deleteNotification: (state, action: PayloadAction<string>) => {
      const index = state.notifications.findIndex(n => n.id === action.payload);
      if (index !== -1) {
        if (!state.notifications[index].read) {
          state.unreadCount -= 1;
        }
        state.notifications.splice(index, 1);
      }
    },
  },
});

// Export actions and reducer
export const {
  fetchBadgesRequest,
  fetchBadgesSuccess,
  fetchBadgesFailure,
  updateBadgeProgress,
  fetchNotificationsRequest,
  fetchNotificationsSuccess,
  fetchNotificationsFailure,
  addNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} = notificationsSlice.actions;
export default notificationsSlice.reducer;
