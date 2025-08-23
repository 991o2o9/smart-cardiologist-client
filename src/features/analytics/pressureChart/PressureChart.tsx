/* eslint-disable @typescript-eslint/no-explicit-any */
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import styles from './PressureChart.module.scss';
import type { FC } from 'react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

interface PressureChartProps {
  systolic: {
    avg: number;
    min: number;
    max: number;
    trend: 'stable' | 'increasing' | 'decreasing';
  };
  diastolic: {
    avg: number | null;
    min: number | null;
    max: number | null;
    trend: 'stable' | 'increasing' | 'decreasing' | null;
  };
}

export const PressureChart: FC<PressureChartProps> = ({
  systolic,
  diastolic,
}) => {
  const generateSystolicData = () => {
    const times = ['06:00', '09:00', '12:00', '15:00', '18:00', '21:00'];
    const baseValue = systolic.avg;

    return times.map((_, index) => {
      let value = baseValue;

      if (index === 0) value = systolic.min;
      else if (index === 5) value = systolic.max;
      else {
        const variation =
          (Math.random() - 0.5) * (systolic.max - systolic.min) * 0.3;
        value = Math.max(
          systolic.min,
          Math.min(systolic.max, baseValue + variation),
        );
      }

      return Math.round(value);
    });
  };

  const generateDiastolicData = () => {
    if (!diastolic.avg) return null;

    const times = ['06:00', '09:00', '12:00', '15:00', '18:00', '21:00'];
    const baseValue = diastolic.avg;

    return times.map((_, index) => {
      let value = baseValue;

      if (index === 0) value = diastolic.min!;
      else if (index === 5) value = diastolic.max!;
      else {
        const variation =
          (Math.random() - 0.5) * (diastolic.max! - diastolic.min!) * 0.3;
        value = Math.max(
          diastolic.min!,
          Math.min(diastolic.max!, baseValue + variation),
        );
      }

      return Math.round(value);
    });
  };

  const datasets = [
    {
      label: 'Systolic Pressure',
      data: generateSystolicData(),
      borderColor: getTrendColor(systolic.trend),
      backgroundColor: getTrendColor(systolic.trend, 0.1),
      borderWidth: 3,
      fill: false,
      tension: 0.4,
      pointBackgroundColor: getTrendColor(systolic.trend),
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2,
      pointRadius: 6,
      pointHoverRadius: 8,
      yAxisID: 'y',
    },
  ];

  if (diastolic.avg) {
    datasets.push({
      label: 'Diastolic Pressure',
      data: generateDiastolicData()!,
      borderColor: getTrendColor(diastolic.trend || 'stable'),
      backgroundColor: getTrendColor(diastolic.trend || 'stable', 0.1),
      borderWidth: 3,
      fill: false,
      tension: 0.4,
      pointBackgroundColor: getTrendColor(diastolic.trend || 'stable'),
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2,
      pointRadius: 6,
      pointHoverRadius: 8,
      yAxisID: 'y',
    });
  }

  const data = {
    labels: ['06:00', '09:00', '12:00', '15:00', '18:00', '21:00'],
    datasets,
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          color: 'var(--text-dark)',
          font: {
            size: 12,
            weight: 500,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: 'var(--ocean-blue)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function (context: any) {
            return `${context.dataset.label}: ${Math.round(
              context.parsed.y,
            )} mmHg`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: 'var(--text-gray)',
          font: {
            size: 12,
            weight: 500,
          },
        },
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        beginAtZero: false,
        min: Math.max(
          0,
          Math.min(systolic.min, diastolic.min || systolic.min) * 0.8,
        ),
        max: Math.max(systolic.max, diastolic.max || systolic.max) * 1.2,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          borderColor: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: 'var(--text-gray)',
          font: {
            size: 12,
            weight: 500,
          },
          callback: function (value: any) {
            return `${Math.round(value)} mmHg`;
          },
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
  };

  return (
    <div className={styles.pressureChart}>
      <Line data={data} options={options} />
    </div>
  );
};

function getTrendColor(trend: string, alpha: number = 1): string {
  switch (trend) {
    case 'increasing':
      return `rgba(239, 68, 68, ${alpha})`;
    case 'decreasing':
      return `rgba(16, 185, 129, ${alpha})`;
    default:
      return `rgba(0, 146, 168, ${alpha})`;
  }
}
