// ChatScreen.tsx
import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    Keyboard,
    TouchableWithoutFeedback,
    Platform,
    KeyboardAvoidingView,
    StatusBar,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import CatProfile from '@/assets/images/cat-profile.svg';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: string;
}

export default function ChatScreen() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const flatListRef = useRef<FlatList>(null);
    const insets = useSafeAreaInsets();

    const getTimeString = (date: Date): string => {
        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const ampm = hours < 12 ? '오전' : '오후';
        if (hours === 0) hours = 12;
        else if (hours > 12) hours -= 12;
        return `${ampm} ${hours}:${minutes}`;
    };

    const handleSend = () => {
        const trimmed = inputText.trim();
        if (!trimmed) return;
        const now = new Date();
        const userMsg: Message = {
            id: Date.now().toString(),
            text: trimmed,
            sender: 'user',
            timestamp: getTimeString(now),
        };
        const updated = [...messages, userMsg];
        setMessages(updated);
        setInputText('');
        scrollToBottom();

        const isEven = updated.filter(m => m.sender === 'user').length % 2 === 0;
        const responses = isEven ? ['머어어어어', '냐아아아아!?'] : ['머냥!'];

        setTimeout(() => {
            const botNow = new Date();
            const botMsgs: Message[] = responses.map((text, idx) => ({
                id: (Date.now() + idx + 1).toString(),
                text,
                sender: 'bot',
                timestamp: getTimeString(botNow),
            }));
            setMessages(prev => [...prev, ...botMsgs]);
            scrollToBottom();
        }, 2000);
    };

    const scrollToBottom = () => {
        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    };

    const handleClose = () => {
        alert('닫기 누름');
        setMessages([]);
    };

    const renderItem = ({ item, index }: { item: Message; index: number }) => {
        const isBot = item.sender === 'bot';
        const isUser = item.sender === 'user';
        const isGroupStart = index === 0 || messages[index - 1].sender !== item.sender;
        const isLastBot = isBot && (index === messages.length - 1 || messages[index + 1].sender !== 'bot');

        if (isBot) {
            return (
                <View style={{ marginBottom: messages[index + 1]?.sender === 'bot' ? 2 : 12 }}>
                    {isGroupStart && (
                        <View style={styles.botHeaderRow}>
                            <CatProfile width={36} height={36} />
                            <Text style={styles.botName}>머냥이</Text>
                        </View>
                    )}
                    <View style={styles.botRow}>
                        <View style={styles.avatarSpacer} />
                        <View style={styles.botBubbleBlock}>
                            <View style={[styles.bubble, styles.botBubble]}>
                                <Text style={styles.bubbleText}>{item.text}</Text>
                            </View>
                            {isLastBot && (
                                <Text style={[styles.timestamp, { alignSelf: 'flex-end', marginRight: 6 }]}>{item.timestamp}</Text>
                            )}
                        </View>
                    </View>
                </View>
            );
        }

        return (
            <View style={styles.userRow}>
                <Text style={[styles.timestamp, { alignSelf: 'flex-end', marginRight: 6 }]}>{item.timestamp}</Text>
                <View style={styles.userBubbleBlock}>
                    <View style={[styles.bubble, styles.userBubble]}>
                        <Text style={styles.bubbleText}>{item.text}</Text>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F4F3FF" />
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
                    style={{ flex: 1 }}
                >
                    <View style={styles.inner}>
                        <TouchableOpacity
                            style={[styles.closeButton, { top: insets.top, position: 'absolute', right: 12 }]}
                            onPress={handleClose}
                        >
                            <Ionicons name="close" size={24} color="#333" />
                        </TouchableOpacity>

                        <FlatList
                            ref={flatListRef}
                            data={messages}
                            renderItem={renderItem}
                            keyExtractor={item => item.id}
                            contentContainerStyle={styles.chatArea}
                        />

                        <View style={[styles.inputContainer, { marginBottom: insets.bottom }]}>
                            <TextInput
                                style={styles.input}
                                placeholder="메시지를 입력해주세요!"
                                placeholderTextColor="#999"
                                value={inputText}
                                onChangeText={setInputText}
                            />
                            <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                                <Ionicons name="arrow-up" size={20} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F4F3FF' },
    inner: { flex: 1, justifyContent: 'space-between' },
    closeButton: { zIndex: 10, padding: 8 },
    chatArea: { paddingTop: 60, paddingHorizontal: 16, paddingBottom: 12 },
    botHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
    botName: { fontSize: 12, color: '#888', marginLeft: 6 },
    botRow: { flexDirection: 'row', alignItems: 'flex-start' },
    userRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        marginBottom: 12,
    },
    avatarSpacer: { width: 42, marginRight: 8 },
    botBubbleBlock: { maxWidth: '75%' },
    userBubbleBlock: { maxWidth: '75%' },
    bubble: {
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderRadius: 16,
    },
    botBubble: {
        backgroundColor: '#F0E8FF',
        borderTopLeftRadius: 4,
    },
    userBubble: {
        backgroundColor: '#D5C6FF',
        borderTopRightRadius: 4,
    },
    bubbleText: { fontSize: 14, color: '#333' },
    timestamp: { fontSize: 12, color: '#999', marginTop: 2 },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    input: {
        flex: 1,
        fontSize: 14,
        paddingVertical: Platform.OS === 'ios' ? 10 : 6,
        paddingHorizontal: 12,
        backgroundColor: '#F6F6F6',
        borderRadius: 20,
        marginRight: 8,
        color: '#000',
    },
    sendButton: {
        backgroundColor: '#A086FF',
        borderRadius: 20,
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
