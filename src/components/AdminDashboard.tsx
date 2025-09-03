import React, { useState, useEffect } from 'react';
import { Settings, Users, Mic, Activity, Plus, Edit2, Trash2, Save, X, Play, Pause, Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { voices, relationshipTypes } from '../data/voices';
import { VoicePreview } from './VoicePreview';

interface Member {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: Date;
  lastLogin?: Date;
  partnersCount: number;
}

interface LogEntry {
  id: string;
  userId: string;
  userName: string;
  action: string;
  timestamp: Date;
  details: string;
}

interface DemoVoice {
  id: string;
  name: string;
  audioUrl: string;
  isSelected: boolean;
}

export function AdminDashboard() {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  
  // API Key Management
  const [retellApiKey, setRetellApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKeyStatus, setApiKeyStatus] = useState<'connected' | 'disconnected' | 'testing'>('disconnected');
  
  // Voice Management
  const [editingVoice, setEditingVoice] = useState<string | null>(null);
  const [newVoice, setNewVoice] = useState({ name: '', nameJa: '', personality: '', personalityJa: '', gender: 'female', ageRange: '' });
  const [showAddVoice, setShowAddVoice] = useState(false);
  
  // Relationship Management
  const [editingRelation, setEditingRelation] = useState<string | null>(null);
  const [newRelation, setNewRelation] = useState({ label: '', labelEn: '' });
  const [showAddRelation, setShowAddRelation] = useState(false);
  
  // Demo Voice Management
  const [demoVoices, setDemoVoices] = useState<DemoVoice[]>([]);
  const [selectedDemoCount, setSelectedDemoCount] = useState(0);
  
  // Member Management
  const [members, setMembers] = useState<Member[]>([
    {
      id: '1',
      name: 'Admin User',
      email: 'admin@kokoro.com',
      role: 'admin',
      createdAt: new Date('2024-01-15'),
      lastLogin: new Date(),
      partnersCount: 0
    },
    {
      id: '2',
      name: 'Regular User',
      email: 'user@example.com',
      role: 'user',
      createdAt: new Date('2024-01-20'),
      lastLogin: new Date('2024-01-22'),
      partnersCount: 2
    },
    {
      id: '3',
      name: 'Tafser Yeamin',
      email: 'tafser.yeamin.tiu@gmail.com',
      role: 'admin',
      createdAt: new Date('2024-01-10'),
      lastLogin: new Date(),
      partnersCount: 1
    }
  ]);
  
  // Logs
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: '1',
      userId: '2',
      userName: 'Regular User',
      action: 'Partner Created',
      timestamp: new Date('2024-01-22T10:30:00'),
      details: 'Created partner "Yuki" with girlfriend relationship'
    },
    {
      id: '2',
      userId: '2',
      userName: 'Regular User',
      action: 'Voice Call',
      timestamp: new Date('2024-01-22T14:15:00'),
      details: 'Started call with partner "Yuki" - Duration: 15 minutes'
    },
    {
      id: '3',
      userId: '3',
      userName: 'Tafser Yeamin',
      action: 'Admin Login',
      timestamp: new Date(),
      details: 'Admin accessed dashboard'
    }
  ]);
  
  const [activeTab, setActiveTab] = useState('api');

  // Load saved data on mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem('retellApiKey');
    if (savedApiKey) {
      setRetellApiKey(savedApiKey);
      setApiKeyStatus('connected');
    }
    
    const savedDemoVoices = localStorage.getItem('demoVoices');
    if (savedDemoVoices) {
      const parsed = JSON.parse(savedDemoVoices);
      setDemoVoices(parsed);
      setSelectedDemoCount(parsed.filter((v: DemoVoice) => v.isSelected).length);
    }
  }, []);

  const testApiKey = async () => {
    if (!retellApiKey.trim()) return;
    
    setApiKeyStatus('testing');
    // Simulate API test
    await new Promise(resolve => setTimeout(resolve, 2000));
    setApiKeyStatus('connected');
    localStorage.setItem('retellApiKey', retellApiKey);
  };

  const handleDemoVoiceUpload = (file: File) => {
    const audioUrl = URL.createObjectURL(file);
    const newDemoVoice: DemoVoice = {
      id: Date.now().toString(),
      name: file.name.replace(/\.[^/.]+$/, ""),
      audioUrl,
      isSelected: false
    };
    
    const updatedVoices = [...demoVoices, newDemoVoice];
    setDemoVoices(updatedVoices);
    localStorage.setItem('demoVoices', JSON.stringify(updatedVoices));
  };

  const toggleDemoVoiceSelection = (voiceId: string) => {
    const voice = demoVoices.find(v => v.id === voiceId);
    if (!voice) return;
    
    const currentSelected = demoVoices.filter(v => v.isSelected).length;
    
    if (!voice.isSelected && currentSelected >= 3) {
      alert('最大3つまでしか選択できません');
      return;
    }
    
    const updatedVoices = demoVoices.map(v => 
      v.id === voiceId ? { ...v, isSelected: !v.isSelected } : v
    );
    
    setDemoVoices(updatedVoices);
    setSelectedDemoCount(updatedVoices.filter(v => v.isSelected).length);
    localStorage.setItem('demoVoices', JSON.stringify(updatedVoices));
  };

  const deleteMember = (memberId: string) => {
    if (confirm('このメンバーを削除しますか？')) {
      setMembers(prev => prev.filter(m => m.id !== memberId));
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const tabs = [
    { id: 'api', label: 'API設定', icon: Settings },
    { id: 'members', label: 'メンバー管理', icon: Users },
    { id: 'voices', label: '音声管理', icon: Mic },
    { id: 'logs', label: 'ログ', icon: Activity },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">管理者ダッシュボード</h1>
          <p className="text-gray-600">システム設定とユーザー管理</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">総メンバー数</p>
                <p className="text-2xl font-bold text-gray-900">{members.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center">
              <Mic className="w-8 h-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">登録音声数</p>
                <p className="text-2xl font-bold text-gray-900">{voices.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center">
              <Settings className="w-8 h-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">API状態</p>
                <p className={`text-sm font-medium ${apiKeyStatus === 'connected' ? 'text-green-600' : 'text-red-600'}`}>
                  {apiKeyStatus === 'connected' ? '接続済み' : '未接続'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center">
              <Activity className="w-8 h-8 text-orange-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">デモ音声</p>
                <p className="text-2xl font-bold text-gray-900">{selectedDemoCount}/3</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-sky-500 text-sky-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* API Settings Tab */}
            {activeTab === 'api' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Retell AI API設定</h2>
                
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-blue-800 text-sm">
                    <strong>重要:</strong> Retell AI APIキーを設定すると、ユーザーが通話ボタンを押した時にリアルタイム音声通話が開始されます。
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Retell AI APIキー
                  </label>
                  <div className="flex space-x-3">
                    <div className="flex-1 relative">
                      <input
                        type={showApiKey ? 'text' : 'password'}
                        value={retellApiKey}
                        onChange={(e) => setRetellApiKey(e.target.value)}
                        placeholder="sk-..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    <button
                      onClick={testApiKey}
                      disabled={!retellApiKey.trim() || apiKeyStatus === 'testing'}
                      className={`px-6 py-3 rounded-xl font-medium transition-all ${
                        apiKeyStatus === 'testing'
                          ? 'bg-gray-400 text-white cursor-not-allowed'
                          : 'bg-sky-500 hover:bg-sky-600 text-white'
                      }`}
                    >
                      {apiKeyStatus === 'testing' ? 'テスト中...' : 'テスト'}
                    </button>
                  </div>
                  
                  <div className="mt-3 flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${
                      apiKeyStatus === 'connected' ? 'bg-green-500' : 
                      apiKeyStatus === 'testing' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                    <span className="text-sm text-gray-600">
                      {apiKeyStatus === 'connected' ? 'API接続成功' : 
                       apiKeyStatus === 'testing' ? 'API接続テスト中...' : 'API未接続'}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">通話の仕組み</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• ユーザーが「通話開始」ボタンを押すとRetell AIに接続</li>
                    <li>• 選択された音声とキャラクター設定でリアルタイム会話</li>
                    <li>• 全ての通話ログは自動的に記録されます</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Members Tab */}
            {activeTab === 'members' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">メンバー管理</h2>
                  <button className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors">
                    <Plus className="w-4 h-4 mr-2 inline" />
                    新規メンバー追加
                  </button>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ユーザー</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">役割</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">登録日</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">最終ログイン</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kokoro数</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {members.map((member) => (
                          <tr key={member.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{member.name}</div>
                                <div className="text-sm text-gray-500">{member.email}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                member.role === 'admin' 
                                  ? 'bg-purple-100 text-purple-800' 
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {member.role === 'admin' ? '管理者' : 'ユーザー'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(member.createdAt)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {member.lastLogin ? formatDate(member.lastLogin) : '未ログイン'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {member.partnersCount}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <button className="text-sky-600 hover:text-sky-900">
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                {member.id !== user?.id && (
                                  <button 
                                    onClick={() => deleteMember(member.id)}
                                    className="text-red-600 hover:text-red-900"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Voices Tab */}
            {activeTab === 'voices' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">音声管理</h2>
                  <button 
                    onClick={() => setShowAddVoice(true)}
                    className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-2 inline" />
                    新しい音声追加
                  </button>
                </div>

                {/* Demo Voice Section */}
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    音声デモ管理 ({selectedDemoCount}/3選択中)
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    ランディングページの「音声デモ」セクションに表示される音声を管理します。最大3つまで選択可能です。
                  </p>
                  
                  <div className="mb-4">
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleDemoVoiceUpload(file);
                      }}
                      className="hidden"
                      id="demo-voice-upload"
                    />
                    <label
                      htmlFor="demo-voice-upload"
                      className="inline-flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg cursor-pointer transition-colors"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      デモ音声をアップロード
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {demoVoices.map((voice) => (
                      <div key={voice.id} className={`border rounded-lg p-4 ${voice.isSelected ? 'border-sky-500 bg-sky-50' : 'border-gray-200'}`}>
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-gray-900">{voice.name}</h4>
                          <button
                            onClick={() => toggleDemoVoiceSelection(voice.id)}
                            className={`px-3 py-1 text-xs rounded-full font-medium ${
                              voice.isSelected 
                                ? 'bg-sky-500 text-white' 
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            {voice.isSelected ? '選択中' : '選択'}
                          </button>
                        </div>
                        <audio controls className="w-full">
                          <source src={voice.audioUrl} />
                        </audio>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Voice List */}
                <div className="space-y-4">
                  {voices.map((voice) => (
                    <div key={voice.id} className="bg-white rounded-xl p-6 shadow-lg">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {voice.nameJa} ({voice.name})
                          </h3>
                          <p className="text-gray-600 mb-2">{voice.personalityJa}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>{voice.ageRange}歳</span>
                            <span>{voice.gender === 'female' ? '女性' : '男性'}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <VoicePreview voiceId={voice.id} voiceName={voice.nameJa} />
                          <button
                            onClick={() => setEditingVoice(voice.id)}
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Relationship Types */}
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">関係性タイプ管理</h3>
                    <button 
                      onClick={() => setShowAddRelation(true)}
                      className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                    >
                      <Plus className="w-4 h-4 mr-2 inline" />
                      関係性追加
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {relationshipTypes.map((relation) => (
                      <div key={relation.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <span className="text-sm font-medium">{relation.label}</span>
                        <button className="text-red-400 hover:text-red-600">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Logs Tab */}
            {activeTab === 'logs' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">システムログ</h2>
                
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">時刻</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ユーザー</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">アクション</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">詳細</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {logs.map((log) => (
                          <tr key={log.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(log.timestamp)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {log.userName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                log.action === 'Partner Created' ? 'bg-green-100 text-green-800' :
                                log.action === 'Voice Call' ? 'bg-blue-100 text-blue-800' :
                                log.action === 'Admin Login' ? 'bg-purple-100 text-purple-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {log.action}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {log.details}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}