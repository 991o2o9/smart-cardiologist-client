export const BASE_URL = import.meta.env.VITE_BASE_URL;

export const paths = {
  homePage: '/',
  registerPage: '/register',
  loginPage: '/login',
  healthCheck: '/health-check',
  prediction: '/prediction',
  aiChat: '/ai-chat',
  profile: '/profile',
  activation: '/activation-email',
};

export const tokens = {
  access: 'access_token',
  refresh: 'refresh_token',
} as const;

export const user = {
  email: 'user_email',
} as const;

export type TokenKeys = keyof typeof tokens;
