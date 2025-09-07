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
  Volume2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
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
  const navigate = useNavigate();
  
  // State management
  const [activeTab, setActiveTab] = useState('overview');
  const [voices, setVoices] = useState<Voice[]>([]);
  const [relationships, setRelationships] = useState<RelationshipType[]>([]);
  const [characteristics, setCharacteristics] = useState<Characteristic[]>([]);
  const [callLogs, setCallLogs] = useState<CallLog[]>([]);
  const [createdPartners, setCreatedPartners] = useState<any[]>([]);
  const [demoVoices, setDemoVoices] = useState<any[]>([]);
  
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
    const storedApiKey = localStorage.getItem('elevenLabsApiKey');
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
    localStorage.setItem('elevenLabsApiKey', apiKey);
    alert('ElevenLabs API key saved successfully!');
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

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">アクセス拒否</h2>
          <p className="text-gray-600 mb-6">管理者権限が必要です</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-full"
          >
            ダッシュボードに戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">管理パネル</h1>
          <p className="text-gray-600">システム設定と管理</p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-lg mb-8">
          <div className="flex border-b border-gray-200">
            {[
              { id: 'overview', label: '概要', icon: Activity },
              { id: 'voices', label: '音声管理', icon: Mic },
              { id: 'relationships', label: '関係性管理', icon: Heart },
              { id: 'characteristics', label: '特徴管理', icon: Users },
              { id: 'settings', label: '設定', icon: Settings },
              { id: 'logs', label: '通話ログ', icon: Phone }
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
              <h2 className="text-2xl font-bold text-gray-900 mb-6">システム概要</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-sky-50 p-6 rounded-xl">
                  <div className="flex items-center">
                    <Mic className="w-8 h-8 text-sky-600" />
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">音声数</p>
                      <p className="text-2xl font-bold text-gray-900">{voices.length}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 p-6 rounded-xl">
                  <div className="flex items-center">
                    <Heart className="w-8 h-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">関係性</p>
                      <p className="text-2xl font-bold text-gray-900">{relationships.length}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-purple-50 p-6 rounded-xl">
                  <div className="flex items-center">
                    <Users className="w-8 h-8 text-purple-600" />
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">作成されたKokoro</p>
                      <p className="text-2xl font-bold text-gray-900">{createdPartners.length}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-orange-50 p-6 rounded-xl">
                  <div className="flex items-center">
                    <Phone className="w-8 h-8 text-orange-600" />
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">総通話数</p>
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
                <h2 className="text-2xl font-bold text-gray-900">音声管理</h2>
                <button
                  onClick={addVoice}
                  className="flex items-center px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  音声追加
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
                            placeholder="英語名"
                            className="px-3 py-2 border border-gray-300 rounded-lg"
                          />
                          <input
                            type="text"
                            value={editingVoice.nameJa}
                            onChange={(e) => setEditingVoice({ ...editingVoice, nameJa: e.target.value })}
                            placeholder="日本語名"
                            className="px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <select
                            value={editingVoice.gender}
                            onChange={(e) => setEditingVoice({ ...editingVoice, gender: e.target.value as 'male' | 'female' })}
                            className="px-3 py-2 border border-gray-300 rounded-lg"
                          >
                            <option value="female">女性</option>
                            <option value="male">男性</option>
                          </select>
                          <input
                            type="text"
                            value={editingVoice.ageRange}
                            onChange={(e) => setEditingVoice({ ...editingVoice, ageRange: e.target.value })}
                            placeholder="年齢範囲"
                            className="px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <input
                            type="text"
                            value={editingVoice.personality}
                            onChange={(e) => setEditingVoice({ ...editingVoice, personality: e.target.value })}
                            placeholder="性格（英語）"
                            className="px-3 py-2 border border-gray-300 rounded-lg"
                          />
                          <input
                            type="text"
                            value={editingVoice.personalityJa}
                            onChange={(e) => setEditingVoice({ ...editingVoice, personalityJa: e.target.value })}
                            placeholder="性格（日本語）"
                            className="px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => updateVoice(editingVoice)}
                            className="flex items-center px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
                          >
                            <Save className="w-4 h-4 mr-1" />
                            保存
                          </button>
                          <button
                            onClick={() => setEditingVoice(null)}
                            className="flex items-center px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg"
                          >
                            <X className="w-4 h-4 mr-1" />
                            キャンセル
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
                            <span className="text-sm">デモ表示</span>
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
                <h2 className="text-2xl font-bold text-gray-900">関係性管理</h2>
                <button
                  onClick={addRelationship}
                  className="flex items-center px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  関係性追加
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
                            placeholder="日本語"
                            className="px-3 py-2 border border-gray-300 rounded-lg"
                          />
                          <input
                            type="text"
                            value={editingRelationship.labelEn}
                            onChange={(e) => setEditingRelationship({ ...editingRelationship, labelEn: e.target.value })}
                            placeholder="英語"
                            className="px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => updateRelationship(editingRelationship)}
                            className="flex items-center px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
                          >
                            <Save className="w-4 h-4 mr-1" />
                            保存
                          </button>
                          <button
                            onClick={() => setEditingRelationship(null)}
                            className="flex items-center px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg"
                          >
                            <X className="w-4 h-4 mr-1" />
                            キャンセル
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
                <h2 className="text-2xl font-bold text-gray-900">特徴管理</h2>
                <button
                  onClick={addCharacteristic}
                  className="flex items-center px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  特徴追加
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
                          placeholder="日本語"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                        <input
                          type="text"
                          value={editingCharacteristic.labelEn}
                          onChange={(e) => setEditingCharacteristic({ ...editingCharacteristic, labelEn: e.target.value })}
                          placeholder="英語"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                        <div className="flex space-x-2">
                          <button
                            onClick={() => updateCharacteristic(editingCharacteristic)}
                            className="flex items-center px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
                          >
                            <Save className="w-4 h-4 mr-1" />
                            保存
                          </button>
                          <button
                            onClick={() => setEditingCharacteristic(null)}
                            className="flex items-center px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg"
                          >
                            <X className="w-4 h-4 mr-1" />
                            キャンセル
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
              <h2 className="text-2xl font-bold text-gray-900 mb-6">システム設定</h2>
              
              <div className="space-y-6">
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Key className="w-5 h-5 mr-2" />
                    ElevenLabs API設定
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        API Key
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="password"
                          value={apiKey}
                          onChange={(e) => setApiKey(e.target.value)}
                          placeholder="ElevenLabs API Key"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                        />
                        <button
                          onClick={saveApiKey}
                          className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg"
                        >
                          保存
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
              <h2 className="text-2xl font-bold text-gray-900 mb-6">通話ログ</h2>
              
              {callLogs.length === 0 ? (
                <div className="text-center py-12">
                  <Phone className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">まだ通話ログがありません</p>
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
                            通話時間: {Math.floor(log.duration / 60)}分{log.duration % 60}秒
                          </p>
                          <p className="text-sm text-gray-600">
                            使用分数: {log.minutesUsed}分
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">
                            {new Date(log.timestamp).toLocaleString('ja-JP')}
                          </p>
                          <p className="text-xs text-gray-400">
                            Agent ID: {log.agentId}
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