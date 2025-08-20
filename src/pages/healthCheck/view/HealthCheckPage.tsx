import {
  QuestionInput,
  SurveyNavigation,
  SurveyProgress,
  SurveyResult,
} from '../../../features/survey';
import styles from './HealthCheckPage.module.scss';
import {
  useSurvey,
  initializeSurveyFromStorage,
  useSurveyCleanup,
} from '../../../entities/survey/model/useSurvey';
import { questions } from '../../../shared/constants/surveyQuestions';
import { Container } from '../../../shared/ui/container/view/Container';
import { Typography } from '../../../shared/ui/typography/view/Typography';
import { toaster } from '../../../shared/lib/toaster/toaster';
import { useEffect } from 'react';

export const HealthCheckPage = () => {
  const {
    currentStep,
    surveyData,
    result,
    error,
    updateSurveyData,
    clearField,
    nextStep,
    submitSurvey,
  } = useSurvey();

  useEffect(() => {
    const wasRestored = initializeSurveyFromStorage();

    if (wasRestored) {
      toaster(
        'info',
        'Your data has been restored. You may continue the survey from where you left off.',
      );
    }
  }, []);

  useSurveyCleanup();

  if (result) {
    return <SurveyResult />;
  }

  const currentQuestion = questions[currentStep];
  const isLastStep = currentStep === questions.length - 1;

  const handleInputChange = (value: number | undefined) => {
    updateSurveyData(currentQuestion.id, value);
  };

  const handleNext = () => {
    if (isLastStep) {
      submitSurvey();
    } else {
      nextStep();
    }
  };

  const handleSkip = () => {
    if (surveyData[currentQuestion.id] !== undefined) {
      clearField(currentQuestion.id);
    }

    if (isLastStep) {
      submitSurvey();
    } else {
      nextStep();
    }
  };

  return (
    <Container>
      <div className={styles.surveyContainer}>
        <div className={styles.header}>
          <Typography variant="h1" color="dark">
            Heart Disease Risk Assessment
          </Typography>
          <Typography variant="h4" color="ocean-blue">
            Answer the questions to receive a personalized analysis
          </Typography>
        </div>

        <div className={styles.surveyContent}>
          <SurveyProgress />

          <div className={styles.questionSection}>
            <QuestionInput
              question={currentQuestion}
              value={surveyData[currentQuestion.id]}
              onChange={handleInputChange}
            />
          </div>

          {error && (
            <div className={styles.errorMessage}>
              <Typography variant="largeT" color="error">
                {error}
              </Typography>
            </div>
          )}

          <SurveyNavigation
            onNext={handleNext}
            onSkip={handleSkip}
            onSubmit={submitSurvey}
          />
        </div>
      </div>
    </Container>
  );
};
