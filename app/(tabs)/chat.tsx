import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    Platform,
    Keyboard,
    TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

// 필요에 따라 실제 이미지 경로로 변경하세요.
const CAT_AVATAR = require('../../assets/images/cat_profile.png');

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: string; // 예: "오후 11:52"
}

export default function ChatScreen() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const flatListRef = useRef<FlatList>(null);
    const insets = useSafeAreaInsets();

    // 백엔드 호출 시뮬레이션 (머냥! 응답)
    const sendMessageToBackend = async (_message: string): Promise<string> => {
        return '머냥!';
    };

    // "오전/오후 hh:mm" 형식의 타임스탬프 생성 함수
    const getKakaoTimeString = (date: Date): string => {
        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const ampm = hours < 12 ? '오전' : '오후';
        if (hours === 0) {
            hours = 12;
        } else if (hours > 12) {
            hours -= 12;
        }
        return `${ampm} ${hours}:${minutes}`;
    };

    const handleSend = async () => {
        const trimmedText = inputText.trim();
        if (!trimmedText) return;
        const now = new Date();
        const userMessage: Message = {
            id: Date.now().toString(),
            text: trimmedText,
            sender: 'user',
            timestamp: getKakaoTimeString(now),
        };
        setMessages(prev => [...prev, userMessage]);
        setInputText('');
        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
        setTimeout(async () => {
            const botNow = new Date();
            const responseText = await sendMessageToBackend(trimmedText);
            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: responseText,
                sender: 'bot',
                timestamp: getKakaoTimeString(botNow),
            };
            setMessages(prev => [...prev, botMessage]);
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
        }, 2000);
    };

    // 메시지 렌더러: 봇 메시지와 사용자 메시지 각각 타임스탬프가 채팅 버블 옆에 배치됨
    const renderItem = ({ item }: { item: Message }) => {
        if (item.sender === 'bot') {
            // 봇 메시지: 왼쪽에 아바타, 오른쪽에 버블과 타임스탬프 (가로 배치)
            return (
                <View style={styles.botRow}>
                    <View style={styles.avatarContainer}>
                        {/* 텍스트 기반의 고양이 아이콘 (실제 이미지를 사용하려면 아래 Image 컴포넌트를 사용) */}
                        <Text style={styles.avatarIcon}>🐱</Text>
                        {/*
            <Image
              source={CAT_AVATAR}
              style={styles.avatarImage}
              resizeMode="contain"
            />
            */}
                    </View>
                    <View style={styles.botBubbleWrapper}>
                        <View style={styles.bubbleRow}>
                            <View style={[styles.bubble, styles.botBubble]}>
                                <Text style={styles.botText}>{item.text}</Text>
                            </View>
                            <Text style={styles.timestamp}>{item.timestamp}</Text>
                        </View>
                    </View>
                </View>
            );
        } else {
            // 사용자 메시지: 오른쪽에 버블과 타임스탬프 (타임스탬프가 왼쪽에 위치)
            return (
                <View style={styles.userRow}>
                    <View style={styles.userBubbleWrapper}>
                        <View style={styles.bubbleRow}>
                            <Text style={styles.timestamp}>{item.timestamp}</Text>
                            <View style={[styles.bubble, styles.userBubble]}>
                                <Text style={styles.userText}>{item.text}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            );
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient colors={['#F4F3FF', '#FFFFFF']} style={styles.gradientBackground}>
                {/* Top Banner */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>머냥이</Text>
                </View>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                    <View style={styles.flexContainer}>
                        <FlatList
                            ref={flatListRef}
                            data={messages}
                            renderItem={renderItem}
                            keyExtractor={item => item.id}
                            contentContainerStyle={styles.flatListContent}
                            ListEmptyComponent={<Text style={styles.emptyText}>채팅을 시작해보세요</Text>}
                        />
                        {/* Input Area */}
                        <View style={[styles.inputContainer, { marginBottom: insets.bottom + 10 }]}>
                            <TextInput
                                style={styles.input}
                                value={inputText}
                                onChangeText={setInputText}
                                placeholder="메시지를 입력해주세요!"
                                placeholderTextColor="#999"
                                multiline={false}
                            />
                            <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                                <Text style={styles.sendButtonText}>전송</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </LinearGradient>
        </SafeAreaView>
    );
}

const AVATAR_SIZE = 44;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    gradientBackground: {
        flex: 1,
    },
    header: {
        height: 50,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    flexContainer: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    flatListContent: {
        paddingHorizontal: 12,
        paddingTop: 12,
        paddingBottom: 12,
    },
    emptyText: {
        color: '#888',
        textAlign: 'center',
        marginTop: 20,
        fontSize: 14,
    },
    // Bot row
    botRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 6,
    },
    avatarContainer: {
        width: AVATAR_SIZE,
        alignItems: 'center',
        marginRight: 6,
    },
    avatarIcon: {
        fontSize: 28,
    },
    botBubbleWrapper: {
        maxWidth: '75%',
    },
    // User row
    userRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginVertical: 6,
    },
    userBubbleWrapper: {
        maxWidth: '75%',
        alignItems: 'flex-end',
    },
    // Common bubble row for bubble + timestamp (horizontal)
    bubbleRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    // Bubbles
    bubble: {
        borderRadius: 16,
        paddingHorizontal: 14,
        paddingVertical: 10,
    },
    botBubble: {
        backgroundColor: '#DAD3FF', // pastel purple
        borderTopLeftRadius: 4,
    },
    userBubble: {
        backgroundColor: '#FFD6F0', // pastel pink
        borderTopRightRadius: 4,
    },
    // Text in bubbles
    botText: {
        fontSize: 15,
        color: '#333',
        lineHeight: 20,
    },
    userText: {
        fontSize: 15,
        color: '#333',
        lineHeight: 20,
    },
    // Timestamp style (placed beside the bubble)
    timestamp: {
        fontSize: 12,
        color: '#666',
        marginHorizontal: 6,
    },
    // Input area
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderTopWidth: 0.5,
        borderTopColor: '#ccc',
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: '#333',
        backgroundColor: '#F8F8F8',
        borderRadius: 18,
        paddingHorizontal: 12,
        paddingVertical: Platform.OS === 'ios' ? 8 : 6,
        marginRight: 6,
    },
    sendButton: {
        backgroundColor: '#A086FF',
        borderRadius: 18,
        paddingHorizontal: 14,
        paddingVertical: 8,
    },
    sendButtonText: {
        color: '#fff',
        fontSize: 15,
    },
});