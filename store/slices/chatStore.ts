import { create } from 'zustand';

export interface ChatDTO {
    chatId: number;
    content: string;
    chatDate: string;
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