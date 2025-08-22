import { useQuery } from '@tanstack/react-query';
import { getAnalytics } from '../api/analyticsApi';

export const useAnalytics = (period: string = 'week') => {
  return useQuery({
    queryKey: ['analytics', period],
    queryFn: () => getAnalytics(period),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // 5 minutes
  });
};
