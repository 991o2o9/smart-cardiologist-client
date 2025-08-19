import { useMutation } from '@tanstack/react-query';
import type { LoginFormData } from '../../../features/auth/loginForm/lib/loginSchema';
import { $mainApi } from '../../../shared/lib/requester/requester';

interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  refresh_expires_in: number;
}

const loginRequest = async (data: LoginFormData): Promise<LoginResponse> => {
  const response = await $mainApi.post<LoginResponse>('/auth/login', data);
  return response.data;
};

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: loginRequest,
    mutationKey: ['login'],
  });
};
