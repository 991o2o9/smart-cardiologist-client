import type { FC } from 'react';
import { useSurvey } from '../../../../entities/survey/model/useSurvey';
import styles from './SurveyResult.module.scss';
import { Typography } from '../../../../shared/ui/typography/view/Typography';
import { Button } from '../../../../shared/ui/button/view/Button';
import { Container } from '../../../../shared/ui/container/view/Container';
import { useEffect, useState } from 'react';

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

export const SurveyResult: FC = () => {
  const { result, resetSurvey } = useSurvey();

  if (!result) return null;

  const riskLevel = result.risk === 1 ? 'High' : 'Low';
  const riskColor = result.risk === 1 ? 'error' : 'success';
  const accuracyPercentage = parseInt(result.accuracy.replace('%', ''), 10);

  return (
    <Container>
      <div className={styles.resultContainer}>
        <div className={styles.header}>
          <Typography variant="h1" color="dark">
            Analysis Result
          </Typography>
          <Typography variant="h5" color="ocean-blue">
            The result is based on the provided data and does not replace a
            doctor&apos;s consultation
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
                percentage={Math.round(result.probability * 100)}
                size={120}
                strokeWidth={10}
                color="#0984e3"
              />
            </div>

            <div className={styles.metric}>
              <Typography variant="largeT" color="ocean-blue">
                Analysis accuracy
              </Typography>
              <CircularProgress
                percentage={accuracyPercentage}
                size={120}
                strokeWidth={10}
                color="#00b894"
              />
            </div>
          </div>

          {result.message && (
            <div className={styles.accuracyWarning}>
              <Typography variant="largeT" color="ocean-blue">
                {result.message}
              </Typography>
            </div>
          )}

          <div className={styles.recommendation}>
            <Typography variant="largeT" color="dark">
              Recommendations:
            </Typography>
            {result.risk === 1 ? (
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
          <Button variant="secondary" onClick={resetSurvey}>
            Retake the survey
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
