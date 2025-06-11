import { create } from 'zustand';
import { MemoryDTO } from "@store/slices/catStore";

export interface ChatDTO {
    chatId: number;
    content: string;
    chatDate: string;
    role: 'user' | 'assistant';
}

export interface ChatStore {
    chatLog: ChatDTO[];
    setChatLog: (log: ChatDTO[]) => void;
    addChatLog: (chat: ChatDTO) => void;
    removeChatLog: (chatId: number) => void;
}


export const useChatStore = create<ChatStore>((set) => ({
    chatLog: [],
    setChatLog: (log) => set({ chatLog: log }),
    addChatLog: (chat: ChatDTO) =>
        set((state) => ({ chatLog: [...state.chatLog, chat] })),
    removeChatLog: (chatId) =>
        set((state) => ({
            chatLog: state.chatLog.filter((chat) => chat.chatId !== chatId),
        })),
}));

export interface ChatRequestDTO {
    messages: ChatDTO[];
    memories: MemoryDTO[];
    status: RequestCatStatus;
}

export interface RequestCatStatus {
    hunger: number;
    love: number;
    mood: 'neutral';
}

export interface ChatResponseDTO {
    messages: ChatDTO[];
}