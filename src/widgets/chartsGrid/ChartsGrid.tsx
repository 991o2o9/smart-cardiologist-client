import { PressureChart, PulseChart, RiskChart } from '../../features/analytics';
import { Typography } from '../../shared/ui';
import styles from './ChartsGrid.module.scss';

interface ChartsData {
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

interface ChartsGridProps {
  chartsData: ChartsData;
}

export const ChartsGrid = ({ chartsData }: ChartsGridProps) => {
  return (
    <div className={styles.chartsGrid}>
      <div className={styles.chartCard}>
        <div className={styles.chartHeader}>
          <Typography variant="h3" className={styles.chartTitle}>
            Risk Level Trend
          </Typography>
          <div className={styles.chartAccentLine}></div>
        </div>
        <div className={styles.chartContainer}>
          <RiskChart
            avg={chartsData.risk.avg}
            min={chartsData.risk.min}
            max={chartsData.risk.max}
            trend={chartsData.risk.trend}
          />
        </div>
      </div>

      <div className={styles.chartCard}>
        <div className={styles.chartHeader}>
          <Typography variant="h3" className={styles.chartTitle}>
            Pulse Trend
          </Typography>
          <div className={styles.chartAccentLine}></div>
        </div>
        <div className={styles.chartContainer}>
          <PulseChart
            avg={chartsData.pulse.avg}
            min={chartsData.pulse.min}
            max={chartsData.pulse.max}
            trend={chartsData.pulse.trend}
          />
        </div>
      </div>

      <div className={styles.chartCard}>
        <div className={styles.chartHeader}>
          <Typography variant="h3" className={styles.chartTitle}>
            Blood Pressure Trend
          </Typography>
          <div className={styles.chartAccentLine}></div>
        </div>
        <div className={styles.chartContainer}>
          <PressureChart
            systolic={{
              avg: chartsData.pressure.avg.systolic,
              min: chartsData.pressure.min.systolic,
              max: chartsData.pressure.max.systolic,
              trend: chartsData.pressure.trend.systolic,
            }}
            diastolic={{
              avg: chartsData.pressure.avg.diastolic,
              min: chartsData.pressure.min.diastolic,
              max: chartsData.pressure.max.diastolic,
              trend: chartsData.pressure.trend.diastolic,
            }}
          />
        </div>
      </div>
    </div>
  );
};
