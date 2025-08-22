import type { FC } from 'react';
import styles from './Loading.module.scss';

export const Loading: FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.heart}></div>
      <h1 className={styles.title}>AI Smart Cardiologist</h1>
      <p className={styles.subtitle}>Analyzing your heart data…</p>
    </div>
  );
};
