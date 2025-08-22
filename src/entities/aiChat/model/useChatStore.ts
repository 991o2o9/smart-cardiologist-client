/* eslint-disable @typescript-eslint/no-explicit-any */
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
  deleteAllHistory: () => Promise<void>;
  deleteChat: (chatId: number) => Promise<void>;

  startVoiceInput: () => Promise<void>;
  stopVoiceInput: () => void;
  clearError: () => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [
    {
      role: 'assistant',
      content:
        'Hello! I am HeartSync Advisor, your personal AI cardiologist. Ready to answer your questions about heart health and provide recommendations based on your data.',
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

    // Create a new user message
    const userMessage: ChatMessage = {
      role: 'user',
      content,
      timestamp: Date.now(),
    };

    // Add the user message to the state
    set((state) => ({
      messages: [...state.messages, userMessage],
    }));

    set({ isLoading: true, error: null });

    try {
      // Ensure there is an active chat
      if (activeChatId == null) {
        try {
          const created = await chatApi.createChat();
          set({ activeChatId: created.chat_id });
        } catch {
          // If creation fails, still try to send in the active context
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
        error: error instanceof Error ? error.message : 'An error occurred',
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
      // If 401, just mark active not loaded, without resetting greeting
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
      // Ignore 401, history is only available to authorized users
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
      set({ error: 'Failed to open chat' });
    } finally {
      set({ isLoading: false });
    }
  },

  createNewChat: async () => {
    try {
      set({ isLoading: true, error: null });
      const created = await chatApi.createChat();
      set({ activeChatId: created.chat_id });

      // Reset messages and show greeting
      set({
        messages: [
          {
            role: 'assistant',
            content: 'New chat created. Ask your question about heart health.',
            timestamp: Date.now(),
          },
        ],
      });

      // Refresh history
      get().loadHistory();
    } catch {
      set({ error: 'Failed to create new chat' });
    } finally {
      set({ isLoading: false });
    }
  },

  startVoiceInput: async () => {
    if (
      !('webkitSpeechRecognition' in window) &&
      !('SpeechRecognition' in window)
    ) {
      set({ error: 'Voice input is not supported in this browser' });
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = 'en-US';
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
        error: 'Speech recognition error',
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

  deleteAllHistory: async () => {
    try {
      await chatApi.deleteAllHistory();
      set({ history: [] });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : 'Failed to delete history',
      });
    }
  },

  deleteChat: async (chatId: number) => {
    try {
      await chatApi.deleteChat(chatId);
      // Remove chat from history
      set((state) => ({
        history: state.history.filter((item) => item.id !== chatId),
      }));
      // If the deleted chat was active, reset active chat
      const { activeChatId } = get();
      if (activeChatId === chatId) {
        set({
          activeChatId: null,
          messages: [
            {
              role: 'assistant',
              content:
                'Hello! I am HeartSync Advisor, your personal AI cardiologist. Ready to answer your questions about heart health and provide recommendations based on your data.',
              timestamp: Date.now(),
            },
          ],
        });
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete chat',
      });
    }
  },
}));

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}
