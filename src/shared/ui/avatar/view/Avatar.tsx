import type { FC } from 'react';
import type { IAvatarProps } from '../types/IAvatarProps';
import styles from './Avatar.module.scss';

export const Avatar: FC<IAvatarProps> = ({
  email,
  size = 'medium',
  className = '',
}) => {
  const getInitials = (email?: string | null): string => {
    if (!email) return 'U';
    const parts = email.split('@')[0].split('.');
    if (parts.length >= 2) {
      return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
    }
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <div className={`${styles.avatar} ${styles[size]} ${className}`}>
      {getInitials(email)}
    </div>
  );
};
