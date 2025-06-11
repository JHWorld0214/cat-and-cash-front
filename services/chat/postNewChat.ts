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

        // ✅ 로그 포맷 개선
        console.log('📤 채팅 요청 바디:\n' + JSON.stringify(requestBody, null, 2));
        console.log('🔑 토큰:', token);

        const response = await axios.post(`${API_BASE_URL}/chat/new`, requestBody, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json', // ✅ 명시해주는 것도 안정적
            },
        });

        console.log('[✅ Chat 응답 수신]', JSON.stringify(response.data, null, 2));
        return response.data as ChatResponseDTO;
    } catch (error: any) {
        // ✅ 에러 본문까지 로그
        if (axios.isAxiosError(error)) {
            console.error('❌ Chat API 요청 실패 (AxiosError):', {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data,
            });
        } else {
            console.error('❌ Chat API 요청 실패:', error);
        }

        return {
            messages: [],
        };
    }
};