import { create } from 'zustand';
import {itemMetaMap} from "@constants/ItemMetaData";

export interface MemoryDTO {
    content: string;
    createdAt: string;
}

export interface CatStatus {
    hunger: number;
    love: number;
    mood: 'neutral';
    setHunger: (value: number) => void;
    setLove: (value: number) => void;
}

export interface ItemData {
    id: string;
    name: string;
    count: number;
    category: 'food' | 'interior';
    image: any;
}

interface CatStore {
    status: CatStatus;
    items: ItemData[];
    careLog: MemoryDTO[];

    setItems: (items: ItemData[]) => void;
    useItem: (itemId: string) => void;
    addCareLogByItemName: (itemName: string) => void;
    getStatus: () => CatStatus; // ✅ 추가
}

function clamp(value: number) {
    return Math.max(0, Math.min(100, value));
}

export const useCatStore = create<CatStore>((set, get) => ({
    status: {
        hunger: 0,
        love: 0,
        mood: 'neutral',

        setHunger: (value: number) =>
            set((state) => ({
                status: {
                    ...state.status,
                    hunger: clamp(value),
                },
            })),

        setLove: (value: number) =>
            set((state) => ({
                status: {
                    ...state.status,
                    love: clamp(value),
                },
            })),
    },
    items: [],
    careLog: [],

    setItems: (items) => set({ items }),

    useItem: (itemId: string) => {
        const { items, status } = get();
        const item = items.find((i) => i.id === itemId);
        if (!item) return;

        const meta = itemMetaMap[itemId];
        const updatedItems = item.count <= 1
            ? items.filter((i) => i.id !== itemId)
            : items.map((i) =>
                i.id === itemId ? { ...i, count: i.count - 1 } : i
            );

        const newStatus = { ...status };
        if (meta.category === 'food') {
            newStatus.hunger += meta.hunger || 0;
            newStatus.love += meta.love || 0;
        }

        set({
            items: updatedItems,
            status: newStatus,
            careLog: [
                ...get().careLog,
                {
                    content: `${meta.name} 아이템 사용`,
                    createdAt: new Date().toISOString(),
                },
            ],
        });
    },

    addCareLogByItemName: (name) => {
        const log: MemoryDTO = {
            content: `${name} 아이템 사용`,
            createdAt: new Date().toISOString(),
        };
        set((state) => ({ careLog: [...state.careLog, log] }));
    },

    getStatus: () => get().status,
}));