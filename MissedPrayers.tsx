// Update MissedPrayers component to use StorageContext
import React, { useState, useEffect } from 'react';
import { PrayerRecord } from '@shared/services/prayerStorageService';
import { useStorage } from '../context/StorageContext';
import './MissedPrayers.css';

const MissedPrayers: React.FC = () => {
  const [missedPrayers, setMissedPrayers] = useState<PrayerRecord[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Get storage context
  const { prayerStorage, userId } = useStorage();
  
  useEffect(() => {
    // Load missed prayers
    const loadMissedPrayers = async () => {
      try {
        const prayers = await prayerStorage.getMissedPrayers(userId);
        setMissedPrayers(prayers);
      } catch (error) {
        console.error('Error loading missed prayers:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadMissedPrayers();
  }, [prayerStorage, userId]);
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric'
    });
  };
  
  // Format time for display
  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Handle marking a prayer as made up
  const handleMarkAsMadeUp = async (prayerId: string) => {
    if (window.confirm('Are you sure you want to mark this prayer as made up?')) {
      try {
        const success = await prayerStorage.markPrayerAsMadeUp(userId, prayerId);
        
        if (success) {
          // Update the list
          setMissedPrayers(missedPrayers.filter(prayer => prayer.id !== prayerId));
          alert('Prayer marked as made up successfully.');
        } else {
          alert('Failed to mark prayer as made up.');
        }
      } catch (error) {
        console.error('Error marking prayer as made up:', error);
        alert('An error occurred. Please try again.');
      }
    }
  };
  
  if (loading) {
    return (
      <div className="missed-prayers-container">
        <div className="loading">Loading missed prayers...</div>
      </div>
    );
  }
  
  return (
    <div className="missed-prayers-container">
      <h1>Missed Prayers</h1>
      
      {missedPrayers.length === 0 ? (
        <div className="empty-state">
          <p>No missed prayers! Keep up the good work.</p>
        </div>
      ) : (
        <div className="prayers-list">
          {missedPrayers.map((prayer) => (
            <div key={prayer.id} className="prayer-item">
              <div className="prayer-details">
                <h3 className="prayer-name">
                  {prayer.prayerName.charAt(0).toUpperCase() + prayer.prayerName.slice(1)}
                </h3>
                <div className="prayer-date">{formatDate(prayer.date)}</div>
                <div className="prayer-time">
                  Scheduled: {formatTime(prayer.scheduledTime)}
                </div>
              </div>
              
              <button 
                className="makeup-button"
                onClick={() => handleMarkAsMadeUp(prayer.id)}
              >
                Mark as Made Up
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MissedPrayers;
