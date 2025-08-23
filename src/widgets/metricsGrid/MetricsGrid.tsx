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

const formatNumber = (num: number | null, digits = 2) => {
  if (num === null || num === undefined) return '-';
  return Number(num.toFixed(digits));
};

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
      {/* Risk */}
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
          {formatNumber(metrics.risk.avg)}
        </Typography>
        <div className={styles.metricRange}>
          <Typography variant="smallT">
            Min: {formatNumber(metrics.risk.min)}
          </Typography>
          <Typography variant="smallT">
            Max: {formatNumber(metrics.risk.max)}
          </Typography>
        </div>
      </div>

      {/* Pulse */}
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
          {formatNumber(metrics.pulse.avg, 1)}{' '}
          <span className={styles.unit}>bpm</span>
        </Typography>
        <div className={styles.metricRange}>
          <Typography variant="smallT">
            Min: {formatNumber(metrics.pulse.min, 1)}
          </Typography>
          <Typography variant="smallT">
            Max: {formatNumber(metrics.pulse.max, 1)}
          </Typography>
        </div>
      </div>

      {/* Pressure */}
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
          {formatNumber(metrics.pressure.avg.systolic)}{' '}
          <span className={styles.unit}>mmHg</span>
        </Typography>
        <div className={styles.metricRange}>
          <Typography variant="smallT">
            Min: {formatNumber(metrics.pressure.min.systolic)}
          </Typography>
          <Typography variant="smallT">
            Max: {formatNumber(metrics.pressure.max.systolic)}
          </Typography>
        </div>
      </div>
    </div>
  );
};
