import { useState } from 'react';
import { ApiResponse, CreatePartnerRequest, ConversationPartner } from '../types';

const API_BASE = 'https://primary-production-0153.up.railway.app';
const WEBHOOK_URL = `${API_BASE}/webhook/f0fe171c-09a5-4f31-b5f8-0acaeba8161e`;

export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPartner = async (data: CreatePartnerRequest): Promise<ApiResponse<{ agentId: string }>> => {
    setLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('image', data.image);
      formData.append('voiceId', data.voiceId);
      formData.append('characteristics', data.characteristics);
      formData.append('characteristicsJa', data.characteristicsJa);
      formData.append('relationshipType', data.relationshipType);

      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return { success: true, data: result };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    createPartner,
    loading,
    error,
  };
}