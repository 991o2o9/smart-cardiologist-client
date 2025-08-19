import { Button } from '../../../../shared/ui/button/view/Button';
import { Input } from '../../../../shared/ui/input/view/Input';
import { Typography } from '../../../../shared/ui/typography/view/Typography';
import styles from './RegisterForm.module.scss';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { useState } from 'react';
import { useAuth } from '../../../../shared/hooks/useAuth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { registerSchema } from '../lib/registerSchema';
import { paths } from '../../../../shared/constants/constants';
import { toaster } from '../../../../shared/lib/toaster/toaster';

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterForm = () => {
  const { register: registerUser, setJustRegistered } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string>('');
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      setServerError('');
      const response = await registerUser({
        email: data.email,
        password: data.password,
      });
      if (response.success) {
        setJustRegistered(true);
        toaster(
          'success',
          'Registration successful! Check your email for activation.',
        );
        navigate(`/activation-email?email=${encodeURIComponent(data.email)}`);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Registration error:', error);
      if (error?.response?.data?.message) {
        setServerError(error.response.data.message);
        toaster('error', error.response.data.message);
      } else if (error?.response?.status === 409) {
        setError('email', {
          type: 'server',
          message: 'A user with this email already exists',
        });
        toaster('error', 'A user with this email already exists');
      } else {
        setServerError(
          'An error occurred during registration. Please try again.',
        );
        toaster(
          'error',
          'An error occurred during registration. Please try again.',
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = () => navigate(paths.loginPage);

  return (
    <form className={styles.registerForm} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.welcomePart}>
        <Typography variant="h2" color="dark">
          Welcome!
        </Typography>
        <Typography variant="largeT" color="gray">
          Sign up to your Smart Cardiologist account
        </Typography>
      </div>
      <div className={styles.form}>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              placeholder="your@example.com"
              type="email"
              label="Email"
              error={errors.email?.message}
              disabled={isLoading}
            />
          )}
        />
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              placeholder="password"
              type="password"
              label="Password"
              error={errors.password?.message}
              disabled={isLoading}
            />
          )}
        />
        <Controller
          name="confirmPassword"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              placeholder="confirm password"
              type="password"
              label="Confirm Password"
              error={errors.confirmPassword?.message}
              disabled={isLoading}
            />
          )}
        />
      </div>
      {serverError && (
        <div className={styles.serverError}>
          <Typography variant="smallT" color="error">
            {serverError}
          </Typography>
        </div>
      )}
      <div className={styles.btnArea}>
        <Button
          variant="primary"
          type="submit"
          size="fullWidth"
          disabled={isLoading}
        >
          <Typography variant="buttonT" color="white">
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </Typography>
        </Button>
        <div className={styles.haveAccount}>
          <Typography variant="largeT" color="gray">
            Already have an account?
          </Typography>
          <button onClick={handleSignUp} type="button" disabled={isLoading}>
            <Typography variant="largeT" color="ocean-blue">
              Sign In
            </Typography>
          </button>
        </div>
      </div>
    </form>
  );
};
