import type { FC } from 'react';

import styles from './SurveyProgress.module.scss';
import { useSurvey } from '../../../../entities/survey/model/useSurvey';
import { Typography } from '../../../../shared/ui/typography/view/Typography';
import { questions } from '../../../../shared/constants/surveyQuestions';

export const SurveyProgress: FC = () => {
  const { currentStep, getFilledFieldsCount } = useSurvey();

  const progress = ((currentStep + 1) / questions.length) * 100;
  const filledFieldsCount = getFilledFieldsCount();
  const completionPercentage = Math.round(
    (filledFieldsCount / questions.length) * 100,
  );

  return (
    <div className={styles.progressContainer}>
      <div className={styles.progressHeader}>
        <Typography variant="largeT" color="dark">
          Question {currentStep + 1} of {questions.length}
        </Typography>
        <Typography variant="largeT" color="dark">
          {Math.round(progress)}% completed
        </Typography>
      </div>

      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className={styles.accuracyInfo}>
        <Typography variant="bodyT" color="ocean-blue">
          Survey completion: {completionPercentage}%
        </Typography>
        {completionPercentage < 100 && (
          <Typography variant="bodyT" color="error">
            With each skipped answer, the prediction accuracy may decrease. For
            the most accurate result, it is recommended to complete all fields.
          </Typography>
        )}
      </div>
    </div>
  );
};
