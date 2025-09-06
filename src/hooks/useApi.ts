import { useState } from 'react';
import { ApiResponse, CreatePartnerRequest, ConversationPartner } from '../types';

const WEBHOOK_URL = 'https://primary-production-0153.up.railway.app/webhook/45ce47ce-2b36-43c5-8e4e-703890f0c5c0';

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
      formData.append('userCallName', data.userCallName);
      formData.append('provider', 'elevenlabs');

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