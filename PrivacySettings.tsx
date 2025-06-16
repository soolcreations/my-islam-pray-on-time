// Privacy Settings Component for Web
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { friendNotificationService } from '../services/friendNotificationService';
import './PrivacySettings.css';

const PrivacySettings = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    prayerStatusVisibility: {
      level: 'friends'
    },
    reminderPermissions: {
      level: 'friends',
      exceptions: {
        allowed: [],
        blocked: []
      }
    },
    notificationPreferences: {
      missedPrayers: true,
      upcomingPrayers: true,
      friendReminders: true,
      dailySummary: false
    },
    reminderSendingEnabled: true
  });
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState('');
  const [exceptionType, setExceptionType] = useState('allowed');
  const [saveStatus, setSaveStatus] = useState('');

  useEffect(() => {
    const loadSettings = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        
        // Load user's privacy settings
        const userSettingsDoc = await friendNotificationService.getUserPrivacySettings(currentUser.uid);
        if (userSettingsDoc) {
          setSettings(userSettingsDoc);
        }
        
        // Load user's friends for exception lists
        const userFriends = await friendNotificationService.getUserFriends(currentUser.uid);
        setFriends(userFriends);
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading privacy settings:', error);
        setLoading(false);
      }
    };
    
    loadSettings();
  }, [currentUser]);

  const handleVisibilityChange = (level) => {
    setSettings(prev => ({
      ...prev,
      prayerStatusVisibility: {
        ...prev.prayerStatusVisibility,
        level
      }
    }));
  };

  const handlePermissionChange = (level) => {
    setSettings(prev => ({
      ...prev,
      reminderPermissions: {
        ...prev.reminderPermissions,
        level
      }
    }));
  };

  const handleNotificationPreferenceChange = (preference) => {
    setSettings(prev => ({
      ...prev,
      notificationPreferences: {
        ...prev.notificationPreferences,
        [preference]: !prev.notificationPreferences[preference]
      }
    }));
  };

  const handleReminderSendingToggle = () => {
    setSettings(prev => ({
      ...prev,
      reminderSendingEnabled: !prev.reminderSendingEnabled
    }));
  };

  const addException = () => {
    if (!selectedFriend) return;
    
    setSettings(prev => {
      const newExceptions = { ...prev.reminderPermissions.exceptions };
      
      // Add to the selected exception list
      if (!newExceptions[exceptionType].includes(selectedFriend)) {
        newExceptions[exceptionType] = [...newExceptions[exceptionType], selectedFriend];
      }
      
      // Remove from the opposite list if present
      const oppositeType = exceptionType === 'allowed' ? 'blocked' : 'allowed';
      newExceptions[oppositeType] = newExceptions[oppositeType].filter(id => id !== selectedFriend);
      
      return {
        ...prev,
        reminderPermissions: {
          ...prev.reminderPermissions,
          exceptions: newExceptions
        }
      };
    });
    
    setSelectedFriend('');
  };

  const removeException = (type, friendId) => {
    setSettings(prev => {
      const newExceptions = { ...prev.reminderPermissions.exceptions };
      newExceptions[type] = newExceptions[type].filter(id => id !== friendId);
      
      return {
        ...prev,
        reminderPermissions: {
          ...prev.reminderPermissions,
          exceptions: newExceptions
        }
      };
    });
  };

  const saveSettings = async () => {
    if (!currentUser) return;
    
    try {
      setSaveStatus('saving');
      const success = await friendNotificationService.updatePrivacySettings(currentUser.uid, settings);
      
      if (success) {
        setSaveStatus('success');
        setTimeout(() => setSaveStatus(''), 3000);
      } else {
        setSaveStatus('error');
      }
    } catch (error) {
      console.error('Error saving privacy settings:', error);
      setSaveStatus('error');
    }
  };

  const getFriendName = (friendId) => {
    const friend = friends.find(f => f.id === friendId);
    return friend ? friend.displayName : 'Unknown Friend';
  };

  if (loading) {
    return <div className="privacy-settings-container loading">Loading privacy settings...</div>;
  }

  return (
    <div className="privacy-settings-container">
      <h1>Privacy Settings</h1>
      <p className="privacy-intro">
        Control who can see your prayer activity and send you reminders.
        Your privacy is important to us.
      </p>
      
      <div className="settings-section">
        <h2>Prayer Status Visibility</h2>
        <p className="section-description">
          Control who can see your prayer times and completion status.
        </p>
        
        <div className="radio-group">
          <label className="radio-option">
            <input
              type="radio"
              name="visibility"
              checked={settings.prayerStatusVisibility.level === 'everyone'}
              onChange={() => handleVisibilityChange('everyone')}
            />
            <div className="option-content">
              <span className="option-title">Everyone</span>
              <span className="option-description">Anyone using the app can see your prayer status</span>
            </div>
          </label>
          
          <label className="radio-option">
            <input
              type="radio"
              name="visibility"
              checked={settings.prayerStatusVisibility.level === 'friends'}
              onChange={() => handleVisibilityChange('friends')}
            />
            <div className="option-content">
              <span className="option-title">Friends Only</span>
              <span className="option-description">Only people you've connected with can see your prayer status</span>
            </div>
          </label>
          
          <label className="radio-option">
            <input
              type="radio"
              name="visibility"
              checked={settings.prayerStatusVisibility.level === 'none'}
              onChange={() => handleVisibilityChange('none')}
            />
            <div className="option-content">
              <span className="option-title">No One</span>
              <span className="option-description">Your prayer status is private to you</span>
            </div>
          </label>
        </div>
      </div>
      
      <div className="settings-section">
        <h2>Reminder Permissions</h2>
        <p className="section-description">
          Control who can send you prayer reminders.
        </p>
        
        <div className="radio-group">
          <label className="radio-option">
            <input
              type="radio"
              name="permissions"
              checked={settings.reminderPermissions.level === 'everyone'}
              onChange={() => handlePermissionChange('everyone')}
            />
            <div className="option-content">
              <span className="option-title">Everyone</span>
              <span className="option-description">Anyone using the app can send you prayer reminders</span>
            </div>
          </label>
          
          <label className="radio-option">
            <input
              type="radio"
              name="permissions"
              checked={settings.reminderPermissions.level === 'friends'}
              onChange={() => handlePermissionChange('friends')}
            />
            <div className="option-content">
              <span className="option-title">Friends Only</span>
              <span className="option-description">Only people you've connected with can send you reminders</span>
            </div>
          </label>
          
          <label className="radio-option">
            <input
              type="radio"
              name="permissions"
              checked={settings.reminderPermissions.level === 'none'}
              onChange={() => handlePermissionChange('none')}
            />
            <div className="option-content">
              <span className="option-title">No One</span>
              <span className="option-description">No one can send you prayer reminders</span>
            </div>
          </label>
        </div>
        
        <div className="exceptions-section">
          <h3>Exceptions</h3>
          
          <div className="add-exception">
            <select 
              value={selectedFriend} 
              onChange={(e) => setSelectedFriend(e.target.value)}
              className="friend-select"
            >
              <option value="">Select a friend</option>
              {friends.map(friend => (
                <option key={friend.id} value={friend.id}>{friend.displayName}</option>
              ))}
            </select>
            
            <select 
              value={exceptionType} 
              onChange={(e) => setExceptionType(e.target.value)}
              className="exception-type-select"
            >
              <option value="allowed">Always allow</option>
              <option value="blocked">Never allow</option>
            </select>
            
            <button 
              onClick={addException} 
              disabled={!selectedFriend}
              className="add-exception-button"
            >
              Add Exception
            </button>
          </div>
          
          <div className="exception-lists">
            <div className="exception-list">
              <h4>Always Allowed</h4>
              {settings.reminderPermissions.exceptions.allowed.length === 0 ? (
                <p className="empty-list">No exceptions added</p>
              ) : (
                <ul>
                  {settings.reminderPermissions.exceptions.allowed.map(friendId => (
                    <li key={friendId} className="exception-item">
                      <span>{getFriendName(friendId)}</span>
                      <button 
                        onClick={() => removeException('allowed', friendId)}
                        className="remove-exception"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            <div className="exception-list">
              <h4>Never Allowed</h4>
              {settings.reminderPermissions.exceptions.blocked.length === 0 ? (
                <p className="empty-list">No exceptions added</p>
              ) : (
                <ul>
                  {settings.reminderPermissions.exceptions.blocked.map(friendId => (
                    <li key={friendId} className="exception-item">
                      <span>{getFriendName(friendId)}</span>
                      <button 
                        onClick={() => removeException('blocked', friendId)}
                        className="remove-exception"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="settings-section">
        <h2>Notification Preferences</h2>
        <p className="section-description">
          Control what types of notifications you receive.
        </p>
        
        <div className="checkbox-group">
          <label className="checkbox-option">
            <input
              type="checkbox"
              checked={settings.notificationPreferences.missedPrayers}
              onChange={() => handleNotificationPreferenceChange('missedPrayers')}
            />
            <div className="option-content">
              <span className="option-title">Missed prayer reminders</span>
              <span className="option-description">Get notified when you miss a prayer</span>
            </div>
          </label>
          
          <label className="checkbox-option">
            <input
              type="checkbox"
              checked={settings.notificationPreferences.upcomingPrayers}
              onChange={() => handleNotificationPreferenceChange('upcomingPrayers')}
            />
            <div className="option-content">
              <span className="option-title">Upcoming prayer alerts</span>
              <span className="option-description">Get notified before prayer time</span>
            </div>
          </label>
          
          <label className="checkbox-option">
            <input
              type="checkbox"
              checked={settings.notificationPreferences.friendReminders}
              onChange={() => handleNotificationPreferenceChange('friendReminders')}
            />
            <div className="option-content">
              <span className="option-title">Friend reminders</span>
              <span className="option-description">Receive reminders sent by friends</span>
            </div>
          </label>
          
          <label className="checkbox-option">
            <input
              type="checkbox"
              checked={settings.notificationPreferences.dailySummary}
              onChange={() => handleNotificationPreferenceChange('dailySummary')}
            />
            <div className="option-content">
              <span className="option-title">Daily prayer summary</span>
              <span className="option-description">Get a daily report of your prayer performance</span>
            </div>
          </label>
        </div>
      </div>
      
      <div className="settings-section">
        <h2>Reminder Sending Capability</h2>
        <p className="section-description">
          Control whether you can send prayer reminders to others.
        </p>
        
        <label className="toggle-option">
          <div className="option-content">
            <span className="option-title">Allow me to send prayer reminders to others</span>
            <span className="option-description">When disabled, you won't be able to send reminders to friends</span>
          </div>
          <div className="toggle-switch">
            <input
              type="checkbox"
              checked={settings.reminderSendingEnabled}
              onChange={handleReminderSendingToggle}
            />
            <span className="toggle-slider"></span>
          </div>
        </label>
      </div>
      
      <div className="save-section">
        <button 
          onClick={saveSettings} 
          className={`save-button ${saveStatus}`}
          disabled={saveStatus === 'saving'}
        >
          {saveStatus === 'saving' ? 'Saving...' : 
           saveStatus === 'success' ? 'Saved!' : 
           saveStatus === 'error' ? 'Error Saving' : 'Save Settings'}
        </button>
        
        {saveStatus === 'error' && (
          <p className="error-message">
            There was an error saving your settings. Please try again.
          </p>
        )}
      </div>
    </div>
  );
};

export default PrivacySettings;
