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
        // 디바운스: 800ms 입력 멈춤 감지
        if (idleTimer.current) clearTimeout(idleTimer.current);
        idleTimer.current = setTimeout(() => {
            if (text.trim()) {
                handleSend(text.trim());
            }
        }, 800);
    };

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
            const botLines = await sendToServer(text); // 서버에 던지고 줄단위 응답 받음

            // 0.5초 딜레이 후 순차적으로 보여주기
            let delay = 0;
            botLines.forEach((line, idx) => {
                delay += 500;
                setTimeout(() => {
                    setMessages(msgs => [
                        ...msgs,
                        { id: `bot-${Date.now()}-${idx}`, text: line, sender: 'bot' },
                    ]);
                    // 마지막 줄이면 타이핑 표시 끄기
                    if (idx === botLines.length - 1) {
                        setIsBotTyping(false);
                    }
                }, delay);
            });
        } catch (e) {
            // 에러 처리
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
    };
}