import { Loader2 } from 'lucide-react';
import styles from './MessagesList.module.scss';
import { useEffect, useRef, type FC } from 'react';
import { useChatStore } from '../../../entities/aiChat';
import { Typography } from '../../../shared/ui';
import { Message } from '../../../features/aiChat';

export const MessagesList: FC = () => {
  const { messages, isLoading, error } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div className={styles.messagesList}>
      <div className={styles.messagesContainer}>
        {messages.map((message, index) => (
          <Message
            key={`${message.role}-${index}-${message.timestamp}`}
            message={message}
          />
        ))}
        {isLoading && (
          <div className={styles.loadingMessage}>
            <div className={styles.avatarContainer}>
              <div className={styles.avatarAssistant}>
                <Loader2 size={18} color="white" className={styles.spinner} />
              </div>
            </div>
            <div className={styles.loadingBubble}>
              <div className={styles.typingIndicator}>
                <span className={styles.dot}></span>
                <span className={styles.dot}></span>
                <span className={styles.dot}></span>
              </div>
              <Typography
                variant="bodyT"
                color="dark"
                className={styles.typingText}
              >
                HeartSync Advisor is typing...
              </Typography>
            </div>
          </div>
        )}
        {error && (
          <div className={styles.errorMessage}>
            <Typography variant="bodyT" color="error">
              {error}
            </Typography>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};
