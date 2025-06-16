// Update PrayerRegistration component to use StorageContext
import React, { useState } from 'react';
import { PrayerTime } from '@shared/types';
import { PrayerScoringService } from '@shared/services/prayerScoringService';
import { useStorage } from '../context/StorageContext';
import './PrayerRegistration.css';

interface PrayerRegistrationProps {
  prayer: PrayerTime;
  onClose: () => void;
}

const PrayerRegistration: React.FC<PrayerRegistrationProps> = ({ prayer, onClose }) => {
  const [atMosque, setAtMosque] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [score, setScore] = useState(0);
  
  // Get storage context
  const { prayerStorage, userId } = useStorage();
  
  // Format time for display
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Handle prayer registration
  const handleRegisterPrayer = async () => {
    setIsRegistering(true);
    
    try {
      // Get current time for registration
      const registrationTime = new Date();
      
      // Calculate score
      const scoringService = new PrayerScoringService();
      const scoreResult = scoringService.calculateScore(prayer, registrationTime, atMosque);
      
      // Store prayer record
      await prayerStorage.storePrayerRecord(userId, scoreResult);
      
      // Update state
      setScore(scoreResult.score);
      setRegistered(true);
    } catch (error) {
      console.error('Error registering prayer:', error);
      alert('Failed to register prayer. Please try again.');
    } finally {
      setIsRegistering(false);
    }
  };
  
  if (registered) {
    return (
      <div className="prayer-registration-container">
        <div className="registration-success">
          <h2>Prayer Registered!</h2>
          <div className="score-display">
            <div className="score-circle">{score.toFixed(1)}</div>
            <div className="score-label">Your Score</div>
          </div>
          <p>Your {prayer.displayName} prayer has been registered successfully.</p>
          <button className="close-button" onClick={onClose}>Close</button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="prayer-registration-container">
      <div className="registration-card">
        <h2>Register {prayer.displayName} Prayer</h2>
        
        <div className="time-info">
          <div className="time-label">Scheduled Time:</div>
          <div className="time-value">{formatTime(prayer.time)}</div>
        </div>
        
        <div className="time-info">
          <div className="time-label">Current Time:</div>
          <div className="time-value">{formatTime(new Date())}</div>
        </div>
        
        <div className="mosque-option">
          <label className="mosque-label">
            Prayer performed at mosque
            <input 
              type="checkbox" 
              checked={atMosque} 
              onChange={(e) => setAtMosque(e.target.checked)} 
            />
            <span className="checkmark"></span>
          </label>
        </div>
        
        <p className="score-info">
          {atMosque 
            ? 'Prayers at mosque automatically receive a score of 10/10!'
            : 'Your score will be calculated based on how promptly you prayed.'}
        </p>
        
        <div className="button-group">
          <button 
            className="cancel-button" 
            onClick={onClose}
            disabled={isRegistering}
          >
            Cancel
          </button>
          <button 
            className="register-button" 
            onClick={handleRegisterPrayer}
            disabled={isRegistering}
          >
            {isRegistering ? 'Registering...' : 'Register Prayer'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrayerRegistration;
