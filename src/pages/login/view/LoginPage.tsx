import { LoginForm } from '../../../features/auth';
import { AuthLayout } from '../../../widgets/authLayout';

export const LoginPage = () => {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
};
