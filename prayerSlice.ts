import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define types
export interface PrayerTime {
  name: string;
  time: string;
  registered: boolean;
  score: number;
}

export interface MissedPrayer {
  id: string;
  name: string;
  date: string;
  madeUp: boolean;
}

interface PrayerState {
  times: {
    fajr: string;
    dhuhr: string;
    asr: string;
    maghrib: string;
    isha: string;
  };
  currentPrayer: PrayerTime | null;
  history: PrayerTime[];
  missedPrayers: MissedPrayer[];
  streaks: {
    current: number;
    longest: number;
  };
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: PrayerState = {
  times: {
    fajr: '05:30',
    dhuhr: '12:30',
    asr: '15:45',
    maghrib: '18:15',
    isha: '19:45',
  },
  currentPrayer: {
    name: 'dhuhr',
    time: '12:30',
    registered: false,
    score: 9.8,
  },
  history: [],
  missedPrayers: [],
  streaks: {
    current: 15,
    longest: 30,
  },
  loading: false,
  error: null,
};

// Create slice
const prayerSlice = createSlice({
  name: 'prayer',
  initialState,
  reducers: {
    fetchPrayerTimesRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchPrayerTimesSuccess: (state, action: PayloadAction<{ [key: string]: string }>) => {
      state.loading = false;
      state.times = { ...state.times, ...action.payload };
      state.error = null;
    },
    fetchPrayerTimesFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateCurrentPrayer: (state, action: PayloadAction<PrayerTime>) => {
      state.currentPrayer = action.payload;
    },
    registerPrayer: (state, action: PayloadAction<{ name: string; score: number }>) => {
      if (state.currentPrayer && state.currentPrayer.name === action.payload.name) {
        state.currentPrayer.registered = true;
        state.currentPrayer.score = action.payload.score;
        state.history.push({ ...state.currentPrayer });
        state.streaks.current += 1;
        if (state.streaks.current > state.streaks.longest) {
          state.streaks.longest = state.streaks.current;
        }
      }
    },
    addMissedPrayer: (state, action: PayloadAction<MissedPrayer>) => {
      state.missedPrayers.push(action.payload);
      state.streaks.current = 0;
    },
    markMissedPrayerAsMadeUp: (state, action: PayloadAction<string>) => {
      const missedPrayer = state.missedPrayers.find(prayer => prayer.id === action.payload);
      if (missedPrayer) {
        missedPrayer.madeUp = true;
      }
    },
  },
});

// Export actions and reducer
export const {
  fetchPrayerTimesRequest,
  fetchPrayerTimesSuccess,
  fetchPrayerTimesFailure,
  updateCurrentPrayer,
  registerPrayer,
  addMissedPrayer,
  markMissedPrayerAsMadeUp,
} = prayerSlice.actions;
export default prayerSlice.reducer;
