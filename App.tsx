// Enhanced App.tsx with social-style navigation and layout
import React, { useState, useEffect } from 'react';
import './App.css';
import CommunityFeed from './components/CommunityFeed';
import Statistics from './components/Statistics';
import Prayer from './components/Prayer';
import QuranReader from './components/QuranReader';
import Notifications from './components/Notifications';
import Settings from './components/Settings';

function App() {
  const [activeTab, setActiveTab] = useState('community');
  const [showSettings, setShowSettings] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  
  // Handle profile/settings click
  const handleProfileClick = () => {
    setShowSettings(true);
  };
  
  // Handle back from settings
  const handleBackFromSettings = () => {
    setShowSettings(false);
  };

  // Add tab change animation effect
  useEffect(() => {
    const mainContent = document.querySelector('.app-content');
    if (mainContent) {
      mainContent.classList.add('tab-transition');
      setTimeout(() => {
        mainContent.classList.remove('tab-transition');
      }, 300);
    }
  }, [activeTab]);

  return (
    <div className="app-container">
      {!showSettings ? (
        <>
          <header className="app-header">
            <h1 className="app-logo">Prayer App</h1>
            <div className="header-actions">
              <button className="icon-button search-button" aria-label="Search">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </button>
              <button 
                className="icon-button profile-button" 
                aria-label="Profile and Settings"
                onClick={handleProfileClick}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </button>
            </div>
          </header>

          <main className="app-content">
            {activeTab === 'community' && <CommunityFeed />}
            {activeTab === 'statistics' && <Statistics />}
            {activeTab === 'prayer' && <Prayer />}
            {activeTab === 'quran' && <QuranReader />}
            {activeTab === 'notifications' && (
              <Notifications onNotificationRead={() => setNotificationCount(prev => Math.max(0, prev - 1))} />
            )}
          </main>

          <footer className="app-footer">
            <nav className="bottom-nav">
              <button 
                className={`nav-button ${activeTab === 'community' ? 'active' : ''}`}
                onClick={() => setActiveTab('community')}
                aria-label="Community Feed"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={activeTab === 'community' ? "var(--primary-color)" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
                <span className={activeTab === 'community' ? 'visible' : 'hidden'}>Home</span>
              </button>
              
              <button 
                className={`nav-button ${activeTab === 'statistics' ? 'active' : ''}`}
                onClick={() => setActiveTab('statistics')}
                aria-label="Statistics"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={activeTab === 'statistics' ? "var(--primary-color)" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="20" x2="18" y2="10"></line>
                  <line x1="12" y1="20" x2="12" y2="4"></line>
                  <line x1="6" y1="20" x2="6" y2="14"></line>
                </svg>
                <span className={activeTab === 'statistics' ? 'visible' : 'hidden'}>Stats</span>
              </button>
              
              <button 
                className={`nav-button ${activeTab === 'prayer' ? 'active' : ''}`}
                onClick={() => setActiveTab('prayer')}
                aria-label="Prayer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={activeTab === 'prayer' ? "var(--primary-color)" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                <span className={activeTab === 'prayer' ? 'visible' : 'hidden'}>Prayer</span>
              </button>
              
              <button 
                className={`nav-button ${activeTab === 'quran' ? 'active' : ''}`}
                onClick={() => setActiveTab('quran')}
                aria-label="Quran"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={activeTab === 'quran' ? "var(--primary-color)" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                </svg>
                <span className={activeTab === 'quran' ? 'visible' : 'hidden'}>Quran</span>
              </button>
              
              <button 
                className={`nav-button ${activeTab === 'notifications' ? 'active' : ''}`}
                onClick={() => setActiveTab('notifications')}
                aria-label="Notifications"
              >
                {notificationCount > 0 && (
                  <div className="notification-badge">{notificationCount}</div>
                )}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={activeTab === 'notifications' ? "var(--primary-color)" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
                <span className={activeTab === 'notifications' ? 'visible' : 'hidden'}>Alerts</span>
              </button>
            </nav>
          </footer>
        </>
      ) : (
        <Settings onBack={handleBackFromSettings} />
      )}
    </div>
  );
}

export default App;
