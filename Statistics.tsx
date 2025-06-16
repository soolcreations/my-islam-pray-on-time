// Statistics and Data Visualization component for web
import React, { useState, useEffect, useRef } from 'react';
import { useStorage } from '../context/StorageContext';
import { useTranslation } from '@shared/i18n/i18nService';
import './Statistics.css';

// For chart rendering
const Statistics: React.FC = () => {
  const { prayerRecords, isLoading } = useStorage();
  const { t, languageInfo } = useTranslation();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');
  const [chartType, setChartType] = useState<'line' | 'bar' | 'radar'>('line');
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<any>(null);
  
  // Process data for visualization
  useEffect(() => {
    if (isLoading || !prayerRecords.length) return;
    
    const renderChart = async () => {
      if (!chartRef.current) return;
      
      // We'll use Chart.js for visualization
      // In a real implementation, we would import Chart.js
      // For this prototype, we'll simulate the chart rendering
      
      // Clear previous chart if exists
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
      
      // Process data based on time range
      const now = new Date();
      let startDate: Date;
      
      switch (timeRange) {
        case 'week':
          startDate = new Date(now);
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate = new Date(now);
          startDate.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          startDate = new Date(now);
          startDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      // Filter records within the time range
      const filteredRecords = prayerRecords.filter(record => 
        new Date(record.timestamp) >= startDate && new Date(record.timestamp) <= now
      );
      
      // Group by prayer name
      const prayerNames = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
      const groupedByPrayer = prayerNames.map(prayer => {
        const records = filteredRecords.filter(record => record.prayerName === prayer);
        return {
          name: prayer,
          records,
          avgScore: records.length ? records.reduce((sum, r) => sum + r.score, 0) / records.length : 0,
          atMosqueCount: records.filter(r => r.atMosque).length,
          totalCount: records.length
        };
      });
      
      // Group by day for trend analysis
      const days = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 365;
      const dailyData = Array(days).fill(0).map((_, i) => {
        const date = new Date(now);
        date.setDate(now.getDate() - (days - 1) + i);
        date.setHours(0, 0, 0, 0);
        
        const nextDate = new Date(date);
        nextDate.setDate(date.getDate() + 1);
        
        const dayRecords = filteredRecords.filter(record => {
          const recordDate = new Date(record.timestamp);
          return recordDate >= date && recordDate < nextDate;
        });
        
        return {
          date,
          avgScore: dayRecords.length ? dayRecords.reduce((sum, r) => sum + r.score, 0) / dayRecords.length : 0,
          completedCount: dayRecords.length,
          atMosqueCount: dayRecords.filter(r => r.atMosque).length
        };
      });
      
      // Simulate chart rendering
      console.log('Rendering chart with:', {
        chartType,
        timeRange,
        groupedByPrayer,
        dailyData,
        language: languageInfo.code
      });
      
      // In a real implementation, we would create the chart here
      // For the prototype, we'll just set a reference to simulate chart instance
      chartInstanceRef.current = { destroy: () => console.log('Chart destroyed') };
    };
    
    renderChart();
  }, [prayerRecords, timeRange, chartType, isLoading, languageInfo]);
  
  if (isLoading) {
    return (
      <div className="statistics-container">
        <div className="loading">{t('app.loading')}...</div>
      </div>
    );
  }
  
  if (!prayerRecords.length) {
    return (
      <div className="statistics-container">
        <div className="empty-stats">
          <h2>{t('statistics.no.data.title')}</h2>
          <p>{t('statistics.no.data.message')}</p>
        </div>
      </div>
    );
  }
  
  // Calculate overall statistics
  const totalPrayers = prayerRecords.length;
  const atMosquePrayers = prayerRecords.filter(r => r.atMosque).length;
  const avgScore = prayerRecords.reduce((sum, r) => sum + r.score, 0) / totalPrayers;
  const perfectScores = prayerRecords.filter(r => r.score === 10).length;
  
  // Calculate prayer type distribution
  const prayerTypes = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
  const prayerCounts = prayerTypes.map(type => ({
    name: type,
    count: prayerRecords.filter(r => r.prayerName === type).length,
    atMosque: prayerRecords.filter(r => r.prayerName === type && r.atMosque).length
  }));
  
  return (
    <div className="statistics-container">
      <h1>{t('statistics.title')}</h1>
      
      <div className="chart-controls">
        <div className="control-group">
          <label>{t('statistics.time.range')}</label>
          <div className="button-group">
            <button 
              className={`control-button ${timeRange === 'week' ? 'active' : ''}`}
              onClick={() => setTimeRange('week')}
            >
              {t('statistics.week')}
            </button>
            <button 
              className={`control-button ${timeRange === 'month' ? 'active' : ''}`}
              onClick={() => setTimeRange('month')}
            >
              {t('statistics.month')}
            </button>
            <button 
              className={`control-button ${timeRange === 'year' ? 'active' : ''}`}
              onClick={() => setTimeRange('year')}
            >
              {t('statistics.year')}
            </button>
          </div>
        </div>
        
        <div className="control-group">
          <label>{t('statistics.chart.type')}</label>
          <div className="button-group">
            <button 
              className={`control-button ${chartType === 'line' ? 'active' : ''}`}
              onClick={() => setChartType('line')}
            >
              {t('statistics.line')}
            </button>
            <button 
              className={`control-button ${chartType === 'bar' ? 'active' : ''}`}
              onClick={() => setChartType('bar')}
            >
              {t('statistics.bar')}
            </button>
            <button 
              className={`control-button ${chartType === 'radar' ? 'active' : ''}`}
              onClick={() => setChartType('radar')}
            >
              {t('statistics.radar')}
            </button>
          </div>
        </div>
      </div>
      
      <div className="stats-summary">
        <div className="stat-card">
          <div className="stat-value">{totalPrayers}</div>
          <div className="stat-label">{t('statistics.total.prayers')}</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{avgScore.toFixed(1)}</div>
          <div className="stat-label">{t('statistics.average.score')}</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{atMosquePrayers}</div>
          <div className="stat-label">{t('statistics.mosque.prayers')}</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{perfectScores}</div>
          <div className="stat-label">{t('statistics.perfect.scores')}</div>
        </div>
      </div>
      
      <div className="chart-container">
        <canvas ref={chartRef} />
        
        {/* Placeholder for chart (in a real app, Chart.js would render here) */}
        <div className="chart-placeholder">
          <div className="chart-title">
            {timeRange === 'week' && t('statistics.weekly.trend')}
            {timeRange === 'month' && t('statistics.monthly.trend')}
            {timeRange === 'year' && t('statistics.yearly.trend')}
          </div>
          <div className="placeholder-chart">
            <div className="chart-y-axis">
              <div>10</div>
              <div>8</div>
              <div>6</div>
              <div>4</div>
              <div>2</div>
              <div>0</div>
            </div>
            <div className="chart-bars">
              {Array(7).fill(0).map((_, i) => (
                <div key={i} className="chart-bar-group">
                  <div 
                    className="chart-bar" 
                    style={{ 
                      height: `${Math.random() * 80 + 10}%`,
                      backgroundColor: '#4CAF50'
                    }}
                  />
                  <div className="chart-label">
                    {timeRange === 'week' ? 
                      ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i] :
                      `${i + 1}`
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="chart-legend">
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#4CAF50' }}></div>
              <div className="legend-label">{t('statistics.average.score')}</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="prayer-distribution">
        <h2>{t('statistics.prayer.distribution')}</h2>
        <div className="distribution-chart">
          {prayerCounts.map(prayer => (
            <div key={prayer.name} className="distribution-item">
              <div className="prayer-label">{t(`prayer.${prayer.name}`)}</div>
              <div className="prayer-bar-container">
                <div 
                  className="prayer-bar" 
                  style={{ 
                    width: `${(prayer.count / totalPrayers) * 100}%`,
                    backgroundColor: '#4CAF50'
                  }}
                >
                  <div 
                    className="mosque-portion" 
                    style={{ 
                      width: `${(prayer.atMosque / prayer.count) * 100}%`,
                      backgroundColor: '#2196F3'
                    }}
                  />
                </div>
                <div className="prayer-count">{prayer.count}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="distribution-legend">
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#4CAF50' }}></div>
            <div className="legend-label">{t('statistics.total')}</div>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#2196F3' }}></div>
            <div className="legend-label">{t('statistics.at.mosque')}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
