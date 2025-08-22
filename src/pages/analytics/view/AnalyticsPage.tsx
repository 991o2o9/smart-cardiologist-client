import { useState } from 'react';
import { useAnalytics } from '../../../entities/analytics';
import { Loading } from '../../../shared/ui/loading';
import {
  AnalyticsHeader,
  PeriodSelector,
  MetricsGrid,
  ChartsGrid,
  SummarySection,
} from '../../../widgets';
import { LastUpdated } from '../../../shared/ui';
import styles from './AnalyticsPage.module.scss';

export const AnalyticsPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const { data: analytics, isLoading, error } = useAnalytics(selectedPeriod);

  if (isLoading) {
    return (
      <div className={styles.analyticsPage}>
        <div className={styles.loadingContainer}>
          <Loading />
        </div>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className={styles.analyticsPage}>
        <div className={styles.errorContainer}>
          <h2>Data Loading Error</h2>
          <p>Failed to load analytics data. Try refreshing the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.analyticsPage}>
      <div className={styles.container}>
        <AnalyticsHeader />
        <PeriodSelector
          selectedPeriod={selectedPeriod}
          onPeriodChange={setSelectedPeriod}
        />
        <LastUpdated lastUpdated={analytics.last_updated} />
        <MetricsGrid metrics={analytics} />
        <ChartsGrid chartsData={analytics} />
        <SummarySection
          selectedPeriod={selectedPeriod}
          riskLevel={analytics.risk.avg}
          riskTrend={analytics.risk.trend}
        />
      </div>
    </div>
  );
};
