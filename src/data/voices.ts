import { Voice } from '../types';

export const voices: Voice[] = [
  {
    id: 'yuki-gentle',
    name: 'Yuki',
    nameJa: 'ユキ',
    gender: 'female',
    ageRange: '22-26',
    personality: 'Gentle and empathetic, perfect listener',
    personalityJa: '優しく共感的で、完璧な聞き手',
  },
  {
    id: 'akira-confident',
    name: 'Akira',
    nameJa: 'アキラ',
    gender: 'male',
    ageRange: '26-30',
    personality: 'Confident and supportive, natural leader',
    personalityJa: '自信があり支援的で、天然のリーダー',
  },
  {
    id: 'miku-cheerful',
    name: 'Miku',
    nameJa: 'ミク',
    gender: 'female',
    ageRange: '20-24',
    personality: 'Cheerful and energetic, brings joy to conversations',
    personalityJa: '明るく元気で、会話に喜びをもたらす',
  },
  {
    id: 'ren-calm',
    name: 'Ren',
    nameJa: 'レン',
    gender: 'male',
    ageRange: '24-28',
    personality: 'Calm and wise, enjoys deep philosophical talks',
    personalityJa: '穏やかで賢く、深い哲学的な話を楽しむ',
  },
  {
    id: 'hana-playful',
    name: 'Hana',
    nameJa: 'ハナ',
    gender: 'female',
    ageRange: '23-27',
    personality: 'Playful and witty, master of humor',
    personalityJa: '遊び心があってウィットに富み、ユーモアの達人',
  },
];

export const relationshipTypes = [
  { id: 'friend', label: '友達', labelEn: 'Friend' },
  { id: 'girlfriend', label: '彼女', labelEn: 'Girlfriend' },
  { id: 'potential-gf', label: '将来の彼女', labelEn: 'Potential Girlfriend' },
  { id: 'coworker', label: '同僚', labelEn: 'Coworker' },
  { id: 'sister', label: '姉妹', labelEn: 'Sister' },
  { id: 'brother', label: '兄弟', labelEn: 'Brother' },
  { id: 'mentor', label: 'メンター', labelEn: 'Mentor' },
  { id: 'confidant', label: '親友', labelEn: 'Confidant' },
  { id: 'companion', label: '人生のパートナー', labelEn: 'Life Companion' },
  { id: 'therapist', label: 'セラピスト', labelEn: 'Therapist' },
  { id: 'study-buddy', label: '勉強仲間', labelEn: 'Study Buddy' },
  { id: 'soulmate', label: 'ソウルメイト', labelEn: 'Soulmate' },
];