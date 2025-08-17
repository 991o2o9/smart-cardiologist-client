import {
  AiChatPage,
  HealthCheckPage,
  PredictionPage,
  ProfilePage,
} from '../../../../pages';
import { paths } from '../../../../shared/constants/constants';
import { AuthGuard } from '../../guards/AuthGuard';

export const privateRouter = [
  {
    path: paths.aiChat,
    element: (
      <AuthGuard>
        <AiChatPage />,
      </AuthGuard>
    ),
  },
  {
    path: paths.healthCheck,
    element: (
      <AuthGuard>
        <HealthCheckPage />
      </AuthGuard>
    ),
  },
  {
    path: paths.prediction,
    element: (
      <AuthGuard>
        <PredictionPage />
      </AuthGuard>
    ),
  },
  {
    path: paths.profile,
    element: (
      <AuthGuard>
        <ProfilePage />
      </AuthGuard>
    ),
  },
];
