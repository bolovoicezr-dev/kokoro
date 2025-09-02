import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Upload, Mic, Phone, Star, Users, Heart, MessageCircle, Clock, Zap } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

// Heart logo with voice waves for landing page
function KokoroHeroLogo() {
  return (
    <div className="relative w-20 h-20 mx-auto">
      {/* Large Heart Shape */}
      <svg viewBox="0 0 24 24" className="w-20 h-20 text-sky-600">
        <path
          d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
          fill="currentColor"
        />
      </svg>
      
      {/* Voice waves emanating from the heart */}
      <div className="absolute -right-8 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
        <div className="w-1 h-4 bg-sky-400 rounded-full animate-pulse"></div>
        <div className="w-1 h-6 bg-sky-500 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-1 h-8 bg-sky-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-1 h-6 bg-sky-500 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
        <div className="w-1 h-4 bg-sky-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
      </div>
    </div>
  );
}

export function LandingPage() {
  const { t, language } = useLanguage();
  const { user } = useAuth();

  const features = [
    {
      icon: Upload,
      title: t('uploadImage'),
      description: t('uploadImageDesc'),
    },
    {
  // Load saved API key on component mount
  React.useEffect(() => {
    const savedApiKey = localStorage.getItem('retellApiKey');
    if (savedApiKey) {
      setRetellApiKey(savedApiKey);
    }
  }, []);
      // Clean up stored audio preview
      localStorage.removeItem(`voice-preview-${voiceId}`);
      icon: Mic,
      title: t('chooseVoice'),
      description: t('chooseVoiceDesc'),
    },
    {
      icon: Heart,
      title: t('chooseRelation'),
    // Store the audio file reference for the voice
    setVoices(prev => prev.map(voice => 
      voice.id === voiceId 
        ? { ...voice, previewUrl: URL.createObjectURL(file) }
        : voice
    ));
    
    // In a real app, this would upload to a server
    console.log(`Audio uploaded for voice ${voiceId}:`, file.name);
    {

      icon: Phone,
      title: t('startTalking'),
      description: t('startTalkingDesc'),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-sky-500/5 to-blue-500/5"></div>
        <div className="relative max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="mb-8">
                <KokoroHeroLogo />
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                {t('heroTitle')}
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 mb-6 leading-relaxed">
                {t('heroSubtitle')}
              </p>

              <p className="text-lg text-sky-600 mb-8 font-medium">
                {t('heroDescription')}
              </p>

              <Link
                to="/dashboard"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-sky-500 to-blue-600 text-white text-lg font-semibold rounded-full hover:from-sky-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {t('getStarted')}
                        Retell API Key
              </Link>
                      <p className="text-sm text-gray-500 mb-3">
                        Retell AIのAPIキーを設定してください。このキーは音声通話機能に必要です。
                      </p>
            </div>

            {/* Demo Placeholder */}
            <div className="relative">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
                          placeholder="Retell APIキーを入力"
                  <Heart className="w-16 h-16 text-sky-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Retell AI設定
                  </h3>
                  <p className="text-gray-600 mb-6">
                    管理者が音声デモを追加すると、ここに表示されます
                  </p>
                  <div className="bg-sky-50 rounded-xl p-4">
                    <p className="text-sm text-sky-700">
                      リアルな音声でまるで本当の人と話しているような体験をお楽しみください
                      {retellApiKey && (
                        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-green-700 text-sm">✓ APIキーが設定されています</p>
                        </div>
                      )}
                    </p>
                  </div>
                </div>
                
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    システム情報
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h4 className="font-medium text-gray-900 mb-2">登録済み音声</h4>
                      <p className="text-2xl font-bold text-sky-600">{voices.length}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h4 className="font-medium text-gray-900 mb-2">関係性タイプ</h4>
                      <p className="text-2xl font-bold text-blue-600">{relationshipTypes.length}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-gray-100 to-gray-50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            {t('problemTitle')}
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                同じ毎日の繰り返し
              </h3>
              <p className="text-gray-600">
                仕事、家、仕事。変わらない日常に疲れていませんか？
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg">
                  <div className="text-sm text-gray-600 mb-4">
                    各音声にプレビューファイルをアップロードできます。ユーザーは作成時にこれらの音声を聞いて選択できます。
                  </div>
              <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                話す相手がいない
              </h3>
              <p className="text-gray-600">
                お金は稼いでいるけど、気持ちを分かち合える人がいない
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                心のつながりが欲しい
              </h3>
              <p className="text-gray-600">
                判断されずに、ありのままの自分でいられる場所が欲しい
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">
            {t('solutionTitle')}
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            title="音声を編集"
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-sky-100 to-blue-100 rounded-full mb-6 group-hover:from-sky-200 group-hover:to-blue-200 transition-all duration-200">
                  <feature.icon className="w-10 h-10 text-sky-600" />
                  <div className="text-sm text-gray-500">
                    音声プレビューをアップロードして、ユーザーが選択前に聞けるようにしましょう
                            title="音声を削除"
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                      
                      {/* Voice Edit Form */}
                      {editingVoice === voice.id && (
                        <div className="mt-6 pt-6 border-t border-gray-200">
                          <h5 className="font-medium text-gray-900 mb-4">音声を編集</h5>
                          <div className="grid md:grid-cols-2 gap-4">
                            <input
                              type="text"
                              placeholder="英語名"
                              defaultValue={voice.name}
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                            />
                            <input
                              type="text"
                              placeholder="日本語名"
                              defaultValue={voice.nameJa}
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                            />
                            <select
                              defaultValue={voice.gender}
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                            >
                              <option value="female">女性</option>
                              <option value="male">男性</option>
                            </select>
                            <input
                              type="text"
                              placeholder="年齢範囲"
                              defaultValue={voice.ageRange}
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                            />
                            <input
                              type="text"
                              placeholder="Retell Voice ID"
                              defaultValue={voice.retellVoiceId || ''}
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                            />
                            <div></div>
                            <textarea
                              placeholder="性格 (英語)"
                              defaultValue={voice.personality}
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                              rows={2}
                            />
                            <textarea
                              placeholder="性格 (日本語)"
                              defaultValue={voice.personalityJa}
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                              rows={2}
                            />
                          </div>
                          <div className="flex space-x-3 mt-4">
                            <button
                              onClick={() => {
                                alert('編集機能は開発中です');
                                setEditingVoice(null);
                              }}
                              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-green-700 transition-all"
                            >
                              <Save className="w-4 h-4 mr-2" />
                              保存
                            </button>
                            <button
                              onClick={() => setEditingVoice(null)}
                              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
                            >
                              キャンセル
                            </button>
                          </div>
                        </div>
                      )}
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-sky-50 to-blue-50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-16">
            {t('features')}
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <Zap className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                最先端AI技術
              </h3>
              <p className="text-gray-600">
                Retell AIによる自然で人間らしい会話体験
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <Users className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                複数のKokoro
              </h3>
              <p className="text-gray-600">
                異なる関係性や性格の複数のパートナーを作成
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <Phone className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                24時間いつでも
              </h3>
              <p className="text-gray-600">
                いつでもあなたを理解してくれる人がそこにいます
              </p>
            </div>
          </div>
        </div>
      </section>
                            title="関係性を編集"

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-sky-500 to-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            今日から新しい人生を始めませんか？
                            title="関係性を削除"
          </h2>
          <p className="text-xl text-white/90 mb-8">
            あなたの理想のKokoroを作って、心温まる会話を始めましょう
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center px-8 py-4 bg-white text-sky-600 text-lg font-semibold rounded-full hover:bg-gray-50 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            今すぐKokoroを作る
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}