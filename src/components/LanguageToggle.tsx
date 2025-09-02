import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-full p-1">
      <Globe className="w-4 h-4 text-white/80 mr-2" />
      <button
        onClick={() => setLanguage('ja')}
        className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
          language === 'ja'
            ? 'bg-white text-sky-600 shadow-sm'
            : 'text-white/80 hover:text-white'
        }`}
      >
        日本語
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
          language === 'en'
            ? 'bg-white text-sky-600 shadow-sm'
            : 'text-white/80 hover:text-white'
        }`}
      >
        EN
      </button>
    </div>
  );
}