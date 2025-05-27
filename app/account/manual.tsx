import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Image,
    Modal,
    Pressable,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { postSpending} from "@services/account/postSpending";
import { useSpendingStore } from '@store/slices/spendingStore';

export default function ManualEntryScreen() {
    const router = useRouter();
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('미분류');
    const [showCategoryPicker, setShowCategoryPicker] = useState(false);
    const [showSavedPopup, setShowSavedPopup] = useState(false);

    const categories = ['식비', '교통', '온라인 쇼핑', '생활', '뷰티/미용', '여행', '주거/통신', '교육/학습'];
    const categoryIdMap: { [key: string]: number } = {
        '식비': 1, '교통': 2, '온라인 쇼핑': 3, '생활': 4, '뷰티/미용': 5,
        '여행': 6, '주거/통신': 7, '교육/학습': 8
    };

    const handleSave = async () => {
        if (!amount || !content || category === '미분류') {
            alert('모든 항목을 입력해주세요.');
            return;
        }

        try {
            const numericAmount = parseInt(amount);
            const categoryId = categoryIdMap[category] || 0;

            const payload = {
                categoryId,
                amount: numericAmount,
                aftMoney: 0,
                content,
            };

            const result = await postSpending(payload);
            if (result) {
                const newItem = {
                    ...payload,
                    create_time: result.create_time || new Date().toISOString(),
                };
                useSpendingStore.getState().addItem(newItem);
                setShowSavedPopup(true);
                setTimeout(() => {
                    setShowSavedPopup(false);
                    router.back();
                }, 1500);
            }
        } catch (err) {
            alert('저장에 실패했습니다.');
        }
    };

    const formatDate = (d: Date) => `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 오전 ${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}`;

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <View style={styles.headerContainer}>
                        <Image source={require('@/assets/ui/ledger.png')} style={styles.icon} />
                        <Text style={styles.headerTitle}>가계부</Text>
                    </View>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="close" size={24} color="#333" />
                    </TouchableOpacity>
                </View>

                <View style={styles.amountContainer}>
                    <TextInput
                        style={styles.amountInput}
                        placeholder="0"
                        placeholderTextColor="#ccc"
                        value={amount}
                        onChangeText={setAmount}
                        keyboardType="numeric"
                    />
                    <Text style={styles.won}>원</Text>
                </View>

                <TouchableOpacity style={styles.infoRow} onPress={() => setShowDatePicker(true)}>
                    <Text>날짜</Text>
                    <Text>{formatDate(date)}</Text>
                </TouchableOpacity>
                {showDatePicker && (
                    <DateTimePicker
                        value={date}
                        mode="datetime"
                        display="default"
                        onChange={(event, selectedDate) => {
                            setShowDatePicker(false);
                            if (selectedDate) setDate(selectedDate);
                        }}
                    />
                )}

                <View style={styles.infoRow}>
                    <Text>내용</Text>
                    <TextInput
                        placeholder="입력하세요"
                        style={[styles.memoInput, { textAlign: 'right' }]}
                        value={content}
                        onChangeText={setContent}
                    />
                </View>

                <TouchableOpacity style={styles.infoRow} onPress={() => setShowCategoryPicker(true)}>
                    <Text>카테고리</Text>
                    <Text>{category}</Text>
                </TouchableOpacity>

                <Modal visible={showCategoryPicker} transparent animationType="fade">
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            {categories.map((c) => (
                                <Pressable key={c} onPress={() => { setCategory(c); setShowCategoryPicker(false); }}>
                                    <Text style={styles.modalOption}>{c}</Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>
                </Modal>

                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>저장</Text>
                </TouchableOpacity>
            </ScrollView>

            {showSavedPopup && (
                <View style={styles.popupOverlay}>
                    <View style={styles.popupBox}>
                        <Text style={styles.popupText}>저장 완료 🎉</Text>
                    </View>
                </View>
            )}
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9F5FB',
        padding: 20,
    },
    scrollContent: {
        paddingTop: 40,
        paddingBottom: 100,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
        alignItems: 'center',
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginLeft: 8,
    },
    icon: {
        width: 28,
        height: 28,
        resizeMode: 'contain',
    },
    amountContainer: {
        flexDirection: 'row',
        alignSelf: 'center',
        alignItems: 'center',
        gap: 10,
        marginBottom: 20,
    },
    amountInput: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#D33',
        paddingTop: 2,
    },
    won: {
        fontSize: 18,
        color: '#D33',
        paddingTop: 2,
    },
    infoRow: {
        borderTopWidth: 0.5,
        borderColor: '#ccc',
        paddingVertical: 14,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    memoInput: {
        flex: 1,
        marginLeft: 12,
        color: '#333',
    },
    saveButton: {
        marginTop: 40,
        backgroundColor: '#715DF2',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    saveButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        width: '80%',
    },
    modalOption: {
        paddingVertical: 12,
        fontSize: 16,
        textAlign: 'center',
    },
    popupOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
    },
    popupBox: {
        backgroundColor: '#fff',
        paddingVertical: 20,
        paddingHorizontal: 30,
        borderRadius: 12,
        elevation: 5,
    },
    popupText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
});