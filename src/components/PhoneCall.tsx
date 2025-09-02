import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Phone, PhoneOff, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export function PhoneCall() {
  const { partnerId } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  // Since we removed mock data, partner will be null
  const partner = null;

  useEffect(() => {
    // Simulate connection delay
    const timer = setTimeout(() => {
      setIsConnected(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isConnected) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isConnected]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const endCall = () => {
    navigate('/dashboard');
  };

  if (!partner) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-white">Partner not found</p>
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
            <p className="text-sm opacity-60">{formatDuration(callDuration)}</p>
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
            {partner.voice?.name} • {partner.voice?.ageRange}歳
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