import axios from 'axios';
import Constants from 'expo-constants';
import { useAuthStore } from '@store/slices/authStore';

const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;

export interface SpendingResponse {
    create_time: string;
    // 여기에 다른 필드도 필요하면 추가
}

export async function postSpending(payload: {
    categoryId: number;
    amount: number;
    aftMoney: number;
    content: string;
}): Promise<SpendingResponse> {
    const token = useAuthStore.getState().token;

    const res = await axios.post(`${API_BASE_URL}/budget/new`, payload, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return res.data;
}