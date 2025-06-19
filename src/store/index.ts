// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import quranReducer from './reducers/quranReducer';
import prayerReducer from './reducers/prayerReducer';
import userStatisticsReducer from './reducers/userStatisticsReducer';

const store = configureStore({
  reducer: {
    quran: quranReducer,
    prayer: prayerReducer,
    userStatistics: userStatisticsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
