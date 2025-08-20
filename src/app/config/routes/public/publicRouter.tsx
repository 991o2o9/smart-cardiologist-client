import { AiChatPage, HealthCheckPage, HomePage } from '../../../../pages';
import { paths } from '../../../../shared/constants/constants';

export const publicRouter = [
  {
    path: paths.homePage,
    element: <HomePage />,
  },

  {
    path: paths.healthCheck,
    element: <HealthCheckPage />,
  },
  {
    path: paths.aiChat,
    element: <AiChatPage />,
  },
];
