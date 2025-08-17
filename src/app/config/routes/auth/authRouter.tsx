import { LoginPage, RegisterPage } from '../../../../pages';
import { paths } from '../../../../shared/constants/constants';
import { GuestGuard } from '../../guards/GuestGuard';

export const authRouter = [
  {
    path: paths.loginPage,
    element: (
      <GuestGuard>
        <LoginPage />
      </GuestGuard>
    ),
  },
  {
    path: paths.registerPage,
    element: (
      <GuestGuard>
        <RegisterPage />
      </GuestGuard>
    ),
  },
];
