import { useState, useRef } from 'react';
import { useChatStore, ChatDTO, ChatRequestDTO, ChatResponseDTO } from '@/store/slices/chatStore';
import { useCatStore } from '@/store/slices/catStore';
import { postNewChat} from "@services/chat/postNewChat";

export const useChat = () => {
    const [input, setInput] = useState('');
    const [isBotTyping, setIsBotTyping] = useState(false);
    const [isUserTyping, setIsUserTyping] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const { chatLog, addChatLog } = useChatStore();
    const catStatus = useCatStore.getState().getStatus();
    const memories = useCatStore.getState().getMemory;

    const onInputChange = (text: string) => {
        setInput(text);
        setIsUserTyping(true);

        if (timerRef.current) clearTimeout(timerRef.current);

        if (text.trim() !== '') {
            timerRef.current = setTimeout(() => {
                handleSendMessage();
            }, 3000);
        }
    };

    const handleSendMessage = async () => {
        const trimmed = input.trim();
        if (!trimmed) return;

        if (timerRef.current) clearTimeout(timerRef.current);

        const userMessage: ChatDTO = {
            chatId: Date.now(),
            content: trimmed,
            chatDate: new Date().toISOString(),
            role: 'user',
        };

        addChatLog(userMessage);
        setInput('');
        setIsUserTyping(false);
        setIsBotTyping(true);

        const { getStatus, getMemory } = useCatStore.getState();
        const { hunger, love, mood } = getStatus();
        const memories = getMemory();

        const requestBody: ChatRequestDTO = {
            messages: [...chatLog, userMessage].slice(-20),
            memories,
            status: { hunger, love, mood: mood as 'neutral' },
        };

        try {
            const res: ChatResponseDTO = await postNewChat(requestBody);
            res.messages.forEach((msg: ChatDTO) => {
                addChatLog(msg);
            });
        } catch (e) {
            console.error('❌ 채팅 처리 중 오류 발생:', e);
        } finally {
            setIsBotTyping(false);
        }
    };

    const onSend = () => {
        handleSendMessage();
    };

    return {
        input,
        isBotTyping,
        isUserTyping,
        onInputChange,
        onSend,
    };
};