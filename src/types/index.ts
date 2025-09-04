export interface User {
  id: string;
  email: string;
  name: string;
  language: 'ja' | 'en';
}

export interface Voice {
  id: string;
  name: string;
  nameJa: string;
  gender: 'male' | 'female';
  ageRange: string;
  personality: string;
  personalityJa: string;
  previewUrl?: string;
  retellVoiceId?: string;
}

export interface ConversationPartner {
  id: string;
  userId: string;
  name: string;
  imageUrl: string;
  voiceId: string;
  voice?: Voice;
  agentId?: string;
  characteristics: string;
  characteristicsJa: string;
  relationshipType: string;
  createdAt: Date;
  lastTalkedAt?: Date;
}

export interface CreatePartnerRequest {
  name: string;
  image: File;
  voiceId: string;
  characteristics: string;
  characteristicsJa: string;
  relationshipType: string;
  userCallName: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}