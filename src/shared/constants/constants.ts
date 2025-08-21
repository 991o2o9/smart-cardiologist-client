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
  history: '/history',
  analytics: '/analytics',
  resources: '/resources',
  legal: '/legal',
};

export const navigation = [
  {
    id: 1,
    key: 'Home',
    path: paths.homePage,
  },
  {
    id: 2,
    key: 'Health Check',
    path: paths.healthCheck,
  },
  {
    id: 3,
    key: 'Ai Chat',
    path: paths.aiChat,
  },
  {
    id: 4,
    key: 'History',
    path: paths.history,
  },
  {
    id: 5,
    key: 'Analytics',
    path: paths.analytics,
  },
];

export const footerNavigation = [
  {
    id: 1,
    key: 'Resources',
    path: paths.resources,
  },
  {
    id: 2,
    key: 'Legal',
    paths: paths.legal,
  },
];

export const tokens = {
  access: 'access_token',
  refresh: 'refresh_token',
} as const;

export const user = {
  email: 'user_email',
} as const;

export type TokenKeys = keyof typeof tokens;
