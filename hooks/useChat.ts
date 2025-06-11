import { useState, useRef } from 'react';
import { useChatStore, ChatDTO, ChatRequestDTO, ChatResponseDTO } from '@/store/slices/chatStore';
import { useCatStore } from '@/store/slices/catStore';
import { postNewChat } from "@services/chat/postNewChat";

export const useChat = () => {
    const [input, setInput] = useState('');
    const [isBotTyping, setIsBotTyping] = useState(false);
    const [isUserTyping, setIsUserTyping] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const { chatLog, addChatLog, removeChatLog } = useChatStore();
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

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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

        const { hunger, love, mood } = useCatStore.getState().getStatus();
        const memories = useCatStore.getState().getMemory();

        const requestBody: ChatRequestDTO = {
            messages: [...chatLog, userMessage].slice(-20),
            memories,
            status: { hunger, love, mood: mood as 'neutral' },
        };

        try {
            const res: ChatResponseDTO = await postNewChat(requestBody);
            for (const msg of res.messages) {
                const typingMessage: ChatDTO = {
                    chatId: Date.now() + Math.random(), // 임시 ID
                    chatDate: new Date().toISOString(),
                    content: '',
                    role: 'assistant',
                };

                addChatLog(typingMessage); // ... 타이핑 애니메이션 표시
                await sleep(2000); // 2초 대기
                removeChatLog(typingMessage.chatId); // 타이핑 제거
                addChatLog(msg); // 실제 메시지 추가
            }
        } catch (e) {
            console.error('❌ 채팅 처리 중 오류 발생:', e);
            const errorMessage: ChatDTO = {
                chatId: Date.now(),
                content: '뭐라고 했냥? 잘 못들었다냥! 😿',
                chatDate: new Date().toISOString(),
                role: 'assistant',
            };
            addChatLog(errorMessage);
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