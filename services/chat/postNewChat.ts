import axios from 'axios';
import Constants from 'expo-constants';
import { useAuthStore } from '@store/slices/authStore';
import {useChatStore, ChatDTO, ChatRequestDTO, RequestCatStatus} from '@store/slices/chatStore';
import { useCatStore } from '@store/slices/catStore';

const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;

function formatToLocalDateTimeString(date: Date): string {
    return date.toISOString().slice(0, 19);
}

export const postNewChat = async (userInputs: string[]): Promise<ChatDTO[]> => {
    try {
        const token = useAuthStore.getState().token;
        if (!token) throw new Error('No token available');

        const chatLog = useChatStore.getState().chatLog;
        const fullStatus = useCatStore.getState().getStatus();
        const careLog = useCatStore.getState().careLog;

        const catStatus: RequestCatStatus = {
            hunger: fullStatus.hunger,
            love: fullStatus.love,
            mood: fullStatus.mood,
        };

        const now = new Date();

        const newChatDtos: ChatDTO[] = userInputs.map((text) => ({
            chatId: -1,
            content: text,
            chatDate: formatToLocalDateTimeString(now),
            role: 'user',
        }));

        const payload: ChatRequestDTO = {
            messages: [...chatLog, ...newChatDtos],
            memories: careLog,
            status: catStatus,
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