import axios from 'axios';
import Constants from 'expo-constants';
import { ChatDTO } from '@store/slices/chatStore';
import { useAuthStore } from '@store/slices/authStore';

const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;

export const getChatLog = async (): Promise<ChatDTO[]> => {
    try {
        const token = useAuthStore.getState().token;

        if (!token) {
            console.warn('⚠️ 토큰이 존재하지 않아 /chat/log 요청 생략됨');
            return [];
        }

        const response = await axios.get(`${API_BASE_URL}/chat/log`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        console.log("전체 채팅 불러오기 성공");

        console.log(response.data);

        return response.data as ChatDTO[];
    } catch (error) {
        console.error('❌ 채팅 로그 불러오기 실패:', error);
        return [];
    }
};