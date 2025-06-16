// Language Selector component for web
import React from 'react';
import { useTranslation, Language, LANGUAGES } from '@shared/i18n/i18nService';
import './LanguageSelector.css';

const LanguageSelector: React.FC = () => {
  const { language, changeLanguage, t } = useTranslation();
  
  return (
    <div className="language-selector">
      <label htmlFor="language-select">{t('settings.language')}:</label>
      <select 
        id="language-select"
        value={language}
        onChange={(e) => changeLanguage(e.target.value as Language)}
      >
        {LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.nativeName}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;
