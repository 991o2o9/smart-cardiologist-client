import { Typography } from '../../shared/ui';
import styles from './SummarySection.module.scss';

interface SummarySectionProps {
  selectedPeriod: string;
  riskLevel: number;
  riskTrend: string;
}

export const SummarySection = ({
  selectedPeriod,
  riskLevel,
  riskTrend,
}: SummarySectionProps) => {
  const getPeriodText = (period: string) => {
    switch (period) {
      case 'week':
        return 'Week';
      case 'month':
        return 'Month';
      default:
        return 'Week';
    }
  };

  const getHealthStatus = (risk: number) => {
    if (risk <= 2) return 'Good';
    if (risk <= 4) return 'Satisfactory';
    return 'Requires Attention';
  };

  const getRecommendation = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return 'Consultation with a doctor is recommended';
      case 'decreasing':
        return 'Continue monitoring your health';
      default:
        return 'Indicators are stable, continue monitoring';
    }
  };

  return (
    <div className={styles.summarySection}>
      <Typography variant="h2" className={styles.summaryTitle}>
        Overall Analysis
      </Typography>
      <div className={styles.summaryContent}>
        <div className={styles.summaryItem}>
          <Typography variant="h3" className={styles.summaryItemTitle}>
            Analysis Period
          </Typography>
          <Typography variant="bodyT" className={styles.summaryItemText}>
            {getPeriodText(selectedPeriod)}
          </Typography>
        </div>
        <div className={styles.summaryItem}>
          <Typography variant="h3" className={styles.summaryItemTitle}>
            Health Status
          </Typography>
          <Typography variant="bodyT" className={styles.healthStatus}>
            {getHealthStatus(riskLevel)}
          </Typography>
        </div>
        <div className={styles.summaryItem}>
          <Typography variant="h3" className={styles.summaryItemTitle}>
            Recommendations
          </Typography>
          <Typography variant="bodyT" className={styles.summaryItemText}>
            {getRecommendation(riskTrend)}
          </Typography>
        </div>
      </div>
    </div>
  );
};
