// Firebase service for community features
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  updateDoc,
  doc,
  arrayUnion,
  arrayRemove,
  serverTimestamp
} from 'firebase/firestore';
import { auth, db } from './firebaseService';

// Types for community posts
export interface PostUser {
  id: string;
  displayName: string;
  photoURL?: string;
}

export interface PrayerPost {
  id?: string;
  userId: string;
  user: PostUser;
  prayerName: string;
  score: number;
  atMosque: boolean;
  timestamp: any; // Firebase Timestamp
  message?: string;
  likes: string[]; // Array of user IDs who liked the post
  comments: Comment[];
  isPublic: boolean;
}

export interface Comment {
  id?: string;
  userId: string;
  user: PostUser;
  text: string;
  timestamp: any; // Firebase Timestamp
}

export interface LeaderboardUser {
  id: string;
  displayName: string;
  photoURL?: string;
  score: number;
  prayersAtMosque: number;
  streak: number;
  rank?: number;
}

// Community service for social features
export class CommunityService {
  // Create a new post
  async createPost(post: Omit<PrayerPost, 'id'>): Promise<string> {
    try {
      const postWithTimestamp = {
        ...post,
        timestamp: serverTimestamp()
      };
      
      const docRef = await addDoc(collection(db, 'posts'), postWithTimestamp);
      return docRef.id;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  }
  
  // Get posts for the community feed
  async getPosts(filter: 'all' | 'friends' | 'mosque' = 'all', userId: string): Promise<PrayerPost[]> {
    try {
      let q;
      
      if (filter === 'all') {
        q = query(
          collection(db, 'posts'),
          where('isPublic', '==', true),
          orderBy('timestamp', 'desc'),
          limit(50)
        );
      } else if (filter === 'mosque') {
        q = query(
          collection(db, 'posts'),
          where('isPublic', '==', true),
          where('atMosque', '==', true),
          orderBy('timestamp', 'desc'),
          limit(50)
        );
      } else if (filter === 'friends') {
        // In a real app, we would have a friends collection
        // For now, we'll just return all public posts
        q = query(
          collection(db, 'posts'),
          where('isPublic', '==', true),
          orderBy('timestamp', 'desc'),
          limit(50)
        );
      }
      
      const querySnapshot = await getDocs(q);
      const posts: PrayerPost[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data() as PrayerPost;
        posts.push({
          ...data,
          id: doc.id
        });
      });
      
      return posts;
    } catch (error) {
      console.error('Error getting posts:', error);
      throw error;
    }
  }
  
  // Like or unlike a post
  async toggleLike(postId: string, userId: string): Promise<void> {
    try {
      const postRef = doc(db, 'posts', postId);
      const postDoc = await getDocs(query(collection(db, 'posts'), where('id', '==', postId)));
      
      if (postDoc.empty) {
        throw new Error('Post not found');
      }
      
      const post = postDoc.docs[0].data() as PrayerPost;
      
      if (post.likes.includes(userId)) {
        // Unlike
        await updateDoc(postRef, {
          likes: arrayRemove(userId)
        });
      } else {
        // Like
        await updateDoc(postRef, {
          likes: arrayUnion(userId)
        });
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      throw error;
    }
  }
  
  // Add a comment to a post
  async addComment(postId: string, comment: Omit<Comment, 'id'>): Promise<void> {
    try {
      const postRef = doc(db, 'posts', postId);
      
      const commentWithTimestamp = {
        ...comment,
        timestamp: serverTimestamp()
      };
      
      await updateDoc(postRef, {
        comments: arrayUnion(commentWithTimestamp)
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  }
  
  // Get leaderboard data
  async getLeaderboard(
    type: 'global' | 'friends' = 'global',
    timeRange: 'daily' | 'weekly' | 'monthly' = 'weekly',
    userId: string
  ): Promise<LeaderboardUser[]> {
    try {
      // In a real app, this would query a leaderboard collection
      // For now, we'll return mock data
      const mockUsers: LeaderboardUser[] = [
        {
          id: 'user1',
          displayName: 'Ahmed',
          photoURL: 'https://randomuser.me/api/portraits/men/1.jpg',
          score: 9.8,
          prayersAtMosque: 15,
          streak: 30
        },
        {
          id: 'user2',
          displayName: 'Fatima',
          photoURL: 'https://randomuser.me/api/portraits/women/1.jpg',
          score: 9.5,
          prayersAtMosque: 12,
          streak: 25
        },
        {
          id: userId,
          displayName: auth.currentUser?.displayName || 'You',
          photoURL: auth.currentUser?.photoURL || undefined,
          score: 9.2,
          prayersAtMosque: 10,
          streak: 20
        },
        {
          id: 'user3',
          displayName: 'Omar',
          photoURL: 'https://randomuser.me/api/portraits/men/2.jpg',
          score: 8.9,
          prayersAtMosque: 8,
          streak: 15
        },
        {
          id: 'user4',
          displayName: 'Aisha',
          photoURL: 'https://randomuser.me/api/portraits/women/2.jpg',
          score: 8.7,
          prayersAtMosque: 7,
          streak: 12
        }
      ];
      
      // Sort by score
      const sortedUsers = [...mockUsers].sort((a, b) => b.score - a.score);
      
      // Add rank
      const rankedUsers = sortedUsers.map((user, index) => ({
        ...user,
        rank: index + 1
      }));
      
      // Filter if friends only
      if (type === 'friends') {
        return rankedUsers.filter(user => ['user1', 'user2', userId, 'user3'].includes(user.id));
      }
      
      return rankedUsers;
    } catch (error) {
      console.error('Error getting leaderboard:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const communityService = new CommunityService();
