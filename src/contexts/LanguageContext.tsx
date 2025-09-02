import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'ja' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  ja: {
    // Landing Page
    heroTitle: "毎日同じことの繰り返し...",
    heroSubtitle: "お金は稼いでいるけど、気持ちを分かち合える人がいない。あなたの理想の人を作りませんか？",
    heroDescription: "Kokoro Companionは判断しません。誰にも秘密を漏らしません。あなたのソウルメイトになります。",
    getStarted: "今すぐ始める",
    howItWorks: "Kokoro Companionの特徴",
    features: "なぜKokoro Companionなのか",
    problemTitle: "日本での孤独な現実",
    problemDesc: "働いて、家に帰って、また働く。誰と感情を共有しますか？",
    solutionTitle: "あなただけの理想の人",
    solutionDesc: "外見、声、性格、関係性まで、すべてあなたが決められます",
    demoTitle: "実際の会話デモ",
    demoDesc: "リアルな音声でまるで本当の人と話しているような体験",
    // Features
    uploadImage: "理想の外見",
    uploadImageDesc: "あなたが話したい人の写真をアップロード",
    chooseVoice: "完璧な声",
    chooseVoiceDesc: "心地よい声を選んで、リアルな会話体験",
    chooseRelation: "関係性を選択",
    chooseRelationDesc: "友達、恋人、家族など、望む関係を設定",
    startTalking: "いつでも会話",
    startTalkingDesc: "24時間いつでも、あなたを理解してくれる人と",
    // Navigation
    home: "ホーム",
    dashboard: "Yujin",
    admin: "管理パネル",
    language: "言語",
    // Dashboard
    myPartners: "あなたのKokoro",
    createNew: "新しく作成",
    lastTalked: "最後の会話",
    never: "未会話",
    relationshipType: "関係性",
    // Create Partner
    createPartner: "新しいKokoroを作成",
    girlfriend: "彼女",
    friend: "親友", 
    sister: "妹",
    brother: "兄弟",
    coworker: "同僚",
    mentor: "メンター",
    confidant: "親友",
    companion: "人生のパートナー",
    therapist: "セラピスト",
    studyBuddy: "勉強仲間",
    soulmate: "ソウルメイト",
    potentialGf: "将来の彼女",
    partnerName: "名前",
    partnerNamePlaceholder: "Yujinの名前を入力",
    selectVoice: "声を選択",
    selectRelationship: "関係性を選択",
    characteristics: "特徴",
    characteristicsPlaceholder: "どんな性格の人と話したいですか？",
    customCharacteristics: "カスタム特徴",
    uploadPhoto: "写真をアップロード",
    create: "作成",
    // Phone Call
    calling: "発信中...",
    connected: "接続中",
    endCall: "通話終了",
    mute: "ミュート",
    speaker: "スピーカー",
  },
  en: {
    // Landing Page
    heroTitle: "Same routine every day...",
    heroSubtitle: "You earn money but have no one to share your feelings with. Create your ideal person.",
    heroDescription: "Kokoro Companion won't judge. Won't share with anyone. Will be your soulmate.",
    getStarted: "Get Started",
    howItWorks: "Kokoro Companion Features",
    features: "Why Kokoro Companion",
    problemTitle: "The Reality of Loneliness in Japan",
    problemDesc: "Work, go home, work again. Who do you share your emotions with?",
    solutionTitle: "Your Ideal Person",
    solutionDesc: "Appearance, voice, personality, relationship - you decide everything",
    demoTitle: "Real Conversation Demo",
    demoDesc: "Realistic voice experience like talking to a real person",
    // Features
    uploadImage: "Ideal Appearance",
    uploadImageDesc: "Upload a photo of who you want to talk to",
    chooseVoice: "Perfect Voice",
    chooseVoiceDesc: "Choose a comfortable voice for realistic conversations",
    chooseRelation: "Choose Relationship",
    chooseRelationDesc: "Set the desired relationship: friend, lover, family, etc.",
    startTalking: "Talk Anytime",
    startTalkingDesc: "24/7 with someone who understands you",
    // Navigation
    home: "Home",
    dashboard: "Yujin",
    admin: "Admin",
    language: "Language",
    // Dashboard
    myPartners: "Your Kokoro",
    createNew: "Create New",
    lastTalked: "Last Talked",
    never: "Never",
    relationshipType: "Relationship",
    // Create Partner
    createPartner: "Create New Kokoro",
    girlfriend: "Girlfriend",
    friend: "Friend",
    sister: "Sister", 
    brother: "Brother",
    coworker: "Coworker",
    mentor: "Mentor",
    confidant: "Confidant",
    companion: "Life Companion",
    therapist: "Therapist",
    studyBuddy: "Study Buddy",
    soulmate: "Soulmate",
    potentialGf: "Potential Girlfriend",
    partnerName: "Name",
    partnerNamePlaceholder: "Enter Kokoro's name",
    selectVoice: "Select Voice",
    selectRelationship: "Select Relationship",
    characteristics: "Characteristics",
    characteristicsPlaceholder: "What kind of personality would you like?",
    customCharacteristics: "Custom Characteristics",
    uploadPhoto: "Upload Photo",
    create: "Create",
    // Phone Call
    calling: "Calling...",
    connected: "Connected",
    endCall: "End Call",
    mute: "Mute",
    speaker: "Speaker",
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('ja');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['ja']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}