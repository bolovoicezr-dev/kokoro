import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Heart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

function KokoroHeartLogo() {
  return (
    <div className="relative w-16 h-16 mx-auto mb-6">
      <svg viewBox="0 0 24 24" className="w-16 h-16 text-sky-600">
        <path
          d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
          fill="currentColor"
        />
      </svg>
      
      <div className="absolute -right-6 top-1/2 transform -translate-y-1/2 flex items-center space-x-0.5">
        <div className="w-0.5 h-3 bg-sky-400 rounded-full animate-pulse"></div>
        <div className="w-0.5 h-4 bg-sky-500 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-0.5 h-5 bg-sky-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-0.5 h-4 bg-sky-500 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
        <div className="w-0.5 h-3 bg-sky-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
      </div>
    </div>
  );
}

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading } = useAuth();
  const { t } = useLanguage();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error || 'ログインに失敗しました');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <KokoroHeartLogo />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              おかえりなさい
            </h1>
            <p className="text-gray-600">
              あなたのKokoroが待っています
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                メールアドレス
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your@email.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                パスワード
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="パスワードを入力"
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
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
              className={`w-full py-3 text-white font-semibold rounded-xl transition-all duration-200 ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 transform hover:scale-105 shadow-lg hover:shadow-xl'
              }`}
            >
              {loading ? 'ログイン中...' : 'ログイン'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              アカウントをお持ちでない方は{' '}
              <Link
                to="/register"
                className="text-sky-600 hover:text-sky-700 font-medium"
              >
                新規登録
              </Link>
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="mt-8 p-4 bg-sky-50 rounded-xl">
            <h3 className="font-semibold text-gray-900 mb-2">デモアカウント</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>管理者:</strong> admin@kokoro.com / admin123</p>
              <p><strong>ユーザー:</strong> user@example.com / user123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}