import { useState, useRef } from 'react';
import { ChatDTO, ChatRequestDTO, ChatResponseDTO } from '@/store/slices/chatStore';
import { useCatStore } from '@/store/slices/catStore';
import { postNewChat } from '@services/chat/postNewChat';

interface UseChatProps {
    localChatLog: ChatDTO[];
    setLocalChatLog: React.Dispatch<React.SetStateAction<ChatDTO[]>>;
}

export const useChat = ({ localChatLog, setLocalChatLog }: UseChatProps) => {
    const [input, setInput] = useState('');
    const [pendingMessages, setPendingMessages] = useState<string[]>([]);
    const [isBotTyping, setIsBotTyping] = useState(false);
    const [isUserTyping, setIsUserTyping] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const getStatus = useCatStore.getState().getStatus;
    const getMemory = useCatStore.getState().getMemory;

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const onInputChange = (text: string) => {
        setInput(text);
        setIsUserTyping(true);

        if (timerRef.current) clearTimeout(timerRef.current);

        if (text.trim() !== '') {
            timerRef.current = setTimeout(() => {
                setPendingMessages(prev => [...prev, text.trim()]);
                setInput('');
                setIsUserTyping(false);
                handleSendMessage();
            }, 3000);
        }
    };

    const handleSendMessage = async () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        if (pendingMessages.length === 0 && input.trim() === '') return;

        const allMessages = [...pendingMessages];
        if (input.trim()) {
            allMessages.push(input.trim());
            setInput('');
        }
        setPendingMessages([]);

        const combined = allMessages.join(' ');
        const userMessage: ChatDTO = {
            chatId: Date.now(),
            content: combined,
            chatDate: new Date().toISOString(),
            role: 'user',
        };

        // 사용자 메시지 추가
        setLocalChatLog(prev => [...prev, userMessage]);

        // ✨ 즉시 '...' 인디케이터 추가
        const typingIndicator: ChatDTO = {
            chatId: -17,
            chatDate: new Date().toISOString(),
            content: '',
            role: 'assistant',
        };
        setLocalChatLog(prev => [...prev, typingIndicator]);
        setIsBotTyping(true);

        const { hunger, love, mood } = getStatus();
        const memories = getMemory();

        const requestBody: ChatRequestDTO = {
            messages: [...localChatLog, userMessage].slice(-20),
            memories,
            status: { hunger, love, mood: mood as 'neutral' },
        };

        try {
            const res: ChatResponseDTO = await postNewChat(requestBody);
            const botMessages = res.messages;

            if (botMessages.length === 0) throw new Error('Empty bot response');

            // 첫 응답 → '...' 제거 후 표시
            setLocalChatLog(prev => [
                ...prev.filter(msg => msg.chatId !== -17),
                {
                    ...botMessages[0],
                    chatId: Date.now() + Math.random(),
                    chatDate: new Date().toISOString(),
                },
            ]);

            // 이후 응답
            for (let i = 1; i < botMessages.length; i++) {
                // 다시 '...' 표시
                setLocalChatLog(prev => [...prev, typingIndicator]);
                await sleep(2000); // 타이핑 효과

                // '...' 제거 후 응답 표시
                setLocalChatLog(prev => [
                    ...prev.filter(msg => msg.chatId !== -17),
                    {
                        ...botMessages[i],
                        chatId: Date.now() + Math.random(),
                        chatDate: new Date().toISOString(),
                    },
                ]);
            }
        } catch (e) {
            console.error('❌ 채팅 처리 중 오류 발생:', e);
            setLocalChatLog(prev => [
                ...prev.filter(msg => msg.chatId !== -17),
                {
                    chatId: Date.now(),
                    content: '뭐라고 했냥? 잘 못들었다냥! 😿',
                    chatDate: new Date().toISOString(),
                    role: 'assistant',
                },
            ]);
        } finally {
            setIsBotTyping(false);
        }
    };

    const onSend = () => {
        if (input.trim()) {
            setPendingMessages(prev => [...prev, input.trim()]);
            setInput('');
        }
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