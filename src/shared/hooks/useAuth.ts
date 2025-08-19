/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError } from 'axios';
import { create } from 'zustand';
import { BASE_URL, tokens } from '../constants/constants';
import { $authApi } from '../lib/requester/requester';

interface RegisterData {
  email: string;
  password: string;
}

interface ActivateAccountData {
  activation_code: string;
  email: string;
}

interface ResendCodeData {
  email: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface ApiResponse {
  message: string;
  success: boolean;
}

interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  refresh_expires_in: number;
}

interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  refresh_expires_in: number;
}

interface MeResponse {
  id: number;
  email: string;
  is_activated: boolean;
  created_at: string;
}

interface UserData {
  id: number;
  email: string;
  is_activated: boolean;
  created_at: string;
}

interface ActivationStatus {
  email: string;
  is_activated: boolean;
  exists: boolean;
}

interface AuthState {
  isAuth: boolean;
  isLoggingOut: boolean;
  isLoadingUser: boolean;
  user: UserData | null;

  justRegistered: boolean;
  setJustRegistered: (value: boolean) => void;

  setTokens: (accessToken: string, refreshToken: string) => void;
  setAuth: (isAuth: boolean) => void;
  register: (data: RegisterData) => Promise<ApiResponse>;
  activateAccount: (data: ActivateAccountData) => Promise<ApiResponse>;
  resendActivationCode: (data: ResendCodeData) => Promise<ApiResponse>;
  login: (data: LoginData) => Promise<void>;
  logout: () => void;
  checkAuth: (refreshToken: string) => Promise<LoginResponse>;
  fetchUserData: () => Promise<void>;
  setUser: (user: UserData) => void;
  checkActivationStatus: (email: string) => Promise<ActivationStatus>;
}

export const useAuth = create<AuthState>((set, get) => ({
  isAuth: !!localStorage.getItem(tokens.access),
  isLoggingOut: false,
  isLoadingUser: false,
  user: null,
  justRegistered: false,

  setJustRegistered: (value: boolean) => set({ justRegistered: value }),

  setUser: (user: UserData) => set({ user }),

  setAuth: (isAuth: boolean) => {
    set({ isAuth });
    if (!isAuth) {
      localStorage.removeItem(tokens.access);
      localStorage.removeItem(tokens.refresh);
      set({ user: null });
    }
  },

  setTokens: (accessToken: string, refreshToken: string) => {
    localStorage.setItem(tokens.access, accessToken);
    localStorage.setItem(tokens.refresh, refreshToken);
    set({ isAuth: true });
  },

  register: async (data: RegisterData): Promise<ApiResponse> => {
    try {
      const response = await axios.post<ApiResponse>(
        `${BASE_URL}/auth/register`,
        data,
      );
      return response.data;
    } catch (error: any) {
      const err = error as AxiosError<ApiResponse>;
      return Promise.reject(err);
    }
  },

  activateAccount: async (data: ActivateAccountData): Promise<ApiResponse> => {
    try {
      const response = await axios.post<ApiResponse>(
        `${BASE_URL}/auth/activate`,
        data,
      );
      return response.data;
    } catch (error: any) {
      const err = error as AxiosError<ApiResponse>;
      return Promise.reject(err);
    }
  },

  resendActivationCode: async (data: ResendCodeData): Promise<ApiResponse> => {
    try {
      const response = await axios.post<ApiResponse>(
        `${BASE_URL}/auth/resend-activation`,
        data,
      );
      return response.data;
    } catch (error: any) {
      const err = error as AxiosError<ApiResponse>;
      return Promise.reject(err);
    }
  },

  checkActivationStatus: async (email: string): Promise<ActivationStatus> => {
    try {
      const response = await axios.get<{
        exists: boolean;
        is_activated: boolean;
      }>(`${BASE_URL}/auth/status`, { params: { email } });

      return {
        email,
        exists: response.data.exists ?? false,
        is_activated: response.data.is_activated ?? false,
      };
    } catch (error: any) {
      console.error('Error checking activation status:', error);
      return Promise.reject(error as AxiosError);
    }
  },

  login: async (data: LoginData): Promise<void> => {
    try {
      const response = await axios.post<LoginResponse>(
        `${BASE_URL}/auth/login`,
        data,
      );
      const { access_token, refresh_token } = response.data;

      localStorage.setItem(tokens.access, access_token);
      localStorage.setItem(tokens.refresh, refresh_token);

      set({ isAuth: true });

      try {
        await get().fetchUserData();
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    } catch (error: any) {
      const err = error as AxiosError<LoginResponse>;
      return Promise.reject(err);
    }
  },

  logout: () => {
    set({ isAuth: false, user: null, isLoggingOut: true });
    localStorage.removeItem(tokens.access);
    localStorage.removeItem(tokens.refresh);
    localStorage.removeItem('user');

    $authApi
      .post('/auth/logout')
      .catch((err) => console.error('Error during logout:', err));

    set({ isLoggingOut: false });
  },

  checkAuth: async (refreshToken: string): Promise<LoginResponse> => {
    try {
      const response = await axios.post<RefreshTokenResponse>(
        `${BASE_URL}/auth/refresh`,
        {
          refresh_token: refreshToken,
        },
      );

      const { access_token, refresh_token: new_refresh_token } = response.data;

      localStorage.setItem(tokens.access, access_token);
      localStorage.setItem(tokens.refresh, new_refresh_token);

      set({ isAuth: true });

      try {
        await get().fetchUserData();
      } catch (error) {
        console.error('Error fetching user data:', error);
      }

      return response.data;
    } catch (error: any) {
      get().setAuth(false);
      const err = error as AxiosError<RefreshTokenResponse>;
      return Promise.reject(err);
    }
  },

  fetchUserData: async (): Promise<void> => {
    try {
      set({ isLoadingUser: true });
      const response = await $authApi.get<MeResponse>('/auth/me');
      const userData = response.data;
      set({ user: userData });
    } catch (error) {
      console.error('Error fetching user data:', error);
      get().setAuth(false);
    } finally {
      set({ isLoadingUser: false });
    }
  },
}));
