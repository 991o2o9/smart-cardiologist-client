import type { ReactNode } from 'react';
import styles from './AuthLayout.module.scss';

export const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className={styles.authLayout}>
      <div className={`${styles.pulseLine} ${styles.pulseLine1}`}></div>
      <div className={`${styles.pulseLine} ${styles.pulseLine2}`}></div>
      <div className={`${styles.pulseLine} ${styles.pulseLine3}`}></div>

      <div className={`${styles.heart} ${styles.heart1}`}>♥</div>
      <div className={`${styles.heart} ${styles.heart2}`}>♥</div>
      <div className={`${styles.heart} ${styles.heart3}`}>♥</div>

      <div className={`${styles.ecgLine} ${styles.ecgTop}`}>
        <svg viewBox="0 0 200 40" className={styles.ecgSvg}>
          <path
            d="M0,20 L30,20 L35,5 L40,35 L45,10 L50,25 L55,20 L200,20"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
            opacity="0.4"
          />
        </svg>
      </div>

      <div className={`${styles.ecgLine} ${styles.ecgBottom}`}>
        <svg viewBox="0 0 180 30" className={styles.ecgSvg}>
          <path
            d="M0,15 L25,15 L30,5 L35,25 L40,8 L45,18 L50,15 L180,15"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
            opacity="0.3"
          />
        </svg>
      </div>

      <div className={styles.contentWrapper}>{children}</div>
    </div>
  );
};
