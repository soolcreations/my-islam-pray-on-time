// Mosque Locator component for web
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './MosqueLocator.css';

// Types for mosque data
interface Mosque {
  id: string;
  name: string;
  address: string;
  distance: number; // in kilometers
  latitude: number;
  longitude: number;
  prayerTimes?: {
    fajr: string;
    dhuhr: string;
    asr: string;
    maghrib: string;
    isha: string;
  };
}

interface Coordinates {
  latitude: number;
  longitude: number;
}

const MosqueLocator: React.FC = () => {
  const [mosques, setMosques] = useState<Mosque[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [searchRadius, setSearchRadius] = useState(5); // in kilometers
  const [selectedMosque, setSelectedMosque] = useState<Mosque | null>(null);
  
  const { currentUser } = useAuth();
  
  // Get user's location
  useEffect(() => {
    const getUserLocation = () => {
      setLocationError(null);
      
      if (!navigator.geolocation) {
        setLocationError('Geolocation is not supported by your browser');
        return;
      }
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setLocationError('User denied the request for geolocation');
              break;
            case error.POSITION_UNAVAILABLE:
              setLocationError('Location information is unavailable');
              break;
            case error.TIMEOUT:
              setLocationError('The request to get user location timed out');
              break;
            default:
              setLocationError('An unknown error occurred');
              break;
          }
        }
      );
    };
    
    getUserLocation();
  }, []);
  
  // Load nearby mosques when user location is available
  useEffect(() => {
    const loadNearbyMosques = async () => {
      if (!userLocation) return;
      
      setLoading(true);
      try {
        // In a real app, this would call an API like Google Places API
        // For now, we'll use mock data
        const mockMosques: Mosque[] = [
          {
            id: 'm1',
            name: 'Central Mosque',
            address: '123 Main St, City Center',
            distance: 0.8,
            latitude: userLocation.latitude + 0.01,
            longitude: userLocation.longitude - 0.01,
            prayerTimes: {
              fajr: '05:30',
              dhuhr: '13:15',
              asr: '16:45',
              maghrib: '19:30',
              isha: '21:00'
            }
          },
          {
            id: 'm2',
            name: 'Masjid Al-Noor',
            address: '456 Oak Ave, Westside',
            distance: 1.5,
            latitude: userLocation.latitude - 0.02,
            longitude: userLocation.longitude + 0.02,
            prayerTimes: {
              fajr: '05:15',
              dhuhr: '13:00',
              asr: '16:30',
              maghrib: '19:30',
              isha: '21:15'
            }
          },
          {
            id: 'm3',
            name: 'Islamic Center',
            address: '789 Pine Rd, Eastside',
            distance: 2.3,
            latitude: userLocation.latitude + 0.03,
            longitude: userLocation.longitude + 0.03,
            prayerTimes: {
              fajr: '05:45',
              dhuhr: '13:30',
              asr: '17:00',
              maghrib: '19:30',
              isha: '21:30'
            }
          },
          {
            id: 'm4',
            name: 'Community Masjid',
            address: '101 Cedar Blvd, Northside',
            distance: 3.7,
            latitude: userLocation.latitude - 0.04,
            longitude: userLocation.longitude - 0.04,
            prayerTimes: {
              fajr: '05:30',
              dhuhr: '13:15',
              asr: '16:45',
              maghrib: '19:30',
              isha: '21:00'
            }
          },
          {
            id: 'm5',
            name: 'Masjid Al-Rahma',
            address: '202 Elm St, Southside',
            distance: 4.2,
            latitude: userLocation.latitude + 0.05,
            longitude: userLocation.longitude - 0.05,
            prayerTimes: {
              fajr: '05:15',
              dhuhr: '13:00',
              asr: '16:30',
              maghrib: '19:30',
              isha: '21:15'
            }
          }
        ];
        
        // Filter by search radius
        const filteredMosques = mockMosques.filter(mosque => mosque.distance <= searchRadius);
        
        setMosques(filteredMosques);
      } catch (error) {
        console.error('Error loading mosques:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadNearbyMosques();
  }, [userLocation, searchRadius]);
  
  // Handle mosque selection
  const handleSelectMosque = (mosque: Mosque) => {
    setSelectedMosque(mosque);
  };
  
  // Handle search radius change
  const handleRadiusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchRadius(Number(e.target.value));
  };
  
  // Get directions to mosque
  const getDirections = (mosque: Mosque) => {
    if (!userLocation) return;
    
    // Open Google Maps in a new tab
    const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.latitude},${userLocation.longitude}&destination=${mosque.latitude},${mosque.longitude}&travelmode=driving`;
    window.open(url, '_blank');
  };
  
  if (locationError) {
    return (
      <div className="mosque-locator-container">
        <div className="location-error">
          <h2>Location Error</h2>
          <p>{locationError}</p>
          <p>Please enable location services to find nearby mosques.</p>
        </div>
      </div>
    );
  }
  
  if (loading && !userLocation) {
    return (
      <div className="mosque-locator-container">
        <div className="loading">Getting your location...</div>
      </div>
    );
  }
  
  return (
    <div className="mosque-locator-container">
      <h1>Nearby Mosques</h1>
      
      <div className="search-controls">
        <div className="radius-slider">
          <label>Search Radius: {searchRadius} km</label>
          <input 
            type="range" 
            min="1" 
            max="10" 
            value={searchRadius}
            onChange={handleRadiusChange}
          />
        </div>
      </div>
      
      {loading ? (
        <div className="loading">Searching for mosques...</div>
      ) : mosques.length === 0 ? (
        <div className="empty-results">
          <p>No mosques found within {searchRadius} km.</p>
          <p>Try increasing your search radius.</p>
        </div>
      ) : (
        <div className="mosques-list">
          {mosques.map(mosque => (
            <div 
              key={mosque.id} 
              className={`mosque-card ${selectedMosque?.id === mosque.id ? 'selected' : ''}`}
              onClick={() => handleSelectMosque(mosque)}
            >
              <div className="mosque-info">
                <h2 className="mosque-name">{mosque.name}</h2>
                <div className="mosque-address">{mosque.address}</div>
                <div className="mosque-distance">{mosque.distance.toFixed(1)} km away</div>
              </div>
              
              <div className="mosque-actions">
                <button 
                  className="directions-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    getDirections(mosque);
                  }}
                >
                  Get Directions
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {selectedMosque && (
        <div className="mosque-details">
          <h2>{selectedMosque.name} Prayer Times</h2>
          
          {selectedMosque.prayerTimes ? (
            <div className="prayer-times-table">
              <div className="prayer-time-row">
                <div className="prayer-name">Fajr</div>
                <div className="prayer-time">{selectedMosque.prayerTimes.fajr}</div>
              </div>
              <div className="prayer-time-row">
                <div className="prayer-name">Dhuhr</div>
                <div className="prayer-time">{selectedMosque.prayerTimes.dhuhr}</div>
              </div>
              <div className="prayer-time-row">
                <div className="prayer-name">Asr</div>
                <div className="prayer-time">{selectedMosque.prayerTimes.asr}</div>
              </div>
              <div className="prayer-time-row">
                <div className="prayer-name">Maghrib</div>
                <div className="prayer-time">{selectedMosque.prayerTimes.maghrib}</div>
              </div>
              <div className="prayer-time-row">
                <div className="prayer-name">Isha</div>
                <div className="prayer-time">{selectedMosque.prayerTimes.isha}</div>
              </div>
            </div>
          ) : (
            <div className="no-prayer-times">
              Prayer times not available for this mosque.
            </div>
          )}
          
          <div className="mosque-note">
            <p>Remember: Prayers performed at the mosque automatically receive a 10/10 score!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MosqueLocator;
