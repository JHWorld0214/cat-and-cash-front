import axios from 'axios';
import Constants from 'expo-constants';
import { useAuthStore } from '@store/slices/authStore';
import { useChatStore, ChatDTO } from '@store/slices/chatStore';

const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;

// LocalDateTime 포맷으로 변환 (Z 없이, 초까지)
function formatToLocalDateTimeString(date: Date): string {
    return date.toISOString().slice(0, 19);
}

export const postNewChat = async (userInputs: string[]): Promise<ChatDTO[]> => {
    try {
        const token = useAuthStore.getState().token;
        if (!token) throw new Error('No token available');

        const existingChatLog = useChatStore.getState().chatLog;

        const now = new Date();
        const newChatDtos: ChatDTO[] = userInputs.map((text) => ({
            chatId: -1, // number 타입으로
            content: text,
            chatDate: formatToLocalDateTimeString(now), // "YYYY-MM-DDTHH:mm:ss"
        }));

        const payload = {
            messages: [...existingChatLog, ...newChatDtos],
        };

        const response = await axios.post(`${API_BASE_URL}/chat/new`, payload, {
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