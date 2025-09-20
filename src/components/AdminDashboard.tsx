import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Settings, 
  Users, 
  Phone, 
  Mic, 
  Plus, 
  Trash2, 
  Edit, 
  Save,
  X,
  Key,
  Activity,
  Heart,
  Volume2,
  Play,
  Pause
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { VoicePreview } from './VoicePreview';

interface Voice {
  id: string;
  name: string;
  nameJa: string;
  gender: 'male' | 'female';
  ageRange: string;
  personality: string;
  personalityJa: string;
}

interface RelationshipType {
  id: string;
  label: string;
  labelEn: string;
}

interface Characteristic {
  id: string;
  label: string;
  labelEn: string;
}

interface CallLog {
  id: string;
  userId: string;
  userName: string;
  partnerId: string;
  partnerName: string;
  agentId: string;
  duration: number;
  minutesUsed: number;
  timestamp: Date;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  
  // State management
  const [activeTab, setActiveTab] = useState('overview');
  const [voices, setVoices] = useState<Voice[]>([]);
  const [relationships, setRelationships] = useState<RelationshipType[]>([]);
  const [characteristics, setCharacteristics] = useState<Characteristic[]>([]);
  const [callLogs, setCallLogs] = useState<CallLog[]>([]);
  const [createdPartners, setCreatedPartners] = useState<any[]>([]);
  const [demoVoices, setDemoVoices] = useState<any[]>([]);
  
  // Audio preview state
  const [currentPlayingVoice, setCurrentPlayingVoice] = useState<string | null>(null);
  
  // Form states
  const [editingVoice, setEditingVoice] = useState<Voice | null>(null);
  const [editingRelationship, setEditingRelationship] = useState<RelationshipType | null>(null);
  const [editingCharacteristic, setEditingCharacteristic] = useState<Characteristic | null>(null);
  const [apiKey, setApiKey] = useState('');

  // Load data on component mount
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = () => {
    // Load voices
    const storedVoices = localStorage.getItem('adminVoices');
    if (storedVoices) {
      setVoices(JSON.parse(storedVoices));
    }

    // Load relationships
    const storedRelationships = localStorage.getItem('adminRelationships');
    if (storedRelationships) {
      setRelationships(JSON.parse(storedRelationships));
    }

    // Load characteristics
    const storedCharacteristics = localStorage.getItem('adminCharacteristics');
    if (storedCharacteristics) {
      setCharacteristics(JSON.parse(storedCharacteristics));
    }

    // Load call logs
    const storedLogs = localStorage.getItem('callLogs');
    if (storedLogs) {
      setCallLogs(JSON.parse(storedLogs));
    }

    // Load created partners
    const storedPartners = localStorage.getItem('createdPartners');
    if (storedPartners) {
      setCreatedPartners(JSON.parse(storedPartners));
    }

    // Load demo voices
    const storedDemoVoices = localStorage.getItem('demoVoices');
    if (storedDemoVoices) {
      setDemoVoices(JSON.parse(storedDemoVoices));
    }

    // Load API key
    const storedApiKey = localStorage.getItem('retellApiKey');
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
  };

  // Voice management
  const addVoice = () => {
    const newVoice: Voice = {
      id: `voice_${Date.now()}`,
      name: 'New Voice',
      nameJa: '新しい音声',
      gender: 'female',
      ageRange: '20-25',
      personality: 'Friendly',
      personalityJa: 'フレンドリー'
    };
    const updatedVoices = [...voices, newVoice];
    setVoices(updatedVoices);
    localStorage.setItem('adminVoices', JSON.stringify(updatedVoices));
    setEditingVoice(newVoice);
  };

  const updateVoice = (updatedVoice: Voice) => {
    const updatedVoices = voices.map(v => v.id === updatedVoice.id ? updatedVoice : v);
    setVoices(updatedVoices);
    localStorage.setItem('adminVoices', JSON.stringify(updatedVoices));
    setEditingVoice(null);
  };

  const deleteVoice = (voiceId: string) => {
    if (confirm('この音声を削除しますか？')) {
      const updatedVoices = voices.filter(v => v.id !== voiceId);
      setVoices(updatedVoices);
      localStorage.setItem('adminVoices', JSON.stringify(updatedVoices));
    }
  };

