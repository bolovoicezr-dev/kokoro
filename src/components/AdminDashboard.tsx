import React, { useState, useEffect, Component, ComponentType } from 'react';
import { Settings, Users, Mic, Activity, Plus, Edit2, Trash2, Save, X, Play, Pause, Eye, EyeOff, UserPlus, Heart, Phone } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { VoicePreview } from './VoicePreview';

// Error Boundary Component
class ErrorBoundary extends Component<{ children: React.ReactNode }, { hasError: boolean; error?: Error }> {
  state = { hasError: false, error: undefined };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-red-50 rounded-xl">
          <h2 className="text-lg font-semibold text-red-800">エラーが発生しました</h2>
          <p className="text-red-600">{this.state.error?.message || '不明なエラーが発生しました。'}</p>
          <p className="text-gray-600 mt-2">
            問題が解決しない場合は、サポートチームに連絡してください。
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

// Define interfaces (same as original)
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

export function AdminDashboard() {
  const { t, language } = useLanguage() || { t: (key: string) => key, language: 'ja' }; // Fallback for language context
  const { user } = useAuth() || { user: null }; // Fallback for auth context

  // API Key Management
  const [retellApiKey, setRetellApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKeyStatus, setApiKeyStatus] = useState<'connected' | 'disconnected' | 'testing'>('disconnected');

  // Voice Management
  const [voices, setVoices] = useState<Voice[]>([]);
  const [editingVoice, setEditingVoice] = useState<string | null>(null);
  const [newVoice, setNewVoice] = useState({ name: '', nameJa: '', personality: '', personalityJa: '', gender: 'female', ageRange: '' });
  const [showAddVoice, setShowAddVoice] = useState(false);

  // Relationship Management
  const [relationshipTypes, setRelationshipTypes] = useState<RelationshipType[]>([]);
  const [editingRelation, setEditingRelation] = useState<string | null>(null);
  const [newRelation, setNewRelation] = useState({ label: '', labelEn: '' });
  const [showAddRelation, setShowAddRelation] = useState(false);

  // Characteristics Management
  const [characteristics, setCharacteristics] = useState<Characteristic[]>([]);
  const [editingCharacteristic, setEditingCharacteristic] = useState<string | null>(null);
  const [newCharacteristic, setNewCharacteristic] = useState({ label: '', labelEn: '' });
  const [showAddCharacteristic, setShowAddCharacteristic] = useState(false);

  // Demo Voice Management
  const [demoVoices, setDemoVoices] = useState<DemoVoice[]>([]);
  const [selectedDemoCount, setSelectedDemoCount] = useState(0);

  // Member Management
  const [members, setMembers] = useState<Member[]>([]);
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', email: '', password: '', role: 'user' });

  // Created Partners
  const [createdPartners, setCreatedPartners] = useState<any[]>([]);

  // Call Logs
  const [callLogs, setCallLogs] = useState<any[]>([]);

  // Logs
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const [activeTab, setActiveTab] = useState('api');

  // Load saved data on mount with error handling
  useEffect(() => {
    try {
      // Load API key
      const savedApiKey = localStorage.getItem('retellApiKey');
      if (savedApiKey) {
        setRetellApiKey(savedApiKey);
        setApiKeyStatus('connected');
      }

      // Load voices
      const savedVoices = localStorage.getItem('adminVoices');
      if (savedVoices) {
        const parsed = JSON.parse(savedVoices);
        if (Array.isArray(parsed)) setVoices(parsed);
      }

      // Load relationship types
      const savedRelationships = localStorage.getItem('adminRelationships');
      if (savedRelationships) {
        const parsed = JSON.parse(savedRelationships);
        if (Array.isArray(parsed)) setRelationshipTypes(parsed);
      }

      // Load characteristics
      const savedCharacteristics = localStorage.getItem('adminCharacteristics');
      if (savedCharacteristics) {
        const parsed = JSON.parse(savedCharacteristics);
        if (Array.isArray(parsed)) setCharacteristics(parsed);
      }

      // Load demo voices
      const savedDemoVoices = localStorage.getItem('demoVoices');
      if (savedDemoVoices) {
        const parsed = JSON.parse(savedDemoVoices);
        if (Array.isArray(parsed)) {
          setDemoVoices(parsed);
          setSelectedDemoCount(parsed.filter((v: DemoVoice) => v.isSelected).length);
        }
      }

      // Load members
      const savedMembers = localStorage.getItem('adminMembers');
      if (savedMembers) {
        const parsedMembers = JSON.parse(savedMembers);
        if (Array.isArray(parsedMembers)) {
          const membersWithDates = parsedMembers.map((member: any) => ({
            ...member,
            createdAt: new Date(member.createdAt),
            lastLogin: member.lastLogin ? new Date(member.lastLogin) : undefined,
          }));
          setMembers(membersWithDates);
        }
      } else {
        const defaultMembers = [
          {
            id: '1',
            name: 'Admin User',
            email: 'admin@kokoro.com',
            role: 'admin' as const,
            createdAt: new Date('2024-01-15'),
            lastLogin: new Date(),
            partnersCount: 0,
          },
          {
            id: '2',
            name: 'Regular User',
            email: 'user@example.com',
            role: 'user' as const,
            createdAt: new Date('2024-01-20'),
            lastLogin: new Date('2024-01-22'),
            partnersCount: 2,
          },
          {
            id: '3',
            name: 'Tafser Yeamin',
            email: 'tafser.yeamin.tiu@gmail.com',
            role: 'admin' as const,
            createdAt: new Date('2024-01-10'),
            lastLogin: new Date(),
            partnersCount: 1,
          },
        ];
        setMembers(defaultMembers);
        localStorage.setItem('adminMembers', JSON.stringify(defaultMembers));
      }

      // Load created partners
      const savedPartners = localStorage.getItem('createdPartners');
      if (savedPartners) {
        const parsedPartners = JSON.parse(savedPartners);
        if (Array.isArray(parsedPartners)) {
          const partnersWithDates = parsedPartners.map((partner: any) => ({
            ...partner,
            createdAt: new Date(partner.createdAt),
            lastTalkedAt: partner.lastTalkedAt ? new Date(partner.lastTalkedAt) : undefined,
          }));
          setCreatedPartners(partnersWithDates);
        }
      }

      // Load call logs
      const savedCallLogs = localStorage.getItem('callLogs');
      if (savedCallLogs) {
        const parsedCallLogs = JSON.parse(savedCallLogs);
        if (Array.isArray(parsedCallLogs)) {
          const callLogsWithDates = parsedCallLogs.map((log: any) => ({
            ...log,
            timestamp: new Date(log.timestamp),
          }));
          setCallLogs(callLogsWithDates);
        }
      }

      // Load logs
      const savedLogs = localStorage.getItem('adminLogs');
      if (savedLogs) {
        const parsedLogs = JSON.parse(savedLogs);
        if (Array.isArray(parsedLogs)) {
          const logsWithDates = parsedLogs.map((log: any) => ({
            ...log,
            timestamp: new Date(log.timestamp),
          }));
          setLogs(logsWithDates);
        }
      } else {
        const defaultLogs = [
          {
            id: '1',
            userId: '2',
            userName: 'Regular User',
            action: 'Partner Created',
            timestamp: new Date('2024-01-22T10:30:00'),
            details: 'Created partner "Yuki" with girlfriend relationship',
          },
          {
            id: '2',
            userId: '2',
            userName: 'Regular User',
            action: 'Voice Call',
            timestamp: new Date('2024-01-22T14:15:00'),
            details: 'Started call with partner "Yuki" - Duration: 15 minutes',
          },
          {
            id: '3',
            userId: '3',
            userName: 'Tafser Yeamin',
            action: 'Admin Login',
            timestamp: new Date(),
            details: 'Admin accessed dashboard',
          },
        ];
        setLogs(defaultLogs);
        localStorage.setItem('adminLogs', JSON.stringify(defaultLogs));
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
      // Optionally display an error message to the user
    }
  }, []);

  const testApiKey = async () => {
    if (!retellApiKey.trim()) return;

    setApiKeyStatus('testing');
    try {
      // Simulate API test
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setApiKeyStatus('connected');
      localStorage.setItem('retellApiKey', retellApiKey);
    } catch (error) {
      setApiKeyStatus('disconnected');
      console.error('API test failed:', error);
    }
  };

  const addVoice = () => {
    if (!newVoice.name || !newVoice.nameJa || !newVoice.personality || !newVoice.personalityJa || !newVoice.ageRange) return;

    const voice: Voice = {
      id: Date.now().toString(),
      ...newVoice,
      gender: newVoice.gender as 'male' | 'female',
    };

    const updatedVoices = [...voices, voice];
    setVoices(updatedVoices);
    localStorage.setItem('adminVoices', JSON.stringify(updatedVoices));
    setNewVoice({ name: '', nameJa: '', personality: '', personalityJa: '', gender: 'female', ageRange: '' });
    setShowAddVoice(false);
  };

  const deleteVoice = (voiceId: string) => {
    if (confirm('この音声を削除しますか？')) {
      const updatedVoices = voices.filter((v) => v.id !== voiceId);
      setVoices(updatedVoices);
      localStorage.setItem('adminVoices', JSON.stringify(updatedVoices));
    }
  };

  const addRelationship = () => {
    if (!newRelation.label || !newRelation.labelEn) return;

    const relationship: RelationshipType = {
      id: Date.now().toString(),
      ...newRelation,
    };

    const updatedRelationships = [...relationshipTypes, relationship];
    setRelationshipTypes(updatedRelationships);
    localStorage.setItem('adminRelationships', JSON.stringify(updatedRelationships));
    setNewRelation({ label: '', labelEn: '' });
    setShowAddRelation(false);
  };

  const deleteRelationship = (relationId: string) => {
    if (confirm('この関係性を削除しますか？')) {
      const updatedRelationships = relationshipTypes.filter((r) => r.id !== relationId);
      setRelationshipTypes(updatedRelationships);
      localStorage.setItem('adminRelationships', JSON.stringify(updatedRelationships));
    }
  };

  const addCharacteristic = () => {
    if (!newCharacteristic.label || !newCharacteristic.labelEn) return;

    const characteristic: Characteristic = {
      id: Date.now().toString(),
      ...newCharacteristic,
    };

    const updatedCharacteristics = [...characteristics, characteristic];
    setCharacteristics(updatedCharacteristics);
    localStorage.setItem('adminCharacteristics', JSON.stringify(updatedCharacteristics));
    setNewCharacteristic({ label: '', labelEn: '' });
    setShowAddCharacteristic(false);
  };

  const deleteCharacteristic = (charId: string) => {
    if (confirm('この特徴を削除しますか？')) {
      const updatedCharacteristics = characteristics.filter((c) => c.id !== charId);
      setCharacteristics(updatedCharacteristics);
      localStorage.setItem('adminCharacteristics', JSON.stringify(updatedCharacteristics));
    }
  };

  const handleDemoVoiceUpload = (file: File) => {
    try {
      const audioUrl = URL.createObjectURL(file);
      const newDemoVoice: DemoVoice = {
        id: Date.now().toString(),
        name: file.name.replace(/\.[^/.]+$/, ''),
        audioUrl,
        isSelected: false,
      };

      const updatedVoices = [...demoVoices, newDemoVoice];
      setDemoVoices(updatedVoices);
      localStorage.setItem('demoVoices', JSON.stringify(updatedVoices));
    } catch (error) {
      console.error('Error uploading demo voice:', error);
    }
  };

  const toggleDemoVoiceSelection = (voiceId: string) => {
    const voice = demoVoices.find((v) => v.id === voiceId);
    if (!voice) return;

    const currentSelected = demoVoices.filter((v) => v.isSelected).length;

    if (!voice.isSelected && currentSelected >= 3) {
      alert('最大3つまでしか選択できません');
      return;
    }

    const updatedVoices = demoVoices.map((v) => (v.id === voiceId ? { ...v, isSelected: !v.isSelected } : v));

    setDemoVoices(updatedVoices);
    setSelectedDemoCount(updatedVoices.filter((v) => v.isSelected).length);
    localStorage.setItem('demoVoices', JSON.stringify(updatedVoices));
  };

  const deleteDemoVoice = (voiceId: string) => {
    if (confirm('このデモ音声を削除しますか？')) {
      const updatedVoices = demoVoices.filter((v) => v.id !== voiceId);
      setDemoVoices(updatedVoices);
      setSelectedDemoCount(updatedVoices.filter((v) => v.isSelected).length);
      localStorage.setItem('demoVoices', JSON.stringify(updatedVoices));
    }
  };

  const addMember = () => {
    if (!newMember.name || !newMember.email || !newMember.password) return;

    const member: Member = {
      id: Date.now().toString(),
      name: newMember.name,
      email: newMember.email,
      role: newMember.role as 'user' | 'admin',
      createdAt: new Date(),
      partnersCount: 0,
    };

    const updatedMembers = [...members, member];
    setMembers(updatedMembers);
    localStorage.setItem('adminMembers', JSON.stringify(updatedMembers));
    setNewMember({ name: '', email: '', password: '', role: 'user' });
    setShowAddMember(false);
  };

  const deleteMember = (memberId: string) => {
    if (confirm('このメンバーを削除しますか？')) {
      const updatedMembers = members.filter((m) => m.id !== memberId);
      setMembers(updatedMembers);
      localStorage.setItem('adminMembers', JSON.stringify(updatedMembers));
    }
  };

  const formatDate = (date: Date) => {
    if (!(date instanceof Date) || isNaN(date.getTime())) return '無効な日付';
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const tabs = [
    { id: 'api', label: t('API設定') || 'API設定', icon: Settings },
    { id: 'members', label: t('メンバー管理') || 'メンバー管理', icon: Users },
    { id: 'voices', label: t('音声管理') || '音声管理', icon: Mic },
    { id: 'partners', label: t('作成されたKokoro') || '作成されたKokoro', icon: Heart },
    { id: 'calls', label: t('通話ログ') || '通話ログ', icon: Phone },
    { id: 'logs', label: t('ログ') || 'ログ', icon: Activity },
  ];

  // Guard against null user
  if (!user) {
    return (
      <div className="p-6 bg-red-50 rounded-xl">
        <h2 className="text-lg font-semibold text-red-800">認証エラー</h2>
        <p className="text-red-600">ログインが必要です。管理者としてログインしてください。</p>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('管理者ダッシュボード') || '管理者ダッシュボード'}</h1>
            <p className="text-gray-600">{t('システム設定とユーザー管理') || 'システム設定とユーザー管理'}</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm text-gray-600">{t('総メンバー数') || '総メンバー数'}</p>
                  <p className="text-2xl font-bold text-gray-900">{members.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center">
                <Mic className="w-8 h-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm text-gray-600">{t('登録音声数') || '登録音声数'}</p>
                  <p className="text-2xl font-bold text-gray-900">{voices.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center">
                <Heart className="w-8 h-8 text-pink-500" />
                <div className="ml-4">
                  <p className="text-sm text-gray-600">{t('作成されたKokoro') || '作成されたKokoro'}</p>
                  <p className="text-2xl font-bold text-gray-900">{createdPartners.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center">
                <Settings className="w-8 h-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-sm text-gray-600">{t('API状態') || 'API状態'}</p>
                  <p
                    className={`text-sm font-medium ${
                      apiKeyStatus === 'connected' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {apiKeyStatus === 'connected' ? t('接続済み') || '接続済み' : t('未接続') || '未接続'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center">
                <Activity className="w-8 h-8 text-orange-500" />
                <div className="ml-4">
                  <p className="text-sm text-gray-600">{t('デモ音声') || 'デモ音声'}</p>
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
                  <h2 className="text-xl font-semibold text-gray-900">{t('Retell AI API設定') || 'Retell AI API設定'}</h2>

                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <p className="text-blue-800 text-sm">
                      <strong>{t('重要') || '重要'}:</strong>{' '}
                      {t('Retell AI APIキーを設定すると、ユーザーが通話ボタンを押した時にリアルタイム音声通話が開始されます。') ||
                        'Retell AI APIキーを設定すると、ユーザーが通話ボタンを押した時にリアルタイム音声通話が開始されます。'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('Retell AI APIキー') || 'Retell AI APIキー'}
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
                        {apiKeyStatus === 'testing' ? t('テスト中...') || 'テスト中...' : t('テスト') || 'テスト'}
                      </button>
                    </div>

                    <div className="mt-3 flex items-center space-x-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          apiKeyStatus === 'connected'
                            ? 'bg-green-500'
                            : apiKeyStatus === 'testing'
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }`}
                      ></div>
                      <span className="text-sm text-gray-600">
                        {apiKeyStatus === 'connected'
                          ? t('API接続成功') || 'API接続成功'
                          : apiKeyStatus === 'testing'
                          ? t('API接続テスト中...') || 'API接続テスト中...'
                          : t('API未接続') || 'API未接続'}
                      </span>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{t('通話の仕組み') || '通話の仕組み'}</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• {t('ユーザーが「通話開始」ボタンを押すとRetell AIに接続') || 'ユーザーが「通話開始」ボタンを押すとRetell AIに接続'}</li>
                      <li>• {t('選択された音声とキャラクター設定でリアルタイム会話') || '選択された音声とキャラクター設定でリアルタイム会話'}</li>
                      <li>• {t('全ての通話ログは自動的に記録されます') || '全ての通話ログは自動的に記録されます'}</li>
                      <li>• {t('WebhookからAgent IDが返され、通話に使用されます') || 'WebhookからAgent IDが返され、通話に使用されます'}</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Members Tab */}
              {activeTab === 'members' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-900">{t('メンバー管理') || 'メンバー管理'}</h2>
                    <button
                      onClick={() => setShowAddMember(true)}
                      className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors"
                    >
                      <Plus className="w-4 h-4 mr-2 inline" />
                      {t('新規メンバー追加') || '新規メンバー追加'}
                    </button>
                  </div>

                  {/* Add Member Modal */}
                  {showAddMember && (
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">{t('新規メンバー追加') || '新規メンバー追加'}</h3>
                        <button onClick={() => setShowAddMember(false)}>
                          <X className="w-5 h-5 text-gray-400" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder={t('名前') || '名前'}
                          value={newMember.name}
                          onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                        />
                        <input
                          type="email"
                          placeholder={t('メールアドレス') || 'メールアドレス'}
                          value={newMember.email}
                          onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                        />
                        <input
                          type="password"
                          placeholder={t('パスワード') || 'パスワード'}
                          value={newMember.password}
                          onChange={(e) => setNewMember({ ...newMember, password: e.target.value })}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                        />
                        <select
                          value={newMember.role}
                          onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                        >
                          <option value="user">{t('ユーザー') || 'ユーザー'}</option>
                          <option value="admin">{t('管理者') || '管理者'}</option>
                        </select>
                      </div>
                      <div className="flex justify-end space-x-3 mt-4">
                        <button
                          onClick={() => setShowAddMember(false)}
                          className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                        >
                          {t('キャンセル') || 'キャンセル'}
                        </button>
                        <button
                          onClick={addMember}
                          className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors"
                        >
                          {t('追加') || '追加'}
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {t('ユーザー') || 'ユーザー'}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {t('役割') || '役割'}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {t('登録日') || '登録日'}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {t('最終ログイン') || '最終ログイン'}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {t('Kokoro数') || 'Kokoro数'}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {t('操作') || '操作'}
                            </th>
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
                                <span
                                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                    member.role === 'admin'
                                      ? 'bg-purple-100 text-purple-800'
                                      : 'bg-green-100 text-green-800'
                                  }`}
                                >
                                  {member.role === 'admin' ? t('管理者') || '管理者' : t('ユーザー') || 'ユーザー'}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatDate(member.createdAt)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {member.lastLogin ? formatDate(member.lastLogin) : t('未ログイン') || '未ログイン'}
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
                    <h2 className="text-xl font-semibold text-gray-900">{t('音声管理') || '音声管理'}</h2>
                    <button
                      onClick={() => setShowAddVoice(true)}
                      className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors"
                    >
                      <Plus className="w-4 h-4 mr-2 inline" />
                      {t('新しい音声追加') || '新しい音声追加'}
                    </button>
                  </div>

                  {/* Demo Voice Section */}
                  <div className="bg-white rounded-xl p-6 shadow-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {t('音声デモ管理') || '音声デモ管理'} ({selectedDemoCount}/3 {t('選択中') || '選択中'})
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {t('ランディングページの「会話デモ」セクションに表示される音声を管理します。最大3つまで選択可能です。') ||
                        'ランディングページの「会話デモ」セクションに表示される音声を管理します。最大3つまで選択可能です。'}
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
                        {t('デモ音声をアップロード') || 'デモ音声をアップロード'}
                      </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {demoVoices.map((voice) => (
                        <div
                          key={voice.id}
                          className={`border rounded-lg p-4 ${voice.isSelected ? 'border-sky-500 bg-sky-50' : 'border-gray-200'}`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-gray-900">{voice.name}</h4>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => toggleDemoVoiceSelection(voice.id)}
                                className={`px-3 py-1 text-xs rounded-full font-medium ${
                                  voice.isSelected
                                    ? 'bg-sky-500 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                              >
                                {voice.isSelected ? t('選択中') || '選択中' : t('選択') || '選択'}
                              </button>
                              <button
                                onClick={() => deleteDemoVoice(voice.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                          <audio controls className="w-full" onError={(e) => console.error('Audio error:', e)}>
                            <source src={voice.audioUrl} />
                          </audio>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Add Voice Form */}
                  {showAddVoice && (
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">{t('新しい音声追加') || '新しい音声追加'}</h3>
                        <button onClick={() => setShowAddVoice(false)}>
                          <X className="w-5 h-5 text-gray-400" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder={t('英語名 (例: Yuki)') || '英語名 (例: Yuki)'}
                          value={newVoice.name}
                          onChange={(e) => setNewVoice({ ...newVoice, name: e.target.value })}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                        />
                        <input
                          type="text"
                          placeholder={t('日本語名 (例: ユキ)') || '日本語名 (例: ユキ)'}
                          value={newVoice.nameJa}
                          onChange={(e) => setNewVoice({ ...newVoice, nameJa: e.target.value })}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                        />
                        <input
                          type="text"
                          placeholder={t('年齢範囲 (例: 22-26)') || '年齢範囲 (例: 22-26)'}
                          value={newVoice.ageRange}
                          onChange={(e) => setNewVoice({ ...newVoice, ageRange: e.target.value })}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                        />
                        <select
                          value={newVoice.gender}
                          onChange={(e) => setNewVoice({ ...newVoice, gender: e.target.value })}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                        >
                          <option value="female">{t('女性') || '女性'}</option>
                          <option value="male">{t('男性') || '男性'}</option>
                        </select>
                        <input
                          type="text"
                          placeholder={t('性格 (英語)') || '性格 (英語)'}
                          value={newVoice.personality}
                          onChange={(e) => setNewVoice({ ...newVoice, personality: e.target.value })}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                        />
                        <input
                          type="text"
                          placeholder={t('性格 (日本語)') || '性格 (日本語)'}
                          value={newVoice.personalityJa}
                          onChange={(e) => setNewVoice({ ...newVoice, personalityJa: e.target.value })}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                        />
                      </div>
                      <div className="flex justify-end space-x-3 mt-4">
                        <button
                          onClick={() => setShowAddVoice(false)}
                          className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                        >
                          {t('キャンセル') || 'キャンセル'}
                        </button>
                        <button
                          onClick={addVoice}
                          className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors"
                        >
                          {t('追加') || '追加'}
                        </button>
                      </div>
                    </div>
                  )}

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
                              <span>{voice.gender === 'female' ? t('女性') || '女性' : t('男性') || '男性'}</span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3">
                            {/* Wrap VoicePreview in ErrorBoundary to isolate potential errors */}
                            <ErrorBoundary>
                              <VoicePreview voiceId={voice.id} voiceName={voice.nameJa} />
                            </ErrorBoundary>
                            <button
                              onClick={() => deleteVoice(voice.id)}
                              className="p-2 text-red-400 hover:text-red-600 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Relationship Types Management */}
                  <div className="bg-white rounded-xl p-6 shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {t('関係性タイプ管理') || '関係性タイプ管理'}
                      </h3>
                      <button
                        onClick={() => setShowAddRelation(true)}
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                      >
                        <Plus className="w-4 h-4 mr-2 inline" />
                        {t('関係性追加') || '関係性追加'}
                      </button>
                    </div>

                    {showAddRelation && (
                      <div className="mb-4 p-4 border border-gray-200 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input
                            type="text"
                            placeholder={t('日本語 (例: 友達)') || '日本語 (例: 友達)'}
                            value={newRelation.label}
                            onChange={(e) => setNewRelation({ ...newRelation, label: e.target.value })}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                          />
                          <input
                            type="text"
                            placeholder={t('英語 (例: Friend)') || '英語 (例: Friend)'}
                            value={newRelation.labelEn}
                            onChange={(e) => setNewRelation({ ...newRelation, labelEn: e.target.value })}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                          />
                        </div>
                        <div className="flex justify-end space-x-3 mt-3">
                          <button
                            onClick={() => setShowAddRelation(false)}
                            className="px-3 py-1 text-gray-600 hover:text-gray-800 transition-colors"
                          >
                            {t('キャンセル') || 'キャンセル'}
                          </button>
                          <button
                            onClick={addRelationship}
                            className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                          >
                            {t('追加') || '追加'}
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {relationshipTypes.map((relation) => (
                        <div
                          key={relation.id}
                          className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                        >
                          <span className="text-sm font-medium">{relation.label}</span>
                          <button
                            onClick={() => deleteRelationship(relation.id)}
                            className="text-red-400 hover:text-red-600"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Characteristics Management */}
                  <div className="bg-white rounded-xl p-6 shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">{t('特徴管理') || '特徴管理'}</h3>
                      <button
                        onClick={() => setShowAddCharacteristic(true)}
                        className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
                      >
                        <Plus className="w-4 h-4 mr-2 inline" />
                        {t('特徴追加') || '特徴追加'}
                      </button>
                    </div>

                    {showAddCharacteristic && (
                      <div className="mb-4 p-4 border border-gray-200 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input
                            type="text"
                            placeholder={t('日本語 (例: 優しい)') || '日本語 (例: 優しい)'}
                            value={newCharacteristic.label}
                            onChange={(e) => setNewCharacteristic({ ...newCharacteristic, label: e.target.value })}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                          />
                          <input
                            type="text"
                            placeholder={t('英語 (例: Gentle)') || '英語 (例: Gentle)'}
                            value={newCharacteristic.labelEn}
                            onChange={(e) => setNewCharacteristic({ ...newCharacteristic, labelEn: e.target.value })}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                          />
                        </div>
                        <div className="flex justify-end space-x-3 mt-3">
                          <button
                            onClick={() => setShowAddCharacteristic(false)}
                            className="px-3 py-1 text-gray-600 hover:text-gray-800 transition-colors"
                          >
                            {t('キャンセル') || 'キャンセル'}
                          </button>
                          <button
                            onClick={addCharacteristic}
                            className="px-3 py-1 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
                          >
                            {t('追加') || '追加'}
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {characteristics.map((char) => (
                        <div
                          key={char.id}
                          className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                        >
                          <span className="text-sm font-medium">{char.label}</span>
                          <button
                            onClick={() => deleteCharacteristic(char.id)}
                            className="text-red-400 hover:text-red-600"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Created Partners Tab */}
              {activeTab === 'partners' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900">{t('作成されたKokoro') || '作成されたKokoro'}</h2>

                  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {t('Kokoro') || 'Kokoro'}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {t('作成者') || '作成者'}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {t('関係性') || '関係性'}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {t('Agent ID') || 'Agent ID'}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {t('作成日') || '作成日'}
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {createdPartners.map((partner) => (
                            <tr key={partner.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <img
                                    className="h-10 w-10 rounded-full object-cover"
                                    src={partner.imageUrl || '/api/placeholder/40/40'}
                                    alt=""
                                    onError={(e) => (e.currentTarget.src = '/api/placeholder/40/40')}
                                  />
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">{partner.name || '不明'}</div>
                                    <div className="text-sm text-gray-500">
                                      {t('呼び名') || '呼び名'}: {partner.userCallName || 'N/A'}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {partner.userName || '不明'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {partner.relationshipType || 'N/A'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <code className="text-xs bg-gray-100 px-2 py-1 rounded">{partner.agentId || 'N/A'}</code>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatDate(new Date(partner.createdAt))}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {createdPartners.length === 0 && (
                    <div className="text-center py-12">
                      <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">{t('まだKokoroが作成されていません') || 'まだKokoroが作成されていません'}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Call Logs Tab */}
              {activeTab === 'calls' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900">{t('通話ログ') || '通話ログ'}</h2>

                  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {t('時刻') || '時刻'}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {t('ユーザー') || 'ユーザー'}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {t('Kokoro') || 'Kokoro'}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {t('通話時間') || '通話時間'}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {t('ステータス') || 'ステータス'}
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {callLogs.map((log) => (
                            <tr key={log.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatDate(log.timestamp)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {log.userName || '不明'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {log.partnerName || 'N/A'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {log.duration || 'N/A'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                    log.status === 'completed'
                                      ? 'bg-green-100 text-green-800'
                                      : log.status === 'failed'
                                      ? 'bg-red-100 text-red-800'
                                      : 'bg-yellow-100 text-yellow-800'
                                  }`}
                                >
                                  {log.status === 'completed'
                                    ? t('完了') || '完了'
                                    : log.status === 'failed'
                                    ? t('失敗') || '失敗'
                                    : t('進行中') || '進行中'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {callLogs.length === 0 && (
                    <div className="text-center py-12">
                      <Phone className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">{t('まだ通話ログがありません') || 'まだ通話ログがありません'}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Logs Tab */}
              {activeTab === 'logs' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900">{t('システムログ') || 'システムログ'}</h2>

                  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {t('時刻') || '時刻'}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {t('ユーザー') || 'ユーザー'}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {t('アクション') || 'アクション'}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {t('詳細') || '詳細'}
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {logs.map((log) => (
                            <tr key={log.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatDate(log.timestamp)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {log.userName || '不明'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                    log.action === 'Partner Created'
                                      ? 'bg-green-100 text-green-800'
                                      : log.action === 'Voice Call'
                                      ? 'bg-blue-100 text-blue-800'
                                      : log.action === 'Admin Login'
                                      ? 'bg-purple-100 text-purple-800'
                                      : 'bg-gray-100 text-gray-800'
                                  }`}
                                >
                                  {log.action}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-500">{log.details || 'N/A'}</td>
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
    </ErrorBoundary>
  );
}