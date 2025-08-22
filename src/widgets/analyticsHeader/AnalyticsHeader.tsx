import { Typography } from '../../shared/ui';
import styles from './AnalyticsHeader.module.scss';

export const AnalyticsHeader = () => {
  return (
    <div className={styles.header}>
      <Typography variant="h1" color="dark" className={styles.title}>
        Health Analytics
      </Typography>
      <Typography variant="h4" className={styles.subtitle}>
        Monitoring key indicators of your health
      </Typography>
    </div>
  );
};
