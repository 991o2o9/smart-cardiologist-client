import { $authApi } from '../../../shared/lib/requester/requester';
import type { SurveyData, SurveyResult } from '../../../shared/types/survey';

export const surveyApi = {
  submitSurvey: async (data: SurveyData): Promise<SurveyResult> => {
    const response = await $authApi.post('/heart-prediction/predict', data);
    return response.data;
  },
};
