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
import ChatInput from '../components/ChatInput';
import TypingIndicator from '../components/TypingIndicator';
import CatProfile from '@/assets/images/cat-profile.svg';
import { ChatDTO, useChatStore } from '@/store/slices/chatStore';
import { useChat } from '@/hooks/useChat';

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

    useEffect(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
    }, [displayedMessages]);

    const renderItem = ({ item, index }: { item: ChatDTO; index: number }) => {
        const isBot = item.role === 'assistant';
        const isTypingIndicator = item.chatId === -17;

        const isGroupStart =
            index === 0 || displayedMessages[index - 1].role !== item.role;

        const isLastBot =
            isBot &&
            (index === displayedMessages.length - 1 ||
                displayedMessages[index + 1].role !== 'assistant');

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
                                {isTypingIndicator ? (
                                    <TypingIndicator />
                                ) : (
                                    <Text style={{ color: '#333' }}>{item.content}</Text>
                                )}
                            </View>
                        </View>
                    </View>
                </View>
            );
        } else {
            return (
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        alignItems: 'flex-end',
                        marginBottom: 12,
                    }}
                >
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
                            <Text style={{ color: '#333' }}>{item.content}</Text>
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