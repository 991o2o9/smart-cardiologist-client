import type { FC } from 'react';
import styles from './QuestionInput.module.scss';
import type { Question } from '../../../../shared/types/survey';
import { Input } from '../../../../shared/ui/input/view/Input';
import { Typography } from '../../../../shared/ui/typography/view/Typography';
import { PulseDetector } from '../../../../shared/ui/pulseDetector';

interface QuestionInputProps {
  question: Question;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
}

export const QuestionInput: FC<QuestionInputProps> = ({
  question,
  value,
  onChange,
}) => {
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (inputValue === '') {
      onChange(undefined);
      return;
    }

    const numValue = parseFloat(inputValue);
    if (!isNaN(numValue)) {
      onChange(numValue);
    }
  };

  const handleRadioChange = (optionValue: number) => {
    onChange(optionValue);
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    if (selectedValue === '') {
      onChange(undefined);
      return;
    }

    const numValue = parseInt(selectedValue, 10);
    if (!isNaN(numValue)) {
      onChange(numValue);
    }
  };

  const renderInput = () => {
    switch (question.type) {
      case 'number':
        return (
          <Input
            type="number"
            value={value?.toString() || ''}
            onChange={handleNumberChange}
            placeholder={`Enter a value${
              question.min !== undefined && question.max !== undefined
                ? ` (${question.min}-${question.max})`
                : ''
            }`}
            className={styles.numberInput}
          />
        );

      case 'radio':
        return (
          <div className={styles.radioGroup}>
            {question.options?.map((option) => (
              <label key={option.value} className={styles.radioLabel}>
                <input
                  type="radio"
                  name={question.id}
                  value={option.value}
                  checked={value === option.value}
                  onChange={() => handleRadioChange(option.value)}
                  className={styles.radioInput}
                />
                <span className={styles.radioCustom}></span>
                <Typography variant="largeT" color="dark">
                  {option.label}
                </Typography>
              </label>
            ))}
          </div>
        );

      case 'select':
        return (
          <select
            value={value?.toString() || ''}
            onChange={handleSelectChange}
            className={styles.select}
          >
            <option value="">Select a value</option>
            {question.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      default:
        return null;
    }
  };

  return (
    <div className={styles.questionContainer}>
      <div className={styles.questionHeader}>
        <Typography variant="h3" color="dark">
          {question.title}
          {question.required && <span className={styles.required}>*</span>}
        </Typography>
        <Typography variant="largeT" color="ocean-blue">
          {question.description}
        </Typography>
      </div>

      <div className={styles.inputContainer}>
        {renderInput()}

        {question.id === 'pulse' && (
          <div className={styles.pulseDetectorContainer}>
            <PulseDetector
              windowSec={20}
              fps={30}
              bpmRange={{ min: 40, max: 200 }}
              showPreview={false}
              onPulseDetected={onChange}
              currentValue={value}
            />
          </div>
        )}
      </div>
    </div>
  );
};
