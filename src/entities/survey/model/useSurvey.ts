import { create } from 'zustand';
import type { SurveyData, SurveyResult } from '../../../shared/types/survey';
import { surveyApi } from '../api/surveyApi';
import { useEffect } from 'react';

const SURVEY_DATA_KEY = 'smart-cardiologist-survey-data';
const SURVEY_STEP_KEY = 'smart-cardiologist-survey-step';

interface SurveyStore {
  currentStep: number;
  surveyData: SurveyData;
  result: SurveyResult | null;
  isLoading: boolean;
  error: string;
  isDataRestored: boolean;

  setCurrentStep: (step: number) => void;
  updateSurveyData: (
    field: keyof SurveyData,
    value: number | undefined,
  ) => void;
  clearField: (field: keyof SurveyData) => void;
  nextStep: () => void;
  prevStep: () => void;
  submitSurvey: () => Promise<void>;
  resetSurvey: () => void;

  getFilledFieldsCount: () => number;
}

const saveSurveyData = (data: SurveyData, step: number) => {
  try {
    localStorage.setItem(SURVEY_DATA_KEY, JSON.stringify(data));
    localStorage.setItem(SURVEY_STEP_KEY, step.toString());
  } catch (error) {
    console.error('Failed to save survey data to localStorage:', error);
  }
};

const loadSurveyData = (): { data: SurveyData; step: number } | null => {
  try {
    const dataStr = localStorage.getItem(SURVEY_DATA_KEY);
    const stepStr = localStorage.getItem(SURVEY_STEP_KEY);

    if (dataStr && stepStr) {
      const data = JSON.parse(dataStr);
      const step = parseInt(stepStr, 10);

      if (data && typeof data === 'object' && !isNaN(step) && step >= 0) {
        return { data, step };
      }
    }
  } catch (error) {
    console.error('Failed to load survey data from localStorage:', error);
  }

  return null;
};

const clearSurveyData = () => {
  try {
    localStorage.removeItem(SURVEY_DATA_KEY);
    localStorage.removeItem(SURVEY_STEP_KEY);
  } catch (error) {
    console.error('Failed to clear survey data from localStorage:', error);
  }
};

export const useSurvey = create<SurveyStore>((set, get) => ({
  currentStep: 0,
  surveyData: {},
  result: null,
  isLoading: false,
  error: '',
  isDataRestored: false,

  setCurrentStep: (step) => {
    set({ currentStep: step });
    const { surveyData } = get();
    saveSurveyData(surveyData, step);
  },

  updateSurveyData: (field, value) =>
    set((state) => {
      const newData = {
        ...state.surveyData,
        [field]: value,
      };

      saveSurveyData(newData, state.currentStep);

      return { surveyData: newData };
    }),

  clearField: (field) =>
    set((state) => {
      const newData = { ...state.surveyData };
      delete newData[field];

      saveSurveyData(newData, state.currentStep);

      return { surveyData: newData };
    }),

  nextStep: () =>
    set((state) => {
      const newStep = state.currentStep + 1;

      saveSurveyData(state.surveyData, newStep);

      return { currentStep: newStep };
    }),

  prevStep: () =>
    set((state) => {
      const newStep = Math.max(0, state.currentStep - 1);

      saveSurveyData(state.surveyData, newStep);

      return { currentStep: newStep };
    }),

  submitSurvey: async () => {
    const { surveyData } = get();
    set({ isLoading: true, error: '' });

    try {
      const result = await surveyApi.submitSurvey(surveyData);
      set({ result, isLoading: false });

      clearSurveyData();
    } catch (error: any) {
      set({
        error: 'An error occurred while submitting data. Please try again.',
        isLoading: false,
      });
      console.error('Survey submission error:', error);
    }
  },

  resetSurvey: () => {
    set({
      currentStep: 0,
      surveyData: {},
      result: null,
      error: '',
      isDataRestored: false,
    });

    clearSurveyData();
  },

  getFilledFieldsCount: () => {
    const { surveyData } = get();
    return Object.keys(surveyData).length;
  },
}));

export const initializeSurveyFromStorage = () => {
  const savedData = loadSurveyData();

  if (savedData) {
    const { data, step } = savedData;
    useSurvey.setState({
      currentStep: step,
      surveyData: data,
      isDataRestored: true,
    });
    return true;
  }

  return false;
};

export const clearSurveyFromStorage = () => {
  clearSurveyData();
};

export const forceClearSurveyFromStorage = () => {
  clearSurveyData();
  useSurvey.setState({
    currentStep: 0,
    surveyData: {},
    result: null,
    error: '',
    isDataRestored: false,
  });
};

export const useSurveyCleanup = (forceClear: boolean = false) => {
  useEffect(() => {
    return () => {
      const { result } = useSurvey.getState();
      if (forceClear || !result) {
        clearSurveyData();
      }
    };
  }, [forceClear]);
};
