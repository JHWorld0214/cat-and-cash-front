import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { itemMetaMap } from '@constants/ItemMetaData';

export interface MemoryDTO {
    content: string;
    createdAt: string;
}

export interface ItemData {
    id: string;
    name: string;
    count: number;
    category: 'food' | 'interior';
    image: any;
}

interface CatStore {
    status: {
        hunger: number;
        love: number;
        mood: 'neutral';
        setHunger: (value: number) => void;
        setLove: (value: number) => void;
    };

    money: number;
    exp: number;
    level: number;
    items: ItemData[];
    memory: MemoryDTO[];
    lastUpdate: number | null;

    setMoney: (value: number) => void;
    setExp: (value: number) => void;
    setLevel: (value: number) => void;
    setItems: (items: ItemData[]) => void;
    setLastUpdate: (timestamp: number) => void;
    setStatus: (status: { hunger: number; love: number; mood: 'neutral' }) => void;

    addMemory: (log: MemoryDTO) => void;

    useItem: (itemId: string) => void;
    recalcStatusByTime: (now: number) => void;

    getStatus: () => { hunger: number; love: number; mood: string };
    getMemory: () => MemoryDTO[];
    getLastUpdate: () => number | null;
}

function clamp(value: number) {
    return Math.max(0, Math.min(100, value));
}

export const useCatStore = create<CatStore>()(
    persist(
        (set, get) => ({
            status: {
                hunger: 50,
                love: 50,
                mood: 'neutral',
                setHunger: (value: number) =>
                    set((state) => ({
                        status: { ...state.status, hunger: clamp(value) },
                    })),
                setLove: (value: number) =>
                    set((state) => ({
                        status: { ...state.status, love: clamp(value) },
                    })),
            },

            money: 0,
            exp: 0,
            level: 1,
            items: [],
            memory: [],
            lastUpdate: null,

            setMoney: (value) => set({ money: value }),
            setExp: (value) => set({ exp: value }),
            setLevel: (value) => set({ level: value }),
            setItems: (items) => set({ items }),
            setLastUpdate: (timestamp) => set({ lastUpdate: timestamp }),
            setStatus: ({ hunger, love, mood }) =>
                set((state) => ({
                    status: {
                        ...state.status,
                        hunger: clamp(hunger),
                        love: clamp(love),
                        mood,
                    },
                })),

            addMemory: (log: MemoryDTO) =>
                set((state) => ({
                    memory: [...state.memory, log],
                })),

            useItem: (itemId: string) => {
                const { items, status } = get();
                const item = items.find((i) => i.id === itemId);
                if (!item) return;

                const meta = itemMetaMap[itemId];
                const updatedItems =
                    item.count <= 1
                        ? items.filter((i) => i.id !== itemId)
                        : items.map((i) =>
                            i.id === itemId
                                ? { ...i, count: i.count - 1 }
                                : i
                        );

                const newHunger = clamp(status.hunger + (meta.hunger || 0));
                const newLove = clamp(status.love + (meta.love || 0));

                set({
                    items: updatedItems,
                    status: {
                        ...status,
                        hunger: newHunger,
                        love: newLove,
                    },
                    memory: [
                        ...get().memory,
                        {
                            content: `${meta.name} 아이템 사용`,
                            createdAt: new Date().toISOString(),
                        },
                    ],
                });
            },

            recalcStatusByTime: (now: number) => {
                const last = get().lastUpdate;
                if (!last) return;

                const minutes = Math.floor((now - last) / 60000);
                const currentHunger = get().status.hunger;
                const currentLove = get().status.love;

                get().status.setHunger(currentHunger - minutes);
                get().status.setLove(currentLove - minutes);
                set({ lastUpdate: now });
            },

            getStatus: () => {
                const state = get();
                return {
                    hunger: state.status.hunger,
                    love: state.status.love,
                    mood: state.status.mood,
                };
            },

            getMemory: () => get().memory,

            getLastUpdate: () => get().lastUpdate,
        }),
        {
            name: 'cat-store',
            partialize: (state) => ({
                status: state.status,
                money: state.money,
                exp: state.exp,
                level: state.level,
                items: state.items,
                memory: state.memory,
                lastUpdate: state.lastUpdate,
            }),
        }
    )
);