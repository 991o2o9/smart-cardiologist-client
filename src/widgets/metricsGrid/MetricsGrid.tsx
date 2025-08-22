import React from 'react';
import { Heart, Activity, AlertTriangle } from 'lucide-react';
import styles from './MetricsGrid.module.scss';
import { Typography } from '../../shared/ui';

interface MetricsData {
  risk: {
    avg: number;
    min: number;
    max: number;
    trend: 'stable' | 'increasing' | 'decreasing';
  };
  pulse: {
    avg: number;
    min: number;
    max: number;
    trend: 'stable' | 'increasing' | 'decreasing';
  };
  pressure: {
    avg: {
      systolic: number;
      diastolic: number | null;
    };
    min: {
      systolic: number;
      diastolic: number | null;
    };
    max: {
      systolic: number;
      diastolic: number | null;
    };
    trend: {
      systolic: 'stable' | 'increasing' | 'decreasing';
      diastolic: 'stable' | 'increasing' | 'decreasing' | null;
    };
  };
}

interface MetricsGridProps {
  metrics: MetricsData;
}

export const MetricsGrid = ({ metrics }: MetricsGridProps) => {
  const getTrendText = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return 'Increasing';
      case 'decreasing':
        return 'Decreasing';
      default:
        return 'Stable';
    }
  };

  return (
    <div className={styles.metricsGrid}>
      <div
        className={styles.metricCard}
        style={{ '--accent-color': 'var(--error)' } as React.CSSProperties}
      >
        <div className={styles.metricHeader}>
          <div className={styles.metricTitleSection}>
            <Typography variant="h3" className={styles.metricTitle}>
              Risk Level
            </Typography>
            <AlertTriangle className={styles.metricIcon} />
          </div>
          <div className={styles.trendIndicator}>
            <Typography variant="smallT" className={styles.trendText}>
              {getTrendText(metrics.risk.trend)}
            </Typography>
          </div>
        </div>
        <Typography variant="h1" className={styles.metricValue}>
          {metrics.risk.avg}
        </Typography>
        <div className={styles.metricRange}>
          <Typography variant="smallT">Min: {metrics.risk.min}</Typography>
          <Typography variant="smallT">Max: {metrics.risk.max}</Typography>
        </div>
      </div>

      <div
        className={styles.metricCard}
        style={{ '--accent-color': 'var(--ocean-blue)' } as React.CSSProperties}
      >
        <div className={styles.metricHeader}>
          <div className={styles.metricTitleSection}>
            <Typography variant="h3" className={styles.metricTitle}>
              Pulse
            </Typography>
            <Activity className={styles.metricIcon} />
          </div>
          <div className={styles.trendIndicator}>
            <Typography variant="smallT" className={styles.trendText}>
              {getTrendText(metrics.pulse.trend)}
            </Typography>
          </div>
        </div>
        <Typography variant="h1" className={styles.metricValue}>
          {metrics.pulse.avg} <span className={styles.unit}>bpm</span>
        </Typography>
        <div className={styles.metricRange}>
          <Typography variant="smallT">Min: {metrics.pulse.min}</Typography>
          <Typography variant="smallT">Max: {metrics.pulse.max}</Typography>
        </div>
      </div>

      <div
        className={styles.metricCard}
        style={{ '--accent-color': 'var(--dark-blue)' } as React.CSSProperties}
      >
        <div className={styles.metricHeader}>
          <div className={styles.metricTitleSection}>
            <Typography variant="h3" className={styles.metricTitle}>
              Systolic Pressure
            </Typography>
            <Heart className={styles.metricIcon} />
          </div>
          <div className={styles.trendIndicator}>
            <Typography variant="smallT" className={styles.trendText}>
              {getTrendText(metrics.pressure.trend.systolic)}
            </Typography>
          </div>
        </div>
        <Typography variant="h1" className={styles.metricValue}>
          {metrics.pressure.avg.systolic}{' '}
          <span className={styles.unit}>mmHg</span>
        </Typography>
        <div className={styles.metricRange}>
          <Typography variant="smallT">
            Min: {metrics.pressure.min.systolic}
          </Typography>
          <Typography variant="smallT">
            Max: {metrics.pressure.max.systolic}
          </Typography>
        </div>
      </div>
    </div>
  );
};
