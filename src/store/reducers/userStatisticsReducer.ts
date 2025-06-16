// src/store/reducers/userStatisticsReducer.ts
import { UserStatisticsState } from '../types';
const initialState: UserStatisticsState = {
  prayerScoreHistory: [],
  quranPagesPerDay: [],
  leaderboardData: [],
};
export default function userStatisticsReducer(state = initialState, action: any): UserStatisticsState {
  switch (action.type) {
    // Placeholder for statistics actions
    default:
      return state;
  }
}
