import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Phone, PhoneOff, Mic, MicOff, Volume2, VolumeX, CreditCard } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

// Stripe payment plans (in Japanese Yen)
const PAYMENT_PLANS = [
  { minutes: 20, price: 599, label: '20分プラン' },
  { minutes: 60, price: 1499, label: '1時間プラン' },
  { minutes: 360, price: 9000, label: '6時間プラン' },
];

export function PhoneCall() {
  const { partnerId } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user, updateUserMinutes } = useAuth();
  
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [callStartTime, setCallStartTime] = useState<Date | null>(null);

  // Load partner data
  const partners = JSON.parse(localStorage.getItem('createdPartners') || '[]');
  const partner = partners.find((p: any) => p.id === partnerId);

  // Check if user has enough minutes before starting call
  useEffect(() => {
    if (user && user.minutesRemaining <= 0 && user.role !== 'admin') {
      setShowPaymentModal(true);
    }
  }, [user]);

  useEffect(() => {
    // Only start connection if user has minutes or is admin
    if (user && (user.minutesRemaining > 0 || user.role === 'admin')) {
      const timer = setTimeout(() => {
        setIsConnected(true);
        setCallStartTime(new Date());
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [user]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isConnected && callStartTime) {
      interval = setInterval(() => {
        const now = new Date();
        const duration = Math.floor((now.getTime() - callStartTime.getTime()) / 1000);
        setCallDuration(duration);
        
        // Check if user has exceeded their minutes (except admin)
        if (user && user.role !== 'admin') {
          const minutesUsed = Math.floor(duration / 60);
          if (minutesUsed >= user.minutesRemaining) {
            endCall();
            setShowPaymentModal(true);
          }
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isConnected, callStartTime, user]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const endCall = () => {
    if (callStartTime && user && user.role !== 'admin') {
      const callEndTime = new Date();
      const totalSeconds = Math.floor((callEndTime.getTime() - callStartTime.getTime()) / 1000);
      const minutesUsed = Math.ceil(totalSeconds / 60); // Round up to next minute
      
      // Update user's minutes
      updateUserMinutes(user.id, minutesUsed);
      
      // Log the call
      const callLog = {
        id: Date.now().toString(),
        userId: user.id,
        userName: user.name,
        partnerId: partnerId,
        partnerName: partner?.name || 'Unknown',
        agentId: partner?.agentId || 'N/A',
        duration: totalSeconds,
        minutesUsed: minutesUsed,
        timestamp: new Date(),
      };
      
      const existingLogs = JSON.parse(localStorage.getItem('callLogs') || '[]');
      localStorage.setItem('callLogs', JSON.stringify([callLog, ...existingLogs]));
    }
    
    navigate('/dashboard');
  };

  const handlePayment = (plan: typeof PAYMENT_PLANS[0]) => {
    // In production, this would integrate with Stripe
    alert(`Stripe payment integration for ${plan.label} - ¥${plan.price} (including tax)`);
    // For demo, we'll just close the modal
    setShowPaymentModal(false);
  };

  if (!partner) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white mb-4">Partner not found</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-full"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Payment Modal
  if (showPaymentModal) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <CreditCard className="w-16 h-16 text-sky-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              通話時間が不足しています
            </h2>
            <p className="text-gray-600">
              {user?.name}さん、残り時間: {user?.minutesRemaining || 0}分
            </p>
          </div>

          <div className="space-y-4 mb-6">
            {PAYMENT_PLANS.map((plan) => (
              <button
                key={plan.minutes}
                onClick={() => handlePayment(plan)}
                className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-sky-500 hover:bg-sky-50 transition-all text-left"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-gray-900">{plan.label}</h3>
                    <p className="text-sm text-gray-600">{plan.minutes}分の通話時間</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-sky-600">¥{plan.price}</p>
                    <p className="text-xs text-gray-500">税込</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              後で
            </button>
            <button
              onClick={() => handlePayment(PAYMENT_PLANS[0])}
              className="flex-1 px-4 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-xl transition-colors"
            >
              今すぐ購入
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-sky-900 to-blue-900 flex flex-col">
      {/* Status Bar */}
      <div className="h-6 bg-black/30 flex items-center justify-center">
        <div className="flex space-x-1">
          <div className="w-1 h-1 bg-white rounded-full"></div>
          <div className="w-1 h-1 bg-white rounded-full"></div>
          <div className="w-1 h-1 bg-white rounded-full"></div>
        </div>
      </div>

      {/* Call Interface */}
      <div className="flex-1 flex flex-col items-center justify-between p-8 text-white">
        {/* Top Section */}
        <div className="text-center">
          <p className="text-sm opacity-80 mb-2">
            {isConnected ? t('connected') : t('calling')}
          </p>
          {isConnected && (
            <div className="space-y-1">
              <p className="text-sm opacity-60">{formatDuration(callDuration)}</p>
              {user && user.role !== 'admin' && (
                <p className="text-xs opacity-50">
                  残り時間: {Math.max(0, user.minutesRemaining - Math.ceil(callDuration / 60))}分
                </p>
              )}
            </div>
          )}
        </div>

        {/* Partner Info */}
        <div className="text-center flex-1 flex flex-col justify-center">
          <div className="relative mb-6">
            <div className={`w-48 h-48 rounded-full overflow-hidden mx-auto border-4 border-white/20 ${
              isConnected ? '' : 'animate-pulse'
            }`}>
              <img
                src={partner.imageUrl}
                alt={partner.name}
                className="w-full h-full object-cover"
              />
            </div>
            {!isConnected && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 rounded-full border-4 border-white/40 animate-ping"></div>
              </div>
            )}
          </div>
          
          <h2 className="text-2xl font-semibold mb-2">{partner.name}</h2>
          <p className="text-white/80 text-sm">
            {partner.relationshipType}
          </p>
        </div>

        {/* Call Controls */}
        <div className="w-full max-w-sm">
          <div className="flex justify-center space-x-8 mb-8">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-lg ${
                isMuted
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-white/20 hover:bg-white/30 backdrop-blur-sm'
              }`}
            >
              {isMuted ? (
                <MicOff className="w-6 h-6" />
              ) : (
                <Mic className="w-6 h-6" />
              )}
            </button>
            
            <button
              onClick={() => setIsSpeakerOn(!isSpeakerOn)}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-lg ${
                isSpeakerOn
                  ? 'bg-sky-500 hover:bg-sky-600'
                  : 'bg-white/20 hover:bg-white/30 backdrop-blur-sm'
              }`}
            >
              {isSpeakerOn ? (
                <Volume2 className="w-6 h-6" />
              ) : (
                <VolumeX className="w-6 h-6" />
              )}
            </button>
          </div>

          <button
            onClick={endCall}
            className="w-20 h-20 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center mx-auto transition-all transform hover:scale-105 shadow-lg"
          >
            <PhoneOff className="w-8 h-8" />
          </button>
        </div>
      </div>

      {/* Home Indicator */}
      <div className="h-8 flex justify-center items-end pb-2">
        <div className="w-32 h-1 bg-white/40 rounded-full"></div>
      </div>
    </div>
  );
}