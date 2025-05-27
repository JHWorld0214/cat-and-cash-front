import axios from 'axios';
import Constants from 'expo-constants';
import { useAuthStore } from '@store/slices/auth';

const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;

export async function isNewUser(): Promise<boolean> {
    const token = useAuthStore.getState().token;

    if (!token) {
        throw new Error('토큰이 존재하지 않습니다');
    }

    try {
        const res = await axios.post<{ isNew: number }>(
            `${API_BASE_URL}/login/new`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        const userType = res.data.isNew;

        return userType === 0;
    } catch (err) {
        console.error('❌ isNewUser 실패:', err);
        throw err;
    }
}