import { create } from 'zustand';
import {
  chatApi,
  type ChatMessage,
  type ActiveChatResponse,
  type ChatDetailsResponse,
  type HistoryItem,
} from '../api/chatApi';

interface ChatStore {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  isListening: boolean;

  activeChatId: number | null;
  history: HistoryItem[];
  isHistoryLoading: boolean;
  hasActiveLoaded: boolean;

  addUserMessage: (content: string) => void;
  sendMessage: (content: string) => Promise<void>;
  loadActiveChat: () => Promise<void>;
  loadHistory: (params?: { limit?: number; offset?: number }) => Promise<void>;
  openChat: (chatId: number) => Promise<void>;
  createNewChat: () => Promise<void>;

  startVoiceInput: () => Promise<void>;
  stopVoiceInput: () => void;
  clearError: () => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [
    {
      role: 'assistant',
      content:
        'Привет! Я доктор Пульс, ваш персональный AI-кардиолог. Готов ответить на ваши вопросы о здоровье сердца и дать рекомендации на основе ваших данных.',
      timestamp: Date.now(),
    },
  ],
  isLoading: false,
  error: null,
  isListening: false,

  activeChatId: null,
  history: [],
  isHistoryLoading: false,
  hasActiveLoaded: false,

  addUserMessage: (content: string) => {
    const newMessage: ChatMessage = {
      role: 'user',
      content,
      timestamp: Date.now(),
    };

    set((state) => ({
      messages: [...state.messages, newMessage],
    }));
  },

  sendMessage: async (content: string) => {
    const { messages, activeChatId } = get();

    // Создаем новое сообщение пользователя
    const userMessage: ChatMessage = {
      role: 'user',
      content,
      timestamp: Date.now(),
    };

    // Добавляем сообщение пользователя в состояние
    set((state) => ({
      messages: [...state.messages, userMessage],
    }));

    set({ isLoading: true, error: null });

    try {
      // Убедимся, что есть активный чат
      if (activeChatId == null) {
        try {
          const created = await chatApi.createChat();
          set({ activeChatId: created.chat_id });
        } catch {
          // Если не удалось создать, все равно попробуем отправить в активный контекст
        }
      }

      const allMessages = [...messages, userMessage];
      const response = await chatApi.sendMessage(allMessages);

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.response,
        timestamp: Date.now(),
      };

      set((state) => ({
        messages: [...state.messages, assistantMessage],
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Произошла ошибка',
        isLoading: false,
      });
    }
  },

  loadActiveChat: async () => {
    try {
      set({ isLoading: true, error: null });
      const data: ActiveChatResponse = await chatApi.getActiveChat();
      set({ activeChatId: data.chat_id });

      const mappedMessages: ChatMessage[] = (data.messages || []).map((m) => ({
        role: m.role,
        content: m.content,
        timestamp: m.timestamp ? Date.parse(m.timestamp) : Date.now(),
      }));

      set({
        messages: mappedMessages.length ? mappedMessages : get().messages,
      });
    } catch {
      // Если 401 — просто отметим, что активный не загружен, без сброса приветствия
      set({ error: null });
    } finally {
      set({ isLoading: false, hasActiveLoaded: true });
    }
  },

  loadHistory: async (params?: { limit?: number; offset?: number }) => {
    try {
      set({ isHistoryLoading: true });
      const items = await chatApi.getHistory(params);
      set({ history: items });
    } catch {
      // Игнорируем 401, история доступна только авторизованным
    } finally {
      set({ isHistoryLoading: false });
    }
  },

  openChat: async (chatId: number) => {
    try {
      set({ isLoading: true, error: null });
      await chatApi.activateChat(chatId);
      const details: ChatDetailsResponse = await chatApi.getChatDetails(chatId);
      const mappedMessages: ChatMessage[] = (details.messages || []).map(
        (m) => ({
          role: m.role,
          content: m.content,
          timestamp: m.timestamp ? Date.parse(m.timestamp) : Date.now(),
        }),
      );
      set({ activeChatId: details.id, messages: mappedMessages });
    } catch {
      set({ error: 'Не удалось открыть чат' });
    } finally {
      set({ isLoading: false });
    }
  },

  createNewChat: async () => {
    try {
      set({ isLoading: true, error: null });
      const created = await chatApi.createChat();
      set({ activeChatId: created.chat_id });

      // Сбросим сообщения и покажем приветствие
      set({
        messages: [
          {
            role: 'assistant',
            content: 'Новый чат создан. Задайте ваш вопрос о здоровье сердца.',
            timestamp: Date.now(),
          },
        ],
      });

      // Обновим историю
      get().loadHistory();
    } catch {
      set({ error: 'Не удалось создать новый чат' });
    } finally {
      set({ isLoading: false });
    }
  },

  startVoiceInput: async () => {
    if (
      !('webkitSpeechRecognition' in window) &&
      !('SpeechRecognition' in window)
    ) {
      set({ error: 'Голосовой ввод не поддерживается в этом браузере' });
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = 'ru-RU';
    recognition.continuous = false;
    recognition.interimResults = false;

    set({ isListening: true, error: null });

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      get().sendMessage(transcript);
      set({ isListening: false });
    };

    recognition.onerror = () => {
      set({
        error: 'Ошибка распознавания речи',
        isListening: false,
      });
    };

    recognition.onend = () => {
      set({ isListening: false });
    };

    recognition.start();
  },

  stopVoiceInput: () => {
    set({ isListening: false });
  },

  clearError: () => {
    set({ error: null });
  },
}));

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}
