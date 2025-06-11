import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type AuthState = {
    token: string | null;
    provider: 'google' | 'kakao' | null;
    setAuth: (token: string, provider: 'google' | 'kakao') => void;
    logout: () => void;
};

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            provider: null,
            setAuth: (token, provider) => set({ token, provider }),
            logout: () => set({ token: null, provider: null }),
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);