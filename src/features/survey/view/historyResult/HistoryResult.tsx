import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { useHistory } from '../../../../entities/survey/model/useHistory';
import styles from './HistoryResult.module.scss';
import { Typography } from '../../../../shared/ui/typography/view/Typography';
import { Button } from '../../../../shared/ui/button/view/Button';
import { Container } from '../../../../shared/ui/container/view/Container';
import type { HistoryItem } from '../../../../entities/survey/api/historyApi';
import { Loading } from '../../../../shared/ui/loading/view/Loading';

interface CircularProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}

const CircularProgress: FC<CircularProgressProps> = ({
  percentage,
  size = 120,
  strokeWidth = 10,
  color = '#0077ff',
}) => {
  const [progress, setProgress] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    let start = 0;
    const step = () => {
      if (start < percentage) {
        start += 1;
        setProgress(start);
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }, [percentage]);

  return (
    <svg width={size} height={size}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#e5e5e5"
        strokeWidth={strokeWidth}
        fill="transparent"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="transparent"
        strokeDasharray={circumference}
        strokeDashoffset={circumference - (circumference * progress) / 100}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.3s ease' }}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy="0.3em"
        fontSize="1.2rem"
        fill={color}
      >
        {progress}%
      </text>
    </svg>
  );
};

interface HistoryResultProps {
  historyId: number;
  onBack: () => void;
}

