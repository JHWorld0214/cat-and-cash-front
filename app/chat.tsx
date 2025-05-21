import React from 'react';
import {
    View,
    Text,
    FlatList,
    SafeAreaView,
    StatusBar,
    TouchableWithoutFeedback,
    Keyboard,
    TouchableOpacity
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // ✅ 추가
import { Message, useChat } from '../hooks/useChat';
import ChatInput from '../components/ChatInput';
import TypingIndicator from '../components/TypingIndicator';
import CatProfile from '@/assets/images/cat-profile.svg';

export default function ChatScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const sendToServer = async (text: string): Promise<string[]> => {
        return ['안녕!', '무슨 도움이 필요해요?'];
    };

    const { messages, input, isBotTyping, onInputChange, onSend } = useChat(sendToServer);

    const renderItem = ({ item, index }: { item: Message; index: number }) => {
        const isBot = item.sender === 'bot';
        const isGroupStart = index === 0 || messages[index - 1].sender !== item.sender;
        const isLastBot = isBot && (index === messages.length - 1 || messages[index + 1].sender !== 'bot');

        if (isBot) {
            return (
                <View style={{ marginBottom: isLastBot ? 12 : 2 }}>
                    {isGroupStart && (
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                            <CatProfile width={36} height={36} />
                            <Text style={{ fontSize: 12, color: '#888', marginLeft: 6 }}>머냥이</Text>
                        </View>
                    )}
                    <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                        <View style={{ width: 42, marginRight: 8 }} />
                        <View style={{ maxWidth: '75%' }}>
                            <View style={{ backgroundColor: '#F0E8FF', padding: 12, borderRadius: 16, borderTopLeftRadius: 4 }}>
                                <Text style={{ color: '#333' }}>{item.text}</Text>
                            </View>
                            {isLastBot && (
                                <Text style={{ fontSize: 12, color: '#999', marginTop: 2, alignSelf: 'flex-end', marginRight: 6 }}>
                                    {/* timestamp */}
                                </Text>
                            )}
                        </View>
                    </View>
                </View>
            );
        } else {
            return (
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-end', marginBottom: 12 }}>
                    <Text style={{ fontSize: 12, color: '#999', marginRight: 6 }}>{/* timestamp */}</Text>
                    <View style={{ maxWidth: '75%' }}>
                        <View style={{ backgroundColor: '#D5C6FF', padding: 12, borderRadius: 16, borderTopRightRadius: 4 }}>
                            <Text style={{ color: '#333' }}>{item.text}</Text>
                        </View>
                    </View>
                </View>
            );
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#F4F3FF' }}>
            <StatusBar barStyle="dark-content" backgroundColor="#F4F3FF" />
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={{ flex: 1, paddingTop: 60, paddingHorizontal: 16, paddingBottom: insets.bottom }}>

                    {/* ✅ X 버튼 추가 */}
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={{ position: 'absolute', top: 18, right: 18, zIndex: 10 }}
                    >
                        <Ionicons name="close" size={28} color="#5A4B91" />
                    </TouchableOpacity>

                    <FlatList
                        data={messages}
                        renderItem={renderItem}
                        keyExtractor={(m) => m.id}
                        contentContainerStyle={{ paddingTop: 20 }}
                    />

                    {isBotTyping && <TypingIndicator />}

                    <ChatInput value={input} onChangeText={onInputChange} onSend={onSend} />
                </View>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
}