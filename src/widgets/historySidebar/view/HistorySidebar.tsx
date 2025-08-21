import { type FC, useEffect } from 'react';
import styles from './HistorySidebar.module.scss';
import { useChatStore } from '../../../entities/aiChat';
import { Button } from '../../../shared/ui/button/view/Button';
import { Typography } from '../../../shared/ui/typography/view/Typography';

export const HistorySidebar: FC = () => {
  const { history, isHistoryLoading, openChat, createNewChat, loadHistory } =
    useChatStore();

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <Typography variant="h4" weight="bold" color="dark">
          История чатов
        </Typography>
        <Button variant="secondary" onClick={createNewChat}>
          Новый чат
        </Button>
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
            <button
              key={item.id}
              className={styles.item}
              onClick={() => openChat(item.id)}
            >
              <div className={styles.itemTitle}>
                {item.summary || 'Без темы'}
              </div>
              <div className={styles.itemMeta}>
                {new Date(item.updated_at).toLocaleString()}
              </div>
            </button>
          ))}
      </div>
    </aside>
  );
};
