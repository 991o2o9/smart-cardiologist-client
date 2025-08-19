import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../../shared/ui/button/view/Button';
import { Input } from '../../../../shared/ui/input/view/Input';
import { Typography } from '../../../../shared/ui/typography/view/Typography';
import { useAuth } from '../../../../shared/hooks/useAuth';
import { toaster } from '../../../../shared/lib/toaster/toaster';
import styles from './LoginForm.module.scss';
import { useLoginMutation } from '../../../../entities/login';
import { loginSchema, type LoginFormData } from '../lib/loginSchema';
import { paths } from '../../../../shared/constants/constants';

export const LoginForm = () => {
  const navigate = useNavigate();
  const { setTokens, fetchUserData } = useAuth();
  const loginMutation = useLoginMutation();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await loginMutation.mutateAsync(data);
      setTokens(response.access_token, response.refresh_token);

      try {
        await fetchUserData();
        toaster('success', 'Successfully logged in!');
        navigate(paths.homePage);
      } catch (userError) {
        console.error('Error fetching user data:', userError);
        toaster('warning', 'Logged in, but failed to load user data');
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Login error:', error);

      if (error?.response?.status === 401) {
        setError('email', {
          type: 'manual',
          message: 'Invalid email or password',
        });
        setError('password', {
          type: 'manual',
          message: 'Invalid email or password',
        });
        toaster('error', 'Invalid email or password');
      } else if (error?.response?.status === 422) {
        const validationErrors = error.response.data?.errors;
        if (validationErrors) {
          Object.entries(validationErrors).forEach(([field, messages]) => {
            if (Array.isArray(messages) && messages.length > 0) {
              setError(field as keyof LoginFormData, {
                type: 'manual',
                message: messages[0] as string,
              });
            }
          });
        }
        toaster('error', 'Please check your input data');
      } else if (error?.response?.status === 429) {
        toaster('error', 'Too many login attempts. Please try again later');
      } else if (error?.code === 'NETWORK_ERROR' || !error?.response) {
        toaster('error', 'Network error. Please check your connection');
      } else {
        toaster('error', 'Login failed. Please try again');
      }
    }
  };

  const handleForgotPassword = () => navigate('/forgot-password');
  const handleSignUp = () => navigate('/register');

  return (
    <form className={styles.LoginForm} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.welcomePart}>
        <Typography variant="h2" color="dark">
          Welcome back!
        </Typography>
        <Typography variant="largeT" color="gray">
          Sign in to your Smart Cardiologist account
        </Typography>
      </div>

      <div className={styles.form}>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="email"
              placeholder="your@example.com"
              label="Email"
              error={errors.email?.message}
              disabled={isSubmitting}
            />
          )}
        />

        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="password"
              placeholder="password"
              label="Password"
              error={errors.password?.message}
              disabled={isSubmitting}
            />
          )}
        />
      </div>

      <div className={styles.btnArea}>
        <button
          type="button"
          onClick={handleForgotPassword}
          disabled={isSubmitting}
        >
          <Typography variant="buttonT" color="dark">
            三 Forgot password?
          </Typography>
        </button>
        <Button
          variant="primary"
          type="submit"
          size="fullWidth"
          disabled={isSubmitting}
        >
          <Typography variant="buttonT" color="white">
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </Typography>
        </Button>
      </div>

      <div className={styles.haveAccount}>
        <Typography variant="largeT" color="gray">
          Don't have an account?
        </Typography>
        <button type="button" onClick={handleSignUp} disabled={isSubmitting}>
          <Typography variant="largeT" color="ocean-blue">
            Sign Up
          </Typography>
        </button>
      </div>
    </form>
  );
};
