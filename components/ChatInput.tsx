import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
    value: string;
    onChangeText: (text: string) => void;
}

export default function ChatInput({ value, onChangeText }: Props) {
    return (
        <View style={styles.inputContainer}>
            <TextInput
                style={styles.input}
                placeholder="머하냥!?"
                placeholderTextColor="#999"
                value={value}
                onChangeText={onChangeText}
                multiline
            />
            <TouchableOpacity style={styles.sendButton} onPress={() => onChangeText(value)}>
                <Ionicons name="arrow-up" size={20} color="#fff" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
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