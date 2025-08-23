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
              avg: Math.round(chartsData.pressure.avg.systolic * 100) / 100,
              min: Math.round(chartsData.pressure.min.systolic * 100) / 100,
              max: Math.round(chartsData.pressure.max.systolic * 100) / 100,
              trend: chartsData.pressure.trend.systolic,
            }}
            diastolic={{
              avg: chartsData.pressure.avg.diastolic
                ? Math.round(chartsData.pressure.avg.diastolic * 100) / 100
                : null,
              min: chartsData.pressure.min.diastolic
                ? Math.round(chartsData.pressure.min.diastolic * 100) / 100
                : null,
              max: chartsData.pressure.max.diastolic
                ? Math.round(chartsData.pressure.max.diastolic * 100) / 100
                : null,
              trend: chartsData.pressure.trend.diastolic,
            }}
          />
        </div>
      </div>
    </div>
  );
};
