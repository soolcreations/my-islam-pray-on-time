import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from './authSlice';

// Define types
export interface Post {
  id: string;
  user: User;
  type: 'prayer' | 'quran' | 'badge' | 'general';
  content: string;
  timestamp: string;
  likes: number;
  comments: Comment[];
  hasLiked: boolean;
}

export interface Comment {
  id: string;
  user: User;
  content: string;
  timestamp: string;
}

export interface Story {
  id: string;
  user: User;
  type: 'prayer' | 'quran' | 'badge';
  content: string;
  timestamp: string;
  viewed: boolean;
}

export interface Friend {
  id: string;
  user: User;
  status: 'active' | 'inactive';
  lastActive: string;
}

interface SocialState {
  feed: Post[];
  stories: Story[];
  friends: Friend[];
  activeFilter: 'all' | 'prayers' | 'quran' | 'badges';
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: SocialState = {
  feed: [],
  stories: [],
  friends: [],
  activeFilter: 'all',
  loading: false,
  error: null,
};

// Create slice
const socialSlice = createSlice({
  name: 'social',
  initialState,
  reducers: {
    fetchFeedRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchFeedSuccess: (state, action: PayloadAction<Post[]>) => {
      state.loading = false;
      state.feed = action.payload;
      state.error = null;
    },
    fetchFeedFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    addPost: (state, action: PayloadAction<Post>) => {
      state.feed.unshift(action.payload);
    },
    likePost: (state, action: PayloadAction<string>) => {
      const post = state.feed.find(p => p.id === action.payload);
      if (post) {
        if (!post.hasLiked) {
          post.likes += 1;
          post.hasLiked = true;
        }
      }
    },
    unlikePost: (state, action: PayloadAction<string>) => {
      const post = state.feed.find(p => p.id === action.payload);
      if (post) {
        if (post.hasLiked) {
          post.likes -= 1;
          post.hasLiked = false;
        }
      }
    },
    addComment: (state, action: PayloadAction<{ postId: string; comment: Comment }>) => {
      const post = state.feed.find(p => p.id === action.payload.postId);
      if (post) {
        post.comments.push(action.payload.comment);
      }
    },
    fetchStoriesRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchStoriesSuccess: (state, action: PayloadAction<Story[]>) => {
      state.loading = false;
      state.stories = action.payload;
      state.error = null;
    },
    fetchStoriesFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    addStory: (state, action: PayloadAction<Story>) => {
      state.stories.unshift(action.payload);
    },
    viewStory: (state, action: PayloadAction<string>) => {
      const story = state.stories.find(s => s.id === action.payload);
      if (story) {
        story.viewed = true;
      }
    },
    fetchFriendsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchFriendsSuccess: (state, action: PayloadAction<Friend[]>) => {
      state.loading = false;
      state.friends = action.payload;
      state.error = null;
    },
    fetchFriendsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    setActiveFilter: (state, action: PayloadAction<'all' | 'prayers' | 'quran' | 'badges'>) => {
      state.activeFilter = action.payload;
    },
  },
});

// Export actions and reducer
export const {
  fetchFeedRequest,
  fetchFeedSuccess,
  fetchFeedFailure,
  addPost,
  likePost,
  unlikePost,
  addComment,
  fetchStoriesRequest,
  fetchStoriesSuccess,
  fetchStoriesFailure,
  addStory,
  viewStory,
  fetchFriendsRequest,
  fetchFriendsSuccess,
  fetchFriendsFailure,
  setActiveFilter,
} = socialSlice.actions;
export default socialSlice.reducer;
