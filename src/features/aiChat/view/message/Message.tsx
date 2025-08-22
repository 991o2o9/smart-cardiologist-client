import type { FC } from 'react';
import type { ChatMessage } from '../../../../entities/aiChat/api/chatApi';
import { Typography } from '../../../../shared/ui/typography/view/Typography';
import { useAuth } from '../../../../shared/hooks/useAuth';

import styles from './Message.module.scss';
import { Avatar } from '../avatar/Avatar';

interface MessageProps {
  message: ChatMessage;
}

export const Message: FC<MessageProps> = ({ message }) => {
  const { user } = useAuth();
  const isAssistant = message.role === 'assistant';
  const isUser = message.role === 'user';

  const formatTime = (timestamp?: number) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div
      className={`${styles.messageWrapper} ${
        isUser ? styles.userMessage : styles.assistantMessage
      }`}
    >
      {isAssistant && (
        <div className={styles.avatarContainer}>
          <Avatar type="assistant" />
        </div>
      )}

      <div className={styles.messageContent}>
        {isAssistant && (
          <div className={styles.messageHeader}>
            <Typography variant="smallT" weight="medium" color="dark">
              HeartSync Advisor
            </Typography>
            {message.timestamp && (
              <Typography variant="extraSmallT" color="moreGray">
                {formatTime(message.timestamp)}
              </Typography>
            )}
          </div>
        )}

        <div
          className={`${styles.messageBubble} ${
            isUser ? styles.userBubble : styles.assistantBubble
          }`}
        >
          <Typography
            variant="bodyT"
            color={isUser ? 'white' : 'dark'}
            isParsed
          >
            {message.content}
          </Typography>
        </div>

        {isUser && message.timestamp && (
          <div className={styles.messageTime}>
            <Typography variant="extraSmallT" color="moreGray">
              {formatTime(message.timestamp)}
            </Typography>
          </div>
        )}
      </div>

      {isUser && (
        <div className={styles.avatarContainer}>
          <Avatar type="user" userEmail={user?.email} />
        </div>
      )}
    </div>
  );
};
