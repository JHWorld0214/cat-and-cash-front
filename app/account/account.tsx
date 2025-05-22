import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const uis = {
    ledgerIcon: require('@/assets/ui/ledger.png'),
};

const sampleData = [
    {
        date: '7일 월요일',
        items: [
            { name: '싸다 분식', amount: -12500 },
            { name: '재난 기부', amount: -50000 },
            { name: '편의점', amount: -3700 },
            { name: '롯데리아', amount: -8100 },
        ],
    },
    {
        date: '6일 일요일',
        items: [
            { name: '버거킹', amount: -8200 },
            { name: '영화관', amount: -12000 },
            { name: '카페', amount: -4800 },
        ],
    },
    {
        date: '5일 토요일',
        items: [
            { name: '편의점', amount: -4000 },
            { name: '지하철', amount: -1250 },
            { name: '편의점', amount: -3000 },
        ],
    },
    {
        date: '4일 금요일',
        items: [
            { name: '점심 도시락', amount: -8000 },
            { name: '배달음식', amount: -18000 },
            { name: 'PC방', amount: -10000 },
        ],
    },
    {
        date: '3일 목요일',
        items: [
            { name: '편의점', amount: -3200 },
            { name: '우유', amount: -1500 },
            { name: '버스', amount: -1250 },
            { name: '편의점', amount: -3800 },
        ],
    },
    {
        date: '2일 수요일',
        items: [
            { name: '마라탕', amount: -13500 },
            { name: '카페', amount: -4500 },
            { name: '편의점', amount: -3700 },
        ],
    },
];

export default function AccountScreen() {
    const router = useRouter();
    const totalIncome = 1000000;
    const totalExpense = 239266;

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
            <View style={styles.summary}>
                <View style={styles.monthNav}>
                    <Ionicons name="chevron-back" size={20} color="#333" />
                    <Text style={styles.monthTitle}>4월</Text>
                    <Ionicons name="chevron-forward" size={20} color="#333" />
                </View>

                <View style={styles.summaryRow}>
                    <View style={styles.summaryBox}>
                        <Text style={styles.summaryLabel}>지출</Text>
                        <Text style={styles.expense}>{totalExpense.toLocaleString()}원</Text>
                    </View>
                    <View style={styles.summaryBox}>
                        <Text style={styles.summaryLabel}>수입</Text>
                        <Text style={styles.income}>{totalIncome.toLocaleString()}원</Text>
                    </View>
                </View>
            </View>

            {/* 내역 리스트 */}
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {sampleData.map((day, idx) => {
                    const totalDayExpense = day.items.reduce((sum, i) => sum + i.amount, 0);
                    return (
                        <View key={idx} style={styles.daySection}>
                            <View style={styles.dateRow}>
                                <Text style={styles.date}>{day.date}</Text>
                                <Text style={styles.totalPerDay}>
                                    총액: {totalDayExpense.toLocaleString()}원
                                </Text>
                            </View>
                            {day.items.map((item, i) => (
                                <View key={i} style={styles.itemRow}>
                                    <Text style={styles.itemText}>{item.name}</Text>
                                    <Text style={styles.itemAmount}>{item.amount.toLocaleString()}원</Text>
                                </View>
                            ))}
                        </View>
                    );
                })}
            </ScrollView>

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
    summary: {
        marginBottom: 32,
    },
    monthNav: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 26,
        gap: 8,
    },
    monthTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    summaryBox: {
        flex: 0.6,
        backgroundColor: '#ECE6F3',
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: 'center',
        marginBottom: 12,
    },
    summaryLabel: {
        fontSize: 14,
        marginBottom: 4,
        color: '#333',
    },
    expense: {
        color: '#D33',
        fontSize: 16,
        fontWeight: '600',
    },
    income: {
        color: 'green',
        fontSize: 16,
        fontWeight: '600',
    },
    scrollView: {
        flex: 1,
        paddingBottom: 100,
    },
    daySection: {
        marginBottom: 20,
    },
    dateRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 0.5,
        borderBottomColor: '#ccc',
        paddingBottom: 8,
        marginBottom: 8,
    },
    date: {
        fontWeight: '600',
        fontSize: 14,
        color: '#666',
    },
    totalPerDay: {
        fontSize: 14,
        color: '#D33',
        fontWeight: '600',
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 4,
    },
    itemText: {
        color: '#333',
        fontSize: 14,
    },
    itemAmount: {
        color: '#D33',
        fontSize: 14,
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