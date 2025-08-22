import { type FC, useEffect } from 'react';
import { Trash2, Trash, MessageCircle, Clock } from 'lucide-react';
import styles from './HistorySidebar.module.scss';
import { useChatStore } from '../../../entities/aiChat';
import { Button } from '../../../shared/ui/button/view/Button';
import { Typography } from '../../../shared/ui/typography/view/Typography';
import { toaster } from '../../../shared/lib/toaster/toaster';

export const HistorySidebar: FC = () => {
  const {
    history,
    isHistoryLoading,
    openChat,
    createNewChat,
    loadHistory,
    deleteAllHistory,
    deleteChat,
  } = useChatStore();

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handleDeleteAllHistory = async () => {
    if (window.confirm('Are you sure you want to delete all chat history?')) {
      try {
        await deleteAllHistory();
        toaster('success', 'All chat history successfully deleted');
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toaster('error', 'Failed to delete chat history');
      }
    }
  };

  const handleDeleteChat = async (chatId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    if (window.confirm('Are you sure you want to delete this chat?')) {
      try {
        await deleteChat(chatId);
        toaster('success', 'Chat successfully deleted');
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toaster('error', 'Failed to delete chat');
      }
    }
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <MessageCircle size={20} className={styles.headerIcon} />
          <Typography variant="h4" weight="bold" color="dark">
            Chat History
          </Typography>
        </div>
        <div className={styles.headerButtons}>
          <Button
            variant="secondary"
            onClick={createNewChat}
            className={styles.newChatButton}
          >
            New Chat
          </Button>
          {history.length > 0 && (
            <Button
              variant="danger"
              onClick={handleDeleteAllHistory}
              className={styles.deleteAllButton}
            >
              <Trash2 size={16} />
            </Button>
          )}
        </div>
      </div>

      <div className={styles.content}>
        {isHistoryLoading && (
          <div className={styles.emptyState}>
            <div className={styles.loadingSpinner}></div>
            <Typography
              variant="bodyT"
              color="dark"
              className={styles.emptyText}
            >
              Loading...
            </Typography>
          </div>
        )}

        {!isHistoryLoading && history.length === 0 && (
          <div className={styles.emptyState}>
            <MessageCircle size={48} className={styles.emptyIcon} />
            <Typography
              variant="bodyT"
              color="dark"
              className={styles.emptyText}
            >
              No conversations yet
            </Typography>
            <Typography
              variant="bodyT"
              color="dark"
              className={styles.emptySubtext}
            >
              Start a new chat to see your history here
            </Typography>
          </div>
        )}

        <div className={styles.list}>
          {!isHistoryLoading &&
            history.map((item) => (
              <div key={item.id} className={styles.itemContainer}>
                <button
                  className={styles.item}
                  onClick={() => openChat(item.id)}
                >
                  <div className={styles.itemContent}>
                    <div className={styles.itemTitle}>
                      {item.summary || 'Untitled conversation'}
                    </div>
                    <div className={styles.itemMeta}>
                      <Clock size={12} className={styles.clockIcon} />
                      {new Date(item.updated_at).toLocaleString()}
                    </div>
                  </div>
                </button>
                <button
                  className={styles.deleteButton}
                  onClick={(e) => handleDeleteChat(item.id, e)}
                  title="Delete chat"
                >
                  <Trash size={14} />
                </button>
              </div>
            ))}
        </div>
      </div>
    </aside>
  );
};
