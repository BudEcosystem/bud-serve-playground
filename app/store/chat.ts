import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Note, Session, Settings } from '../types/chat';
import { Endpoint } from '../types/deployment';
import { SavedMessage } from '../types/chat';
interface ChatStore {
  activeChatList: Session[];
  setActiveChatList: (chatList: Session[]) => void;

  createChat: (chat: Session) => void;
  updateChat: (chat: Session) => void;
  getChat: (id: string) => Session | undefined;
  setDeployment: (chatId: string, deployment: Endpoint) => void;
  disableChat: (chatId: string) => void;
  enableChat: (chatId: string) => void;
  deleteChat: (chatId: string) => void;
  syncWithServer: () => Promise<void>;

  messages: Record<string, SavedMessage[]>;
  addMessage: (chatId: string, message: SavedMessage) => void;
  getMessages: (chatId: string) => SavedMessage[];
  setMessages: (chatId: string, messages: SavedMessage[]) => void;

  setFeedback: (chatId: string, messageId: string, feedback: string) => void;
  getFeedback: (chatId: string, messageId: string) => string | undefined;

  settingPresets: Settings[];
  currentSettingPreset: Settings;
  setCurrentSettingPreset: (settings: Settings) => void;
  setSettingPresets: (settings: Settings[]) => void;
  addSettingPreset: (settings: Settings) => void;
  updateSettingPreset: (settings: Settings) => void;

  notes: Note[];
  setNotes: (notes: Note[]) => void;
  addNote: (note: Note) => void;
  updateNote: (note: Note) => void;
  deleteNote: (noteId: string) => void;
  getNotes: (chatId: string) => Note[];
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      activeChatList: [],
      setActiveChatList: (chatList: Session[]) => set((state) => {
        // Sync with server if user is signed in
        get().syncWithServer();
        return { activeChatList: chatList };
      }),
      getChat: (id: string): Session | undefined => {
        return useChatStore.getState().activeChatList.find((chat: Session) => chat.id === id);
      },
      setDeployment: (chatId: string, deployment: Endpoint) => set((state) => ({
        activeChatList: state.activeChatList.map((chat: Session) => 
          chat.id === chatId ? { ...chat, selectedDeployment: deployment as unknown as Endpoint } : chat
        )
      })),
      createChat: (chat: Session) => set((state) => {
        const newList = [...(state.activeChatList || []), chat];
        const newState = { activeChatList: newList };
        get().syncWithServer();
        return newState;
      }),
      updateChat: (chat: Session) => set((state) => ({
        activeChatList: state.activeChatList.map((c: Session) => 
          c.id === chat.id ? chat : c
        )
      })),
      deleteChat: (chatId: string) => set((state) => {
        const updatedChatList = state.activeChatList.filter((chat: Session) => chat.id !== chatId);
        if (updatedChatList.length > 0) {
          updatedChatList[0].active = true;
        }
        return { activeChatList: updatedChatList };
      }),
      disableChat: (chatId: string) => set((state) => ({
        activeChatList: state.activeChatList.map((chat: Session) => 
          chat.id === chatId ? { ...chat, active: false } : chat
        )
      })),
      enableChat: (chatId: string) => set((state) => ({
        activeChatList: state.activeChatList.map((chat: Session) => 
          chat.id === chatId ? { ...chat, active: true } : chat
        )
      })),
      syncWithServer: async () => {
        // Check if user is signed in (you'll need to implement this check)
        const isSignedIn = false; // Replace with actual auth check
        
        if (isSignedIn) {
          try {
            const chats = get().activeChatList;
            // Make API call to sync chats (implement your API endpoint)
            await fetch('/api/chats/sync', {
              method: 'POST',
              body: JSON.stringify({ chats }),
            });
          } catch (error) {
            console.error('Failed to sync chats with server:', error);
          }
        }
      },
      messages: {},
      
      addMessage: (chatId: string, message: SavedMessage) => set((state) => ({
        messages: {
          ...state.messages,
          [chatId]: [...(state.messages[chatId] || []), message]
        }
      })),

      getMessages: (chatId: string) => {
        return get().messages[chatId] || [];
      },

      setMessages: (chatId: string, messages: SavedMessage[]) => set((state) => ({
        messages: {
          ...state.messages,
          [chatId]: messages
        }
      })),

      setFeedback: (chatId: string, messageId: string, feedback: string) => set((state) => ({
        messages: {
          ...state.messages,
          [chatId]: state.messages[chatId].map((message: SavedMessage) => 
            message.id === messageId ? { ...message, feedback: feedback } : message
          )
        }
      })),

      getFeedback: (chatId: string, messageId: string) => {
        return get().messages[chatId].find((message: SavedMessage) => message.id === messageId)?.feedback;
      },

      settingPresets: [],
      setSettingPresets: (settings: Settings[]) => set((state) => ({
        settingPresets: settings
      })),

      currentSettingPreset: {} as Settings,

      setCurrentSettingPreset: (settings: Settings) => set((state) => ({
        currentSettingPreset: settings
      })),

      addSettingPreset: (settings: Settings) => set((state) => ({
        settingPresets: [...(state.settingPresets || []), settings]
      })),

      updateSettingPreset: (settings: Settings) => set((state) => ({
        settingPresets: state.settingPresets.map((preset: Settings) => 
          preset.id === settings.id ? settings : preset
        )
      })),
      
      notes: [],
      setNotes: (notes: Note[]) => set((state) => ({
        notes: notes
      })),

      addNote: (note: Note) => set((state) => ({
        notes: [...(state.notes || []), note]
      })),

      updateNote: (note: Note) => set((state) => ({
        notes: state.notes.map((n: Note) => 
          n.id === note.id ? note : n
        )
      })),

      deleteNote: (noteId: string) => set((state) => ({
        notes: state.notes.filter((n: Note) => n.id !== noteId)
      })),

      getNotes: (chatId: string) => {
        return get().notes.filter((n: Note) => n.chat_session_id === chatId);
      },
    }),
    {
      name: 'chat-storage',
      partialize: (state) => ({
        activeChatList: state.activeChatList,
        messages: state.messages,
        settingPresets: state.settingPresets,
        currentSettingPreset: state.currentSettingPreset,
        notes: state.notes,
      }),
    }
  )
);