  // Relationship management
  const addRelationship = () => {
    const newRelationship: RelationshipType = {
      id: `rel_${Date.now()}`,
      label: '新しい関係',
      labelEn: 'New Relationship'
    };
    const updatedRelationships = [...relationships, newRelationship];
    setRelationships(updatedRelationships);
    localStorage.setItem('adminRelationships', JSON.stringify(updatedRelationships));
    setEditingRelationship(newRelationship);
  };

  const updateRelationship = (updatedRelationship: RelationshipType) => {
    const updatedRelationships = relationships.map(r => 
      r.id === updatedRelationship.id ? updatedRelationship : r
    );
    setRelationships(updatedRelationships);
    localStorage.setItem('adminRelationships', JSON.stringify(updatedRelationships));
    setEditingRelationship(null);
  };

  const deleteRelationship = (relationshipId: string) => {
    if (confirm('この関係性を削除しますか？')) {
      const updatedRelationships = relationships.filter(r => r.id !== relationshipId);
      setRelationships(updatedRelationships);
      localStorage.setItem('adminRelationships', JSON.stringify(updatedRelationships));
    }
  };

  // Characteristic management
  const addCharacteristic = () => {
    const newCharacteristic: Characteristic = {
      id: `char_${Date.now()}`,
      label: '新しい特徴',
      labelEn: 'New Characteristic'
    };
    const updatedCharacteristics = [...characteristics, newCharacteristic];
    setCharacteristics(updatedCharacteristics);
    localStorage.setItem('adminCharacteristics', JSON.stringify(updatedCharacteristics));
    setEditingCharacteristic(newCharacteristic);
  };

  const updateCharacteristic = (updatedCharacteristic: Characteristic) => {
    const updatedCharacteristics = characteristics.map(c => 
      c.id === updatedCharacteristic.id ? updatedCharacteristic : c
    );
    setCharacteristics(updatedCharacteristics);
    localStorage.setItem('adminCharacteristics', JSON.stringify(updatedCharacteristics));
    setEditingCharacteristic(null);
  };

  const deleteCharacteristic = (characteristicId: string) => {
    if (confirm('この特徴を削除しますか？')) {
      const updatedCharacteristics = characteristics.filter(c => c.id !== characteristicId);
      setCharacteristics(updatedCharacteristics);
      localStorage.setItem('adminCharacteristics', JSON.stringify(updatedCharacteristics));
    }
  };

  // API Key management
  const saveApiKey = () => {
    localStorage.setItem('retellApiKey', apiKey);
    alert(language === 'ja' ? 'APIキーが正常に保存されました！' : 'API key saved successfully!');
  };

  // Demo voice management
  const toggleDemoVoice = (voiceId: string) => {
    const voice = voices.find(v => v.id === voiceId);
    if (!voice) return;

    const existingDemo = demoVoices.find(d => d.id === voiceId);
    let updatedDemoVoices;

    if (existingDemo) {
      // Remove from demo
      updatedDemoVoices = demoVoices.filter(d => d.id !== voiceId);
    } else {
      // Add to demo
      updatedDemoVoices = [...demoVoices, { ...voice, isSelected: true }];
    }

    setDemoVoices(updatedDemoVoices);
    localStorage.setItem('demoVoices', JSON.stringify(updatedDemoVoices));
  };

