import { lazy } from 'react';

export const HomePage = lazy(() =>
  import('./home/view/HomePage').then((module) => ({
    default: module.HomePage,
  })),
);

export const LoginPage = lazy(() =>
  import('./login/view/LoginPage').then((module) => ({
    default: module.LoginPage,
  })),
);

export const RegisterPage = lazy(() =>
  import('./register/view/RegisterPage').then((module) => ({
    default: module.RegisterPage,
  })),
);

export const PredictionPage = lazy(() =>
  import('./prediction/view/PredictionPage').then((module) => ({
    default: module.PredictionPage,
  })),
);

export const HealthCheckPage = lazy(() =>
  import('./healthCheck/view/HealthCheckPage').then((module) => ({
    default: module.HealthCheckPage,
  })),
);

export const AiChatPage = lazy(() =>
  import('./aiChat/view/AiChatPage').then((module) => ({
    default: module.AiChatPage,
  })),
);

export const ProfilePage = lazy(() =>
  import('./profile/view/ProfilePage').then((module) => ({
    default: module.ProfilePage,
  })),
);

export const ActivationCodePage = lazy(() =>
  import('./activationCode/view/ActivationCodePage').then((module) => ({
    default: module.ActivationCodePage,
  })),
);

export const HistoryHeartPage = lazy(() =>
  import('./historyHeart/view/HistoryHeartPage').then((module) => ({
    default: module.HistoryHeartPage,
  })),
);
