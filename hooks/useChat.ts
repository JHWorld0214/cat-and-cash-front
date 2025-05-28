import { useState, useRef } from 'react';
import { postNewChat } from '@/services/chat/postNewChat';
import { useChatStore } from '@/store/slices/chatStore';
import { delay } from '@/services/chat/delay';
import { ChatDTO } from '@/store/slices/chatStore';

export type Message = {
    id: number;
    sender: 'user' | 'bot';
    text: string;
};

export function useChat() {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isBotTyping, setIsBotTyping] = useState(false);
    const [isUserTyping, setIsUserTyping] = useState(false);
    const userMessagesBuffer = useRef<string[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const addMessage = (msg: Message) => {
        setMessages((prev) => [...prev, msg]);
    };

    const sendUserMessages = async () => {
        if (userMessagesBuffer.current.length === 0) return;

        const userMsgs = [...userMessagesBuffer.current];
        userMessagesBuffer.current = [];

        // UI에 사용자 메시지 표시
        userMsgs.forEach((msg) =>
            addMessage({
                id: Math.random(),
                sender: 'user',
                text: msg,
            })
        );

        setIsBotTyping(true);

        const response: ChatDTO[] = await postNewChat(userMsgs);

        for (const dto of response) {
            await delay(dto.content.length * 50 + 300);
            addMessage({
                id: dto.chatId,
                sender: 'bot',
                text: dto.content,
            });
            useChatStore.getState().addChat(dto);
        }

        setIsBotTyping(false);
    };

    const onSend = () => {
        if (!input.trim()) return;

        // ✅ 1. 버퍼에 추가만
        userMessagesBuffer.current.push(input.trim());
        setInput('');

        // ✅ 2. 타이머 리셋
        if (timerRef.current) clearTimeout(timerRef.current);

        // ✅ 3. 3초 후 자동 전송
        timerRef.current = setTimeout(() => {
            sendUserMessages();
        }, 3000);
    };

    const onInputChange = (text: string) => {
        setInput(text);
        setIsUserTyping(true);

        // ✅ 입력 중이면 전송 예약을 지연시키기 위해 타이머 리셋
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => {
                sendUserMessages();
            }, 3000);
        }
    };

    return {
        messages,
        input,
        isBotTyping,
        isUserTyping,
        onInputChange,
        onSend,
    };
}