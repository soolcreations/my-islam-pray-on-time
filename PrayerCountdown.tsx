/**
 * Enhanced PrayerCountdown Component
 * Visual countdown timer for current prayer with registration and social sharing functionality
 */
import React, { useState, useEffect } from 'react';
import './PrayerCountdown.css';
import badgeService from '../services/BadgeService';

interface PrayerCountdownProps {
  onRegister?: () => void;
}

const PrayerCountdown: React.FC<PrayerCountdownProps> = ({ onRegister }) => {
  // Current prayer data (would come from a central state/context in a real app)
  const [currentPrayer, setCurrentPrayer] = useState({
    name: 'Dhuhr',
    time: '1:15 PM',
    endTime: '4:45 PM', // This would be the time of the next prayer
    registered: false,
    score: 10, // Starting score
    maxScore: 10
  });

  // Countdown state
  const [timeRemaining, setTimeRemaining] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
    percentage: 100, // Percentage of time remaining
    totalSeconds: 0
  });
  
  // Notification state
  const [showNotifyFriends, setShowNotifyFriends] = useState(false);
  const [notificationSent, setNotificationSent] = useState(false);

  // Calculate time remaining on component mount and when current prayer changes
  useEffect(() => {
    // In a real app, this would use actual prayer times
    // For demo purposes, we'll set a countdown of 30 minutes
    const totalSeconds = 30 * 60;
    
    // Set initial time remaining
    setTimeRemaining({
      hours: Math.floor(totalSeconds / 3600),
      minutes: Math.floor((totalSeconds % 3600) / 60),
      seconds: totalSeconds % 60,
      percentage: 100,
      totalSeconds
    });

    // Start countdown timer
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        // If time is up, clear interval and return current state
        if (prev.totalSeconds <= 0) {
          clearInterval(timer);
          
          // If prayer wasn't registered, it would be marked as missed in a real app
          if (!currentPrayer.registered) {
            console.log('Prayer missed and added to missed prayers');
          }
          
          return prev;
        }
        
        // Calculate new time remaining
        const newTotalSeconds = prev.totalSeconds - 1;
        const newPercentage = (newTotalSeconds / totalSeconds) * 100;
        
        // Update score based on time remaining (decreases as time passes)
        if (!currentPrayer.registered) {
          const newScore = Math.max(
            parseFloat(((newPercentage / 100) * currentPrayer.maxScore).toFixed(1)), 
            1
          );
          setCurrentPrayer(prev => ({
            ...prev,
            score: newScore
          }));
        }
        
        return {
          hours: Math.floor(newTotalSeconds / 3600),
          minutes: Math.floor((newTotalSeconds % 3600) / 60),
          seconds: newTotalSeconds % 60,
          percentage: newPercentage,
          totalSeconds: newTotalSeconds
        };
      });
    }, 1000);

    // Clean up timer on unmount
    return () => clearInterval(timer);
  }, [currentPrayer.name]);

  // Handle prayer registration
  const handleRegister = () => {
    setCurrentPrayer(prev => ({
      ...prev,
      registered: true
    }));
    
    // Don't show notify friends option here since it's handled in CommunityFeed
    // setShowNotifyFriends(true);
    
    // Call parent component callback if provided
    if (onRegister) {
      onRegister();
    }
    
    // Check for badge unlocks
    const unlockedBadges = badgeService.handlePrayerRegistration(currentPrayer.name, currentPrayer.score);
    
    // Show toast message
    const toastContainer = document.querySelector('.toast-container') || createToastContainer();
    const toast = document.createElement('div');
    toast.className = 'toast success';
    toast.textContent = `${currentPrayer.name} prayer registered with score ${currentPrayer.score.toFixed(1)}/10!`;
    toastContainer.appendChild(toast);
    
    // Remove toast after animation completes
    setTimeout(() => {
      toast.remove();
      if (toastContainer.childNodes.length === 0) {
        toastContainer.remove();
      }
    }, 3000);
  };
  
  // Handle notify friends
  const handleNotifyFriends = () => {
    // In a real app, this would send notifications to friends
    console.log(`Notifying friends about ${currentPrayer.name} prayer completion`);
    
    // Track social interaction for badges
    badgeService.handleSocialInteraction('reminder');
    
    // Update state to show notification was sent
    setNotificationSent(true);
    
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
  };

  const createToastContainer = () => {
    const container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
    return container;
  };

  // Format time as MM:SS or HH:MM:SS
  const formatTime = (hours: number, minutes: number, seconds: number) => {
    return hours > 0
      ? `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      : `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="prayer-countdown-container">
      <div className="prayer-countdown-header">
        <div className="prayer-info">
          <h3 className="current-prayer-name">{currentPrayer.name}</h3>
          <div className="prayer-time">{currentPrayer.time}</div>
        </div>
        <div className="countdown-display">
          <div className="countdown-label">Time Remaining</div>
          <div className="countdown-timer">
            {formatTime(timeRemaining.hours, timeRemaining.minutes, timeRemaining.seconds)}
          </div>
        </div>
      </div>
      
      <div className="countdown-progress-container">
        <div 
          className="countdown-progress-bar" 
          style={{ 
            width: `${timeRemaining.percentage}%`,
            backgroundColor: getColorForPercentage(timeRemaining.percentage)
          }}
        ></div>
      </div>
      
      <div className="prayer-countdown-footer">
        {currentPrayer.registered ? (
          <div className="prayer-registered">
            <div className="registered-icon">✓</div>
            <div className="registered-text">
              Registered with score <span className="score">{currentPrayer.score}/{currentPrayer.maxScore}</span>
            </div>
          </div>
        ) : (
          <>
            <div className="current-score">
              Current Score: <span className="score">{currentPrayer.score}/{currentPrayer.maxScore}</span>
              <div className="score-warning">Score decreases over time</div>
            </div>
            <button 
              className="register-button"
              onClick={handleRegister}
            >
              Register Prayer
            </button>
          </>
        )}
      </div>
      
      {/* Notify Friends Section */}
      {showNotifyFriends && !notificationSent && (
        <div className="notify-friends-section">
          <div className="notify-friends-header">
            <div className="notify-friends-icon">👥</div>
            <div className="notify-friends-title">Share with your friends</div>
          </div>
          <div className="notify-friends-message">
            Let your friends know you've completed {currentPrayer.name} prayer
          </div>
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
      
      {/* Notification Sent Confirmation */}
      {notificationSent && (
        <div className="notification-sent">
          <div className="notification-sent-icon">✓</div>
          <div className="notification-sent-message">
            Notification sent to friends
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to get color based on percentage
const getColorForPercentage = (percentage: number) => {
  if (percentage > 66) return 'var(--primary-color)';
  if (percentage > 33) return 'var(--warning-color)';
  return 'var(--error-color)';
};

export default PrayerCountdown;
