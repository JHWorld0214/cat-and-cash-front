import { create } from 'zustand';

export interface ChatDTO {
    chatId: number;
    content: string;
    chatDate: string;
    role: 'user' | 'assistant';
}

export interface MemoryDTO {
    content: string;
    createdAt: string;
}

interface ChatStore {
    chatLog: ChatDTO[];
    setChatLog: (log: ChatDTO[]) => void;
    addChat: (chat: ChatDTO) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
    chatLog: [],
    setChatLog: (log) => set({ chatLog: log }),
    addChat: (chat: ChatDTO) =>
        set((state) => ({ chatLog: [...state.chatLog, chat] })),
}));

export interface ChatRequestDTO {
    messages: ChatDTO[];
    memories: MemoryDTO[];
    state: {
        love: number;
        hunger: number;
        mood: 'neutral' | 'happy' | 'sad';
    };
}