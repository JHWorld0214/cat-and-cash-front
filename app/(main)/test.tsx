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
import CatProfile from "@/assets/images/cat-profile.svg";

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: string; // e.g. "오후 11:52"
}

export default function ChatScreen() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const flatListRef = useRef<FlatList>(null);
    const insets = useSafeAreaInsets();

    // Simulated backend call returning "머냥!"
    const sendMessageToBackend = async (_message: string): Promise<string> => {
        return '머냥!';
    };

    // Returns a string like "오전 11:52"
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

        // Scroll to bottom
        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);

        // Simulate bot response after 2s
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

    // Renders each chat bubble with optional cat avatar on bot messages
    const renderItem = ({ item }: { item: Message }) => {
        const isBot = item.sender === 'bot';
        const isUser = item.sender === 'user';

        if (isBot) {
            // Bot row: cat avatar on the left, bubble next to it
            return (
                <View style={styles.botRow}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatarCircle}>
                            <LinearGradient
                                colors={['#fff', '#eee']}
                                style={styles.avatarBg}
                            >
                                <View style={styles.avatarImageWrapper}>
                                    <View style={styles.avatarImage}>
                                        <Text style={{ fontSize: 20 }}>🐱</Text>
                                    </View>
                                    <CatProfile width={25} height={25} />
                                </View>
                            </LinearGradient>
                        </View>
                    </View>
                    <View style={styles.botBubbleWrapper}>
                        <View style={[styles.bubble, styles.botBubble]}>
                            <Text style={styles.botText}>{item.text}</Text>
                        </View>
                        <Text style={styles.timestamp}>{item.timestamp}</Text>
                    </View>
                </View>
            );
        }

        // User row: bubble on the right, no avatar
        return (
            <View style={styles.userRow}>
                <View style={styles.userBubbleWrapper}>
                    <View style={[styles.bubble, styles.userBubble]}>
                        <Text style={styles.userText}>{item.text}</Text>
                    </View>
                    <Text style={[styles.timestamp, { alignSelf: 'flex-end' }]}>{item.timestamp}</Text>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient
                // Light pastel purple to white, tweak as you wish
                colors={['#F4F3FF', '#FFFFFF']}
                style={styles.gradientBackground}
            >
                {/*
          We use KeyboardAvoidingView so the input bar moves up
          on iOS. Tweak keyboardVerticalOffset if there's a bottom tab.
        */}
                <View style={styles.flexContainer}>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                        <View style={styles.chatContainer}>
                            <FlatList
                                ref={flatListRef}
                                data={messages}
                                renderItem={renderItem}
                                keyExtractor={item => item.id}
                                contentContainerStyle={styles.flatListContent}
                                ListEmptyComponent={
                                    <Text style={styles.emptyText}>채팅을 시작해보세요</Text>
                                }
                            />

                            {/* Input bar at bottom */}
                            <View style={[styles.inputContainer, { marginBottom: insets.bottom }]}>
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
                </View>
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
    flexContainer: {
        flex: 1,
    },
    chatContainer: {
        flex: 1,
        justifyContent: 'flex-end',
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

    // Bot row: avatar on the left, bubble on the right
    botRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginVertical: 6,
    },
    avatarContainer: {
        width: AVATAR_SIZE,
        alignItems: 'center',
        marginRight: 6,
    },
    avatarCircle: {
        width: AVATAR_SIZE,
        height: AVATAR_SIZE,
        borderRadius: AVATAR_SIZE / 2,
        overflow: 'hidden',
    },
    avatarBg: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarImageWrapper: {
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarImage: {
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
    },
    botBubbleWrapper: {
        maxWidth: '75%',
    },

    // User row: bubble on the right
    userRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginVertical: 6,
    },
    userBubbleWrapper: {
        maxWidth: '75%',
        alignItems: 'flex-end',
    },

    // Bubbles
    bubble: {
        borderRadius: 16,
        paddingHorizontal: 14,
        paddingVertical: 10,
    },
    botBubble: {
        backgroundColor: '#DAD3FF', // pastel purple
        borderTopLeftRadius: 4, // slightly sharper corner
    },
    userBubble: {
        backgroundColor: '#FFD6F0', // pastel pink
        borderTopRightRadius: 4,
    },

    // Text inside bubbles
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

    // Timestamps
    timestamp: {
        marginTop: 2,
        fontSize: 12,
        color: '#666',
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