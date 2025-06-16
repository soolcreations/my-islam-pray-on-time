/**
 * Statistics Component
 * Unified statistics view for prayer and Quran activities with badges
 */
import React, { useState } from 'react';
import './Statistics.css';
import BadgesTab from './BadgesTab';

const Statistics = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Mock data for statistics
  const stats = {
    overallScore: 8.5,
    prayerStats: {
      completed: 28,
      total: 35,
      percentage: 80,
      avgScore: 7.8
    },
    quranStats: {
      pagesRead: 86,
      totalPages: 604,
      streak: 12
    },
    leaderboard: [
      { name: 'Ahmed', score: 9.2 },
      { name: 'Fatima', score: 8.9 },
      { name: 'You', score: 8.5 },
      { name: 'Omar', score: 8.1 },
      { name: 'Aisha', score: 7.8 }
    ]
  };

  return (
    <div className="statistics-container">
      {/* Statistics Tabs */}
      <div className="statistics-tabs">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab-button ${activeTab === 'badges' ? 'active' : ''}`}
          onClick={() => setActiveTab('badges')}
        >
          Badges
        </button>
        <button 
          className={`tab-button ${activeTab === 'leaderboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('leaderboard')}
        >
          Leaderboard
        </button>
      </div>
      
      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <>
          <div className="card">
            <h2 className="section-title">Overall Worship Score</h2>
            <div className="score-display">
              <div className="score-value">{stats.overallScore}/10</div>
              <div className="progress-container">
                <div 
                  className="progress-bar" 
                  style={{ width: `${stats.overallScore * 10}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="section-title">Prayer Performance</h2>
            <div className="chart-placeholder">
              <div className="chart-bars">
                <div className="chart-bar" style={{ height: '60%' }}></div>
                <div className="chart-bar" style={{ height: '80%' }}></div>
                <div className="chart-bar" style={{ height: '70%' }}></div>
                <div className="chart-bar" style={{ height: '90%' }}></div>
                <div className="chart-bar" style={{ height: '75%' }}></div>
                <div className="chart-bar" style={{ height: '85%' }}></div>
                <div className="chart-bar" style={{ height: '65%' }}></div>
              </div>
              <div className="chart-labels">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </div>
            <div className="stats-metrics">
              <div className="metric">
                <span className="metric-label">Completed:</span>
                <span className="metric-value">{stats.prayerStats.completed}/{stats.prayerStats.total} ({stats.prayerStats.percentage}%)</span>
              </div>
              <div className="metric">
                <span className="metric-label">Avg Score:</span>
                <span className="metric-value">{stats.prayerStats.avgScore}/10</span>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="section-title">Quran Reading</h2>
            <div className="chart-placeholder">
              <div className="progress-circle">
                <svg viewBox="0 0 36 36" className="circular-chart">
                  <path className="circle-bg"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path className="circle"
                    strokeDasharray={`${(stats.quranStats.pagesRead / stats.quranStats.totalPages) * 100}, 100`}
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <text x="18" y="20.35" className="percentage">{Math.round((stats.quranStats.pagesRead / stats.quranStats.totalPages) * 100)}%</text>
                </svg>
              </div>
            </div>
            <div className="stats-metrics">
              <div className="metric">
                <span className="metric-label">Pages Read:</span>
                <span className="metric-value">{stats.quranStats.pagesRead}/{stats.quranStats.totalPages}</span>
              </div>
              <div className="metric">
                <span className="metric-label">Reading Streak:</span>
                <span className="metric-value">{stats.quranStats.streak} days</span>
              </div>
            </div>
          </div>
        </>
      )}
      
      {/* Badges Tab */}
      {activeTab === 'badges' && (
        <BadgesTab />
      )}
      
      {/* Leaderboard Tab */}
      {activeTab === 'leaderboard' && (
        <div className="card leaderboard-card">
          <h2 className="section-title">Community Leaderboard</h2>
          <div className="leaderboard">
            {stats.leaderboard.map((user, index) => (
              <div key={index} className={`leaderboard-item ${user.name === 'You' ? 'current-user' : ''}`}>
                <div className="leaderboard-rank">{index + 1}</div>
                <div className="leaderboard-name">{user.name}</div>
                <div className="leaderboard-score">{user.score}/10</div>
              </div>
            ))}
          </div>
          <button className="view-all-button">View All</button>
        </div>
      )}
    </div>
  );
};

export default Statistics;
