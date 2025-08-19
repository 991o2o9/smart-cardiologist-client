import { $mainApi } from '../../../shared/lib/requester/requester';
import type { ApiResponse, ResendCodeData } from '../types/types';

export const resendActivationCode = async (
  data: ResendCodeData,
): Promise<ApiResponse> => {
  const response = await $mainApi.post<ApiResponse>(
    '/auth/resend-activation',
    data,
  );
  return response.data;
};
