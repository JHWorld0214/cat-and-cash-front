import { useState, useRef, useCallback } from 'react';

export interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
}
type BotResponse = string[]; // 서버에서 줄단위로 내려온다고 가정

export function useChat(sendToServer: (text: string) => Promise<BotResponse>) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isBotTyping, setIsBotTyping] = useState(false);

    const idleTimer = useRef<NodeJS.Timeout | null>(null);

    const onInputChange = (text: string) => {
        setInput(text);
        if (idleTimer.current) clearTimeout(idleTimer.current);
    };

    const onSend = useCallback(() => {
        const trimmed = input.trim();
        if (trimmed) {
            handleSend(trimmed);
        }
    }, [input]);

    const handleSend = useCallback(async (text: string) => {
        const userMsg: Message = {
            id: Date.now().toString(),
            text,
            sender: 'user',
        };
        setMessages(msgs => [...msgs, userMsg]);
        setInput('');

        setIsBotTyping(true);

        try {
            const botLines = await sendToServer(text);

            let delay = 500;
            botLines.forEach((line, idx) => {
                delay += Math.min(3000, line.length * 40);
                setTimeout(() => {
                    setMessages(msgs => [
                        ...msgs,
                        { id: `bot-${Date.now()}-${idx}`, text: line, sender: 'bot' },
                    ]);
                    if (idx === botLines.length - 1) {
                        setIsBotTyping(false);
                    }
                }, delay);
            });
        } catch (e) {
            setIsBotTyping(false);
            setMessages(msgs => [
                ...msgs,
                { id: `bot-${Date.now()}`, text: '오류가 발생했어요😢', sender: 'bot' },
            ]);
        }
    }, [sendToServer]);

    return {
        messages,
        input,
        isBotTyping,
        onInputChange,
        onSend,
    };
}