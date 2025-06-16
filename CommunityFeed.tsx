/**
 * Updated CommunityFeed Component with badge integration
 * Main dashboard showing social feed of prayer and Quran activities, including badge achievements
 */
import React, { useState, useEffect } from 'react';
import './CommunityFeed.css';
import PrayerCountdown from './PrayerCountdown';
import BadgeNotification from './BadgeNotification';
import BadgePost from './BadgePost';
import badgeService from '../services/BadgeService';
import { Badge } from '../models/Badge';

// Define post types
interface BasePost {
  id: number;
  user: {
    name: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  liked: boolean;
  type: string;
}

interface BadgePostType extends BasePost {
  type: 'badge';
  badge: Badge;
}

const CommunityFeed = () => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      user: {
        name: 'Ahmed',
        avatar: '👤'
      },
      content: 'Alhamdulillah for completing Fajr prayer with score 9/10 🕌',
      timestamp: '3h ago',
      likes: 12,
      comments: 3,
      liked: false,
      type: 'prayer'
    },
    {
      id: 2,
      user: {
        name: 'Fatima',
        avatar: '👤'
      },
      content: 'Completed Surah Al-Baqarah today! 30 minutes of reading 📖',
      timestamp: '5h ago',
      likes: 24,
      comments: 7,
      liked: false,
      type: 'quran'
    },
    {
      id: 3,
      user: {
        name: 'Yusuf',
        avatar: '👤'
      },
      content: 'Prayed Maghrib at Al-Noor Mosque today. Join me for Isha! 🕌',
      timestamp: '1d ago',
      likes: 18,
      comments: 5,
      liked: true,
      type: 'prayer'
    },
    {
      id: 4,
      user: {
        name: 'Aisha',
        avatar: '👤'
      },
      content: 'Just reached a 30-day prayer streak! Alhamdulillah for the consistency.',
      timestamp: '2d ago',
      likes: 35,
      comments: 12,
      liked: false,
      type: 'achievement'
    }
  ]);

  const [activeFilter, setActiveFilter] = useState('all');
  const [showComments, setShowComments] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [prayerRegistered, setPrayerRegistered] = useState(false);
  const [showNotifyFriends, setShowNotifyFriends] = useState(false);
  const [newBadge, setNewBadge] = useState<Badge | null>(null);

  // Story data
  const stories = [
    { id: 1, username: 'You', avatar: '👤', hasUnread: false, isYou: true },
    { id: 2, username: 'Ahmed', avatar: '👤', hasUnread: true },
    { id: 3, username: 'Fatima', avatar: '👤', hasUnread: true },
    { id: 4, username: 'Yusuf', avatar: '👤', hasUnread: false },
    { id: 5, username: 'Aisha', avatar: '👤', hasUnread: true },
    { id: 6, username: 'Omar', avatar: '👤', hasUnread: false }
  ];

  // Mock comments
  const comments = {
    1: [
      { id: 1, user: 'Fatima', content: 'MashaAllah brother!', timestamp: '2h ago' },
      { id: 2, user: 'Omar', content: 'May Allah accept it', timestamp: '1h ago' }
    ],
    2: [
      { id: 1, user: 'Ahmed', content: 'SubhanAllah, great achievement!', timestamp: '4h ago' },
      { id: 2, user: 'Yusuf', content: 'Which translation are you reading?', timestamp: '3h ago' },
      { id: 3, user: 'Aisha', content: 'I just started this surah too!', timestamp: '1h ago' }
    ],
    3: [
      { id: 1, user: 'Ahmed', content: 'I\'ll try to join inshallah', timestamp: '1d ago' },
      { id: 2, user: 'Fatima', content: 'Is there a sisters\' section?', timestamp: '1d ago' }
    ],
    4: [
      { id: 1, user: 'Yusuf', content: 'MashaAllah! That\'s inspiring!', timestamp: '1d ago' },
      { id: 2, user: 'Ahmed', content: 'Any tips for maintaining consistency?', timestamp: '1d ago' },
      { id: 3, user: 'Fatima', content: 'May Allah reward your efforts!', timestamp: '12h ago' }
    ]
  };

  // Listen for badge unlocks
  useEffect(() => {
    badgeService.onBadgeUnlocked((badge) => {
      // Show notification
      setNewBadge(badge);
      
      // Add badge post to feed
      addBadgePost(badge);
    });
  }, []);

  const handleLike = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: post.liked ? post.likes - 1 : post.likes + 1,
          liked: !post.liked
        };
      }
      return post;
    }));
    
    // Track social interaction for badges
    badgeService.handleSocialInteraction('like');
  };

  const toggleComments = (postId) => {
    setShowComments(showComments === postId ? null : postId);
    setCommentText('');
  };

  const addComment = (postId) => {
    if (commentText.trim()) {
      // In a real app, this would call an API to save the comment
      console.log(`Adding comment to post ${postId}: ${commentText}`);
      setCommentText('');
      
      // Track social interaction for badges
      badgeService.handleSocialInteraction('comment');
      
      // Show toast message
      const toastContainer = document.querySelector('.toast-container') || createToastContainer();
      const toast = document.createElement('div');
      toast.className = 'toast success';
      toast.textContent = 'Comment added successfully!';
      toastContainer.appendChild(toast);
      
      // Remove toast after animation completes
      setTimeout(() => {
        toast.remove();
        if (toastContainer.childNodes.length === 0) {
          toastContainer.remove();
        }
      }, 3000);
    }
  };

  const createToastContainer = () => {
    const container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
    return container;
  };

  const handlePrayerRegister = () => {
    setPrayerRegistered(true);
    setShowNotifyFriends(true);
    
    // In a real app, this would update the global state or make an API call
    console.log('Prayer registered from dashboard');
    
    // Check for badge unlocks
    const unlockedBadges = badgeService.handlePrayerRegistration('Dhuhr', 10);
    
    // Add a new post for the registered prayer
    const newPost = {
      id: Date.now(),
      user: {
        name: 'You',
        avatar: '👤'
      },
      content: 'Just registered Dhuhr prayer. Alhamdulillah! 🕌',
      timestamp: 'Just now',
      likes: 0,
      comments: 0,
      liked: false,
      type: 'prayer'
    };
    
    setPosts([newPost, ...posts]);
  };
  
  const handleNotifyFriends = () => {
    // In a real app, this would send notifications to friends
    console.log('Notifying friends about prayer completion');
    
    // Track social interaction for badges
    badgeService.handleSocialInteraction('reminder');
    
    // Show toast message
    const toastContainer = document.querySelector('.toast-container') || createToastContainer();
    const toast = document.createElement('div');
    toast.className = 'toast success';
    toast.textContent = 'Prayer reminder sent to friends!';
    toastContainer.appendChild(toast);
    
    // Remove toast after animation completes
    setTimeout(() => {
      toast.remove();
      if (toastContainer.childNodes.length === 0) {
        toastContainer.remove();
      }
    }, 3000);
    
    setShowNotifyFriends(false);
  };
  
  const handleShareBadge = () => {
    if (!newBadge) return;
    
    // Add badge post to feed
    addBadgePost(newBadge);
    
    // Track social interaction for badges
    badgeService.handleSocialInteraction('share');
    
    // Show toast message
    const toastContainer = document.querySelector('.toast-container') || createToastContainer();
    const toast = document.createElement('div');
    toast.className = 'toast success';
    toast.textContent = 'Badge shared with friends!';
    toastContainer.appendChild(toast);
    
    // Remove toast after animation completes
    setTimeout(() => {
      toast.remove();
      if (toastContainer.childNodes.length === 0) {
        toastContainer.remove();
      }
    }, 3000);
  };
  
  const addBadgePost = (badge: Badge) => {
    // Create a new badge post
    const badgePost: BadgePostType = {
      id: Date.now(),
      user: {
        name: 'You',
        avatar: '👤'
      },
      content: `Earned the "${badge.name}" badge! ${badge.description}`,
      badge: badge,
      timestamp: 'Just now',
      likes: 0,
      comments: 0,
      liked: false,
      type: 'badge'
    };
    
    setPosts([badgePost, ...posts]);
  };

  const filteredPosts = activeFilter === 'all' 
    ? posts 
    : posts.filter(post => post.type === activeFilter);

  return (
    <div className="community-feed">
      {/* Badge Notification */}
      {newBadge && (
        <BadgeNotification 
          badge={newBadge} 
          onClose={() => setNewBadge(null)}
          onShare={handleShareBadge}
        />
      )}
      
      {/* Story Circles */}
      <div className="story-circles">
        {stories.map(story => (
          <div key={story.id} className="story-circle">
            <div className={`story-avatar ${story.hasUnread ? 'unread' : ''} ${story.isYou ? 'your-story' : ''}`}>
              <div className="story-avatar-inner">
                {story.avatar}
              </div>
            </div>
            <div className="story-username">{story.username}</div>
          </div>
        ))}
      </div>

      {/* Prayer Countdown Timer */}
      <div className="prayer-countdown-wrapper">
        <PrayerCountdown onRegister={handlePrayerRegister} />
        
        {/* Notify Friends Button (appears after prayer registration) */}
        {showNotifyFriends && (
          <div className="notify-friends-container">
            <button 
              className="notify-friends-button"
              onClick={handleNotifyFriends}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              Notify Friends
            </button>
          </div>
        )}
      </div>

      {/* Post Creator */}
      <div className="post-creator">
        <div className="card-avatar">👤</div>
        <div className="post-input">What's on your mind?</div>
        <button className="icon-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
      </div>

      {/* Post Filters */}
      <div className="post-filters">
        <button 
          className={`filter-button ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => setActiveFilter('all')}
        >
          All
        </button>
        <button 
          className={`filter-button ${activeFilter === 'prayer' ? 'active' : ''}`}
          onClick={() => setActiveFilter('prayer')}
        >
          Prayers
        </button>
        <button 
          className={`filter-button ${activeFilter === 'quran' ? 'active' : ''}`}
          onClick={() => setActiveFilter('quran')}
        >
          Quran
        </button>
        <button 
          className={`filter-button ${activeFilter === 'badge' ? 'active' : ''}`}
          onClick={() => setActiveFilter('badge')}
        >
          Badges
        </button>
        <button 
          className={`filter-button ${activeFilter === 'achievement' ? 'active' : ''}`}
          onClick={() => setActiveFilter('achievement')}
        >
          Achievements
        </button>
      </div>

      {/* Posts */}
      {filteredPosts.length > 0 ? (
        filteredPosts.map(post => (
          post.type === 'badge' ? (
            <BadgePost
              key={post.id}
              badge={(post as BadgePostType).badge}
              username={post.user.name}
              avatar={post.user.avatar}
              timestamp={post.timestamp}
              onLike={() => handleLike(post.id)}
              onComment={() => toggleComments(post.id)}
              onShare={() => console.log('Sharing badge post')}
              liked={post.liked}
            />
          ) : (
            <div key={post.id} className={`card post-card ${post.type}`}>
              <div className="card-header">
                <div className="card-avatar">{post.user.avatar}</div>
                <div>
                  <div className="card-title">{post.user.name}</div>
                  <div className="card-subtitle">{post.timestamp}</div>
                </div>
              </div>
              <div className="card-content">
                {post.content}
              </div>
              <div className="card-divider"></div>
              <div className="post-engagement">
                <div className="post-reactions">
                  <span>{post.likes} likes</span>
                  <span className="dot-separator">•</span>
                  <span>{post.comments} comments</span>
                </div>
              </div>
              <div className="card-divider"></div>
              <div className="card-actions">
                <button 
                  className={`action-button ${post.liked ? 'liked' : ''}`}
                  onClick={() => handleLike(post.id)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={post.liked ? "var(--primary-color)" : "none"} stroke={post.liked ? "var(--primary-color)" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                  Like
                </button>
                <button 
                  className="action-button"
                  onClick={() => toggleComments(post.id)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                  </svg>
                  Comment
                </button>
                <button className="action-button">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="18" cy="5" r="3"></circle>
                    <circle cx="6" cy="12" r="3"></circle>
                    <circle cx="18" cy="19" r="3"></circle>
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                  </svg>
                  Share
                </button>
              </div>

              {/* Comments Section */}
              {showComments === post.id && (
                <div className="comments-section">
                  <div className="comments-list">
                    {comments[post.id]?.map(comment => (
                      <div key={comment.id} className="comment">
                        <div className="comment-avatar">👤</div>
                        <div className="comment-content">
                          <div className="comment-user">{comment.user}<
(Content truncated due to size limit. Use line ranges to read in chunks)