export interface SurveyData {
  age?: number;
  sex?: number;
  cp?: number;
  trestbps?: number;
  chol?: number;
  fbs?: number;
  restecg?: number;
  thalach?: number;
  exang?: number;
  oldpeak?: number;
  slope?: number;
  ca?: number;
  thal?: number;
  pulse?: number;
}

export interface Question {
  id: keyof SurveyData;
  title: string;
  description: string;
  type: 'number' | 'radio' | 'select';
  options?: { value: number; label: string }[];
  min?: number;
  max?: number;
  step?: number;
  required?: boolean;
}

export interface SurveyResult {
  risk: number;
  probability: number;
  accuracy: string;
  message: string;
}
