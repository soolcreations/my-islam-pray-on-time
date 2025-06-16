/**
 * Prayer Component
 * Consolidated prayer tab with prayer times, registration, missed prayers, and mosque locator
 */
import React, { useState } from 'react';
import './Prayer.css';

const Prayer = () => {
  // Mock data for prayers
  const prayers = [
    {
      id: 1,
      name: 'Fajr',
      time: '5:30 AM',
      status: 'completed',
      progress: 100,
      score: 8
    },
    {
      id: 2,
      name: 'Dhuhr',
      time: '1:15 PM',
      status: 'current',
      progress: 0
    },
    {
      id: 3,
      name: 'Asr',
      time: '4:45 PM',
      status: 'upcoming',
      progress: 0
    },
    {
      id: 4,
      name: 'Maghrib',
      time: '7:30 PM',
      status: 'upcoming',
      progress: 0
    },
    {
      id: 5,
      name: 'Isha',
      time: '9:00 PM',
      status: 'upcoming',
      progress: 0
    }
  ];

  // Mock data for missed prayers
  const missedPrayers = [
    {
      id: 1,
      name: 'Fajr',
      date: 'May 19',
      status: 'pending'
    },
    {
      id: 2,
      name: 'Asr',
      date: 'May 18',
      status: 'made-up'
    },
    {
      id: 3,
      name: 'Isha',
      date: 'May 17',
      status: 'pending'
    }
  ];

  // Mock data for nearby mosques
  const nearbyMosques = [
    {
      id: 1,
      name: 'Masjid Al-Noor',
      distance: '0.5 mi'
    },
    {
      id: 2,
      name: 'Islamic Center',
      distance: '1.2 mi'
    }
  ];

  const handleMakeUp = (id) => {
    // Handle prayer make-up logic
    console.log(`Making up prayer ${id}`);
  };

  const handleRegister = (id) => {
    // Handle prayer registration logic
    console.log(`Registering prayer ${id}`);
  };

  const handleRemindFriends = (id) => {
    // Handle friend reminder logic
    console.log(`Sending reminders for prayer ${id}`);
  };

  return (
    <div className="prayer-container">
      <h2 className="section-title">Today's Prayers</h2>
      
      {prayers.map(prayer => (
        <div key={prayer.id} className={`card prayer-card ${prayer.status}`}>
          <div className="prayer-header">
            <div className="prayer-name">{prayer.name}</div>
            <div className="prayer-time">{prayer.time}</div>
          </div>
          
          <div className="progress-container">
            <div 
              className="progress-bar" 
              style={{ width: `${prayer.progress}%` }}
            ></div>
          </div>
          
          <div className="prayer-status">
            {prayer.status === 'completed' && (
              <div>Completed • Score: {prayer.score}/10</div>
            )}
            {prayer.status === 'current' && (
              <div>Current Prayer</div>
            )}
            {prayer.status === 'upcoming' && (
              <div>Upcoming</div>
            )}
          </div>
          
          {prayer.status === 'current' && (
            <div className="prayer-actions">
              <button 
                className="button-primary"
                onClick={() => handleRegister(prayer.id)}
              >
                Register
              </button>
              <button 
                className="button-secondary"
                onClick={() => handleRemindFriends(prayer.id)}
              >
                Remind Friends
              </button>
            </div>
          )}
        </div>
      ))}
      
      <h2 className="section-title">Missed Prayers</h2>
      <div className="card">
        <div className="missed-prayers-list">
          {missedPrayers.map(prayer => (
            <div key={prayer.id} className="missed-prayer-item">
              <div className="missed-prayer-info">
                <span>{prayer.name} - {prayer.date}</span>
              </div>
              {prayer.status === 'pending' ? (
                <button 
                  className="button-secondary small"
                  onClick={() => handleMakeUp(prayer.id)}
                >
                  Make Up
                </button>
              ) : (
                <span className="made-up-label">Made Up</span>
              )}
            </div>
          ))}
        </div>
        <button className="view-all-button">View All</button>
      </div>
      
      <h2 className="section-title">Nearby Mosques</h2>
      <div className="card">
        <div className="map-placeholder">
          <div className="map-icon">🗺️</div>
          <div className="map-label">Map View</div>
        </div>
        <div className="mosque-list">
          {nearbyMosques.map(mosque => (
            <div key={mosque.id} className="mosque-item">
              <div className="mosque-info">
                <span className="mosque-name">{mosque.name}</span>
                <span className="mosque-distance">({mosque.distance})</span>
              </div>
            </div>
          ))}
        </div>
        <button className="view-all-button">View All</button>
      </div>
    </div>
  );
};

export default Prayer;
