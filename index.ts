import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import prayerReducer from './slices/prayerSlice';
import quranReducer from './slices/quranSlice';
import socialReducer from './slices/socialSlice';
import notificationsReducer from './slices/notificationsSlice';

// Configure the Redux store
const store = configureStore({
  reducer: {
    auth: authReducer,
    prayer: prayerReducer,
    quran: quranReducer,
    social: socialReducer,
    notifications: notificationsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['persist/PERSIST'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.timestamp', 'meta.arg'],
        // Ignore these paths in the state
        ignoredPaths: ['items.dates'],
      },
    }),
});

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
