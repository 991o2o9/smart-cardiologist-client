import axios from 'axios';
import { create } from 'zustand';
import { BASE_URL, tokens } from '../constants/constants';
import { $authApi } from '../lib/requester';

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

interface AuthState {
  isAuth: boolean;
  isLoggingOut: boolean;
  isLoadingUser: boolean;
  user: UserData | null;

  setAuth: (isAuth: boolean) => void;
  register: (data: RegisterData) => Promise<ApiResponse>;
  activateAccount: (data: ActivateAccountData) => Promise<ApiResponse>;
  resendActivationCode: (data: ResendCodeData) => Promise<ApiResponse>;
  login: (data: LoginData) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: (refreshToken: string) => Promise<LoginResponse>;
  fetchUserData: () => Promise<void>;
  setUser: (user: UserData) => void;
}

export const useAuth = create<AuthState>((set, get) => ({
  isAuth: !!localStorage.getItem(tokens.access),
  isLoggingOut: false,
  isLoadingUser: false,
  user: null,

  setUser: (user: UserData) => set({ user }),

  setAuth: (isAuth: boolean) => {
    set({ isAuth });
    if (!isAuth) {
      localStorage.removeItem(tokens.access);
      localStorage.removeItem(tokens.refresh);
      set({ user: null });
    }
  },

  register: async (data: RegisterData): Promise<ApiResponse> => {
    try {
      const response = await axios.post<ApiResponse>(
        `${BASE_URL}/auth/register`,
        data,
      );
      return response.data;
    } catch (error) {
      return Promise.reject(error);
    }
  },

  activateAccount: async (data: ActivateAccountData): Promise<ApiResponse> => {
    try {
      const response = await axios.post<ApiResponse>(
        `${BASE_URL}/auth/activate`,
        data,
      );
      return response.data;
    } catch (error) {
      return Promise.reject(error);
    }
  },

  resendActivationCode: async (data: ResendCodeData): Promise<ApiResponse> => {
    try {
      const response = await axios.post<ApiResponse>(
        `${BASE_URL}/auth/resend-activation`,
        data,
      );
      return response.data;
    } catch (error) {
      return Promise.reject(error);
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
        console.error('Ошибка при получении данных пользователя:', error);
      }
    } catch (error) {
      return Promise.reject(error);
    }
  },

  logout: async (): Promise<void> => {
    const state = get();
    if (state.isLoggingOut) return;

    set({ isLoggingOut: true });

    try {
      await $authApi.post<ApiResponse>('/auth/logout');
    } catch (error) {
      console.error('Ошибка при выходе:', error);
    } finally {
      localStorage.removeItem(tokens.access);
      localStorage.removeItem(tokens.refresh);
      set({ isAuth: false, user: null, isLoggingOut: false });
    }
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
        console.error('Ошибка при получении данных пользователя:', error);
      }

      return response.data;
    } catch (error) {
      get().setAuth(false);
      return Promise.reject(error);
    }
  },

  fetchUserData: async (): Promise<void> => {
    try {
      set({ isLoadingUser: true });
      const response = await $authApi.get<MeResponse>('/auth/me');
      const userData = response.data;
      set({ user: userData });
    } catch (error) {
      console.error('Ошибка при получении данных пользователя:', error);
      get().setAuth(false);
    } finally {
      set({ isLoadingUser: false });
    }
  },
}));
