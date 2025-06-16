// Update Settings component to include language selection
import React, { useState, useEffect } from 'react';
import { CalculationMethod, PrayerSettings } from '@shared/types';
import { useStorage } from '../context/StorageContext';
import { useTranslation } from '@shared/i18n/i18nService';
import LanguageSelector from './LanguageSelector';
import './Settings.css';

const Settings: React.FC = () => {
  const { userSettings, setUserSettings, isLoading } = useStorage();
  const { t } = useTranslation();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Handle calculation method change
  const handleMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUserSettings({
      ...userSettings,
      calculationMethod: e.target.value as CalculationMethod
    });
  };
  
  // Handle Asr method change
  const handleAsrMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUserSettings({
      ...userSettings,
      asrMethod: e.target.value as 'Standard' | 'Hanafi'
    });
  };
  
  // Handle save settings
  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      await setUserSettings(userSettings);
      alert(t('settings.success'));
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="settings-container">
        <div className="loading">Loading settings...</div>
      </div>
    );
  }
  
  return (
    <div className="settings-container">
      <h1>{t('settings.title')}</h1>
      
      <div className="settings-section">
        <h2>{t('settings.prayer.calculation')}</h2>
        
        <div className="setting-item">
          <label htmlFor="calculation-method">{t('settings.calculation.method')}</label>
          <select 
            id="calculation-method"
            value={userSettings.calculationMethod}
            onChange={handleMethodChange}
          >
            {Object.values(CalculationMethod).map((method) => (
              <option key={method} value={method}>{method}</option>
            ))}
          </select>
        </div>
        
        <div className="setting-item">
          <label htmlFor="asr-method">{t('settings.asr.calculation')}</label>
          <select 
            id="asr-method"
            value={userSettings.asrMethod}
            onChange={handleAsrMethodChange}
          >
            <option value="Standard">{t('settings.standard')}</option>
            <option value="Hanafi">{t('settings.hanafi')}</option>
          </select>
        </div>
      </div>
      
      <div className="settings-section">
        <h2>{t('settings.notifications')}</h2>
        
        <div className="setting-item">
          <label htmlFor="prayer-reminders">{t('settings.prayer.reminders')}</label>
          <div className="toggle-switch">
            <input 
              type="checkbox" 
              id="prayer-reminders" 
              checked={notificationsEnabled}
              onChange={() => setNotificationsEnabled(!notificationsEnabled)}
            />
            <span className="slider"></span>
          </div>
        </div>
        
        <div className={`setting-item ${!notificationsEnabled ? 'disabled-setting' : ''}`}>
          <label htmlFor="reminder-time">{t('settings.reminder.time')}</label>
          <select 
            id="reminder-time"
            disabled={!notificationsEnabled}
            defaultValue="10"
          >
            <option value="5">5 {t('settings.before')}</option>
            <option value="10">10 {t('settings.before')}</option>
            <option value="15">15 {t('settings.before')}</option>
            <option value="30">30 {t('settings.before')}</option>
          </select>
        </div>
      </div>
      
      <div className="settings-section">
        <h2>{t('settings.appearance')}</h2>
        
        <div className="setting-item">
          <label htmlFor="dark-mode">{t('settings.dark.mode')}</label>
          <div className="toggle-switch">
            <input 
              type="checkbox" 
              id="dark-mode" 
              checked={darkModeEnabled}
              onChange={() => setDarkModeEnabled(!darkModeEnabled)}
            />
            <span className="slider"></span>
          </div>
        </div>
        
        <div className="setting-item">
          <LanguageSelector />
        </div>
      </div>
      
      <div className="settings-section">
        <h2>{t('settings.about')}</h2>
        
        <div className="about-item">
          <p>{t('settings.version')}: 1.0.0</p>
          <p>{t('app.name')}</p>
        </div>
      </div>
      
      <button 
        className="save-button" 
        onClick={handleSaveSettings}
        disabled={isSaving}
      >
        {isSaving ? 'Saving...' : t('settings.save')}
      </button>
    </div>
  );
};

export default Settings;
