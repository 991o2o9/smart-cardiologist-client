import { $mainApi } from '../../../shared/lib/requester/requester';

export interface AnalyticsData {
  user_id: number;
  period: string;
  risk: {
    avg: number;
    min: number;
    max: number;
    trend: 'stable' | 'increasing' | 'decreasing';
  };
  pulse: {
    avg: number;
    min: number;
    max: number;
    trend: 'stable' | 'increasing' | 'decreasing';
  };
  pressure: {
    avg: {
      systolic: number;
      diastolic: number | null;
    };
    min: {
      systolic: number;
      diastolic: number | null;
    };
    max: {
      systolic: number;
      diastolic: number | null;
    };
    trend: {
      systolic: 'stable' | 'increasing' | 'decreasing';
      diastolic: 'stable' | 'increasing' | 'decreasing' | null;
    };
  };
  last_updated: string;
}

export const getAnalytics = async (
  period: string = 'week',
): Promise<AnalyticsData> => {
  const response = await $mainApi.get(`/analytics/?period=${period}`);
  return response.data;
};
