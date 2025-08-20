import type { FC } from 'react';
import styles from './SurveyNavigation.module.scss';
import { useSurvey } from '../../../../entities/survey/model/useSurvey';
import { questions } from '../../../../shared/constants/surveyQuestions';
import { Button } from '../../../../shared/ui/button/view/Button';
import { Typography } from '../../../../shared/ui/typography/view/Typography';

interface SurveyNavigationProps {
  onSkip?: () => void;
  onNext?: () => void;
  onSubmit?: () => void;
}

export const SurveyNavigation: FC<SurveyNavigationProps> = ({
  onSkip,
  onNext,
  onSubmit,
}) => {
  const { currentStep, isLoading, prevStep } = useSurvey();

  const isLastStep = currentStep === questions.length - 1;
  const canGoBack = currentStep > 0;

  const handleNext = () => {
    if (isLastStep) {
      onSubmit?.();
    } else {
      onNext?.();
    }
  };

  const handleSkip = () => {
    onSkip?.();
  };

  return (
    <div className={styles.navigationContainer}>
      <div className={styles.leftButtons}>
        {canGoBack && (
          <Button variant="primary" onClick={prevStep} disabled={isLoading}>
            <Typography variant="buttonT" color="white">
              Back
            </Typography>
          </Button>
        )}
      </div>

      <div className={styles.rightButtons}>
        <Button variant="primary" onClick={handleSkip} disabled={isLoading}>
          <Typography variant="buttonT" color="white">
            {isLastStep ? 'Finish without answer' : 'Skip'}
          </Typography>
        </Button>

        <Button variant="primary" onClick={handleNext} disabled={isLoading}>
          <Typography variant="buttonT" color="white">
            {isLoading ? 'Loading...' : isLastStep ? 'Get result' : 'Next'}
          </Typography>
        </Button>
      </div>
    </div>
  );
};
