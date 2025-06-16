// Update Dashboard component to use StorageContext and display prayer statistics
import React, { useState, useEffect } from 'react';
import { PrayerTimeCalculator } from '@shared/services/prayerTimeCalculator';
import { PrayerTime, PrayerDay, Coordinates } from '@shared/types';
import { useStorage } from '../context/StorageContext';
import { PrayerRecord } from '@shared/services/prayerStorageService';
import './Dashboard.css';

interface DashboardProps {
  onRegisterPrayer: (prayer: PrayerTime) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onRegisterPrayer }) => {
  const [prayerDay, setPrayerDay] = useState<PrayerDay | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [todaysPrayers, setTodaysPrayers] = useState<PrayerRecord[]>([]);
  const [averageScore, setAverageScore] = useState(0);
  const [loading, setLoading] = useState(true);

  // Get storage context
  const { prayerStorage, userSettings, userId } = useStorage();

  // Initialize with default location (will be replaced with geolocation in real app)
  const defaultCoordinates: Coordinates = {
    latitude: 37.7749,
    longitude: -122.4194
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        // Calculate prayer times using user settings
        const calculator = new PrayerTimeCalculator(defaultCoordinates, userSettings);
        const prayers = calculator.calculatePrayerTimes(new Date());
        setPrayerDay(prayers);

        // Load today's prayer records
        const today = new Date();
        const records = await prayerStorage.getPrayerRecordsForDate(userId, today);
        setTodaysPrayers(records);

        // Calculate average score
        if (records.length > 0) {
          const totalScore = records.reduce((sum, record) => sum + record.score, 0);
          setAverageScore(Math.round((totalScore / records.length) * 10) / 10);
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Update current time every minute
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, [prayerStorage, userSettings, userId]);

  // Format time for display
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Determine prayer status
  const getPrayerStatus = (prayer: PrayerTime) => {
    // Check if prayer is already registered today
    const isRegistered = todaysPrayers.some(p => p.prayerName === prayer.name);
    if (isRegistered) return 'completed';
    
    if (!prayer.endTime) return 'upcoming';
    
    if (currentTime < prayer.time) {
      return 'upcoming';
    } else if (currentTime >= prayer.time && currentTime <= prayer.endTime) {
      return 'active';
    } else {
      return 'missed';
    }
  };

  // Handle prayer registration
  const handleRegisterPrayer = (prayer: PrayerTime) => {
    onRegisterPrayer(prayer);
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading prayer times...</div>
      </div>
    );
  }

  if (!prayerDay) {
    return (
      <div className="dashboard-container">
        <div className="loading">Error loading prayer times. Please try again.</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Prayer Dashboard</h1>
        <div className="date-display">
          {currentTime.toLocaleDateString(undefined, { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
        <div className="time-display">
          {formatTime(currentTime)}
        </div>
      </div>

      <div className="prayers-container">
        {prayerDay.prayers.map((prayer, index) => {
          const status = getPrayerStatus(prayer);
          const isRegistered = status === 'completed';
          
          return (
            <div 
              key={index} 
              className={`prayer-card ${status === 'active' ? 'active-prayer' : ''} 
                         ${status === 'missed' ? 'missed-prayer' : ''}
                         ${isRegistered ? 'completed-prayer' : ''}`}
            >
              <div className="prayer-info">
                <h2 className="prayer-name">{prayer.displayName}</h2>
                <div className="prayer-time">{formatTime(prayer.time)}</div>
                {prayer.endTime && (
                  <div className="prayer-end-time">
                    Until {formatTime(prayer.endTime)}
                  </div>
                )}
              </div>
              
              <button 
                className={`register-button 
                          ${status === 'upcoming' ? 'disabled-button' : ''} 
                          ${status === 'missed' ? 'missed-button' : ''}
                          ${isRegistered ? 'completed-button' : ''}`}
                onClick={() => handleRegisterPrayer(prayer)}
                disabled={status === 'upcoming' || isRegistered}
              >
                {isRegistered ? 'Completed' : 
                 status === 'active' ? 'Register' : 
                 status === 'missed' ? 'Missed' : 'Upcoming'}
              </button>
            </div>
          );
        })}
      </div>

      <div className="stats-container">
        <h2>Today's Statistics</h2>
        <div className="stats-item">Prayers completed: {todaysPrayers.length}/5</div>
        <div className="stats-item">Average score: {averageScore.toFixed(1)}</div>
      </div>
    </div>
  );
};

export default Dashboard;
