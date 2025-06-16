/**
 * BadgePost Component
 * Displays a badge achievement post in the community feed
 */
import React from 'react';
import './BadgePost.css';
import { Badge } from '../models/Badge';

interface BadgePostProps {
  badge: Badge;
  username: string;
  avatar: string;
  timestamp: string;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  liked?: boolean;
}

const BadgePost: React.FC<BadgePostProps> = ({
  badge,
  username,
  avatar,
  timestamp,
  onLike,
  onComment,
  onShare,
  liked = false
}) => {
  return (
    <div className={`card post-card badge-post ${badge.category.toLowerCase()}`}>
      <div className="card-header">
        <div className="card-avatar">{avatar}</div>
        <div>
          <div className="card-title">{username}</div>
          <div className="card-subtitle">{timestamp}</div>
        </div>
      </div>
      
      <div className="card-content">
        <div className="badge-post-content">
          <div className="badge-post-icon">{badge.icon}</div>
          <div className="badge-post-details">
            <div className="badge-post-achievement">
              Earned the <span className="badge-name">{badge.name}</span> badge!
            </div>
            <div className="badge-post-description">{badge.description}</div>
            <div className="badge-post-points">+{badge.points} points</div>
          </div>
        </div>
      </div>
      
      <div className="card-divider"></div>
      
      <div className="post-engagement">
        <div className="post-reactions">
          <span>0 likes</span>
          <span className="dot-separator">•</span>
          <span>0 comments</span>
        </div>
      </div>
      
      <div className="card-divider"></div>
      
      <div className="card-actions">
        <button 
          className={`action-button ${liked ? 'liked' : ''}`}
          onClick={onLike}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={liked ? "var(--primary-color)" : "none"} stroke={liked ? "var(--primary-color)" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
          Like
        </button>
        <button 
          className="action-button"
          onClick={onComment}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
          </svg>
          Comment
        </button>
        <button 
          className="action-button"
          onClick={onShare}
        >
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
    </div>
  );
};

export default BadgePost;
