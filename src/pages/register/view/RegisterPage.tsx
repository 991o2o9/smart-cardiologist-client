import { RegisterForm } from '../../../features/auth';
import { AuthLayout } from '../../../widgets/authLayout';

export const RegisterPage = () => {
  return (
    <AuthLayout>
      <RegisterForm />
    </AuthLayout>
  );
};
