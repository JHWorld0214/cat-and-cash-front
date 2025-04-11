import { create } from 'zustand';

export type User = {
    userId: number | null;
    email: string;
    name: string;
    profileImage: string;
};

type UserStore = {
    user: User;
    setUser: (user: User) => void;
    clearUser: () => void;
};

export const useUserStore = create<UserStore>((set) => ({
    user: {
        userId: null,
        email: '',
        name: '',
        profileImage: '',
    },
    setUser: (user) => set({ user }),
    clearUser: () =>
        set({
            user: {
                userId: null,
                email: '',
                name: '',
                profileImage: '',
            },
        }),
}));