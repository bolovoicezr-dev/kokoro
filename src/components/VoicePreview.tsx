import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Upload, Volume2 } from 'lucide-react';

interface VoicePreviewProps {
  voiceId: string;
  voiceName: string;
  onAudioUpload?: (voiceId: string, file: File) => void;
}

export function VoicePreview({ voiceId, voiceName, onAudioUpload }: VoicePreviewProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check for existing audio file in localStorage
  useEffect(() => {
    const storedAudio = localStorage.getItem(`voice-preview-${voiceId}`);
    if (storedAudio) {
      setAudioUrl(storedAudio);
    }
  }, [voiceId]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      setUploadedFile(file);
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
      
      // Store in localStorage for persistence
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          localStorage.setItem(`voice-preview-${voiceId}`, reader.result as string);
        }
      };
      reader.readAsDataURL(file);
      
      if (onAudioUpload) {
        onAudioUpload(voiceId, file);
      }
    }
  };

  const togglePlayback = () => {
    if (!audioRef.current || !audioUrl) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  return (
    <div className="flex items-center space-x-2">
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onEnded={handleAudioEnded}
          onPause={() => setIsPlaying(false)}
        />
      )}
      
      {audioUrl ? (
        <button
          onClick={togglePlayback}
          className="p-2 bg-sky-100 hover:bg-sky-200 rounded-full transition-colors"
          title={`${voiceName}の音声を${isPlaying ? '停止' : '再生'}`}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 text-sky-600" />
          ) : (
            <Play className="w-4 h-4 text-sky-600" />
          )}
        </button>
      ) : (
        <div className="flex items-center space-x-1">
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={handleFileUpload}
            className="hidden"
            id={`audio-upload-${voiceId}`}
          />
          <label
            htmlFor={`audio-upload-${voiceId}`}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors cursor-pointer"
            title={`${voiceName}の音声をアップロード`}
          >
            <Upload className="w-4 h-4 text-gray-600" />
          </label>
          <Volume2 className="w-4 h-4 text-gray-400" />
        </div>
      )}
    </div>
  );
}