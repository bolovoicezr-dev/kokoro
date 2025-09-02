import React, { useState } from 'react';
import { Settings, Plus, Edit, Trash2, Play, Save, Mic, Volume2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { voices as initialVoices, relationshipTypes as initialRelationshipTypes } from '../data/voices';

export function AdminDashboard() {
  const { t, language } = useLanguage();
  const [retellApiKey, setRetellApiKey] = useState('');
  const [activeTab, setActiveTab] = useState<'settings' | 'voices' | 'relationships'>('settings');
  const [editingVoice, setEditingVoice] = useState<string | null>(null);
  const [voices, setVoices] = useState(initialVoices);
  const [relationshipTypes, setRelationshipTypes] = useState(initialRelationshipTypes);
  const [newVoice, setNewVoice] = useState({
    name: '',
    nameJa: '',
    gender: 'female' as 'male' | 'female',
    ageRange: '',
    personality: '',
    personalityJa: '',
    retellVoiceId: '',
  });
  const [newRelationship, setNewRelationship] = useState({
    id: '',
    label: '',
    labelEn: '',
  });

  const saveApiKey = () => {
    localStorage.setItem('retellApiKey', retellApiKey);
    alert('APIキーが正常に保存されました');
  };

  const tabs = [
    { id: 'settings', label: 'AI設定', icon: Settings },
    { id: 'voices', label: '音声管理', icon: Volume2 },
    { id: 'relationships', label: '関係性管理', icon: Mic },
  ];

  const addNewVoice = () => {
    if (!newVoice.name || !newVoice.nameJa || !newVoice.personality || !newVoice.personalityJa) {
      alert('すべてのフィールドを入力してください');
      return;
    }

    const voiceId = `${newVoice.name.toLowerCase()}-${Date.now()}`;
    const voice = {
      id: voiceId,
      ...newVoice,
    };

    setVoices(prev => [...prev, voice]);
    setNewVoice({
      name: '',
      nameJa: '',
      gender: 'female',
      ageRange: '',
      personality: '',
      personalityJa: '',
      retellVoiceId: '',
    });
    alert('新しい音声が追加されました');
  };

  const deleteVoice = (voiceId: string) => {
    if (confirm('この音声を削除しますか？')) {
      setVoices(prev => prev.filter(v => v.id !== voiceId));
    }
  };

  const addNewRelationship = () => {
    if (!newRelationship.id || !newRelationship.label || !newRelationship.labelEn) {
      alert('すべてのフィールドを入力してください');
      return;
    }

    setRelationshipTypes(prev => [...prev, newRelationship]);
    setNewRelationship({
      id: '',
      label: '',
      labelEn: '',
    });
    alert('新しい関係性が追加されました');
  };

  const deleteRelationship = (relationId: string) => {
    if (confirm('この関係性を削除しますか？')) {
      setRelationshipTypes(prev => prev.filter(r => r.id !== relationId));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Kokoro Companion 管理ダッシュボード</h1>
          <p className="text-gray-600">音声、関係性、システム設定を管理</p>
        </div>

        {/* Tabs */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-sky-500 text-sky-600 bg-sky-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-8">
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    AI設定
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        API Key
                      </label>
                      <div className="flex space-x-4">
                        <input
                          type="password"
                          value={retellApiKey}
                          onChange={(e) => setRetellApiKey(e.target.value)}
                          placeholder="AI APIキーを入力"
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                        />
                        <button
                          onClick={saveApiKey}
                          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold rounded-xl hover:from-sky-600 hover:to-blue-700 transition-all"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          保存
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'voices' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">
                    音声管理
                  </h3>
                </div>

                {/* Add New Voice Form */}
                <div className="bg-sky-50 rounded-2xl p-6 mb-6">
                  <h4 className="font-semibold text-gray-900 mb-4">新しい音声を追加</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="英語名 (例: Yuki)"
                      value={newVoice.name}
                      onChange={(e) => setNewVoice({ ...newVoice, name: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="日本語名 (例: ユキ)"
                      value={newVoice.nameJa}
                      onChange={(e) => setNewVoice({ ...newVoice, nameJa: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    />
                    <select
                      value={newVoice.gender}
                      onChange={(e) => setNewVoice({ ...newVoice, gender: e.target.value as 'male' | 'female' })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    >
                      <option value="female">女性</option>
                      <option value="male">男性</option>
                    </select>
                    <input
                      type="text"
                      placeholder="年齢範囲 (例: 22-26)"
                      value={newVoice.ageRange}
                      onChange={(e) => setNewVoice({ ...newVoice, ageRange: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="Retell Voice ID (オプション)"
                      value={newVoice.retellVoiceId}
                      onChange={(e) => setNewVoice({ ...newVoice, retellVoiceId: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    />
                    <div></div>
                    <textarea
                      placeholder="性格 (英語)"
                      value={newVoice.personality}
                      onChange={(e) => setNewVoice({ ...newVoice, personality: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      rows={2}
                    />
                    <textarea
                      placeholder="性格 (日本語)"
                      value={newVoice.personalityJa}
                      onChange={(e) => setNewVoice({ ...newVoice, personalityJa: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      rows={2}
                    />
                  </div>
                  <button
                    onClick={addNewVoice}
                    className="mt-4 inline-flex items-center px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold rounded-lg hover:from-sky-600 hover:to-blue-700 transition-all"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    音声を追加
                  </button>
                </div>

                {/* Existing Voices */}
                <div className="space-y-4">
                  {voices.map((voice) => (
                    <div key={voice.id} className="bg-white rounded-2xl p-6 shadow-lg">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-2">
                            {voice.nameJa} ({voice.name})
                          </h4>
                          <p className="text-sm text-gray-600 mb-2">
                            {voice.personalityJa}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>{voice.gender === 'female' ? '女性' : '男性'}</span>
                            <span>{voice.ageRange}歳</span>
                            {voice.retellVoiceId && (
                              <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                                Voice ID: {voice.retellVoiceId}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => alert('音声プレビュー機能は開発中です')}
                            className="p-2 text-gray-600 hover:text-sky-600 transition-colors"
                          >
                            <Play className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => setEditingVoice(voice.id)}
                            className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => deleteVoice(voice.id)}
                            className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'relationships' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">
                    関係性タイプ管理
                  </h3>
                </div>

                {/* Add New Relationship Form */}
                <div className="bg-sky-50 rounded-2xl p-6 mb-6">
                  <h4 className="font-semibold text-gray-900 mb-4">新しい関係性を追加</h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      placeholder="ID (例: best-friend)"
                      value={newRelationship.id}
                      onChange={(e) => setNewRelationship({ ...newRelationship, id: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="日本語ラベル (例: 親友)"
                      value={newRelationship.label}
                      onChange={(e) => setNewRelationship({ ...newRelationship, label: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="英語ラベル (例: Best Friend)"
                      value={newRelationship.labelEn}
                      onChange={(e) => setNewRelationship({ ...newRelationship, labelEn: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    />
                  </div>
                  <button
                    onClick={addNewRelationship}
                    className="mt-4 inline-flex items-center px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold rounded-lg hover:from-sky-600 hover:to-blue-700 transition-all"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    関係性を追加
                  </button>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {relationshipTypes.map((relation) => (
                    <div key={relation.id} className="bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-shadow">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {relation.label}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {relation.labelEn}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            ID: {relation.id}
                          </p>
                        </div>
                        <div className="flex items-center space-x-1">
                          <button 
                            onClick={() => alert('編集機能は開発中です')}
                            className="p-1 text-gray-600 hover:text-blue-600 transition-colors"
                          >
                            <Edit className="w-3 h-3" />
                          </button>
                          <button 
                            onClick={() => deleteRelationship(relation.id)}
                            className="p-1 text-gray-600 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}