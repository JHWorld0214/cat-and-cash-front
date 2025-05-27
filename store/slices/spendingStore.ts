import { create } from 'zustand';

export interface SpendingItem {
    categoryId: number;
    amount: number;
    content: string;
    create_time: string;
}

interface SpendingState {
    list: SpendingItem[];
    setList: (newList: SpendingItem[]) => void;
    addItem: (item: SpendingItem) => void;
}

export const useSpendingStore = create<SpendingState>((set) => ({
    list: [],
    setList: (newList) => set({ list: newList }),
    addItem: (item) => set((state) => ({ list: [...state.list, item] })),
}));