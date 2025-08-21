import {
  Activity,
  BrainCircuit,
  ChartLine,
  MessageCircleMore,
} from 'lucide-react';
import { Container, Typography } from '../../../shared/ui';
import styles from './AboutBlock.module.scss';

export const AboutBlock = () => {
  const aboutData = [
    {
      icon: <BrainCircuit />,
      title: 'AI-Driven Risk Analysis',
      description:
        'Receive accurate predictions of heart disease risks using advanced algorithms and your personal health data.',
      id: 1,
    },
    {
      icon: <MessageCircleMore />,
      title: 'Smart Health Guidance',
      description:
        'Chat with an AI cardiologist and get personalized advice designed to improve lifestyle and support heart health.',
      id: 2,
    },
    {
      icon: <Activity />,
      title: 'Contactless Pulse Check',
      description:
        'Easily measure your heart rate in real time using only your device’s camera — no extra devices or wearables needed.',
      id: 3,
    },
    {
      icon: <ChartLine />,
      title: 'Insightful Health Tracking',
      description:
        'Track your heart condition with clear charts and trends that help you stay informed and motivated every single day.',
      id: 4,
    },
  ];

  return (
    <Container>
      <div className={styles.aboutBlock}>
        <Typography variant="h1" className={styles.title}>
          Your Heart Health, Reimagined.
        </Typography>
        <div className={styles.cardsList}>
          {aboutData.map((item) => (
            <div key={item.id} className={styles.card}>
              <div className={styles.icon}>{item.icon}</div>
              <div className={styles.description}>
                <Typography
                  variant="h2"
                  className={styles.cardTitle}
                  weight="semiBold"
                >
                  {item.title}
                </Typography>
                <Typography
                  variant="largeT"
                  className={styles.cardDescription}
                  color="moreGray"
                >
                  {item.description}
                </Typography>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
};
