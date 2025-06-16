// Community Feed component for web
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './CommunityFeed.css';

// Types for community posts
interface PostUser {
  id: string;
  displayName: string;
  photoURL?: string;
}

interface PrayerPost {
  id: string;
  userId: string;
  user: PostUser;
  prayerName: string;
  score: number;
  atMosque: boolean;
  timestamp: number;
  message?: string;
  likes: string[]; // Array of user IDs who liked the post
  comments: Comment[];
  isPublic: boolean;
}

interface Comment {
  id: string;
  userId: string;
  user: PostUser;
  text: string;
  timestamp: number;
}

const CommunityFeed: React.FC = () => {
  const [posts, setPosts] = useState<PrayerPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPostMessage, setNewPostMessage] = useState('');
  const [selectedPrayer, setSelectedPrayer] = useState<string>('fajr');
  const [isPublic, setIsPublic] = useState(true);
  const [filter, setFilter] = useState<'all' | 'friends' | 'mosque'>('all');
  
  const { currentUser } = useAuth();
  
  // Load posts on component mount
  useEffect(() => {
    const loadPosts = async () => {
      try {
        // In a real app, this would fetch from Firebase
        // For now, we'll use mock data
        const mockPosts: PrayerPost[] = [
          {
            id: '1',
            userId: 'user1',
            user: { id: 'user1', displayName: 'Ahmed', photoURL: 'https://randomuser.me/api/portraits/men/1.jpg' },
            prayerName: 'fajr',
            score: 9.5,
            atMosque: true,
            timestamp: Date.now() - 3600000, // 1 hour ago
            message: 'Alhamdulillah for another blessed morning!',
            likes: ['user2', 'user3'],
            comments: [
              {
                id: 'c1',
                userId: 'user2',
                user: { id: 'user2', displayName: 'Fatima' },
                text: 'MashaAllah brother!',
                timestamp: Date.now() - 3000000
              }
            ],
            isPublic: true
          },
          {
            id: '2',
            userId: 'user2',
            user: { id: 'user2', displayName: 'Fatima', photoURL: 'https://randomuser.me/api/portraits/women/1.jpg' },
            prayerName: 'asr',
            score: 10,
            atMosque: true,
            timestamp: Date.now() - 7200000, // 2 hours ago
            message: 'Prayed Asr at the new mosque in town. Beautiful architecture!',
            likes: ['user1'],
            comments: [],
            isPublic: true
          },
          {
            id: '3',
            userId: 'user3',
            user: { id: 'user3', displayName: 'Omar', photoURL: 'https://randomuser.me/api/portraits/men/2.jpg' },
            prayerName: 'maghrib',
            score: 8.2,
            atMosque: false,
            timestamp: Date.now() - 10800000, // 3 hours ago
            likes: [],
            comments: [],
            isPublic: true
          }
        ];
        
        setPosts(mockPosts);
      } catch (error) {
        console.error('Error loading posts:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadPosts();
  }, []);
  
  // Filter posts based on selected filter
  const filteredPosts = posts.filter(post => {
    if (filter === 'all') return post.isPublic;
    if (filter === 'friends') return post.isPublic && ['user1', 'user2'].includes(post.userId); // Mock friends list
    if (filter === 'mosque') return post.isPublic && post.atMosque;
    return true;
  });
  
  // Format timestamp
  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} min ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
    
    return new Date(timestamp).toLocaleDateString();
  };
  
  // Handle post submission
  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPostMessage.trim()) return;
    
    // In a real app, this would save to Firebase
    const newPost: PrayerPost = {
      id: `post-${Date.now()}`,
      userId: currentUser?.uid || 'current-user',
      user: { 
        id: currentUser?.uid || 'current-user', 
        displayName: currentUser?.displayName || 'You',
        photoURL: currentUser?.photoURL || undefined
      },
      prayerName: selectedPrayer,
      score: 9.8, // Mock score
      atMosque: false,
      timestamp: Date.now(),
      message: newPostMessage,
      likes: [],
      comments: [],
      isPublic
    };
    
    setPosts([newPost, ...posts]);
    setNewPostMessage('');
  };
  
  // Handle like
  const handleLike = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const userId = currentUser?.uid || 'current-user';
        const alreadyLiked = post.likes.includes(userId);
        
        return {
          ...post,
          likes: alreadyLiked
            ? post.likes.filter(id => id !== userId)
            : [...post.likes, userId]
        };
      }
      return post;
    }));
  };
  
  if (loading) {
    return (
      <div className="community-container">
        <div className="loading">Loading community feed...</div>
      </div>
    );
  }
  
  return (
    <div className="community-container">
      <h1>Community Feed</h1>
      
      <div className="post-filters">
        <button 
          className={`filter-button ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Posts
        </button>
        <button 
          className={`filter-button ${filter === 'friends' ? 'active' : ''}`}
          onClick={() => setFilter('friends')}
        >
          Friends
        </button>
        <button 
          className={`filter-button ${filter === 'mosque' ? 'active' : ''}`}
          onClick={() => setFilter('mosque')}
        >
          Mosque Prayers
        </button>
      </div>
      
      <div className="create-post">
        <h2>Share Your Prayer</h2>
        <form onSubmit={handlePostSubmit}>
          <div className="post-options">
            <div className="prayer-select">
              <label>Prayer:</label>
              <select 
                value={selectedPrayer}
                onChange={(e) => setSelectedPrayer(e.target.value)}
              >
                <option value="fajr">Fajr</option>
                <option value="dhuhr">Dhuhr</option>
                <option value="asr">Asr</option>
                <option value="maghrib">Maghrib</option>
                <option value="isha">Isha</option>
              </select>
            </div>
            
            <div className="privacy-toggle">
              <label>
                <input 
                  type="checkbox" 
                  checked={isPublic}
                  onChange={() => setIsPublic(!isPublic)}
                />
                Public
              </label>
            </div>
          </div>
          
          <textarea
            placeholder="Share your thoughts about this prayer..."
            value={newPostMessage}
            onChange={(e) => setNewPostMessage(e.target.value)}
            rows={3}
          />
          
          <button type="submit" className="post-button">Share</button>
        </form>
      </div>
      
      <div className="posts-container">
        {filteredPosts.length === 0 ? (
          <div className="empty-feed">
            <p>No posts to display. Be the first to share your prayer!</p>
          </div>
        ) : (
          filteredPosts.map(post => (
            <div key={post.id} className="post-card">
              <div className="post-header">
                <div className="user-info">
                  {post.user.photoURL ? (
                    <img src={post.user.photoURL} alt={post.user.displayName} className="user-avatar" />
                  ) : (
                    <div className="user-avatar-placeholder">
                      {post.user.displayName.charAt(0)}
                    </div>
                  )}
                  <div>
                    <div className="user-name">{post.user.displayName}</div>
                    <div className="post-time">{formatTime(post.timestamp)}</div>
                  </div>
                </div>
                
                <div className="prayer-info">
                  <div className="prayer-name">
                    {post.prayerName.charAt(0).toUpperCase() + post.prayerName.slice(1)}
                  </div>
                  <div className="prayer-score">
                    Score: <span>{post.score.toFixed(1)}</span>
                  </div>
                  {post.atMosque && (
                    <div className="mosque-badge">
                      At Mosque
                    </div>
                  )}
                </div>
              </div>
              
              {post.message && (
                <div className="post-content">
                  {post.message}
                </div>
              )}
              
              <div className="post-actions">
                <button 
                  className={`like-button ${post.likes.includes(currentUser?.uid || 'current-user') ? 'liked' : ''}`}
                  onClick={() => handleLike(post.id)}
                >
                  {post.likes.length > 0 ? `${post.likes.length} Likes` : 'Like'}
                </button>
                
                <button className="comment-button">
                  {post.comments.length > 0 ? `${post.comments.length} Comments` : 'Comment'}
                </button>
              </div>
              
              {post.comments.length > 0 && (
                <div className="comments-section">
                  {post.comments.map(comment => (
                    <div key={comment.id} className="comment">
                      <div className="comment-user">{comment.user.displayName}</div>
                      <div className="comment-text">{comment.text}</div>
                      <div className="comment-time">{formatTime(comment.timestamp)}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommunityFeed;
