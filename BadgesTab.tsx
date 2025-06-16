/**
 * BadgesTab Component
 * Displays user's earned and locked badges in the Statistics section
 */
import React, { useState } from 'react';
import './BadgesTab.css';
import badgeService from '../services/BadgeService';
import { Badge, BadgeCategory } from '../models/Badge';

const BadgesTab: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<BadgeCategory | 'all'>('all');
  
  // Get badges from service
  const allBadges = badgeService.getAllBadges();
  const unlockedBadges = badgeService.getUnlockedBadges();
  const lockedBadges = badgeService.getLockedBadges();
  const totalPoints = badgeService.getTotalPoints();
  
  // Filter badges by category
  const filteredBadges = activeCategory === 'all' 
    ? allBadges 
    : allBadges.filter(badge => badge.category === activeCategory);
  
  // Group badges by category for the summary
  const badgesByCategory = allBadges.reduce((acc, badge) => {
    if (!acc[badge.category]) {
      acc[badge.category] = { total: 0, unlocked: 0 };
    }
    acc[badge.category].total++;
    if (badge.unlocked) {
      acc[badge.category].unlocked++;
    }
    return acc;
  }, {} as Record<string, { total: number, unlocked: number }>);
  
  return (
    <div className="badges-tab">
      <div className="badges-header">
        <div className="badges-summary">
          <div className="badges-total">
            <span className="badges-count">{unlockedBadges.length}</span>
            <span className="badges-label">Badges Earned</span>
          </div>
          <div className="badges-points">
            <span className="points-count">{totalPoints}</span>
            <span className="points-label">Total Points</span>
          </div>
        </div>
        
        <div className="badges-progress">
          <div className="progress-label">
            <span>{unlockedBadges.length} of {allBadges.length} badges unlocked</span>
            <span>{Math.round((unlockedBadges.length / allBadges.length) * 100)}%</span>
          </div>
          <div className="progress-container">
            <div 
              className="progress-bar" 
              style={{ width: `${(unlockedBadges.length / allBadges.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      <div className="badges-categories">
        <button 
          className={`category-button ${activeCategory === 'all' ? 'active' : ''}`}
          onClick={() => setActiveCategory('all')}
        >
          All
        </button>
        {Object.entries(BadgeCategory).map(([key, value]) => (
          <button 
            key={key}
            className={`category-button ${activeCategory === value ? 'active' : ''}`}
            onClick={() => setActiveCategory(value)}
          >
            {key.charAt(0) + key.slice(1).toLowerCase()} 
            <span className="category-count">
              {badgesByCategory[value]?.unlocked || 0}/{badgesByCategory[value]?.total || 0}
            </span>
          </button>
        ))}
      </div>
      
      <div className="badges-list">
        {filteredBadges.map(badge => (
          <div 
            key={badge.id} 
            className={`badge-item ${badge.unlocked ? 'unlocked' : 'locked'} ${badge.category.toLowerCase()}`}
          >
            <div className="badge-icon">{badge.icon}</div>
            <div className="badge-details">
              <div className="badge-name">{badge.name}</div>
              <div className="badge-description">{badge.description}</div>
              {badge.unlocked ? (
                <div className="badge-unlocked-info">
                  <span className="badge-points">+{badge.points} points</span>
                  <span className="badge-unlock-date">
                    Unlocked {badge.unlockedAt ? new Date(badge.unlockedAt).toLocaleDateString() : 'recently'}
                  </span>
                </div>
              ) : (
                <div className="badge-progress-container">
                  <div className="badge-progress-label">
                    <span>Progress</span>
                    <span>{badge.progress || 0}%</span>
                  </div>
                  <div className="badge-progress-bar-container">
                    <div 
                      className="badge-progress-bar" 
                      style={{ width: `${badge.progress || 0}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
            <div className="badge-rarity">{badge.rarity}</div>
          </div>
        ))}
      </div>
      
      {filteredBadges.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🏆</div>
          <div className="empty-message">No badges in this category yet</div>
        </div>
      )}
    </div>
  );
};

export default BadgesTab;
