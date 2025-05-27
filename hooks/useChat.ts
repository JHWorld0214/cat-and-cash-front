import { useState, useEffect, useRef } from 'react';
import { postNewChat } from '@/services/chat/postNewChat';
import { useChatStore } from '@/store/slices/chatStore';
import { delay } from '@/services/chat/delay';
import { ChatDTO } from '@/store/slices/chatStore';

export type Message = {
    id: string;
    sender: 'user' | 'bot';
    text: string;
};

export function useChat() {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isBotTyping, setIsBotTyping] = useState(false);
    const userMessagesBuffer = useRef<string[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const addMessage = (msg: Message) => {
        setMessages((prev) => [...prev, msg]);
    };

    const onInputChange = (text: string) => {
        setInput(text);
        if (timerRef.current) clearTimeout(timerRef.current);

        timerRef.current = setTimeout(() => {
            if (input.trim()) {
                sendUserMessages();
            }
        }, 3000); // 3초 후 전송
    };

    const sendUserMessages = async () => {
        const text = input.trim();
        if (!text) return;

        setInput('');
        userMessagesBuffer.current.push(text);
        const userMsgs = [...userMessagesBuffer.current];

        // UI에 사용자 메시지 표시
        userMsgs.forEach((msg) =>
            addMessage({
                id: Math.random().toString(),
                sender: 'user',
                text: msg,
            })
        );

        userMessagesBuffer.current = [];

        setIsBotTyping(true);
        const response: ChatDTO[] = await postNewChat(userMsgs);

        for (const dto of response) {
            await delay(dto.content.length * 50 + 300); // 길이에 따라 delay
            addMessage({
                id: dto.chatId.toString(),
                sender: 'bot',
                text: dto.content,
            });
            useChatStore.getState().addChat(dto); // 상태에 저장
        }
        setIsBotTyping(false);
    };

    const onSend = () => {
        if (input.trim()) {
            if (timerRef.current) clearTimeout(timerRef.current);
            sendUserMessages();
        }
    };

    return {
        messages,
        input,
        isBotTyping,
        onInputChange,
        onSend,
    };
}