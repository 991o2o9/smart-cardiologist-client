import type { FC, ReactNode } from 'react';
import { useAuth } from '../../../shared/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { paths } from '../../../shared/constants/constants';

interface GuestGuardProps {
  children: ReactNode;
}

export const GuestGuard: FC<GuestGuardProps> = ({ children }) => {
  const { isAuth } = useAuth();

  return !isAuth ? children : <Navigate to={paths.homePage} replace />;
};
