// Leaderboard component for web
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './Leaderboard.css';

// Types for leaderboard
interface LeaderboardUser {
  id: string;
  displayName: string;
  photoURL?: string;
  score: number;
  prayersAtMosque: number;
  streak: number;
  rank: number;
}

const Leaderboard: React.FC = () => {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [leaderboardType, setLeaderboardType] = useState<'global' | 'friends'>('global');
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  
  const { currentUser } = useAuth();
  
  // Load leaderboard data
  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        // In a real app, this would fetch from Firebase
        // For now, we'll use mock data
        const mockUsers: LeaderboardUser[] = [
          {
            id: 'user1',
            displayName: 'Ahmed',
            photoURL: 'https://randomuser.me/api/portraits/men/1.jpg',
            score: 9.8,
            prayersAtMosque: 15,
            streak: 30,
            rank: 1
          },
          {
            id: 'user2',
            displayName: 'Fatima',
            photoURL: 'https://randomuser.me/api/portraits/women/1.jpg',
            score: 9.5,
            prayersAtMosque: 12,
            streak: 25,
            rank: 2
          },
          {
            id: 'current-user',
            displayName: currentUser?.displayName || 'You',
            photoURL: currentUser?.photoURL || undefined,
            score: 9.2,
            prayersAtMosque: 10,
            streak: 20,
            rank: 3
          },
          {
            id: 'user3',
            displayName: 'Omar',
            photoURL: 'https://randomuser.me/api/portraits/men/2.jpg',
            score: 8.9,
            prayersAtMosque: 8,
            streak: 15,
            rank: 4
          },
          {
            id: 'user4',
            displayName: 'Aisha',
            photoURL: 'https://randomuser.me/api/portraits/women/2.jpg',
            score: 8.7,
            prayersAtMosque: 7,
            streak: 12,
            rank: 5
          },
          {
            id: 'user5',
            displayName: 'Yusuf',
            photoURL: 'https://randomuser.me/api/portraits/men/3.jpg',
            score: 8.5,
            prayersAtMosque: 5,
            streak: 10,
            rank: 6
          },
          {
            id: 'user6',
            displayName: 'Zainab',
            photoURL: 'https://randomuser.me/api/portraits/women/3.jpg',
            score: 8.2,
            prayersAtMosque: 4,
            streak: 8,
            rank: 7
          },
          {
            id: 'user7',
            displayName: 'Ibrahim',
            photoURL: 'https://randomuser.me/api/portraits/men/4.jpg',
            score: 8.0,
            prayersAtMosque: 3,
            streak: 7,
            rank: 8
          },
          {
            id: 'user8',
            displayName: 'Khadija',
            photoURL: 'https://randomuser.me/api/portraits/women/4.jpg',
            score: 7.8,
            prayersAtMosque: 2,
            streak: 5,
            rank: 9
          },
          {
            id: 'user9',
            displayName: 'Mustafa',
            photoURL: 'https://randomuser.me/api/portraits/men/5.jpg',
            score: 7.5,
            prayersAtMosque: 1,
            streak: 3,
            rank: 10
          }
        ];
        
        // Filter based on leaderboard type
        const filteredUsers = leaderboardType === 'friends'
          ? mockUsers.filter(user => ['user1', 'user2', 'current-user', 'user3'].includes(user.id))
          : mockUsers;
        
        setUsers(filteredUsers);
      } catch (error) {
        console.error('Error loading leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadLeaderboard();
  }, [leaderboardType, timeRange, currentUser]);
  
  // Find current user in leaderboard
  const currentUserRank = users.find(user => user.id === 'current-user')?.rank || 0;
  
  if (loading) {
    return (
      <div className="leaderboard-container">
        <div className="loading">Loading leaderboard...</div>
      </div>
    );
  }
  
  return (
    <div className="leaderboard-container">
      <h1>Leaderboard</h1>
      
      <div className="leaderboard-filters">
        <div className="filter-group">
          <button 
            className={`filter-button ${leaderboardType === 'global' ? 'active' : ''}`}
            onClick={() => setLeaderboardType('global')}
          >
            Global
          </button>
          <button 
            className={`filter-button ${leaderboardType === 'friends' ? 'active' : ''}`}
            onClick={() => setLeaderboardType('friends')}
          >
            Friends
          </button>
        </div>
        
        <div className="filter-group">
          <button 
            className={`filter-button ${timeRange === 'daily' ? 'active' : ''}`}
            onClick={() => setTimeRange('daily')}
          >
            Daily
          </button>
          <button 
            className={`filter-button ${timeRange === 'weekly' ? 'active' : ''}`}
            onClick={() => setTimeRange('weekly')}
          >
            Weekly
          </button>
          <button 
            className={`filter-button ${timeRange === 'monthly' ? 'active' : ''}`}
            onClick={() => setTimeRange('monthly')}
          >
            Monthly
          </button>
        </div>
      </div>
      
      <div className="your-rank">
        <div className="rank-label">Your Rank</div>
        <div className="rank-value">{currentUserRank}</div>
      </div>
      
      <div className="leaderboard-table">
        <div className="leaderboard-header">
          <div className="rank-column">Rank</div>
          <div className="user-column">User</div>
          <div className="score-column">Score</div>
          <div className="mosque-column">Mosque</div>
          <div className="streak-column">Streak</div>
        </div>
        
        {users.map(user => (
          <div 
            key={user.id} 
            className={`leaderboard-row ${user.id === 'current-user' ? 'current-user-row' : ''}`}
          >
            <div className="rank-column">
              {user.rank <= 3 ? (
                <div className={`trophy rank-${user.rank}`}>
                  {user.rank === 1 && '🥇'}
                  {user.rank === 2 && '🥈'}
                  {user.rank === 3 && '🥉'}
                </div>
              ) : (
                user.rank
              )}
            </div>
            
            <div className="user-column">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName} className="user-avatar" />
              ) : (
                <div className="user-avatar-placeholder">
                  {user.displayName.charAt(0)}
                </div>
              )}
              <span className="user-name">{user.displayName}</span>
              {user.id === 'current-user' && <span className="you-badge">You</span>}
            </div>
            
            <div className="score-column">{user.score.toFixed(1)}</div>
            <div className="mosque-column">{user.prayersAtMosque}</div>
            <div className="streak-column">{user.streak} days</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
