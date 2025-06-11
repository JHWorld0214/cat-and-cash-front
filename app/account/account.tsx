import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import SpendingList from '@components/account/SpendingList';
import TotalSpending from '@components/account/TotalSpending';

const uis = {
    ledgerIcon: require('@/assets/ui/ledger.png'),
};

export default function AccountScreen() {
    const router = useRouter();

    const today = new Date();
    const [selectedYear, setSelectedYear] = useState(today.getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1); // JS month: 0~11 → +1

    const [totalExpense, setTotalExpense] = useState(0);
    const totalIncome = 1000000; // 샘플 수입

    const goToPrevMonth = () => {
        setSelectedMonth(prev => {
            if (prev === 1) {
                setSelectedYear(y => y - 1);
                return 12;
            }
            return prev - 1;
        });
    };

    const goToNextMonth = () => {
        setSelectedMonth(prev => {
            if (prev === 12) {
                setSelectedYear(y => y + 1);
                return 1;
            }
            return prev + 1;
        });
    };

    return (
        <View style={styles.container}>
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

            {/* 요약 */}
            <View style={styles.monthNav}>
                <TouchableOpacity onPress={goToPrevMonth}>
                    <Ionicons name="chevron-back" size={20} color="#333" />
                </TouchableOpacity>
                <Text style={styles.monthTitle}>
                    {selectedYear}년 {selectedMonth}월
                </Text>
                <TouchableOpacity onPress={goToNextMonth}>
                    <Ionicons name="chevron-forward" size={20} color="#333" />
                </TouchableOpacity>
            </View>

            {/* 총 지출 박스 */}
            <TotalSpending total={totalExpense} />

            {/* 내역 리스트 */}
            <SpendingList
                year={selectedYear}
                month={selectedMonth}
                onTotalAmountCalculated={setTotalExpense}
            />

            {/* Floating Button */}
            <TouchableOpacity style={styles.addButton} onPress={() => router.push('/account/manual')}>
                <Ionicons name="add" size={28} color="#333" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F9F5FB',
        padding: 20,
        flex: 1,
        position: 'relative',
    },
    header: {
        marginTop: 40,
        marginBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
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
    monthNav: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        gap: 8,
    },
    monthTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    summaryBox: {
        flex: 0.6,
        backgroundColor: '#ECE6F3',
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: 'center',
        marginBottom: 12,
    },
    income: {
        color: 'green',
        fontSize: 16,
        fontWeight: '600',
    },
    addButton: {
        position: 'absolute',
        right: 19,
        bottom: 37,
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#ccc',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 5,
        elevation: 5,
    },
});