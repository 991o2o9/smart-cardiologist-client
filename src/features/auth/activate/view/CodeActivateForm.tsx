/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { useState, useRef } from 'react';
import styles from './CodeActivateForm.module.scss';
import {
  activateAccount,
  resendActivationCode,
  type ActivateAccountData,
  type ResendCodeData,
} from '../../../../entities/activationCode';
import { Typography } from '../../../../shared/ui/typography/view/Typography';
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
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const { control, handleSubmit, setValue } = useForm<ActivateAccountData>({
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

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Обновляем значение в react-hook-form
    const fullCode = newCode.join('');
    setValue('activation_code', fullCode);

    // Автоматический переход к следующему полю
    if (value !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    // Переход к предыдущему полю при Backspace
    if (e.key === 'Backspace' && code[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    // Переход к следующему полю при стрелке вправо
    if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    // Переход к предыдущему полю при стрелке влево
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, 6);
    const newCode = [...code];

    for (let i = 0; i < 6; i++) {
      newCode[i] = pastedData[i] || '';
    }
    setCode(newCode);
    setValue('activation_code', newCode.join(''));

    // Фокус на первом пустом поле или последнем заполненном
    const firstEmpty = newCode.findIndex((val) => val === '');
    const targetIndex = firstEmpty === -1 ? 5 : firstEmpty;
    inputRefs.current[targetIndex]?.focus();
  };

  const onSubmit = (data: ActivateAccountData) => {
    activateMutation.mutate(data);
  };

  if (statusLoading)
    return (
      <div className={styles.loadingContainer}>
        <Typography variant="largeT" color="dark">
          Loading...
        </Typography>
      </div>
    );

  if (!statusData?.exists) {
    return (
      <div className={styles.errorContainer}>
        <Typography variant="largeT" color="error">
          User with this email not found.
        </Typography>
      </div>
    );
  }

  if (statusData?.is_activated) {
    return (
      <div className={styles.successContainer}>
        <Typography variant="largeT" color="dark">
          Account already activated. You can log in.
        </Typography>
      </div>
    );
  }

  const isComplete = code.every((digit) => digit !== '');

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.codeForm}>
        <div className={styles.header}>
          <div className={styles.icon}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <path
                d="M21 8V7C21 4.79086 19.2091 3 17 3H7C4.79086 3 3 4.79086 3 7V8M21 8L12 13L3 8M21 8V17C21 19.2091 19.2091 21 17 21H7C4.79086 21 3 19.2091 3 17V8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <Typography variant="h4">Account Confirmation</Typography>
          <Typography variant="bodyT" className={styles.description}>
            Enter the 6-digit code sent to your email
          </Typography>
        </div>

        <div className={styles.codeInputContainer}>
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={digit}
              onChange={(e) =>
                handleCodeChange(index, e.target.value.replace(/\D/g, ''))
              }
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className={`${styles.codeInput} ${digit ? styles.filled : ''}`}
            />
          ))}
        </div>

        <Controller
          name="activation_code"
          control={control}
          rules={{ required: true, minLength: 6 }}
          render={() => <></>}
        />

        <input type="hidden" {...control.register('email')} value={email} />

        <div className={styles.actions}>
          <Button
            variant="secondary"
            type="submit"
            disabled={activateMutation.isPending || !isComplete}
            className={`${styles.activateButton} ${
              isComplete ? styles.ready : ''
            }`}
          >
            {activateMutation.isPending ? 'Checking...' : 'Activate'}
          </Button>

          <Button
            variant="secondary"
            type="button"
            disabled={resendMutation.isPending}
            onClick={() => resendMutation.mutate({ email })}
            className={styles.resendButton}
          >
            {resendMutation.isPending ? 'Sending...' : 'Resend code'}
          </Button>
        </div>
      </form>
    </div>
  );
};
