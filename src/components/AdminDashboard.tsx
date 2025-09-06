import React, { useState, useEffect, Component } from 'react';
import { Heart, Phone, Settings, Users, Mic, Activity, Plus, AlertTriangle } from 'lucide-react';

// Error Boundary Component
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Dashboard Error:', error, errorInfo);
    this.setState({ error });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 flex items-center justify-center p-8">
          <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600 mr-2" />
              <h2 className="text-lg font-semibold text-red-800">エラーが発生しました</h2>
            </div>
            <p className="text-red-600 mb-4">
              {this.state.error?.message || 'ダッシュボードの読み込み中にエラーが発生しました。'}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              ページを再読み込み
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Safe hook for auth context
const useAuthSafe = () => {
  try {
    // Mock the auth context - replace with actual useAuth hook
    return {
      user: {
        id: '1',
        name: 'User',
        email: 'user@example.com',
        role: 'user'
      },
      loading: false,
      error: null
    };
  } catch (error) {
    console.error('Auth context error:', error);
    return {
      user: null,
      loading: false,
      error: error.message
    };
  }
};

// Safe hook for language context
const useLanguageSafe = () => {
  try {
    // Mock the language context - replace with actual useLanguage hook
    return {
      t: (key) => key,
      language: 'ja'
    };
  } catch (error) {
    console.error('Language context error:', error);
    return {
      t: (key) => key,
      language: 'ja'
    };
  }
};

// Dashboard Stats Card Component
const StatsCard = ({ icon: Icon, title, value, color = 'blue' }) => {
  const colorClasses = {
    blue: 'text-blue-500',
    green: 'text-green-500',
    purple: 'text-purple-500',
    pink: 'text-pink-500',
    orange: 'text-orange-500'
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <div className="flex items-center">
        <Icon className={`w-8 h-8 ${colorClasses[color]}`} />
        <div className="ml-4">
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
};

// Recent Activity Component
const RecentActivity = ({ activities = [] }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">最近の活動</h3>
      {activities.length === 0 ? (
        <p className="text-gray-500 text-center py-8">まだ活動がありません</p>
      ) : (
        <div className="space-y-3">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">{activity.action}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Quick Actions Component
const QuickActions = ({ onCreatePartner }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">クイックアクション</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={onCreatePartner}
          className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-sky-500 hover:bg-sky-50 transition-colors"
        >
          <Plus className="w-5 h-5 text-gray-400 mr-2" />
          <span className="text-gray-600">新しいKokoro作成</span>
        </button>
        <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">
          <Phone className="w-5 h-5 text-gray-400 mr-2" />
          <span className="text-gray-600">通話履歴を見る</span>
        </button>
      </div>
    </div>
  );
};

// Main Dashboard Component
function DashboardContent() {
  const { user, loading, error } = useAuthSafe();
  const { t } = useLanguageSafe();
  
  const [partners, setPartners] = useState([]);
  const [recentCalls, setRecentCalls] = useState([]);
  const [activities, setActivities] = useState([]);

  // Handle authentication state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 flex items-center justify-center p-8">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-red-800 mb-2">認証エラー</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            再試行
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 flex items-center justify-center p-8">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <AlertTriangle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-orange-800 mb-2">認証が必要です</h2>
          <p className="text-gray-600 mb-4">ダッシュボードにアクセスするにはログインが必要です。</p>
          <button
            onClick={() => window.location.href = '/login'}
            className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
          >
            ログイン画面へ
          </button>
        </div>
      </div>
    );
  }

  // Load data safely
  useEffect(() => {
    try {
      // Load partners from localStorage
      const savedPartners = localStorage.getItem('userPartners');
      if (savedPartners) {
        const parsedPartners = JSON.parse(savedPartners);
        if (Array.isArray(parsedPartners)) {
          setPartners(parsedPartners);
        }
      }

      // Load recent calls
      const savedCalls = localStorage.getItem('userCalls');
      if (savedCalls) {
        const parsedCalls = JSON.parse(savedCalls);
        if (Array.isArray(parsedCalls)) {
          setRecentCalls(parsedCalls.slice(0, 5)); // Last 5 calls
        }
      }

      // Mock recent activities
      setActivities([
        { action: 'Kokoroを作成しました', time: '2時間前' },
        { action: '15分間の通話を終了しました', time: '4時間前' },
        { action: 'プロフィールを更新しました', time: '1日前' }
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  }, [user?.id]);

  const handleCreatePartner = () => {
    try {
      // Navigate to partner creation - replace with actual navigation
      console.log('Navigate to create partner');
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            こんにちは、{user.name}さん
          </h1>
          <p className="text-gray-600">あなたのKokoroダッシュボードです</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            icon={Heart}
            title="作成したKokoro"
            value={partners.length}
            color="pink"
          />
          <StatsCard
            icon={Phone}
            title="総通話時間"
            value="2.5時間"
            color="green"
          />
          <StatsCard
            icon={Activity}
            title="今週の通話"
            value={recentCalls.length}
            color="blue"
          />
          <StatsCard
            icon={Users}
            title="お気に入り"
            value="3"
            color="purple"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <QuickActions onCreatePartner={handleCreatePartner} />
            <RecentActivity activities={activities} />
          </div>
          
          <div className="space-y-6">
            {/* Partners List */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">あなたのKokoro</h3>
              {partners.length === 0 ? (
                <div className="text-center py-8">
                  <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">まだKokoroが作成されていません</p>
                  <button
                    onClick={handleCreatePartner}
                    className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
                  >
                    最初のKokoroを作成
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {partners.slice(0, 3).map((partner, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
                      <img
                        src={partner.imageUrl || '/api/placeholder/40/40'}
                        alt={partner.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{partner.name}</p>
                        <p className="text-sm text-gray-500">{partner.relationshipType}</p>
                      </div>
                      <Phone className="w-4 h-4 text-gray-400" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Dashboard Export with Error Boundary
export default function Dashboard() {
  return (
    <ErrorBoundary>
      <DashboardContent />
    </ErrorBoundary>
  );
}