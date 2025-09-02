import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Play, Pause, ArrowLeft, Heart } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useApi } from '../hooks/useApi';
import { voices, relationshipTypes } from '../data/voices';

const predefinedCharacteristics = [
  { id: 'gentle', label: '優しい', labelEn: 'Gentle' },
  { id: 'cheerful', label: '明るい', labelEn: 'Cheerful' },
  { id: 'calm', label: '落ち着いた', labelEn: 'Calm' },
  { id: 'supportive', label: '支援的', labelEn: 'Supportive' },
  { id: 'playful', label: '遊び心がある', labelEn: 'Playful' },
  { id: 'wise', label: '賢い', labelEn: 'Wise' },
  { id: 'caring', label: '思いやりがある', labelEn: 'Caring' },
  { id: 'funny', label: '面白い', labelEn: 'Funny' },
];

function KokoroHeartCreateLogo() {
  return (
    <svg className="w-8 h-8 text-white" viewBox="0 0 24 24">
      <path
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
        fill="currentColor"
      />
    </svg>
  );
}

export function CreatePartner() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { createPartner, loading, error } = useApi();
  
  const [formData, setFormData] = useState({
    name: '',
    characteristics: '',
    voiceId: '',
    relationshipType: '',
    image: null as File | null,
  });
  
  const [selectedCharacteristics, setSelectedCharacteristics] = useState<string[]>([]);
  const [customCharacteristics, setCustomCharacteristics] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const toggleCharacteristic = (charId: string) => {
    setSelectedCharacteristics(prev => 
      prev.includes(charId) 
        ? prev.filter(id => id !== charId)
        : [...prev, charId]
    );
  };

  const playVoicePreview = (voiceId: string) => {
    if (playingVoice === voiceId) {
      setPlayingVoice(null);
    } else {
      setPlayingVoice(voiceId);
      setTimeout(() => setPlayingVoice(null), 3000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.voiceId || !formData.relationshipType || !formData.image) {
      return;
    }

    const selectedChars = selectedCharacteristics.map(id => 
      predefinedCharacteristics.find(char => char.id === id)
    ).filter(Boolean);

    const characteristicsText = [
      ...selectedChars.map(char => language === 'ja' ? char!.label : char!.labelEn),
      customCharacteristics
    ].filter(Boolean).join(', ');

    const result = await createPartner({
      name: formData.name,
      image: formData.image,
      voiceId: formData.voiceId,
      relationshipType: formData.relationshipType,
      characteristics: characteristicsText,
      characteristicsJa: characteristicsText,
    });

    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            戻る
          </button>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-sky-400 to-blue-500 rounded-full mb-4">
              <KokoroHeartCreateLogo />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              {t('createPartner')}
            </h1>
            <p className="text-gray-600 mt-2">あなたの理想のKokoroを作りましょう</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                {t('partnerName')}
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={t('partnerNamePlaceholder')}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                {t('uploadPhoto')}
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                  required
                />
                <label
                  htmlFor="image-upload"
                  className="w-full h-40 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-sky-500 transition-colors bg-gradient-to-br from-sky-50 to-blue-50"
                >
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-gray-500">理想の人の写真をアップロード</span>
                    </>
                  )}
                </label>
              </div>
            </div>

            {/* Relationship Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                {t('selectRelationship')}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {relationshipTypes.map((relation) => (
                  <label
                    key={relation.id}
                    className={`relative flex items-center justify-center p-3 border rounded-xl cursor-pointer transition-all ${
                      formData.relationshipType === relation.id
                        ? 'border-sky-500 bg-sky-50 text-sky-700'
                        : 'border-gray-200 hover:border-sky-300 hover:bg-sky-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="relationshipType"
                      value={relation.id}
                      checked={formData.relationshipType === relation.id}
                      onChange={(e) => setFormData({ ...formData, relationshipType: e.target.value })}
                      className="sr-only"
                    />
                    <span className="text-sm font-medium">
                      {t(relation.id)}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Voice Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                {t('selectVoice')}
              </label>
              <div className="space-y-3">
                {voices.map((voice) => (
                  <label
                    key={voice.id}
                    className={`block p-4 border rounded-xl cursor-pointer transition-all ${
                      formData.voiceId === voice.id
                        ? 'border-sky-500 bg-sky-50'
                        : 'border-gray-200 hover:border-sky-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="voiceId"
                      value={voice.id}
                      checked={formData.voiceId === voice.id}
                      onChange={(e) => setFormData({ ...formData, voiceId: e.target.value })}
                      className="sr-only"
                    />
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {language === 'ja' ? voice.nameJa : voice.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {language === 'ja' ? voice.personalityJa : voice.personality}
                        </p>
                        <span className="text-xs text-gray-500">{voice.ageRange}歳 • {voice.gender === 'female' ? '女性' : '男性'}</span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          playVoicePreview(voice.id);
                        }}
                        className="p-2 bg-sky-100 hover:bg-sky-200 rounded-full transition-colors"
                      >
                        {playingVoice === voice.id ? (
                          <Pause className="w-4 h-4 text-sky-600" />
                        ) : (
                          <Play className="w-4 h-4 text-sky-600" />
                        )}
                      </button>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Characteristics Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                {t('characteristics')}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                {predefinedCharacteristics.map((char) => (
                  <label
                    key={char.id}
                    className={`relative flex items-center justify-center p-3 border rounded-xl cursor-pointer transition-all ${
                      selectedCharacteristics.includes(char.id)
                        ? 'border-sky-500 bg-sky-50 text-sky-700'
                        : 'border-gray-200 hover:border-sky-300 hover:bg-sky-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedCharacteristics.includes(char.id)}
                      onChange={() => toggleCharacteristic(char.id)}
                      className="sr-only"
                    />
                    <span className="text-sm font-medium">
                      {language === 'ja' ? char.label : char.labelEn}
                    </span>
                  </label>
                ))}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('customCharacteristics')}
                </label>
                <textarea
                  value={customCharacteristics}
                  onChange={(e) => setCustomCharacteristics(e.target.value)}
                  placeholder="その他の特徴があれば入力してください..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all resize-none"
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 text-white font-semibold rounded-full transition-all duration-200 ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 transform hover:scale-105 shadow-lg hover:shadow-xl'
              }`}
            >
              {loading ? '作成中...' : t('create')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}