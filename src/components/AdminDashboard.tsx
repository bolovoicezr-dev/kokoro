import React, { useState, useEffect } from 'react';
import { Settings, Users, Phone, Clock, Plus, Trash2, Upload, Play, Pause, Volume2, CheckCircle, Download } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { VoicePreview } from './VoicePreview';

interface LogEntry {
  id: string;
  timestamp: Date;
  action: string;
  details: string;
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
  provider: string;
}

interface Member {
  id: string;
  email: string;
  name: string;
  role: string;
  minutesRemaining: number;
  totalMinutesPurchased: number;
  minutesUsed: number;
  createdAt: Date;
  lastLogin?: Date;
}

export function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('voices');
  
  // ElevenLabs Settings
  const [elevenLabsApiKey, setElevenLabsApiKey] = useState('');
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Voice Management
  const [voices, setVoices] = useState<any[]>([]);
  const [newVoice, setNewVoice] = useState({
    name: '',
    nameJa: '',
    gender: 'female' as 'male' | 'female',
    ageRange: '',
    personality: '',
    personalityJa: '',
  });

  // Relationship Types
  const [relationshipTypes, setRelationshipTypes] = useState<any[]>([]);
  const [newRelationship, setNewRelationship] = useState({
    label: '',
    labelEn: '',
  });

  // Characteristics
  const [characteristics, setCharacteristics] = useState<any[]>([]);
  const [newCharacteristic, setNewCharacteristic] = useState({
    label: '',
    labelEn: '',
  });

  // Demo Voices
  const [demoVoices, setDemoVoices] = useState<any[]>([]);

  // Call Logs
  const [callLogs, setCallLogs] = useState<CallLog[]>([]);

  // System Logs
  const [logs, setLogs] = useState<LogEntry[]>([]);

  // Members
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMember, setSelectedMember] = useState<string>('');
  const [minutesToAdd, setMinutesToAdd] = useState<number>(0);

  // Created Partners
  const [createdPartners, setCreatedPartners] = useState<any[]>([]);

  // Load data on component mount
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = () => {
    // Load ElevenLabs settings
    const savedApiKey = localStorage.getItem('elevenLabsApiKey');
    if (savedApiKey) {
      setElevenLabsApiKey(savedApiKey);
    }

    // Load voices
    const savedVoices = localStorage.getItem('adminVoices');
    if (savedVoices) {
      setVoices(JSON.parse(savedVoices));
    }

    // Load relationship types
    const savedRelationships = localStorage.getItem('adminRelationships');
    if (savedRelationships) {
      setRelationshipTypes(JSON.parse(savedRelationships));
    }

    // Load characteristics
    const savedCharacteristics = localStorage.getItem('adminCharacteristics');
    if (savedCharacteristics) {
      setCharacteristics(JSON.parse(savedCharacteristics));
    }

    // Load demo voices
    const savedDemoVoices = localStorage.getItem('demoVoices');
    if (savedDemoVoices) {
      setDemoVoices(JSON.parse(savedDemoVoices));
    }

    // Load call logs
    const savedCallLogs = localStorage.getItem('callLogs');
    if (savedCallLogs) {
      const parsedLogs = JSON.parse(savedCallLogs).map((log: any) => ({
        ...log,
        timestamp: new Date(log.timestamp)
      }));
      setCallLogs(parsedLogs);
    }

    // Load system logs
    const savedLogs = localStorage.getItem('adminLogs');
    if (savedLogs) {
      const parsedLogs = JSON.parse(savedLogs).map((log: any) => ({
        ...log,
        timestamp: new Date(log.timestamp)
      }));
      setLogs(parsedLogs);
    }

    // Load members
    const savedMembers = localStorage.getItem('adminMembers');
    if (savedMembers) {
      const parsedMembers = JSON.parse(savedMembers).map((member: any) => ({
        ...member,
        createdAt: new Date(member.createdAt),
        lastLogin: member.lastLogin ? new Date(member.lastLogin) : undefined
      }));
      setMembers(parsedMembers);
    }

    // Load created partners
    const savedPartners = localStorage.getItem('createdPartners');
    if (savedPartners) {
      const parsedPartners = JSON.parse(savedPartners).map((partner: any) => ({
        ...partner,
        createdAt: new Date(partner.createdAt),
        lastTalkedAt: partner.lastTalkedAt ? new Date(partner.lastTalkedAt) : undefined
      }));
      setCreatedPartners(parsedPartners);
    }
  };

  const addLog = (action: string, details: string) => {
    const newLog: LogEntry = {
      id: Date.now().toString(),
      timestamp: new Date(),
      action,
      details,
    };
    const updatedLogs = [newLog, ...logs];
    setLogs(updatedLogs);
    localStorage.setItem('adminLogs', JSON.stringify(updatedLogs));
  };

  const formatDate = (date: Date) => {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // ElevenLabs API Functions
  const saveElevenLabsApiKey = () => {
    localStorage.setItem('elevenLabsApiKey', elevenLabsApiKey);
    addLog('ElevenLabs Settings', 'API key updated');
    alert('ElevenLabs API key saved successfully!');
  };

  const testElevenLabsConnection = async () => {
    if (!elevenLabsApiKey) {
      alert('Please enter your ElevenLabs API key first');
      return;
    }

    setIsTestingConnection(true);
    setConnectionStatus('idle');

    try {
      const response = await fetch('https://api.elevenlabs.io/v1/user', {
        headers: {
          'xi-api-key': elevenLabsApiKey,
        },
      });

      if (response.ok) {
        setConnectionStatus('success');
        addLog('ElevenLabs Connection', 'Connection test successful');
      } else {
        setConnectionStatus('error');
        addLog('ElevenLabs Connection', 'Connection test failed');
      }
    } catch (error) {
      setConnectionStatus('error');
      addLog('ElevenLabs Connection', 'Connection test failed with error');
    } finally {
      setIsTestingConnection(false);
    }
  };

  // Voice Management Functions
  const addVoice = () => {
    if (!newVoice.name || !newVoice.nameJa) return;

    const voice = {
      id: Date.now().toString(),
      ...newVoice,
    };

    const updatedVoices = [...voices, voice];
    setVoices(updatedVoices);
    localStorage.setItem('adminVoices', JSON.stringify(updatedVoices));
    
    setNewVoice({
      name: '',
      nameJa: '',
      gender: 'female',
      ageRange: '',
      personality: '',
      personalityJa: '',
    });

    addLog('Voice Management', `Added voice: ${voice.nameJa}`);
  };

  const deleteVoice = (id: string) => {
    const updatedVoices = voices.filter(v => v.id !== id);
    setVoices(updatedVoices);
    localStorage.setItem('adminVoices', JSON.stringify(updatedVoices));
    addLog('Voice Management', 'Deleted voice');
  };

  // Relationship Management Functions
  const addRelationshipType = () => {
    if (!newRelationship.label || !newRelationship.labelEn) return;

    const relationship = {
      id: Date.now().toString(),
      ...newRelationship,
    };

    const updatedRelationships = [...relationshipTypes, relationship];
    setRelationshipTypes(updatedRelationships);
    localStorage.setItem('adminRelationships', JSON.stringify(updatedRelationships));
    
    setNewRelationship({ label: '', labelEn: '' });
    addLog('Relationship Management', `Added relationship: ${relationship.label}`);
  };

  const deleteRelationshipType = (id: string) => {
    const updatedRelationships = relationshipTypes.filter(r => r.id !== id);
    setRelationshipTypes(updatedRelationships);
    localStorage.setItem('adminRelationships', JSON.stringify(updatedRelationships));
    addLog('Relationship Management', 'Deleted relationship type');
  };

  // Characteristics Management Functions
  const addCharacteristic = () => {
    if (!newCharacteristic.label || !newCharacteristic.labelEn) return;

    const characteristic = {
      id: Date.now().toString(),
      ...newCharacteristic,
    };

    const updatedCharacteristics = [...characteristics, characteristic];
    setCharacteristics(updatedCharacteristics);
    localStorage.setItem('adminCharacteristics', JSON.stringify(updatedCharacteristics));
    
    setNewCharacteristic({ label: '', labelEn: '' });
    addLog('Characteristics Management', `Added characteristic: ${characteristic.label}`);
  };

  const deleteCharacteristic = (id: string) => {
    const updatedCharacteristics = characteristics.filter(c => c.id !== id);
    setCharacteristics(updatedCharacteristics);
    localStorage.setItem('adminCharacteristics', JSON.stringify(updatedCharacteristics));
    addLog('Characteristics Management', 'Deleted characteristic');
  };

  // Demo Voice Management
  const toggleDemoVoice = (voiceId: string) => {
    const updatedDemoVoices = demoVoices.map(voice => 
      voice.id === voiceId 
        ? { ...voice, isSelected: !voice.isSelected }
        : voice
    );
    setDemoVoices(updatedDemoVoices);
    localStorage.setItem('demoVoices', JSON.stringify(updatedDemoVoices));
    addLog('Demo Management', 'Updated demo voice selection');
  };

  const handleDemoAudioUpload = (voiceId: string, file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const audioUrl = reader.result as string;
      const updatedDemoVoices = demoVoices.map(voice => 
        voice.id === voiceId 
          ? { ...voice, audioUrl }
          : voice
      );
      setDemoVoices(updatedDemoVoices);
      localStorage.setItem('demoVoices', JSON.stringify(updatedDemoVoices));
      addLog('Demo Management', `Uploaded audio for ${voices.find(v => v.id === voiceId)?.nameJa}`);
    };
    reader.readAsDataURL(file);
  };

  // Member Management Functions
  const addMinutesToMember = () => {
    if (!selectedMember || minutesToAdd <= 0) return;

    const updatedMembers = members.map(member => 
      member.id === selectedMember 
        ? { 
            ...member, 
            minutesRemaining: member.minutesRemaining + minutesToAdd,
            totalMinutesPurchased: member.totalMinutesPurchased + minutesToAdd
          }
        : member
    );
    
    setMembers(updatedMembers);
    localStorage.setItem('adminMembers', JSON.stringify(updatedMembers));
    
    const memberName = members.find(m => m.id === selectedMember)?.name;
    addLog('Member Management', `Added ${minutesToAdd} minutes to ${memberName}`);
    
    setSelectedMember('');
    setMinutesToAdd(0);
    alert(`Successfully added ${minutesToAdd} minutes!`);
  };

  // Export functions
  const exportCallLogs = () => {
    const csvContent = [
      ['Date', 'User', 'Partner', 'Agent ID', 'Duration', 'Minutes Used', 'Provider'].join(','),
      ...callLogs.map(log => [
        formatDate(log.timestamp),
        log.userName,
        log.partnerName,
        log.agentId,
        formatDuration(log.duration),
        log.minutesUsed,
        log.provider
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `call-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const tabs = [
    { id: 'elevenlabs', label: 'ElevenLabs Settings', icon: Settings },
    { id: 'voices', label: 'Voice Management', icon: Volume2 },
    { id: 'relationships', label: 'Relationships', icon: Users },
    { id: 'characteristics', label: 'Characteristics', icon: Settings },
    { id: 'demo', label: 'Demo Management', icon: Play },
    { id: 'calls', label: 'Call Logs', icon: Phone },
    { id: 'members', label: 'Member Management', icon: Users },
    { id: 'partners', label: 'Created Partners', icon: Users },
    { id: 'logs', label: 'System Logs', icon: Clock },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">管理パネル</h1>
          <p className="text-gray-600 mt-2">システム設定と管理</p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === id
                      ? 'border-sky-500 text-sky-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* ElevenLabs Settings Tab */}
            {activeTab === 'elevenlabs' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">ElevenLabs API Settings</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ElevenLabs API Key
                      </label>
                      <div className="flex space-x-3">
                        <input
                          type="password"
                          value={elevenLabsApiKey}
                          onChange={(e) => setElevenLabsApiKey(e.target.value)}
                          placeholder="sk-..."
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                        />
                        <button
                          onClick={saveElevenLabsApiKey}
                          className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors"
                        >
                          Save
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <button
                        onClick={testElevenLabsConnection}
                        disabled={isTestingConnection}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          isTestingConnection
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-500 hover:bg-blue-600'
                        } text-white`}
                      >
                        {isTestingConnection ? 'Testing...' : 'Test Connection'}
                      </button>
                      
                      {connectionStatus === 'success' && (
                        <span className="text-green-600 text-sm">✓ Connection successful</span>
                      )}
                      {connectionStatus === 'error' && (
                        <span className="text-red-600 text-sm">✗ Connection failed</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Voice Management Tab */}
            {activeTab === 'voices' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Voice</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <input
                      type="text"
                      placeholder="English Name"
                      value={newVoice.name}
                      onChange={(e) => setNewVoice({ ...newVoice, name: e.target.value })}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="Japanese Name"
                      value={newVoice.nameJa}
                      onChange={(e) => setNewVoice({ ...newVoice, nameJa: e.target.value })}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    />
                    <select
                      value={newVoice.gender}
                      onChange={(e) => setNewVoice({ ...newVoice, gender: e.target.value as 'male' | 'female' })}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    >
                      <option value="female">Female</option>
                      <option value="male">Male</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Age Range (e.g., 20-25)"
                      value={newVoice.ageRange}
                      onChange={(e) => setNewVoice({ ...newVoice, ageRange: e.target.value })}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="Personality (English)"
                      value={newVoice.personality}
                      onChange={(e) => setNewVoice({ ...newVoice, personality: e.target.value })}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="Personality (Japanese)"
                      value={newVoice.personalityJa}
                      onChange={(e) => setNewVoice({ ...newVoice, personalityJa: e.target.value })}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    />
                  </div>
                  <button
                    onClick={addVoice}
                    className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4 inline mr-2" />
                    Add Voice
                  </button>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Existing Voices</h3>
                  <div className="space-y-3">
                    {voices.map((voice) => (
                      <div key={voice.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{voice.nameJa} ({voice.name})</h4>
                          <p className="text-sm text-gray-600">
                            {voice.personalityJa} • {voice.ageRange}歳 • {voice.gender === 'female' ? '女性' : '男性'}
                          </p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <VoicePreview
                            voiceId={voice.id}
                            voiceName={voice.nameJa}
                          />
                          <button
                            onClick={() => deleteVoice(voice.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Relationships Tab */}
            {activeTab === 'relationships' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Relationship Type</h3>
                  <div className="flex space-x-3 mb-4">
                    <input
                      type="text"
                      placeholder="Japanese Label"
                      value={newRelationship.label}
                      onChange={(e) => setNewRelationship({ ...newRelationship, label: e.target.value })}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="English Label"
                      value={newRelationship.labelEn}
                      onChange={(e) => setNewRelationship({ ...newRelationship, labelEn: e.target.value })}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    />
                    <button
                      onClick={addRelationshipType}
                      className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Existing Relationship Types</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {relationshipTypes.map((relationship) => (
                      <div key={relationship.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <span className="font-medium text-gray-900">{relationship.label}</span>
                          <span className="text-sm text-gray-600 ml-2">({relationship.labelEn})</span>
                        </div>
                        <button
                          onClick={() => deleteRelationshipType(relationship.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Characteristics Tab */}
            {activeTab === 'characteristics' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Characteristic</h3>
                  <div className="flex space-x-3 mb-4">
                    <input
                      type="text"
                      placeholder="Japanese Label"
                      value={newCharacteristic.label}
                      onChange={(e) => setNewCharacteristic({ ...newCharacteristic, label: e.target.value })}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="English Label"
                      value={newCharacteristic.labelEn}
                      onChange={(e) => setNewCharacteristic({ ...newCharacteristic, labelEn: e.target.value })}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    />
                    <button
                      onClick={addCharacteristic}
                      className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Existing Characteristics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {characteristics.map((characteristic) => (
                      <div key={characteristic.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <span className="font-medium text-gray-900">{characteristic.label}</span>
                          <span className="text-sm text-gray-600 block">({characteristic.labelEn})</span>
                        </div>
                        <button
                          onClick={() => deleteCharacteristic(characteristic.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Demo Management Tab */}
            {activeTab === 'demo' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Demo Voice Management</h3>
                  <p className="text-gray-600 mb-6">
                    Select voices to show in the landing page demo section and upload audio samples.
                  </p>
                  
                  <div className="space-y-4">
                    {voices.map((voice) => {
                      const demoVoice = demoVoices.find(dv => dv.id === voice.id) || { ...voice, isSelected: false };
                      return (
                        <div key={voice.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <input
                              type="checkbox"
                              checked={demoVoice.isSelected || false}
                              onChange={() => toggleDemoVoice(voice.id)}
                              className="w-4 h-4 text-sky-600 border-gray-300 rounded focus:ring-sky-500"
                            />
                            <div>
                              <h4 className="font-medium text-gray-900">{voice.nameJa}</h4>
                              <p className="text-sm text-gray-600">{voice.personalityJa}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-3">
                            <VoicePreview
                              voiceId={voice.id}
                              voiceName={voice.nameJa}
                              onAudioUpload={handleDemoAudioUpload}
                            />
                            {demoVoice.audioUrl && (
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Call Logs Tab */}
            {activeTab === 'calls' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Call Logs</h3>
                  <button
                    onClick={exportCallLogs}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export CSV</span>
                  </button>
                </div>
                
                <div className="bg-white rounded-lg border overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Partner</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agent ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Minutes Used</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {callLogs.map((log) => (
                          <tr key={log.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatDate(log.timestamp)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {log.userName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {log.partnerName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">
                              {log.agentId}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatDuration(log.duration)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {log.minutesUsed}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                {log.provider}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {callLogs.length === 0 && (
                    <div className="text-center py-12">
                      <Phone className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No call logs yet</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Member Management Tab */}
            {activeTab === 'members' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Minutes to Member</h3>
                  <div className="flex space-x-3 mb-6">
                    <select
                      value={selectedMember}
                      onChange={(e) => setSelectedMember(e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    >
                      <option value="">Select Member</option>
                      {members.map((member) => (
                        <option key={member.id} value={member.id}>
                          {member.name} ({member.email}) - {member.minutesRemaining} minutes remaining
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      placeholder="Minutes to add"
                      value={minutesToAdd || ''}
                      onChange={(e) => setMinutesToAdd(parseInt(e.target.value) || 0)}
                      className="w-40 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    />
                    <button
                      onClick={addMinutesToMember}
                      disabled={!selectedMember || minutesToAdd <= 0}
                      className="px-4 py-2 bg-sky-500 hover:bg-sky-600 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                    >
                      Add Minutes
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">All Members</h3>
                  <div className="bg-white rounded-lg border overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Minutes Remaining</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Purchased</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Minutes Used</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {members.map((member) => (
                            <tr key={member.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {member.name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {member.email}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  member.role === 'admin' 
                                    ? 'bg-purple-100 text-purple-800' 
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {member.role}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {member.minutesRemaining}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {member.totalMinutesPurchased}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {member.minutesUsed}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatDate(member.createdAt)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Created Partners Tab */}
            {activeTab === 'partners' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Created Partners</h3>
                
                <div className="grid gap-6">
                  {createdPartners.map((partner) => (
                    <div key={partner.id} className="bg-white p-6 rounded-lg border">
                      <div className="flex items-start space-x-4">
                        <img
                          src={partner.imageUrl}
                          alt={partner.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-900">{partner.name}</h4>
                          <p className="text-sm text-gray-600 mb-2">Created by: {partner.userName}</p>
                          <p className="text-sm text-gray-600 mb-2">Agent ID: <code className="bg-gray-100 px-2 py-1 rounded">{partner.agentId || 'N/A'}</code></p>
                          <p className="text-sm text-gray-600 mb-2">Relationship: {partner.relationshipType}</p>
                          <p className="text-sm text-gray-600 mb-2">Characteristics: {partner.characteristics}</p>
                          <p className="text-sm text-gray-500">Created: {formatDate(partner.createdAt)}</p>
                          {partner.lastTalkedAt && (
                            <p className="text-sm text-gray-500">Last talked: {formatDate(partner.lastTalkedAt)}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {createdPartners.length === 0 && (
                    <div className="text-center py-12">
                      <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No partners created yet</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* System Logs Tab */}
            {activeTab === 'logs' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">System Logs</h3>
                
                <div className="bg-white rounded-lg border overflow-hidden">
                  <div className="max-h-96 overflow-y-auto">
                    {logs.map((log) => (
                      <div key={log.id} className="px-6 py-4 border-b border-gray-200 last:border-b-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-900">{log.action}</p>
                            <p className="text-sm text-gray-600">{log.details}</p>
                          </div>
                          <span className="text-xs text-gray-500">
                            {formatDate(log.timestamp)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {logs.length === 0 && (
                    <div className="text-center py-12">
                      <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No system logs yet</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}