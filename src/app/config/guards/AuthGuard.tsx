import type { FC } from 'react';
import { useAuth } from '../../../shared/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { paths } from '../../../shared/constants/constants';

interface AuthGuardProps {
  children?: React.ReactNode;
}

export const AuthGuard: FC<AuthGuardProps> = ({ children }) => {
  const { isAuth } = useAuth();

  return isAuth ? children : <Navigate to={paths.homePage} replace />;
};
