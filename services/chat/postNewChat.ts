import axios from 'axios';
import Constants from 'expo-constants';
import { useAuthStore } from '@store/slices/authStore';
import { ChatDTO } from '@store/slices/chatStore';

const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;

export const postNewChat = async (messages: string[]): Promise<ChatDTO[]> => {
    try {
        const token = useAuthStore.getState().token;
        if (!token) throw new Error('No token available');

        console.log('채팅 보내기!');

        const response = await axios.post(`${API_BASE_URL}/chat/new`, messages, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        console.log('[✅ postNewChat 응답]', response.data);
        return response.data as ChatDTO[];
    } catch (error) {
        console.error('❌ postNewChat 실패:', error);
        return [];
    }
};