  // Voice file upload and preview functions
  const handleVoiceFileUpload = (voiceId: string, file: File | undefined) => {
    if (file && file.type.startsWith('audio/')) {
      const url = URL.createObjectURL(file);
      localStorage.setItem(`voice-preview-${voiceId}`, url);
      
      // Also store the file data for persistence
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          localStorage.setItem(`voice-file-${voiceId}`, reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const getVoicePreviewUrl = (voiceId: string) => {
    return localStorage.getItem(`voice-preview-${voiceId}`) || localStorage.getItem(`voice-file-${voiceId}`);
  };

  const toggleVoicePreview = (voiceId: string) => {
    const audio = document.getElementById(`voice-preview-${voiceId}`) as HTMLAudioElement;
    if (!audio) return;

    if (currentPlayingVoice === voiceId) {
      audio.pause();
      setCurrentPlayingVoice(null);
    } else {
      // Pause any currently playing audio
      if (currentPlayingVoice) {
        const currentAudio = document.getElementById(`voice-preview-${currentPlayingVoice}`) as HTMLAudioElement;
        if (currentAudio) currentAudio.pause();
      }
      audio.play();
      setCurrentPlayingVoice(voiceId);
    }
  };
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {language === 'ja' ? 'アクセス拒否' : 'Access Denied'}
          </h2>
          <p className="text-gray-600 mb-6">
            {language === 'ja' ? '管理者権限が必要です' : 'Administrator privileges required'}
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-full"
          >
            {language === 'ja' ? 'ダッシュボードに戻る' : 'Back to Dashboard'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {language === 'ja' ? '管理パネル' : 'Admin Panel'}
          </h1>
          <p className="text-gray-600">
            {language === 'ja' ? 'システム設定と管理' : 'System Configuration and Management'}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-lg mb-8">
          <div className="flex border-b border-gray-200">
            {[
              { id: 'overview', label: language === 'ja' ? '概要' : 'Overview', icon: Activity },
              { id: 'voices', label: language === 'ja' ? '音声管理' : 'Voice Management', icon: Mic },
              { id: 'relationships', label: language === 'ja' ? '関係性管理' : 'Relationship Management', icon: Heart },
              { id: 'characteristics', label: language === 'ja' ? '特徴管理' : 'Characteristic Management', icon: Users },
              { id: 'settings', label: language === 'ja' ? '設定' : 'Settings', icon: Settings },
              { id: 'logs', label: language === 'ja' ? '通話ログ' : 'Call Logs', icon: Phone }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center px-6 py-4 font-medium transition-colors ${
                  activeTab === id
                    ? 'text-sky-600 border-b-2 border-sky-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {language === 'ja' ? 'システム概要' : 'System Overview'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-sky-50 p-6 rounded-xl">
                  <div className="flex items-center">
                    <Mic className="w-8 h-8 text-sky-600" />
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">
                        {language === 'ja' ? '音声数' : 'Voices'}
                      </p>
                      <p className="text-2xl font-bold text-gray-900">{voices.length}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 p-6 rounded-xl">
                  <div className="flex items-center">
                    <Heart className="w-8 h-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">
                        {language === 'ja' ? '関係性' : 'Relationships'}
                      </p>
                      <p className="text-2xl font-bold text-gray-900">{relationships.length}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-purple-50 p-6 rounded-xl">
                  <div className="flex items-center">
                    <Users className="w-8 h-8 text-purple-600" />
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">
                        {language === 'ja' ? '作成されたKokoro' : 'Created Kokoro'}
                      </p>
                      <p className="text-2xl font-bold text-gray-900">{createdPartners.length}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-orange-50 p-6 rounded-xl">
                  <div className="flex items-center">
                    <Phone className="w-8 h-8 text-orange-600" />
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">
                        {language === 'ja' ? '総通話数' : 'Total Calls'}
                      </p>
                      <p className="text-2xl font-bold text-gray-900">{callLogs.length}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'voices' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {language === 'ja' ? '音声管理' : 'Voice Management'}
                </h2>
                <button
                  onClick={addVoice}
                  className="flex items-center px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {language === 'ja' ? '音声追加' : 'Add Voice'}
                </button>
              </div>

              <div className="space-y-4">
                {voices.map((voice) => (
                  <div key={voice.id} className="border border-gray-200 rounded-lg p-4">
                    {editingVoice?.id === voice.id ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <input
                            type="text"
                            value={editingVoice.name}
                            onChange={(e) => setEditingVoice({ ...editingVoice, name: e.target.value })}
                            placeholder={language === 'ja' ? '英語名' : 'English Name'}
                            className="px-3 py-2 border border-gray-300 rounded-lg"
                          />
                          <input
                            type="text"
                            value={editingVoice.nameJa}
                            onChange={(e) => setEditingVoice({ ...editingVoice, nameJa: e.target.value })}
                            placeholder={language === 'ja' ? '日本語名' : 'Japanese Name'}
                            className="px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <select
                            value={editingVoice.gender}
                            onChange={(e) => setEditingVoice({ ...editingVoice, gender: e.target.value as 'male' | 'female' })}
                            className="px-3 py-2 border border-gray-300 rounded-lg"
                          >
                            <option value="female">{language === 'ja' ? '女性' : 'Female'}</option>
                            <option value="male">{language === 'ja' ? '男性' : 'Male'}</option>
                          </select>
                          <input
                            type="text"
                            value={editingVoice.ageRange}
                            onChange={(e) => setEditingVoice({ ...editingVoice, ageRange: e.target.value })}
                            placeholder={language === 'ja' ? '年齢範囲' : 'Age Range'}
                            className="px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <input
                            type="text"
                            value={editingVoice.personality}
                            onChange={(e) => setEditingVoice({ ...editingVoice, personality: e.target.value })}
                            placeholder={language === 'ja' ? '性格（英語）' : 'Personality (English)'}
                            className="px-3 py-2 border border-gray-300 rounded-lg"
                          />
                          <input
                            type="text"
                            value={editingVoice.personalityJa}
                            onChange={(e) => setEditingVoice({ ...editingVoice, personalityJa: e.target.value })}
                            placeholder={language === 'ja' ? '性格（日本語）' : 'Personality (Japanese)'}
                            className="px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                        
                        {/* Voice File Upload Section */}
                        <div className="border-t pt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {language === 'ja' ? '音声ファイル' : 'Voice File'}
                          </label>
                          <div className="space-y-3">
                            <input
                              type="file"
                              accept="audio/*"
                              onChange={(e) => handleVoiceFileUpload(editingVoice.id, e.target.files?.[0])}
                              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"
                            />
                            {getVoicePreviewUrl(editingVoice.id) && (
                              <div className="flex items-center space-x-3 p-3 bg-sky-50 rounded-lg">
                                <button
                                  type="button"
                                  onClick={() => toggleVoicePreview(editingVoice.id)}
                                  className="flex items-center space-x-2 px-3 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors"
                                >
                                  {currentPlayingVoice === editingVoice.id ? (
                                    <>
                                      <Pause className="w-4 h-4" />
                                      <span>
                                        {language === 'ja' ? '停止' : 'Stop'}
                                      </span>
                                    </>
                                  ) : (
                                    <>
                                      <Play className="w-4 h-4" />
                                      <span>
                                        {language === 'ja' ? '再生' : 'Play'}
                                      </span>
                                    </>
                                  )}
                                </button>
                                <span className="text-sm text-sky-700">
                                  {language === 'ja' ? '音声プレビュー準備完了' : 'Voice preview ready'}
                                </span>
                                <audio
                                  id={`voice-preview-${editingVoice.id}`}
                                  src={getVoicePreviewUrl(editingVoice.id)}
                                  onEnded={() => setCurrentPlayingVoice(null)}
                                  onPause={() => setCurrentPlayingVoice(null)}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <button
                            onClick={() => updateVoice(editingVoice)}
                            className="flex items-center px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
                          >
                            <Save className="w-4 h-4 mr-1" />
                            {language === 'ja' ? '保存' : 'Save'}
                          </button>
                          <button
                            onClick={() => setEditingVoice(null)}
                            className="flex items-center px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg"
                          >
                            <X className="w-4 h-4 mr-1" />
                            {language === 'ja' ? 'キャンセル' : 'Cancel'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                          <div>
                            <h3 className="font-semibold text-gray-900">{voice.nameJa} ({voice.name})</h3>
                            <p className="text-sm text-gray-600">
                              {voice.personalityJa} • {voice.ageRange}歳 • {voice.gender === 'female' ? '女性' : '男性'}
                            </p>
                          </div>
                          <VoicePreview voiceId={voice.id} voiceName={voice.nameJa} />
                        </div>
                        <div className="flex items-center space-x-2">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={demoVoices.some(d => d.id === voice.id)}
                              onChange={() => toggleDemoVoice(voice.id)}
                              className="mr-2"
                            />
                            <span className="text-sm">
                              {language === 'ja' ? 'デモ表示' : 'Demo Display'}
                            </span>
                          </label>
                          <button
                            onClick={() => setEditingVoice(voice)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteVoice(voice.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'relationships' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {language === 'ja' ? '関係性管理' : 'Relationship Management'}
                </h2>
                <button
                  onClick={addRelationship}
                  className="flex items-center px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {language === 'ja' ? '関係性追加' : 'Add Relationship'}
                </button>
              </div>

              <div className="space-y-4">
                {relationships.map((relationship) => (
                  <div key={relationship.id} className="border border-gray-200 rounded-lg p-4">
                    {editingRelationship?.id === relationship.id ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <input
                            type="text"
                            value={editingRelationship.label}
                            onChange={(e) => setEditingRelationship({ ...editingRelationship, label: e.target.value })}
                            placeholder={language === 'ja' ? '日本語' : 'Japanese'}
                            className="px-3 py-2 border border-gray-300 rounded-lg"
                          />
                          <input
                            type="text"
                            value={editingRelationship.labelEn}
                            onChange={(e) => setEditingRelationship({ ...editingRelationship, labelEn: e.target.value })}
                            placeholder={language === 'ja' ? '英語' : 'English'}
                            className="px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => updateRelationship(editingRelationship)}
                            className="flex items-center px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
                          >
                            <Save className="w-4 h-4 mr-1" />
                            {language === 'ja' ? '保存' : 'Save'}
                          </button>
                          <button
                            onClick={() => setEditingRelationship(null)}
                            className="flex items-center px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg"
                          >
                            <X className="w-4 h-4 mr-1" />
                            {language === 'ja' ? 'キャンセル' : 'Cancel'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold text-gray-900">{relationship.label}</h3>
                          <p className="text-sm text-gray-600">{relationship.labelEn}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setEditingRelationship(relationship)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteRelationship(relationship.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'characteristics' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {language === 'ja' ? '特徴管理' : 'Characteristic Management'}
                </h2>
                <button
                  onClick={addCharacteristic}
                  className="flex items-center px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {language === 'ja' ? '特徴追加' : 'Add Characteristic'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {characteristics.map((characteristic) => (
                  <div key={characteristic.id} className="border border-gray-200 rounded-lg p-4">
                    {editingCharacteristic?.id === characteristic.id ? (
                      <div className="space-y-4">
                        <input
                          type="text"
                          value={editingCharacteristic.label}
                          onChange={(e) => setEditingCharacteristic({ ...editingCharacteristic, label: e.target.value })}
                          placeholder={language === 'ja' ? '日本語' : 'Japanese'}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                        <input
                          type="text"
                          value={editingCharacteristic.labelEn}
                          onChange={(e) => setEditingCharacteristic({ ...editingCharacteristic, labelEn: e.target.value })}
                          placeholder={language === 'ja' ? '英語' : 'English'}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                        <div className="flex space-x-2">
                          <button
                            onClick={() => updateCharacteristic(editingCharacteristic)}
                            className="flex items-center px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
                          >
                            <Save className="w-4 h-4 mr-1" />
                            {language === 'ja' ? '保存' : 'Save'}
                          </button>
                          <button
                            onClick={() => setEditingCharacteristic(null)}
                            className="flex items-center px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg"
                          >
                            <X className="w-4 h-4 mr-1" />
                            {language === 'ja' ? 'キャンセル' : 'Cancel'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold text-gray-900">{characteristic.label}</h3>
                          <p className="text-sm text-gray-600">{characteristic.labelEn}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setEditingCharacteristic(characteristic)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteCharacteristic(characteristic.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {language === 'ja' ? 'システム設定' : 'System Settings'}
              </h2>
              
              <div className="space-y-6">
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Key className="w-5 h-5 mr-2" />
                    {language === 'ja' ? 'AI音声API設定' : 'AI Voice API Settings'}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ja' ? 'APIキー' : 'API Key'}
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="password"
                          value={apiKey}
                          onChange={(e) => setApiKey(e.target.value)}
                          placeholder={language === 'ja' ? 'AI音声APIキー' : 'AI Voice API Key'}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                        />
                        <button
                          onClick={saveApiKey}
                          className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg"
                        >
                          {language === 'ja' ? '保存' : 'Save'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {language === 'ja' ? '通話ログ' : 'Call Logs'}
              </h2>
              
              {callLogs.length === 0 ? (
                <div className="text-center py-12">
                  <Phone className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    {language === 'ja' ? 'まだ通話ログがありません' : 'No call logs yet'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {callLogs.map((log) => (
                    <div key={log.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {log.userName} → {log.partnerName}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {language === 'ja' ? '通話時間' : 'Call Duration'}: {Math.floor(log.duration / 60)}{language === 'ja' ? '分' : 'min'}{log.duration % 60}{language === 'ja' ? '秒' : 's'}
                          </p>
                          <p className="text-sm text-gray-600">
                            {language === 'ja' ? '使用分数' : 'Minutes Used'}: {log.minutesUsed}{language === 'ja' ? '分' : ' min'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">
                            {new Date(log.timestamp).toLocaleString('ja-JP')}
                          </p>
                          <p className="text-xs text-gray-400">
                            {language === 'ja' ? 'エージェントID' : 'Agent ID'}: {log.agentId}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}