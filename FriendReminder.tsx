// Friend Reminder Component for Dashboard
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { friendNotificationService } from '../services/friendNotificationService';
import './FriendReminder.css';

const FriendReminder = ({ prayerName, prayerTime }) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [friends, setFriends] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState({ success: false, message: '' });
  const [canSendReminders, setCanSendReminders] = useState(true);

  useEffect(() => {
    // Check if user can send reminders
    const checkPermissions = async () => {
      if (!currentUser) return;
      
      try {
        const settings = await friendNotificationService.getUserPrivacySettings(currentUser.uid);
        setCanSendReminders(settings?.reminderSendingEnabled || false);
      } catch (error) {
        console.error('Error checking reminder permissions:', error);
      }
    };
    
    checkPermissions();
  }, [currentUser]);

  const openReminderModal = async () => {
    if (!currentUser || !canSendReminders) return;
    
    try {
      setLoading(true);
      const friendsWhoHaventPrayed = await friendNotificationService.getFriendsWhoHaventPrayed(
        currentUser.uid,
        prayerName
      );
      
      setFriends(friendsWhoHaventPrayed);
      setSelectedFriends([]);
      setMessage('');
      setResult({ success: false, message: '' });
      setShowModal(true);
      setLoading(false);
    } catch (error) {
      console.error('Error loading friends who haven\'t prayed:', error);
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const toggleFriendSelection = (friendId) => {
    setSelectedFriends(prev => {
      if (prev.includes(friendId)) {
        return prev.filter(id => id !== friendId);
      } else {
        return [...prev, friendId];
      }
    });
  };

  const selectAllFriends = () => {
    const availableFriends = friends
      .filter(friend => friend.canSendReminder)
      .map(friend => friend.id);
    
    setSelectedFriends(availableFriends);
  };

  const deselectAllFriends = () => {
    setSelectedFriends([]);
  };

  const sendReminders = async () => {
    if (!currentUser || selectedFriends.length === 0) return;
    
    try {
      setSending(true);
      
      // Send reminders to all selected friends
      const results = await Promise.all(
        selectedFriends.map(friendId => 
          friendNotificationService.sendPrayerReminder(
            currentUser.uid,
            friendId,
            prayerName,
            message
          )
        )
      );
      
      // Check if all reminders were sent successfully
      const allSuccessful = results.every(result => result.success);
      const successCount = results.filter(result => result.success).length;
      
      if (allSuccessful) {
        setResult({
          success: true,
          message: `Successfully sent reminders to ${successCount} friend${successCount !== 1 ? 's' : ''}.`
        });
      } else {
        setResult({
          success: false,
          message: `Sent reminders to ${successCount} out of ${selectedFriends.length} friends. Some reminders failed to send.`
        });
      }
      
      setSending(false);
      
      // Close modal after a delay if successful
      if (allSuccessful) {
        setTimeout(() => {
          setShowModal(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Error sending reminders:', error);
      setResult({
        success: false,
        message: 'An error occurred while sending reminders. Please try again.'
      });
      setSending(false);
    }
  };

  // Don't render the button if user can't send reminders
  if (!canSendReminders) {
    return null;
  }

  return (
    <>
      <button 
        className="remind-friends-button"
        onClick={openReminderModal}
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Remind Friends'}
      </button>
      
      {showModal && (
        <div className="reminder-modal-overlay">
          <div className="reminder-modal">
            <div className="modal-header">
              <h2>Remind Friends about {prayerName} Prayer</h2>
              <button className="close-button" onClick={closeModal}>×</button>
            </div>
            
            <div className="modal-content">
              {friends.length === 0 ? (
                <div className="no-friends-message">
                  <p>No friends available to remind.</p>
                  <p>This could be because:</p>
                  <ul>
                    <li>All your friends have already prayed</li>
                    <li>Your friends' prayer status is private</li>
                    <li>You don't have any friends added yet</li>
                  </ul>
                </div>
              ) : (
                <>
                  <div className="friend-selection-header">
                    <h3>Select Friends to Remind</h3>
                    <div className="selection-actions">
                      <button onClick={selectAllFriends} className="select-all-button">Select All</button>
                      <button onClick={deselectAllFriends} className="deselect-all-button">Deselect All</button>
                    </div>
                  </div>
                  
                  <div className="friends-list">
                    {friends.map(friend => (
                      <div 
                        key={friend.id} 
                        className={`friend-item ${!friend.canSendReminder ? 'disabled' : ''}`}
                      >
                        <label className="friend-checkbox">
                          <input
                            type="checkbox"
                            checked={selectedFriends.includes(friend.id)}
                            onChange={() => toggleFriendSelection(friend.id)}
                            disabled={!friend.canSendReminder}
                          />
                          <span className="friend-name">{friend.displayName}</span>
                        </label>
                        
                        {!friend.canSendReminder && (
                          <span className="cannot-send-reason">
                            {friend.reasonIfBlocked === 'EXPLICITLY_BLOCKED' ? 'You are blocked from sending reminders' :
                             friend.reasonIfBlocked === 'NOT_FRIENDS' ? 'Not friends' :
                             friend.reasonIfBlocked === 'GLOBALLY_DISABLED' ? 'Does not accept reminders' :
                             'Cannot send reminder'}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <div className="message-input">
                    <label htmlFor="reminder-message">Add a personal message (optional):</label>
                    <textarea
                      id="reminder-message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Example: Don't forget to pray! I'm praying for you."
                      maxLength={200}
                    />
                    <div className="character-count">
                      {message.length}/200 characters
                    </div>
                  </div>
                </>
              )}
              
              {result.message && (
                <div className={`result-message ${result.success ? 'success' : 'error'}`}>
                  {result.message}
                </div>
              )}
            </div>
            
            <div className="modal-footer">
              <button 
                className="cancel-button" 
                onClick={closeModal}
                disabled={sending}
              >
                Cancel
              </button>
              <button 
                className="send-button" 
                onClick={sendReminders}
                disabled={selectedFriends.length === 0 || sending || friends.length === 0}
              >
                {sending ? 'Sending...' : `Send Reminders (${selectedFriends.length})`}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FriendReminder;
