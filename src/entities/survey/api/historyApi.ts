import { $authApi } from '../../../shared/lib/requester/requester';

export interface HistoryItem {
  id: number;
  age: number;
  sex: number;
  cp: number;
  trestbps: number;
  chol: number;
  fbs: number;
  restecg: number;
  thalach: number;
  exang: number;
  oldpeak: number;
  slope: number;
  ca: number;
  thal: number;
  pulse: number;
  risk_prediction: number;
  probability: number;
  created_at: string;
}

export interface HistoryResponse {
  data: HistoryItem[];
  total: number;
  limit: number;
  offset: number;
}

// API actually returns array directly, not wrapped in object
export type HistoryApiResponse = HistoryItem[];

export const historyApi = {
  getHistory: async (
    limit: number = 10,
    offset: number = 0,
  ): Promise<HistoryResponse> => {
    try {
      const response = await $authApi.get<HistoryApiResponse>(
        `/heart-prediction/history`,
        { params: { limit, offset } },
      );

      // API returns array directly, so we need to wrap it
      const data = response.data || [];
      return {
        data,
        total: data.length, // We don't have total from API, so use array length
        limit,
        offset,
      };
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  getHistoryById: async (id: number): Promise<HistoryItem> => {
    const response = await $authApi.get<HistoryItem>(
      `/heart-prediction/history/${id}`,
    );
    return response.data;
  },
};
