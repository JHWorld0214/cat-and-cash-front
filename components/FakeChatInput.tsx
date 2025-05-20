import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  GestureResponderEvent,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  onPress?: (event: GestureResponderEvent) => void; // 눌렀을 때 실행할 함수
  disabled?: boolean; // 입력 비활성화 여부
}

export default function FakeChatInput({
  value,
  onChangeText,
  onPress,
  disabled = false,
}: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={1}
      style={styles.inputContainer}
    >
      <TextInput
        style={styles.input}
        placeholder="메시지를 입력해주세요!"
        placeholderTextColor="#999"
        value={value}
        onChangeText={onChangeText}
        editable={!disabled}
        multiline
        pointerEvents={disabled ? 'none' : 'auto'} // 입력 방지
      />
      <View style={styles.sendButton}>
        <Ionicons name="arrow-up" size={20} color="#fff" />
      </View>
    </TouchableOpacity>
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
    borderRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
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