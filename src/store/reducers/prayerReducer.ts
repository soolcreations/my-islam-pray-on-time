// src/store/reducers/prayerReducer.ts
import { PrayerState } from '../types';
const initialState: PrayerState = {
  prayerTimesToday: [],
  currentPrayerIndex: null,
  missedPrayers: [],
  dailyLog: {},
};
export default function prayerReducer(state = initialState, action: any): PrayerState {
  switch (action.type) {
    // Placeholder for prayer actions
    default:
      return state;
  }
}
