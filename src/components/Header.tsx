import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, Settings, LogOut } from 'lucide-react';
import { LanguageToggle } from './LanguageToggle';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

// Heart logo with voice waves
function KokoroHeartLogo() {
  return (
    <div className="relative w-14 h-10 flex items-center">
      {/* Heart Shape */}
      <svg viewBox="0 0 24 24" className="w-7 h-7 text-white">
        <path
          d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
          fill="currentColor"
        />
      </svg>
      
      {/* Voice waves emanating from the heart */}
      <div className="ml-2 flex items-center space-x-0.5">
        <div className="w-0.5 h-2 bg-white/70 rounded-full animate-pulse"></div>
        <div className="w-0.5 h-3 bg-white/85 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-0.5 h-4 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-0.5 h-3 bg-white/85 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
        <div className="w-0.5 h-2 bg-white/70 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
      </div>
    </div>
  );
}
export function Header() {
  const location = useLocation();
  const { t } = useLanguage();
  const { user, logout } = useAuth();

  const navItems = [
    { path: '/', icon: Home, label: t('home') },
    { path: '/dashboard', icon: Users, label: t('dashboard') },
    ...(user?.role === 'admin' ? [{ path: '/admin', icon: Settings, label: `${t('admin')} 🔧` }] : []),
  ];

  return (
    <header className="bg-gradient-to-r from-sky-500 to-blue-600 shadow-lg backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <KokoroHeartLogo />
            <span className="text-xl font-bold text-white">Kokoro Companion</span>
          </Link>

          <nav className="hidden md:flex space-x-8">
            {navItems.map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === path
                    ? 'bg-white/20 text-white'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <LanguageToggle />
            {user ? (
              <div className="flex items-center space-x-3">
                <span className="text-white/80 text-sm hidden sm:block">
                  {user.name}
                </span>
                <button
                  onClick={logout}
                  className="flex items-center space-x-1 px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:block">ログアウト</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-3 py-2 text-white/90 hover:text-white hover:bg-white/10 rounded-md text-sm font-medium transition-colors"
                >
                  ログイン
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-2 bg-white text-sky-600 hover:bg-white/90 rounded-md text-sm font-semibold transition-colors"
                >
                  新規登録
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}