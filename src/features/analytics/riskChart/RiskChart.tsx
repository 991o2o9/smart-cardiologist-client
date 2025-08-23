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
import styles from './RiskChart.module.scss';
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

interface RiskChartProps {
  avg: number;
  min: number;
  max: number;
  trend: 'stable' | 'increasing' | 'decreasing';
}

export const RiskChart: FC<RiskChartProps> = ({ avg, min, max, trend }) => {
  const generateData = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const baseValue = avg;

    return days.map((_, index) => {
      let value = baseValue;

      if (index === 0) value = min;
      else if (index === 6) value = max;
      else {
        const variation = (Math.random() - 0.5) * (max - min) * 0.3;
        value = Math.max(min, Math.min(max, baseValue + variation));
      }

      return Math.round(value * 10) / 10;
    });
  };

  const data = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Cardiac Risk Score',
        data: generateData(),
        borderColor: getTrendColor(trend),
        backgroundColor: getTrendColor(trend, 0.1),
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: getTrendColor(trend),
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: getTrendColor(trend),
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: function (context: any) {
            return `Risk Score: ${context.parsed.y}`;
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
        beginAtZero: true,
        max: Math.max(max * 1.2, 5),
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
            return value.toFixed(1);
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
    <div className={styles.riskChart}>
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
