/**
 * BadgeNotification Component
 * Displays a notification when a user earns a new badge
 */
import React, { useState, useEffect } from 'react';
import './BadgeNotification.css';
import { Badge } from '../models/Badge';

interface BadgeNotificationProps {
  badge: Badge;
  onClose: () => void;
  onShare?: () => void;
}

const BadgeNotification: React.FC<BadgeNotificationProps> = ({ 
  badge, 
  onClose,
  onShare 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Animate in
    setTimeout(() => setIsVisible(true), 100);
    
    // Auto close after 8 seconds if not interacted with
    const timer = setTimeout(() => {
      handleClose();
    }, 8000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(), 300); // Wait for animation to complete
  };
  
  const handleShare = () => {
    if (onShare) {
      onShare();
    }
    handleClose();
  };
  
  return (
    <div className={`badge-notification ${isVisible ? 'visible' : ''}`}>
      <div className="badge-notification-content">
        <div className="badge-notification-header">
          <div className="badge-notification-title">New Badge Unlocked!</div>
          <button className="badge-notification-close" onClick={handleClose}>×</button>
        </div>
        
        <div className="badge-notification-body">
          <div className="badge-icon">{badge.icon}</div>
          <div className="badge-details">
            <div className="badge-name">{badge.name}</div>
            <div className="badge-description">{badge.description}</div>
            <div className="badge-points">+{badge.points} points</div>
          </div>
        </div>
        
        <div className="badge-notification-footer">
          <button 
            className="badge-share-button"
            onClick={handleShare}
          >
            Share with Friends
          </button>
        </div>
      </div>
    </div>
  );
};

export default BadgeNotification;
