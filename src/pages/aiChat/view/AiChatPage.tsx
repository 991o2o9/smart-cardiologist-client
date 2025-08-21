import { useEffect, type FC } from 'react';
import { useChatStore } from '../../../entities/aiChat';
import styles from './AiChatPage.module.scss';
import { Container, Typography } from '../../../shared/ui';
import { MessagesList } from '../../../widgets/messagesList';
import { ChatInput } from '../../../features/aiChat';
import { HistorySidebar } from '../../../widgets/historySidebar';
import { useAuth } from '../../../shared/hooks/useAuth';

export const AiChatPage: FC = () => {
  const { loadActiveChat, loadHistory } = useChatStore();
  const { isAuth } = useAuth();

  useEffect(() => {
    if (isAuth) {
      loadActiveChat();
      loadHistory();
    }
  }, [isAuth, loadActiveChat, loadHistory]);

  return (
    <div className={styles.chatPage}>
      <Container>
        <div className={styles.chatHeader}>
          <Typography variant="h2" weight="bold" color="dark">
            AI Кардиолог
          </Typography>
          <Typography variant="bodyT" color="dark">
            Персональные консультации и рекомендации для вашего здоровья
          </Typography>
        </div>

        <div className={styles.chatContainer}>
          {isAuth && <HistorySidebar />}
          <div className={styles.chatMain}>
            <MessagesList />
            <ChatInput />
          </div>
        </div>
      </Container>
    </div>
  );
};
