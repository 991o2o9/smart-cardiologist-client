import { paths } from '../../../shared/constants/constants';
import { Button } from '../../../shared/ui/button/view/Button';
import { Container } from '../../../shared/ui/container/view/Container';
import { Typography } from '../../../shared/ui/typography/view/Typography';
import styles from './HeroBlock.module.scss';
import banner from '../../../shared/assets/icons/fitness-app-77.svg';

export const HeroBlock = () => {
  return (
    <Container>
      <div className={styles.heroBlock}>
        <div className={styles.textPart}>
          <div className={styles.titleContainer}>
            <Typography
              variant="h1"
              color="ocean-blue"
              className={styles.mainH1}
            >
              PulseAI — your AI-powered heart health companion
            </Typography>
            <div className={styles.titleAccent}></div>
          </div>

          <Typography variant="h2" color="dark" className={styles.subtitle}>
            Smarter insights for a stronger heart
          </Typography>

          <Typography
            variant="h5"
            color="moreGray"
            className={styles.description}
          >
            PulseAI combines advanced artificial intelligence with medical
            expertise to assess heart risks, deliver personalized
            recommendations, answer your questions in real time, and track your
            pulse with precision. Stay proactive, stay healthy, and take charge
            of your heart&apos;s future today.
          </Typography>

          <div className={styles.buttonContainer}>
            <Button
              variant="primary"
              to={paths.healthCheck}
              size="large"
              className={styles.ctaButton}
            >
              <Typography variant="buttonT" color="white">
                Start Health Check
              </Typography>
            </Button>
            <div className={styles.buttonGlow}></div>
          </div>
        </div>

        <div className={styles.bannerPart}>
          <div className={styles.imageContainer}>
            <div className={styles.imageBackground}></div>
            <div className={styles.floatingElements}>
              <div className={styles.pulse1}></div>
              <div className={styles.pulse2}></div>
              <div className={styles.pulse3}></div>
            </div>
            <img
              src={banner}
              alt="Heart Health AI Companion"
              className={styles.bannerImage}
            />
          </div>
        </div>
      </div>
    </Container>
  );
};
