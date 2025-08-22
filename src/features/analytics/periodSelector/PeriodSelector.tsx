import type { FC } from 'react';
import styles from './PeriodSelector.module.scss';

interface PeriodSelectorProps {
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
}

const periods = [
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
];

export const PeriodSelector: FC<PeriodSelectorProps> = ({
  selectedPeriod,
  onPeriodChange,
}) => {
  return (
    <div className={styles.periodSelector}>
      <h3 className={styles.title}>Analysis Period</h3>
      <div className={styles.buttons}>
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
