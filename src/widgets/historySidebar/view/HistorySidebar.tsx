import { type FC, useEffect } from 'react';
import { Trash2, Trash } from 'lucide-react';
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
    if (window.confirm('Вы уверены, что хотите удалить всю историю чатов?')) {
      try {
        await deleteAllHistory();
        toaster('success', 'Вся история чатов успешно удалена');
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toaster('error', 'Не удалось удалить историю чатов');
      }
    }
  };

  const handleDeleteChat = async (chatId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    if (window.confirm('Вы уверены, что хотите удалить этот чат?')) {
      try {
        await deleteChat(chatId);
        toaster('success', 'Чат успешно удален');
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toaster('error', 'Не удалось удалить чат');
      }
    }
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <Typography variant="h4" weight="bold" color="dark">
          История чатов
        </Typography>
        <div className={styles.headerButtons}>
          <Button variant="secondary" onClick={createNewChat}>
            Новый чат
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

      <div className={styles.list}>
        {isHistoryLoading && (
          <Typography variant="bodyT" color="dark">
            Загрузка...
          </Typography>
        )}

        {!isHistoryLoading && history.length === 0 && (
          <Typography variant="bodyT" color="dark">
            История пуста
          </Typography>
        )}

        {!isHistoryLoading &&
          history.map((item) => (
            <div key={item.id} className={styles.itemContainer}>
              <button className={styles.item} onClick={() => openChat(item.id)}>
                <div className={styles.itemTitle}>
                  {item.summary || 'Без темы'}
                </div>
                <div className={styles.itemMeta}>
                  {new Date(item.updated_at).toLocaleString()}
                </div>
              </button>
              <button
                className={styles.deleteButton}
                onClick={(e) => handleDeleteChat(item.id, e)}
                title="Удалить чат"
              >
                <Trash size={14} />
              </button>
            </div>
          ))}
      </div>
    </aside>
  );
};
