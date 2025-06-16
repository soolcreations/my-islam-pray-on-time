import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define types
export interface QuranPosition {
  surah: number;
  ayah: number;
  page?: number;
  juz?: number;
}

export interface QuranBookmark {
  id: string;
  position: QuranPosition;
  title: string;
  notes?: string;
  timestamp: string;
}

export interface QuranReadingGoal {
  id: string;
  type: 'daily' | 'weekly' | 'monthly' | 'custom';
  target: number; // pages, ayahs, or minutes
  unit: 'pages' | 'ayahs' | 'minutes';
  progress: number;
  completed: boolean;
  startDate: string;
  endDate?: string;
}

export interface QuranReadingSession {
  id: string;
  startPosition: QuranPosition;
  endPosition: QuranPosition;
  duration: number; // in minutes
  timestamp: string;
}

interface QuranState {
  currentPosition: QuranPosition;
  readingGoals: QuranReadingGoal[];
  bookmarks: QuranBookmark[];
  readingHistory: QuranReadingSession[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: QuranState = {
  currentPosition: {
    surah: 1,
    ayah: 1,
    page: 1,
    juz: 1,
  },
  readingGoals: [],
  bookmarks: [],
  readingHistory: [],
  loading: false,
  error: null,
};

// Create slice
const quranSlice = createSlice({
  name: 'quran',
  initialState,
  reducers: {
    updateCurrentPosition: (state, action: PayloadAction<QuranPosition>) => {
      state.currentPosition = { ...state.currentPosition, ...action.payload };
    },
    addBookmark: (state, action: PayloadAction<QuranBookmark>) => {
      state.bookmarks.push(action.payload);
    },
    removeBookmark: (state, action: PayloadAction<string>) => {
      state.bookmarks = state.bookmarks.filter(bookmark => bookmark.id !== action.payload);
    },
    updateBookmark: (state, action: PayloadAction<{ id: string; updates: Partial<QuranBookmark> }>) => {
      const bookmark = state.bookmarks.find(b => b.id === action.payload.id);
      if (bookmark) {
        Object.assign(bookmark, action.payload.updates);
      }
    },
    addReadingGoal: (state, action: PayloadAction<QuranReadingGoal>) => {
      state.readingGoals.push(action.payload);
    },
    updateReadingGoal: (state, action: PayloadAction<{ id: string; updates: Partial<QuranReadingGoal> }>) => {
      const goal = state.readingGoals.find(g => g.id === action.payload.id);
      if (goal) {
        Object.assign(goal, action.payload.updates);
      }
    },
    removeReadingGoal: (state, action: PayloadAction<string>) => {
      state.readingGoals = state.readingGoals.filter(goal => goal.id !== action.payload);
    },
    recordReadingSession: (state, action: PayloadAction<QuranReadingSession>) => {
      state.readingHistory.push(action.payload);
      
      // Update current position
      state.currentPosition = action.payload.endPosition;
      
      // Update reading goals progress
      state.readingGoals.forEach(goal => {
        if (!goal.completed) {
          // Calculate progress based on goal unit
          let progressIncrement = 0;
          
          if (goal.unit === 'pages' && action.payload.endPosition.page && action.payload.startPosition.page) {
            progressIncrement = action.payload.endPosition.page - action.payload.startPosition.page;
          } else if (goal.unit === 'ayahs') {
            // Calculate total ayahs read
            // This is simplified and would need more complex logic for actual implementation
            const startTotal = (action.payload.startPosition.surah * 100) + action.payload.startPosition.ayah;
            const endTotal = (action.payload.endPosition.surah * 100) + action.payload.endPosition.ayah;
            progressIncrement = endTotal - startTotal;
          } else if (goal.unit === 'minutes') {
            progressIncrement = action.payload.duration;
          }
          
          goal.progress += progressIncrement;
          
          // Check if goal is completed
          if (goal.progress >= goal.target) {
            goal.completed = true;
          }
        }
      });
    },
  },
});

// Export actions and reducer
export const {
  updateCurrentPosition,
  addBookmark,
  removeBookmark,
  updateBookmark,
  addReadingGoal,
  updateReadingGoal,
  removeReadingGoal,
  recordReadingSession,
} = quranSlice.actions;
export default quranSlice.reducer;
