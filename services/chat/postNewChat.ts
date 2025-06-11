import axios from 'axios';
import Constants from 'expo-constants';
import { useAuthStore } from '@store/slices/authStore';
import {
    ChatRequestDTO,
    ChatResponseDTO,
} from '@store/slices/chatStore';

const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;

export const postNewChat = async (
    requestBody: ChatRequestDTO
): Promise<ChatResponseDTO> => {
    try {
        const token = useAuthStore.getState().token;
        if (!token) throw new Error('No token available');

        console.log('채팅 요청 바디');
        console.log(requestBody);
        console.log(token);

        const response = await axios.post(`${API_BASE_URL}/chat/new`, requestBody, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        console.log('[✅ Chat 응답 수신]', response.data);
        return response.data as ChatResponseDTO;
    } catch (error) {
        console.error('❌ Chat API 요청 실패:', error);
        return {
            messages: [],
        };
    }
};