export const HistoryResult: FC<HistoryResultProps> = ({
  historyId,
  onBack,
}) => {
  const { fetchHistoryById, history } = useHistory();
  const [historyItem, setHistoryItem] = useState<HistoryItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadedId, setLoadedId] = useState<number | null>(null);

  // Try to find item in the already loaded history list first
  const itemFromList = history?.find((item) => item.id === historyId);

  useEffect(() => {
    // If we have the item in the list, use it immediately
    if (itemFromList) {
      setHistoryItem(itemFromList);
      setLoadedId(historyId);
      setLoading(false);
      return;
    }

    // Only load if we don't have this item already loaded
    if (loadedId === historyId && historyItem) {
      setLoading(false);
      return;
    }

    const loadHistoryItem = async () => {
      setLoading(true);
      setError(null);

      try {
        const item = await fetchHistoryById(historyId);
        if (item) {
          setHistoryItem(item);
          setLoadedId(historyId);
        } else {
          setError('History item not found');
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError('Failed to load history item');
      } finally {
        setLoading(false);
      }
    };

    loadHistoryItem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [historyId, itemFromList]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Loading />
      </div>
    );
  }

  if (error || (!historyItem && !loading)) {
    return (
      <Container>
        <div className={styles.errorContainer}>
          <Typography variant="h3" color="error">
            {error || 'History item not found'}
          </Typography>
          <Button variant="primary" onClick={onBack}>
            Back to History
          </Button>
        </div>
      </Container>
    );
  }

  if (!historyItem) {
    return null;
  }

  const riskLevel = historyItem.risk_prediction === 1 ? 'High' : 'Low';
  const riskColor = historyItem.risk_prediction === 1 ? 'error' : 'success';
  const probabilityPercentage = Math.round(historyItem.probability * 100);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Container>
      <div className={styles.resultContainer}>
        <div className={styles.header}>
          <Button
            variant="secondary"
            onClick={onBack}
            className={styles.backButton}
          >
            ← Back to History
          </Button>
          <Typography variant="h1" color="dark">
            Assessment Result #{historyItem.id}
          </Typography>
          <Typography variant="h5" color="ocean-blue">
            Completed on {formatDate(historyItem.created_at)}
          </Typography>
        </div>

        <div className={styles.resultCard}>
          <div className={styles.riskLevel}>
            <Typography variant="h3" color="dark">
              Risk level of heart disease:
            </Typography>
            <Typography variant="h2" color={riskColor}>
              {riskLevel}
            </Typography>
          </div>

          <div className={styles.metrics}>
            <div className={styles.metric}>
              <Typography variant="largeT" color="ocean-blue">
                Probability
              </Typography>
              <CircularProgress
                percentage={probabilityPercentage}
                size={120}
                strokeWidth={10}
                color="#0984e3"
              />
            </div>
          </div>

          <div className={styles.details}>
            <Typography
              variant="h4"
              color="dark"
              className={styles.detailsTitle}
            >
              Assessment Details:
            </Typography>

            <div className={styles.detailsGrid}>
              <div className={styles.detailItem}>
                <Typography variant="bodyT" color="ocean-blue">
                  Age:
                </Typography>
                <Typography variant="bodyT" color="dark">
                  {historyItem.age} years
                </Typography>
              </div>

              <div className={styles.detailItem}>
                <Typography variant="bodyT" color="ocean-blue">
                  Sex:
                </Typography>
                <Typography variant="bodyT" color="dark">
                  {historyItem.sex === 1 ? 'Male' : 'Female'}
                </Typography>
              </div>

              <div className={styles.detailItem}>
                <Typography variant="bodyT" color="ocean-blue">
                  Chest Pain Type:
                </Typography>
                <Typography variant="bodyT" color="dark">
                  {historyItem.cp}
                </Typography>
              </div>

              <div className={styles.detailItem}>
                <Typography variant="bodyT" color="ocean-blue">
                  Blood Pressure:
                </Typography>
                <Typography variant="bodyT" color="dark">
                  {historyItem.trestbps} mmHg
                </Typography>
              </div>

              <div className={styles.detailItem}>
                <Typography variant="bodyT" color="ocean-blue">
                  Cholesterol:
                </Typography>
                <Typography variant="bodyT" color="dark">
                  {historyItem.chol} mg/dl
                </Typography>
              </div>

              <div className={styles.detailItem}>
                <Typography variant="bodyT" color="ocean-blue">
                  Fasting Blood Sugar:
                </Typography>
                <Typography variant="bodyT" color="dark">
                  {historyItem.fbs === 1 ? '> 120 mg/dl' : '≤ 120 mg/dl'}
                </Typography>
              </div>

              <div className={styles.detailItem}>
                <Typography variant="bodyT" color="ocean-blue">
                  ECG Results:
                </Typography>
                <Typography variant="bodyT" color="dark">
                  {historyItem.restecg}
                </Typography>
              </div>

              <div className={styles.detailItem}>
                <Typography variant="bodyT" color="ocean-blue">
                  Max Heart Rate:
                </Typography>
                <Typography variant="bodyT" color="dark">
                  {historyItem.thalach} bpm
                </Typography>
              </div>

              <div className={styles.detailItem}>
                <Typography variant="bodyT" color="ocean-blue">
                  Exercise Angina:
                </Typography>
                <Typography variant="bodyT" color="dark">
                  {historyItem.exang === 1 ? 'Yes' : 'No'}
                </Typography>
              </div>

              <div className={styles.detailItem}>
                <Typography variant="bodyT" color="ocean-blue">
                  ST Depression:
                </Typography>
                <Typography variant="bodyT" color="dark">
                  {historyItem.oldpeak}
                </Typography>
              </div>

              <div className={styles.detailItem}>
                <Typography variant="bodyT" color="ocean-blue">
                  Slope:
                </Typography>
                <Typography variant="bodyT" color="dark">
                  {historyItem.slope}
                </Typography>
              </div>

              <div className={styles.detailItem}>
                <Typography variant="bodyT" color="ocean-blue">
                  Vessels:
                </Typography>
                <Typography variant="bodyT" color="dark">
                  {historyItem.ca}
                </Typography>
              </div>

              <div className={styles.detailItem}>
                <Typography variant="bodyT" color="ocean-blue">
                  Thalassemia:
                </Typography>
                <Typography variant="bodyT" color="dark">
                  {historyItem.thal}
                </Typography>
              </div>

              <div className={styles.detailItem}>
                <Typography variant="bodyT" color="ocean-blue">
                  Pulse Rate:
                </Typography>
                <Typography variant="bodyT" color="dark">
                  {historyItem.pulse} bpm
                </Typography>
              </div>
            </div>
          </div>

          <div className={styles.recommendation}>
            <Typography variant="largeT" color="dark">
              Recommendations:
            </Typography>
            {historyItem.risk_prediction === 1 ? (
              <Typography variant="bodyT" color="dark">
                Consult a cardiologist for a detailed examination. The result
                indicates an increased risk of cardiovascular disease. Monitor
                your blood pressure, cholesterol levels, and maintain a healthy
                lifestyle.
              </Typography>
            ) : (
              <Typography variant="bodyT" color="dark">
                The result shows a low risk of heart disease. Continue
                maintaining a healthy lifestyle and attend regular medical
                check-ups.
              </Typography>
            )}
          </div>
        </div>

        <div className={styles.actions}>
          <Button variant="secondary" onClick={onBack}>
            Back to History
          </Button>
          <Button variant="primary" href="/consultation">
            <Typography variant="buttonT" color="white">
              Book a consultation
            </Typography>
          </Button>
        </div>
      </div>
    </Container>
  );
};
