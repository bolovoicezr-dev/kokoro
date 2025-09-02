import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Upload, Volume2, CheckCircle } from 'lucide-react';

interface VoicePreviewProps {
  voiceId: string;
  voiceName: string;
  onAudioUpload?: (voiceId: string, file: File) => void;
}

export function VoicePreview({ voiceId, voiceName, onAudioUpload }: VoicePreviewProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check for existing audio file in localStorage
  useEffect(() => {
    const storedAudio = localStorage.getItem(`voice-preview-${voiceId}`);
    if (storedAudio) {
      setAudioUrl(storedAudio);
    }
  }, [voiceId]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      setIsUploading(true);
      setUploadedFile(file);
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
      
      // Simulate upload delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      try {
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
      } catch (error) {
        console.error('Upload failed:', error);
      } finally {
        setIsUploading(false);
      }
    } else {
      alert('音声ファイルを選択してください（MP3, WAV, M4A等）');
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
    <div className="flex items-center space-x-2 min-w-0">
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onEnded={handleAudioEnded}
          onPause={() => setIsPlaying(false)}
        />
      )}
      
      {audioUrl ? (
        <div className="flex items-center space-x-2">
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
          <CheckCircle className="w-4 h-4 text-green-500" title="音声プレビューあり" />
        </div>
      ) : (
        <div className="flex items-center space-x-1">
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={handleFileUpload}
            className="hidden"
            id={`audio-upload-${voiceId}`}
            disabled={isUploading}
          />
          <label
            htmlFor={`audio-upload-${voiceId}`}
            className={`p-2 rounded-full transition-colors cursor-pointer ${
              isUploading 
                ? 'bg-sky-100 cursor-not-allowed' 
                : 'bg-gray-100 hover:bg-sky-200'
            }`}
            title={`${voiceName}の音声をアップロード`}
          >
            {isUploading ? (
              <div className="w-4 h-4 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Upload className="w-4 h-4 text-gray-600" />
            )}
          </label>
          <Volume2 className="w-4 h-4 text-gray-400" title="音声プレビューなし" />
        </div>
      )}
    </div>
  );
}