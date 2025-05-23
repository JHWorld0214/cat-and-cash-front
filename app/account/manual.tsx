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

export default function ManualEntryScreen() {
    const router = useRouter();
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('미분류');
    const [showCategoryPicker, setShowCategoryPicker] = useState(false);
    const categories = ['식비', '교통', '온라인 쇼핑', '생활', '뷰티/미용', '여행', '주거/통신', '교육/학습'];

    const uis = {
        ledgerIcon: require('@/assets/ui/ledger.png'),
    };

    const formatDate = (d: Date) => `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 오전 ${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}`;

    const handleSave = () => {
        console.log({ amount, date, content, category });
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* 헤더 */}
                <View style={styles.header}>
                    <View style={styles.headerContainer}>
                        <Image source={uis.ledgerIcon} style={styles.icon} />
                        <Text style={styles.headerTitle}>가계부</Text>
                    </View>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="close" size={24} color="#333" />
                    </TouchableOpacity>
                </View>

                {/* 금액 */}
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

                {/* 날짜 */}
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

                {/* 내용 */}
                <View style={styles.infoRow}>
                    <Text>내용</Text>
                    <TextInput
                        placeholder="입력하세요"
                        style={[styles.memoInput, { textAlign: 'right' }]}
                        value={content}
                        onChangeText={setContent}
                    />
                </View>

                {/* 카테고리 */}
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

                {/* 저장 버튼 */}
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>저장</Text>
                </TouchableOpacity>
            </ScrollView>
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
});