/**
 * QuranReader Component
 * Dedicated Quran reading interface with navigation and tracking
 */
import React, { useState } from 'react';
import './QuranReader.css';

const QuranReader = () => {
  // Mock data for Quran content
  const [currentSurah, setCurrentSurah] = useState('Al-Fatiha');
  const [readingSession, setReadingSession] = useState(null);
  
  // Mock Quran text
  const quranText = {
    arabic: [
      'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
      'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
      'الرَّحْمَٰنِ الرَّحِيمِ',
      'مَالِكِ يَوْمِ الدِّينِ',
      'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
      'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
      'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ'
    ],
    translation: [
      'In the name of Allah, the Entirely Merciful, the Especially Merciful.',
      '[All] praise is [due] to Allah, Lord of the worlds -',
      'The Entirely Merciful, the Especially Merciful,',
      'Sovereign of the Day of Recompense.',
      'It is You we worship and You we ask for help.',
      'Guide us to the straight path -',
      'The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray.'
    ]
  };

  // Mock reading progress
  const readingProgress = {
    currentPosition: 'Surah Al-Baqarah',
    page: 8,
    totalPages: 604,
    lastSession: '25 minutes'
  };

  // Mock bookmarks
  const bookmarks = [
    { id: 1, name: 'Surah Yasin - Verse 36' },
    { id: 2, name: 'Ayatul Kursi - Al-Baqarah 255' }
  ];

  const startReadingSession = () => {
    setReadingSession({
      startTime: new Date(),
      duration: 0,
      active: true
    });
  };

  const stopReadingSession = () => {
    setReadingSession(null);
  };

  return (
    <div className="quran-container">
      <div className="card quran-reader">
        <h2 className="section-title">Quran Reader</h2>
        <div className="quran-controls">
          <select className="surah-selector">
            <option>Al-Fatiha (The Opening)</option>
            <option>Al-Baqarah (The Cow)</option>
            <option>Aal-Imran (Family of Imran)</option>
            <option>An-Nisa (The Women)</option>
            <option>Al-Ma'idah (The Table Spread)</option>
          </select>
        </div>
        
        <div className="quran-content">
          <h3 className="surah-title">Al-Fatiha (The Opening)</h3>
          
          {quranText.arabic.map((verse, index) => (
            <div key={index} className="verse-container">
              <p className="arabic-text">{verse}</p>
              <p className="translation-text">{quranText.translation[index]}</p>
            </div>
          ))}
        </div>
        
        <div className="quran-navigation">
          <button className="button-secondary">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            Previous Page
          </button>
          <button className="button-secondary">
            Next Page
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
        
        {!readingSession ? (
          <button 
            className="button-primary full-width"
            onClick={startReadingSession}
          >
            Start Reading Session
          </button>
        ) : (
          <button 
            className="button-secondary full-width"
            onClick={stopReadingSession}
          >
            End Reading Session
          </button>
        )}
      </div>

      <div className="card">
        <h2 className="section-title">Reading Progress</h2>
        <div className="reading-progress">
          <div className="progress-item">
            <span className="progress-label">Current Position:</span>
            <span className="progress-value">{readingProgress.currentPosition}</span>
          </div>
          <div className="progress-item">
            <span className="progress-label">Page:</span>
            <span className="progress-value">{readingProgress.page}/{readingProgress.totalPages}</span>
          </div>
          <div className="progress-item">
            <span className="progress-label">Last Session:</span>
            <span className="progress-value">{readingProgress.lastSession}</span>
          </div>
        </div>
        <button className="button-primary full-width">Resume Reading</button>
      </div>

      <div className="card">
        <h2 className="section-title">Bookmarks</h2>
        <div className="bookmarks-list">
          {bookmarks.map(bookmark => (
            <div key={bookmark.id} className="bookmark-item">
              <span className="bookmark-name">{bookmark.name}</span>
              <button className="icon-button small">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
          ))}
        </div>
        <button className="view-all-button">View All</button>
      </div>
    </div>
  );
};

export default QuranReader;
