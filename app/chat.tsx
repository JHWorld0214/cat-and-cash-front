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
import ChatInput from '@components/chat/ChatInput';
import TypingIndicator from '@components/chat/TypingIndicator';
import CatProfile from '@/assets/images/cat-profile.svg';
import { ChatDTO, useChatStore } from '@/store/slices/chatStore';
import { useChat } from '@/hooks/useChat';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
dayjs.locale('ko');

const formatDateToDay = (dateStr: string) => dayjs(dateStr).format('YYYY년 M월 D일 dddd');
const formatToKoreanTime = (dateStr: string) => dayjs(dateStr).format('A h:mm');

export default function ChatScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const flatListRef = useRef<FlatList>(null);

    const { chatLog } = useChatStore();
    const { input, isBotTyping, isUserTyping, onInputChange, onSend } = useChat();

    const typingIndicator: ChatDTO = {
        chatId: -17,
        chatDate: new Date().toISOString(),
        content: '',
        role: 'assistant',
    };

    const displayedMessages: ChatDTO[] =
        isBotTyping && !isUserTyping ? [...chatLog, typingIndicator] : [...chatLog];

    const scrollToBottom = () => {
        flatListRef.current?.scrollToEnd({ animated: true });
    };

    useEffect(() => {
        scrollToBottom();
    }, [displayedMessages, isUserTyping]);

    useEffect(() => {
        const keyboardShowListener = Keyboard.addListener('keyboardDidShow', scrollToBottom);
        return () => {
            keyboardShowListener.remove();
        };
    }, []);

    const renderItem = ({ item, index }: { item: ChatDTO; index: number }) => {
        const isBot = item.role === 'assistant';
        const isTypingIndicator = item.chatId === -17;

        const isGroupStart =
            index === 0 || displayedMessages[index - 1].role !== item.role;

        const isLastBot =
            isBot &&
            (index === displayedMessages.length - 1 ||
                displayedMessages[index + 1].role !== 'assistant');

        const showDateIndicator =
            index === 0 ||
            formatDateToDay(item.chatDate) !== formatDateToDay(displayedMessages[index - 1].chatDate);

        return (
            <>
                {showDateIndicator && (
                    <View style={{ alignItems: 'center', marginVertical: 10 }}>
                        <Text style={{ fontSize: 13, color: '#999' }}>
                            {formatDateToDay(item.chatDate)}
                        </Text>
                    </View>
                )}

                {isBot ? (
                    <View style={{ marginBottom: isTypingIndicator || isLastBot ? 12 : 2 }}>
                        {isGroupStart && (
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                                <CatProfile width={36} height={36} />
                                <Text style={{ fontSize: 12, color: '#888', marginLeft: 6 }}>머냥이</Text>
                            </View>
                        )}
                        <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                            <View style={{ width: 42, marginRight: 8 }} />
                            <View style={{ flexDirection: 'row', alignItems: 'flex-end', maxWidth: '60%' }}>
                                <View
                                    style={{
                                        backgroundColor: '#F0E8FF',
                                        paddingVertical: 12,
                                        paddingHorizontal: 16,
                                        borderRadius: 16,
                                        borderTopLeftRadius: 4,
                                        justifyContent: 'center',
                                        flexShrink: 1,
                                    }}
                                >
                                    {isTypingIndicator ? (
                                        <TypingIndicator />
                                    ) : (
                                        <Text
                                            style={{
                                                color: '#333',
                                                flexWrap: 'wrap',
                                                flexShrink: 1,
                                            }}
                                        >
                                            {item.content}
                                        </Text>
                                    )}
                                </View>
                                {!isTypingIndicator && (
                                    <Text
                                        style={{
                                            fontSize: 11,
                                            color: '#999',
                                            marginLeft: 6,
                                            alignSelf: 'flex-end',
                                        }}
                                    >
                                        {formatToKoreanTime(item.chatDate)}
                                    </Text>
                                )}
                            </View>
                        </View>
                    </View>
                ) : (
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                            alignItems: 'flex-end',
                            marginBottom: 12,
                        }}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                            <Text style={{ fontSize: 11, color: '#999', marginRight: 6, alignSelf: 'flex-end' }}>
                                {formatToKoreanTime(item.chatDate)}
                            </Text>
                            <View
                                style={{
                                    backgroundColor: '#D5C6FF',
                                    padding: 12,
                                    borderRadius: 16,
                                    borderTopRightRadius: 4,
                                    minHeight: 40,
                                    justifyContent: 'center',
                                    maxWidth: '75%',
                                }}
                            >
                                <Text style={{ color: '#333', flexWrap: 'wrap' }}>{item.content}</Text>
                            </View>
                        </View>
                    </View>
                )}
            </>
        );
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
                    <View style={{ position: 'absolute', top: 18, right: 18, zIndex: 10 }}>
                        <Ionicons name="close" size={28} color="#5A4B91" onPress={() => router.back()} />
                    </View>

                    <FlatList
                        ref={flatListRef}
                        data={displayedMessages}
                        renderItem={renderItem}
                        keyExtractor={(m) => m.chatId.toString()}
                        contentContainerStyle={{
                            paddingTop: 80,
                            paddingHorizontal: 16,
                            paddingBottom: 5,
                            flexGrow: 1,
                        }}
                        style={{ flex: 1 }}
                        keyboardShouldPersistTaps="handled"
                    />

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