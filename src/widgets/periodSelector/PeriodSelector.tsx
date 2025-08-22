import { Typography } from '../../shared/ui';
import styles from './PeriodSelector.module.scss';

interface PeriodSelectorProps {
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
}

export const PeriodSelector = ({
  selectedPeriod,
  onPeriodChange,
}: PeriodSelectorProps) => {
  const periods = [
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
  ];

  return (
    <div className={styles.periodSelector}>
      <Typography variant="h3" className={styles.periodTitle}>
        Analysis Period
      </Typography>
      <div className={styles.periodButtons}>
        {periods.map((period) => (
          <button
            key={period.value}
            className={`${styles.periodButton} ${
              selectedPeriod === period.value ? styles.active : ''
            }`}
            onClick={() => onPeriodChange(period.value)}
          >
            {period.label}
          </button>
        ))}
      </div>
    </div>
  );
};
