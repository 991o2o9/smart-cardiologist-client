/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import styles from './CodeActivateForm.module.scss';
import {
  activateAccount,
  resendActivationCode,
  type ActivateAccountData,
  type ResendCodeData,
} from '../../../../entities/activationCode';
import { Typography } from '../../../../shared/ui/typography/view/Typography';
import { Input } from '../../../../shared/ui/input/view/Input';
import { Button } from '../../../../shared/ui/button/view/Button';
import { toaster } from '../../../../shared/lib/toaster/toaster';
import { useAuth } from '../../../../shared/hooks/useAuth';

interface CodeActivateFormProps {
  email: string;
  onActivate?: () => void;
}

export const CodeActivateForm = ({
  email,
  onActivate,
}: CodeActivateFormProps) => {
  const { control, handleSubmit } = useForm<ActivateAccountData>({
    defaultValues: { email, activation_code: '' },
  });
  const { checkActivationStatus } = useAuth();

  const { data: statusData, isLoading: statusLoading } = useQuery({
    queryKey: ['activationStatus', email],
    queryFn: () => checkActivationStatus(email),
    retry: false,
  });

  const activateMutation = useMutation({
    mutationFn: (data: ActivateAccountData) => activateAccount(data),
    onSuccess: (data) => {
      toaster('success', data.message);
      onActivate?.();
    },
    onError: (err: any) => {
      toaster('error', err?.response?.data?.message || 'Activation error');
    },
  });

  const resendMutation = useMutation({
    mutationFn: (data: ResendCodeData) => resendActivationCode(data),
    onSuccess: (data) => {
      toaster('success', data.message);
    },
    onError: (err: any) => {
      toaster('error', err?.response?.data?.message || 'Error sending code');
    },
  });

  const onSubmit = (data: ActivateAccountData) => {
    activateMutation.mutate(data);
  };

  if (statusLoading)
    return (
      <Typography variant="largeT" color="dark">
        Loading...
      </Typography>
    );

  if (!statusData?.exists) {
    return (
      <Typography variant="largeT" color="error">
        User with this email not found.
      </Typography>
    );
  }

  if (statusData?.is_activated) {
    return (
      <Typography variant="largeT" color="dark">
        Account already activated. You can log in.
      </Typography>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.codeForm}>
      <Typography variant="h4">Account Confirmation</Typography>
      <Controller
        name="activation_code"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <Input label="Code from email" placeholder="Enter code" {...field} />
        )}
      />
      <input type="hidden" {...control.register('email')} value={email} />
      <div className={styles.actions}>
        <Button
          variant="secondary"
          type="submit"
          disabled={activateMutation.isPending}
        >
          {activateMutation.isPending ? 'Checking...' : 'Activate'}
        </Button>
        <Button
          variant="secondary"
          type="button"
          disabled={resendMutation.isPending}
          onClick={() => resendMutation.mutate({ email })}
        >
          {resendMutation.isPending ? 'Sending...' : 'Resend code'}
        </Button>
      </div>
    </form>
  );
};
