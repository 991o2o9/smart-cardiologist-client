import { Clock } from 'lucide-react';
import { Typography } from '../index';
import styles from './LastUpdated.module.scss';

interface LastUpdatedProps {
  lastUpdated: string;
}

export const LastUpdated = ({ lastUpdated }: LastUpdatedProps) => {
  const formatLastUpdated = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={styles.lastUpdated}>
      <Clock className={styles.clockIcon} />
      <Typography variant="bodyT" className={styles.text}>
        Last Updated: {formatLastUpdated(lastUpdated)}
      </Typography>
    </div>
  );
};
