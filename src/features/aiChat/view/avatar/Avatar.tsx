import { Heart, User } from 'lucide-react';
import styles from './Avatar.module.scss';
import type { FC } from 'react';

interface AvatarProps {
  type: 'user' | 'assistant';
}

export const Avatar: FC<AvatarProps> = ({ type }) => {
  if (type === 'assistant') {
    return (
      <div className={styles.avatarAssistant}>
        <Heart size={20} color="white" fill="white" />
      </div>
    );
  }

  return (
    <div className={styles.avatarUser}>
      <User size={20} color="white" />
    </div>
  );
};
