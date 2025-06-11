import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { calDecAmount} from "@services/account/calDecAmount";

export default function SpendInputWithNyang() {
    const [spend, setSpend] = useState('');
    const [nyang, setNyang] = useState<number | null>(null);

    const getColor = (nyang: number | null) => {
        if (nyang === null) return '#ccc'; // 기본 회색
        if (nyang <= 30) return '#4CAF50'; // 초록
        if (nyang <= 100) return '#FFC107'; // 노랑
        return '#F44336'; // 빨강
    };

    const getMessage = (nyang: number | null) => {
        if (nyang === null) return '소비를 입력해보세요!';
        if (nyang <= 30) return '좋은 소비 습관이에요!';
        if (nyang <= 100) return '조금만 아껴보면 어때요?';
        return '이러다 통장이 털려요…!';
    };

    useEffect(() => {
        const calculate = async () => {
            const amount = parseInt(spend);
            if (!isNaN(amount) && amount > 0) {
                const result = await calDecAmount(amount);
                setNyang(result);
            } else {
                setNyang(null);
            }
        };
        calculate();
    }, [spend]);

    return (
        <View style={styles.container}>
            <Text style={styles.label}>오늘 얼마를 소비했냥?</Text>
            <TextInput
                style={styles.input}
                placeholder="예: 10000"
                keyboardType="numeric"
                value={spend}
                onChangeText={setSpend}
            />
            {nyang !== null && (
                <View style={[styles.reactionBox, { backgroundColor: getColor(nyang) }]}>
                    <Text style={styles.reactionText}>줄어드는 냥: {nyang}냥</Text>
                    <Text style={styles.reactionText}>{getMessage(nyang)}</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { padding: 16, alignItems: 'center' },
    label: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
    input: {
        width: '80%',
        height: 44,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 12,
        marginBottom: 16,
    },
    reactionBox: {
        padding: 16,
        borderRadius: 12,
        marginTop: 8,
        width: '80%',
        alignItems: 'center',
    },
    reactionText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});