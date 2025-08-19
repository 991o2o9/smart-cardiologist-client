import { useNavigate, useSearchParams } from 'react-router-dom';
import { CodeActivateForm } from '../../../features/auth';
import { AuthLayout } from '../../../widgets/authLayout';
import { useEffect } from 'react';
import { paths } from '../../../shared/constants/constants';
import { useAuth } from '../../../shared/hooks/useAuth';

export const ActivationCodePage = () => {
  const { justRegistered, setJustRegistered } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const email = searchParams.get('email') || '';

  useEffect(() => {
    if (!justRegistered || !email) {
      navigate(paths.registerPage);
    }
  }, [justRegistered, email, navigate]);

  return (
    <AuthLayout>
      <CodeActivateForm
        email={email}
        onActivate={() => {
          setJustRegistered(false);
          navigate(paths.loginPage);
        }}
      />
    </AuthLayout>
  );
};
