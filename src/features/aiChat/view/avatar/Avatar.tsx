import { Heart } from 'lucide-react';
import { Avatar as UserAvatar } from '../../../../shared/ui/avatar';
import styles from './Avatar.module.scss';
import type { FC } from 'react';

interface AvatarProps {
  type: 'user' | 'assistant';
  userEmail?: string | null;
}

export const Avatar: FC<AvatarProps> = ({ type, userEmail }) => {
  if (type === 'assistant') {
    return (
      <div className={styles.avatarAssistant}>
        <Heart size={20} color="white" fill="white" />
      </div>
    );
  }

  return <UserAvatar email={userEmail} size="medium" />;
};
