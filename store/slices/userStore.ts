import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

type UserStore = {
    money: number;
    name: string;
    setMoney: (money: number) => void;
    setName: (name: string) => void;
    loadUserData: () => Promise<void>;
};

export const useUserStore = create<UserStore>((set) => ({
    money: 0,
    name: '',
    setMoney: (money) => {
        set({ money });
        AsyncStorage.setItem('money', money.toString());
    },
    setName: (name) => {
        set({ name });
        AsyncStorage.setItem('user_name', name);
    },
    loadUserData: async () => {
        const storedMoney = await AsyncStorage.getItem('money');
        const storedName = await AsyncStorage.getItem('user_name');

        set({
            money: storedMoney ? Number(storedMoney) : 0,
            name: storedName ?? '',
        });
    },
}));