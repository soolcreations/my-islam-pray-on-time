// Context provider for community features
import React, { createContext, useContext, ReactNode, useState } from 'react';
import { communityService, PrayerPost, LeaderboardUser } from '@shared/firebase/communityService';
import { useAuth } from './AuthContext';

// Context type definitions
interface CommunityContextType {
  // Community feed
  posts: PrayerPost[];
  loadingPosts: boolean;
  getPosts: (filter: 'all' | 'friends' | 'mosque') => Promise<void>;
  createPost: (post: Partial<PrayerPost>) => Promise<void>;
  toggleLike: (postId: string) => Promise<void>;
  addComment: (postId: string, text: string) => Promise<void>;
  
  // Leaderboard
  leaderboardUsers: LeaderboardUser[];
  loadingLeaderboard: boolean;
  getLeaderboard: (type: 'global' | 'friends', timeRange: 'daily' | 'weekly' | 'monthly') => Promise<void>;
}

// Create the context
const CommunityContext = createContext<CommunityContextType | undefined>(undefined);

// Provider component
export const CommunityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<PrayerPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [leaderboardUsers, setLeaderboardUsers] = useState<LeaderboardUser[]>([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);
  
  const { currentUser } = useAuth();
  
  // Get posts for the community feed
  const getPosts = async (filter: 'all' | 'friends' | 'mosque' = 'all') => {
    if (!currentUser) return;
    
    setLoadingPosts(true);
    try {
      const fetchedPosts = await communityService.getPosts(filter, currentUser.uid);
      setPosts(fetchedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoadingPosts(false);
    }
  };
  
  // Create a new post
  const createPost = async (postData: Partial<PrayerPost>) => {
    if (!currentUser) return;
    
    try {
      const user = {
        id: currentUser.uid,
        displayName: currentUser.displayName || 'Anonymous',
        photoURL: currentUser.photoURL || undefined
      };
      
      const newPost: Omit<PrayerPost, 'id'> = {
        userId: currentUser.uid,
        user,
        prayerName: postData.prayerName || 'fajr',
        score: postData.score || 0,
        atMosque: postData.atMosque || false,
        timestamp: new Date(),
        message: postData.message || '',
        likes: [],
        comments: [],
        isPublic: postData.isPublic !== undefined ? postData.isPublic : true
      };
      
      await communityService.createPost(newPost);
      
      // Refresh posts
      getPosts('all');
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  };
  
  // Toggle like on a post
  const toggleLike = async (postId: string) => {
    if (!currentUser) return;
    
    try {
      await communityService.toggleLike(postId, currentUser.uid);
      
      // Update local state
      setPosts(posts.map(post => {
        if (post.id === postId) {
          const userLiked = post.likes.includes(currentUser.uid);
          return {
            ...post,
            likes: userLiked
              ? post.likes.filter(id => id !== currentUser.uid)
              : [...post.likes, currentUser.uid]
          };
        }
        return post;
      }));
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };
  
  // Add a comment to a post
  const addComment = async (postId: string, text: string) => {
    if (!currentUser || !text.trim()) return;
    
    try {
      const user = {
        id: currentUser.uid,
        displayName: currentUser.displayName || 'Anonymous',
        photoURL: currentUser.photoURL || undefined
      };
      
      const comment = {
        userId: currentUser.uid,
        user,
        text,
        timestamp: new Date()
      };
      
      await communityService.addComment(postId, comment);
      
      // Update local state
      setPosts(posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...post.comments, { ...comment, id: `temp-${Date.now()}` }]
          };
        }
        return post;
      }));
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };
  
  // Get leaderboard data
  const getLeaderboard = async (
    type: 'global' | 'friends' = 'global',
    timeRange: 'daily' | 'weekly' | 'monthly' = 'weekly'
  ) => {
    if (!currentUser) return;
    
    setLoadingLeaderboard(true);
    try {
      const users = await communityService.getLeaderboard(type, timeRange, currentUser.uid);
      setLeaderboardUsers(users);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoadingLeaderboard(false);
    }
  };
  
  return (
    <CommunityContext.Provider
      value={{
        posts,
        loadingPosts,
        getPosts,
        createPost,
        toggleLike,
        addComment,
        leaderboardUsers,
        loadingLeaderboard,
        getLeaderboard
      }}
    >
      {children}
    </CommunityContext.Provider>
  );
};

// Hook to use the community context
export const useCommunity = () => {
  const context = useContext(CommunityContext);
  if (context === undefined) {
    throw new Error('useCommunity must be used within a CommunityProvider');
  }
  return context;
};
