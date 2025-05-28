import { create } from 'zustand';
import { CatStatus, MemoryDTO} from "@store/slices/catStore";

export interface ChatDTO {
    chatId: number;
    content: string;
    chatDate: string;
    role: 'user' | 'assistant';
}

export interface ChatStore {
    chatLog: ChatDTO[];
    setChatLog: (log: ChatDTO[]) => void;
    addChat: (chat: ChatDTO) => void;
}

export interface RequestCatStatus {
    hunger: number;
    love: number;
    mood: 'neutral';
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
    status: RequestCatStatus;
}