/**
 * Notifications Component
 * Dedicated notifications tab showing prayer reminders, friend activities, and achievements
 */
import React, { useState } from 'react';
import './Notifications.css';

interface NotificationsProps {
  onNotificationRead?: () => void;
}

const Notifications: React.FC<NotificationsProps> = ({ onNotificationRead }) => {
  // Mock notifications data
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'prayer',
      icon: '🕌',
      title: "Prayer Time",
      message: "It's time for Dhuhr prayer",
      time: "5 minutes ago",
      read: false
    },
    {
      id: 2,
      type: 'friend',
      icon: '👤',
      title: "Friend Activity",
      message: "Ahmed completed Fajr prayer",
      time: "3 hours ago",
      read: false
    },
    {
      id: 3,
      type: 'achievement',
      icon: '🏆',
      title: "Achievement",
      message: "You've maintained a 7-day prayer streak! Keep it up!",
      time: "1 day ago",
      read: false
    },
    {
      id: 4,
      type: 'social',
      icon: '💬',
      title: "Social",
      message: "Fatima commented on your post",
      time: "2 days ago",
      read: false
    },
    {
      id: 5,
      type: 'quran',
      icon: '📖',
      title: "Quran",
      message: "You haven't completed your daily Quran reading goal yet",
      time: "4 hours ago",
      read: false
    }
  ]);

  const handleMarkAsRead = (id: number) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
    
    // Call the callback if provided
    if (onNotificationRead) {
      onNotificationRead();
    }
  };

  return (
    <div className="notifications-container">
      <h2 className="section-title">Notifications</h2>
      
      <div className="notifications-list">
        {notifications.map(notification => (
          <div 
            key={notification.id} 
            className={`card notification-card ${notification.type} ${notification.read ? 'read' : 'unread'}`}
            onClick={() => handleMarkAsRead(notification.id)}
          >
            <div className="notification-icon">{notification.icon}</div>
            <div className="notification-content">
              <div className="notification-title">{notification.title}</div>
              <div className="notification-message">{notification.message}</div>
              <div className="notification-time">{notification.time}</div>
            </div>
            {!notification.read && <div className="unread-indicator"></div>}
          </div>
        ))}
      </div>
      
      {notifications.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🔔</div>
          <div className="empty-message">No notifications yet</div>
        </div>
      )}
      
      {notifications.length > 0 && (
        <button 
          className="button-secondary full-width"
          onClick={() => {
            setNotifications(notifications.map(notification => ({ ...notification, read: true })));
            // Call the callback multiple times to clear all notifications
            if (onNotificationRead) {
              notifications.filter(n => !n.read).forEach(() => onNotificationRead());
            }
          }}
        >
          Mark all as read
        </button>
      )}
    </div>
  );
};

export default Notifications;
