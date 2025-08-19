import { $mainApi } from '../../../shared/lib/requester/requester';
import type { ActivateAccountData, ApiResponse } from '../types/types';

export const activateAccount = async (
  data: ActivateAccountData,
): Promise<ApiResponse> => {
  const response = await $mainApi.post<ApiResponse>('/auth/activate', data);
  return response.data;
};
