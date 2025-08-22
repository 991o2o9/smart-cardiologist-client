import {
  AnalyticsPage,
  HistoryHeartPage,
  PredictionPage,
  ProfilePage,
} from '../../../../pages';
import { paths } from '../../../../shared/constants/constants';
import { AuthGuard } from '../../guards/AuthGuard';

export const privateRouter = [
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
  {
    path: paths.history,
    element: (
      <AuthGuard>
        <HistoryHeartPage />
      </AuthGuard>
    ),
  },
  {
    path: paths.analytics,
    element: (
      <AuthGuard>
        <AnalyticsPage />
      </AuthGuard>
    ),
  },
];
