import { $authApi } from '../../../shared/lib/requester/requester';
import { AxiosError } from 'axios';

// Message shape used inside the app store/UI
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: number;
}

// Message shape returned by backend
export interface ApiMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export interface ChatRequest {
  messages: Array<{
    role: string;
    content: string;
  }>;
}

export interface SendMessageResponse {
  response: string;
}

export interface ActiveChatResponse {
  chat_id: number;
  messages: ApiMessage[];
  summary: string;
  created_at: string;
  updated_at: string;
}

export interface ChatDetailsResponse {
  id: number;
  messages: ApiMessage[];
  summary: string;
  created_at: string;
  updated_at: string;
}

export interface HistoryItem {
  id: number;
  summary: string;
  created_at: string;
  updated_at: string;
}

export const chatApi = {
  // Отправка сообщения в активный чат
  sendMessage: async (
    messages: ChatMessage[],
  ): Promise<SendMessageResponse> => {
    try {
      const validMessages = messages.filter(
        (msg) => msg.content && msg.content.trim() !== '',
      );

      const response = await $authApi.post<SendMessageResponse>(
        '/cardio-assistant/',
        {
          messages: validMessages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        },
      );

      return response.data;
    } catch (error) {
      if ((error as AxiosError)?.response?.status === 400) {
        throw new Error(
          'Вопрос не похож на медицинский. Уточните формулировку.',
        );
      }
      if ((error as AxiosError)?.response?.status === 401) {
        throw new Error('Требуется вход в аккаунт для использования чата.');
      }
      throw new Error('Ошибка ИИ сервиса. Попробуйте позже.');
    }
  },

  // Получить активный чат
  getActiveChat: async (): Promise<ActiveChatResponse> => {
    const { data } = await $authApi.get<ActiveChatResponse>(
      '/cardio-assistant/active',
    );
    return data;
  },

  // Создать новый чат и сделать его активным
  createChat: async (): Promise<{ chat_id: number; message: string }> => {
    const { data } = await $authApi.post<{ chat_id: number; message: string }>(
      '/cardio-assistant/create',
    );
    return data;
  },

  // Получить историю чатов
  getHistory: async (params?: {
    limit?: number;
    offset?: number;
  }): Promise<HistoryItem[]> => {
    const { data } = await $authApi.get<HistoryItem[]>(
      '/cardio-assistant/history',
      { params },
    );
    return data;
  },

  // Получить детали конкретного чата
  getChatDetails: async (chatId: number): Promise<ChatDetailsResponse> => {
    const { data } = await $authApi.get<ChatDetailsResponse>(
      `/cardio-assistant/history/${chatId}`,
    );
    return data;
  },

  // Активировать выбранный чат
  activateChat: async (chatId: number): Promise<{ message: string }> => {
    const { data } = await $authApi.post<{ message: string }>(
      `/cardio-assistant/history/${chatId}/activate`,
    );
    return data;
  },
};
