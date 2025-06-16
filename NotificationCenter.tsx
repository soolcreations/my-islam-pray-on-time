// Notification Center Component for Web
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { friendNotificationService } from '../services/friendNotificationService';
import './NotificationCenter.css';

const NotificationCenter = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [reminders, setReminders] = useState([]);
  const [activeTab, setActiveTab] = useState('received');
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, [currentUser, activeTab]);

  const loadNotifications = async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      
      if (activeTab === 'received') {
        const receivedReminders = await friendNotificationService.getRemindersForUser(currentUser.uid);
        setReminders(receivedReminders);
      } else {
        const sentReminders = await friendNotificationService.getSentReminders(currentUser.uid);
        setReminders(sentReminders);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading notifications:', error);
      setLoading(false);
    }
  };

  const markAsRead = async (reminderId) => {
    try {
      await friendNotificationService.markReminderAsRead(reminderId);
      
      // Update local state
      setReminders(prev => 
        prev.map(reminder => 
          reminder.id === reminderId 
            ? { ...reminder, status: 'read' } 
            : reminder
        )
      );
    } catch (error) {
      console.error('Error marking reminder as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadReminders = reminders.filter(r => r.status !== 'read');
      
      await Promise.all(
        unreadReminders.map(reminder => 
          friendNotificationService.markReminderAsRead(reminder.id)
        )
      );
      
      // Update local state
      setReminders(prev => 
        prev.map(reminder => ({ ...reminder, status: 'read' }))
      );
      
      setShowDropdown(false);
    } catch (error) {
      console.error('Error marking all reminders as read:', error);
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const reminderDate = new Date(date);
    
    // If today, show time
    if (reminderDate.toDateString() === now.toDateString()) {
      return reminderDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // If this year, show month and day
    if (reminderDate.getFullYear() === now.getFullYear()) {
      return reminderDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
    
    // Otherwise show full date
    return reminderDate.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'sent': return 'status-sent';
      case 'delivered': return 'status-delivered';
      case 'read': return 'status-read';
      default: return '';
    }
  };

  return (
    <div className="notification-center">
      <div className="notification-header">
        <h2>Notifications</h2>
        
        <div className="notification-actions">
          <div className="dropdown-container">
            <button 
              className="more-actions-button" 
              onClick={() => setShowDropdown(!showDropdown)}
            >
              •••
            </button>
            
            {showDropdown && (
              <div className="dropdown-menu">
                <button onClick={markAllAsRead}>Mark All as Read</button>
                <button onClick={loadNotifications}>Refresh</button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="notification-tabs">
        <button 
          className={`tab ${activeTab === 'received' ? 'active' : ''}`}
          onClick={() => setActiveTab('received')}
        >
          Received
        </button>
        <button 
          className={`tab ${activeTab === 'sent' ? 'active' : ''}`}
          onClick={() => setActiveTab('sent')}
        >
          Sent
        </button>
      </div>
      
      <div className="notifications-list">
        {loading ? (
          <div className="loading-message">Loading notifications...</div>
        ) : reminders.length === 0 ? (
          <div className="empty-message">
            {activeTab === 'received' 
              ? 'No reminders received yet.' 
              : 'You haven\'t sent any reminders yet.'}
          </div>
        ) : (
          reminders.map(reminder => (
            <div 
              key={reminder.id} 
              className={`notification-item ${activeTab === 'received' && reminder.status !== 'read' ? 'unread' : ''}`}
              onClick={() => activeTab === 'received' && reminder.status !== 'read' && markAsRead(reminder.id)}
            >
              <div className="notification-content">
                <div className="notification-header">
                  {activeTab === 'received' ? (
                    <span className="sender-name">{reminder.senderName}</span>
                  ) : (
                    <span className="receiver-name">To: {reminder.receiverName}</span>
                  )}
                  <span className="notification-time">{formatTime(reminder.sentAt)}</span>
                </div>
                
                <div className="notification-body">
                  <div className="prayer-info">
                    Reminder for <strong>{reminder.prayerName}</strong> prayer
                  </div>
                  
                  {reminder.message && (
                    <div className="message">
                      "{reminder.message}"
                    </div>
                  )}
                </div>
                
                <div className="notification-footer">
                  <span className={`status ${getStatusClass(reminder.status)}`}>
                    {reminder.status === 'sent' ? 'Sent' : 
                     reminder.status === 'delivered' ? 'Delivered' : 
                     'Read'}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;
