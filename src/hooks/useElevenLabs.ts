import { useState, useRef, useCallback } from 'react';

interface ElevenLabsConfig {
  apiKey: string;
  agentId: string;
}

interface CallState {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
}

export function useElevenLabs() {
  const [callState, setCallState] = useState<CallState>({
    isConnected: false,
    isConnecting: false,
    error: null,
  });
  
  const conversationRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const initializeCall = useCallback(async (config: ElevenLabsConfig) => {
    setCallState({ isConnected: false, isConnecting: true, error: null });
    
    try {
      // Initialize AudioContext
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      // For now, we'll simulate the connection
      // In production, this would use ElevenLabs Conversational AI SDK
      setTimeout(() => {
        setCallState({ isConnected: true, isConnecting: false, error: null });
      }, 2000);

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to initialize call';
      setCallState({ isConnected: false, isConnecting: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  }, []);

  const endCall = useCallback(() => {
    if (conversationRef.current) {
      // End ElevenLabs conversation
      conversationRef.current = null;
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    setCallState({ isConnected: false, isConnecting: false, error: null });
  }, []);

  const toggleMute = useCallback((muted: boolean) => {
    // Implement mute functionality with ElevenLabs
    console.log('Toggle mute:', muted);
  }, []);

  return {
    callState,
    initializeCall,
    endCall,
    toggleMute,
  };
}