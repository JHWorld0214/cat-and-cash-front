import React, { useRef, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    SafeAreaView,
    StatusBar,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Message, useChat } from '@hooks/useChat';
import ChatInput from '../components/ChatInput';
import TypingIndicator from '../components/TypingIndicator';
import CatProfile from '@/assets/images/cat-profile.svg';
import {useChatStore} from "@store/slices/chatStore";

export default function ChatScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const flatListRef = useRef<FlatList>(null);

    const sendToServer = async (text: string): Promise<string[]> => {
        return ['안녕!', '무슨 도움이 필요해요?'];
    };

    const { chatLog } = useChatStore();
    const { messages, input, isBotTyping, onInputChange, onSend } = useChat();

    // API에서 가져온 이전 메시지
    const initialMessages: Message[] = chatLog.map((item) => ({
        id: item.chatId,
        sender: 'user',
        text: item.content,
    }));

    // 메시지 + 입력중 indicator 추가
// 🔁 이걸로 바꿔주세요
    const displayedMessages: Message[] = isBotTyping
        ? [...initialMessages, ...messages, { id: 'typing', sender: 'bot', text: '' }]
        : [...initialMessages, ...messages];

    // 👇 메시지 변경 시 자동 스크롤
    useEffect(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
    }, [displayedMessages]);

    const renderItem = ({ item, index }: { item: Message; index: number }) => {
        const isBot = item.sender === 'bot';
        const isGroupStart = index === 0 || displayedMessages[index - 1].sender !== item.sender;
        const isLastBot = isBot && (index === displayedMessages.length - 1 || displayedMessages[index + 1].sender !== 'bot');
        const isTypingIndicator = item.id === 'typing';

        if (isBot) {
            return (
                <View style={{ marginBottom: isTypingIndicator || isLastBot ? 12 : 2 }}>
                    {isGroupStart && (
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                            <CatProfile width={36} height={36} />
                            <Text style={{ fontSize: 12, color: '#888', marginLeft: 6 }}>머냥이</Text>
                        </View>
                    )}
                    <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                        <View style={{ width: 42, marginRight: 8 }} />
                        <View style={{ maxWidth: '75%' }}>
                            <View
                                style={{
                                    backgroundColor: '#F0E8FF',
                                    paddingVertical: 12,
                                    paddingHorizontal: 16,
                                    borderRadius: 16,
                                    borderTopLeftRadius: 4,
                                    minHeight: 40,
                                    justifyContent: 'center',
                                }}
                            >
                                {isTypingIndicator ? <TypingIndicator /> : <Text style={{ color: '#333' }}>{item.text}</Text>}
                            </View>
                        </View>
                    </View>
                </View>
            );
        } else {
            return (
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-end', marginBottom: 12 }}>
                    <Text style={{ fontSize: 12, color: '#999', marginRight: 6 }}>{/* timestamp */}</Text>
                    <View style={{ maxWidth: '75%' }}>
                        <View
                            style={{
                                backgroundColor: '#D5C6FF',
                                padding: 12,
                                borderRadius: 16,
                                borderTopRightRadius: 4,
                                minHeight: 40,
                                justifyContent: 'center',
                            }}
                        >
                            <Text style={{ color: '#333' }}>{item.text}</Text>
                        </View>
                    </View>
                </View>
            );
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#F4F3FF', paddingBottom: insets.bottom }}>
            <StatusBar barStyle="dark-content" backgroundColor="#F4F3FF" />
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
            >
                <View style={{ flex: 1 }}>
                    {/* 닫기 버튼 */}
                    <View style={{ position: 'absolute', top: 18, right: 18, zIndex: 10 }}>
                        <Ionicons name="close" size={28} color="#5A4B91" onPress={() => router.back()} />
                    </View>

                    {/* 메시지 목록 */}
                    <FlatList
                        ref={flatListRef}
                        data={displayedMessages}
                        renderItem={renderItem}
                        keyExtractor={(m) => m.id}
                        contentContainerStyle={{
                            paddingTop: 80,
                            paddingHorizontal: 16,
                            paddingBottom: 5,
                            flexGrow: 1,
                        }}
                        style={{ flex: 1 }}
                        keyboardShouldPersistTaps="handled"
                    />

                    {/* 인풋창만 키보드 닫기용 터치 처리 */}
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={{ paddingHorizontal: 16, backgroundColor: '#F4F3FF' }}>
                            <ChatInput value={input} onChangeText={onInputChange} onSend={onSend} />
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}