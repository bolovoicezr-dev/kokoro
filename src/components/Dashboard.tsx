import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Clock, MessageCircle, Heart } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { getRelationshipTypes } from '../data/voices';

export function Dashboard() {
  const { t, language } = useLanguage();
  const relationshipTypes = getRelationshipTypes();

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(language === 'ja' ? 'ja-JP' : 'en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getRelationshipLabel = (relationshipType: string) => {
    const relation = relationshipTypes.find(r => r.id === relationshipType);
    return relation ? (language === 'ja' ? relation.label : relation.labelEn) : relationshipType;
  };

  // Load created partners from localStorage
  const partners = JSON.parse(localStorage.getItem('createdPartners') || '[]');

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('myPartners')}</h1>
            {user && user.role !== 'admin' && (
              <p className="text-sm text-gray-600 mt-1">
                残り通話時間: {user.minutesRemaining}分
              </p>
            )}
          </div>
          <Link
            to="/create"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold rounded-full hover:from-sky-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5 mr-2" />
            {t('createNew')}
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {partners.map((partner) => (
            <div
              key={partner.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              <div className="relative">
                <img
                  src={partner.imageUrl}
                  alt={partner.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{partner.name}</h3>
                  <span className="text-sm text-gray-500">
                    {partner.voice?.gender === 'female' ? '♀' : '♂'}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {language === 'ja' ? partner.characteristicsJa : partner.characteristics}
                </p>
                
                <div className="flex items-center text-xs text-gray-500 mb-4">
                  <Clock className="w-3 h-3 mr-1" />
                  <span>
                    {t('lastTalked')}: {partner.lastTalkedAt ? formatDate(partner.lastTalkedAt) : t('never')}
                  </span>
                </div>
                
                <div className="flex items-center text-xs text-sky-600 mb-4">
                  <Heart className="w-3 h-3 mr-1" />
                  <span>{t('relationshipType')}: {getRelationshipLabel(partner.relationshipType)}</span>
                </div>

                <Link
                  to={`/call/${partner.id}`}
                  className="w-full inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold rounded-full hover:from-sky-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  通話開始
                </Link>
              </div>
            </div>
          ))}
        </div>

        {partners.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
              <MessageCircle className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              まだ話し相手がいません
            </h3>
            <p className="text-gray-600 mb-8">
              最初の話し相手を作成して、新しいつながりを始めましょう
            </p>
            <Link
              to="/create"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold rounded-full hover:from-sky-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5 mr-2" />
              {t('createNew')}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}