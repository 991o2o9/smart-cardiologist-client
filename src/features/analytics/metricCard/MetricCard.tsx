import { type FC } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import styles from './MetricCard.module.scss';

interface MetricCardProps {
  title: string;
  value: number | string;
  unit?: string;
  min?: number;
  max?: number;
  trend: 'stable' | 'increasing' | 'decreasing';
  color: string;
  icon?: React.ReactNode;
}

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case 'increasing':
      return <TrendingUp className={styles.trendIcon} />;
    case 'decreasing':
      return <TrendingDown className={styles.trendIcon} />;
    default:
      return <Minus className={styles.trendIcon} />;
  }
};

const getTrendColor = (trend: string) => {
  switch (trend) {
    case 'increasing':
      return 'var(--error)';
    case 'decreasing':
      return '#10b981';
    default:
      return 'var(--text-gray)';
  }
};

export const MetricCard: FC<MetricCardProps> = ({
  title,
  value,
  unit,
  min,
  max,
  trend,
  color,
  icon,
}) => {
  return (
    <div
      className={styles.metricCard}
      style={{ '--accent-color': color } as React.CSSProperties}
    >
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h3 className={styles.title}>{title}</h3>
          {icon && <div className={styles.icon}>{icon}</div>}
        </div>
        <div
          className={styles.trendIndicator}
          style={{ color: getTrendColor(trend) }}
        >
          {getTrendIcon(trend)}
        </div>
      </div>

      <div className={styles.valueSection}>
        <div className={styles.mainValue}>
          {value}
          {unit && <span className={styles.unit}>{unit}</span>}
        </div>

        {(min !== undefined || max !== undefined) && (
          <div className={styles.range}>
            {min !== undefined && (
              <span className={styles.rangeItem}>
                <span className={styles.rangeLabel}>Мин:</span>
                <span className={styles.rangeValue}>
                  {min}
                  {unit}
                </span>
              </span>
            )}
            {max !== undefined && (
              <span className={styles.rangeItem}>
                <span className={styles.rangeLabel}>Макс:</span>
                <span className={styles.rangeValue}>
                  {max}
                  {unit}
                </span>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
