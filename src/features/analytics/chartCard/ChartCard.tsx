import { type FC } from 'react';
import styles from './ChartCard.module.scss';

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  color?: string;
}

export const ChartCard: FC<ChartCardProps> = ({
  title,
  children,
  color = 'var(--ocean-blue)',
}) => {
  return (
    <div
      className={styles.chartCard}
      style={{ '--accent-color': color } as React.CSSProperties}
    >
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.accentLine}></div>
      </div>
      <div className={styles.chartContainer}>{children}</div>
    </div>
  );
};
