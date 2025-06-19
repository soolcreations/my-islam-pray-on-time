// src/store/reducers/quranReducer.ts
import { QuranState, UPDATE_QURAN_POSITION } from '../types';
const initialState: QuranState = {
  currentPosition: { ayah: 1, page: 1, juz: 1 },
  readingGoals: [],
  bookmarks: [],
};
export default function quranReducer(state = initialState, action: any): QuranState {
  switch (action.type) {
    case UPDATE_QURAN_POSITION:
      return { ...state, currentPosition: action.payload };
    default:
      return state;
  }
}
