import React, { useEffect, useState } from 'react';
import { SectionList, Text, View, StyleSheet } from 'react-native';
import axios from 'axios';
import Constants from 'expo-constants';
import { useAuthStore } from '@/store/slices/auth';

interface SpendingItem {
    categoryId: number;
    amount: number;
    content: string;
    create_time: string;
}

interface SectionData {
    title: string;
    data: SpendingItem[];
}

interface Props {
    year: number;
    month: number;
    onTotalAmountCalculated?: (total: number) => void;
}

const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;

const categoryIconMap: { [key: number]: string } = {
    1: '🍚', // 식비
    2: '🚗', // 교통
    3: '📦', // 온라인 쇼핑
    4: '🧻', // 생활
    5: '💄', // 뷰티/미용
    6: '✈️', // 여행
    7: '🏠', // 주거/통신
    8: '📚', // 교육/학습
};

const SpendingList: React.FC<Props> = ({ year, month, onTotalAmountCalculated }) => {
    const token = useAuthStore((state) => state.token);
    const [allItems, setAllItems] = useState<SpendingItem[]>([]);

    const getFormattedDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const weekday = date.toLocaleDateString('ko-KR', { weekday: 'short' });
        return `${day}일 ${weekday}`;
    };

    const isSameMonth = (dateString: string) => {
        const date = new Date(dateString);
        return date.getFullYear() === year && date.getMonth() + 1 === month;
    };

    useEffect(() => {
        if (!token) return;

        const fetchAllData = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/budget/all`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setAllItems(response.data.budgets);
            } catch (error) {
                console.error('❌ 전체 지출 내역 조회 실패:', error);
            }
        };

        fetchAllData();
    }, [token]);

    // 현재 연/월에 해당하는 데이터만 필터링
    const filtered = allItems.filter(item => isSameMonth(item.create_time));
    const grouped: { [key: string]: SpendingItem[] } = {};
    let total = 0;

    filtered.forEach(item => {
        const dateKey = getFormattedDate(item.create_time);
        if (!grouped[dateKey]) grouped[dateKey] = [];
        grouped[dateKey].push(item);
        total += item.amount;
    });

    const sectionData: SectionData[] = Object.keys(grouped).map((title) => ({
        title,
        data: grouped[title],
    }));

    useEffect(() => {
        if (onTotalAmountCalculated) {
            onTotalAmountCalculated(total);
        }
    }, [year, month, allItems]);

    return (
        <SectionList
            sections={sectionData}
            keyExtractor={(item, index) => item.create_time + index}
            renderSectionHeader={({ section: { title } }) => {
                const dayOfWeek = title.slice(-1); // ex: "24일 월" → "월"
                let color = '#333';

                if (dayOfWeek === '토') color = '#4A6CF7';
                else if (dayOfWeek === '일') color = '#FF4C4C';

                return (
                    <View style={styles.stickyHeaderWrapper}>
                        <View style={styles.sectionHeaderContainer}>
                            <View style={styles.sectionLabel}>
                                <Text style={[styles.sectionHeaderText, { color }]}>{title}</Text>
                            </View>
                        </View>
                    </View>
                );
            }}
            renderItem={({ item, index, section }) => {
                const icon = categoryIconMap[item.categoryId] || '💰';
                const isLast = index === section.data.length - 1;

                return (
                    <View style={[styles.item, isLast && styles.lastItem]}>
                        <Text style={styles.itemText}>{icon} {item.content}</Text>
                        <Text style={styles.itemAmount}>{item.amount.toLocaleString()}원</Text>
                    </View>
                );
            }}
        />
    );
};

const styles = StyleSheet.create({
    sectionHeader: {
        fontWeight: 'bold',
        fontSize: 16,
        marginTop: 20,
        marginBottom: 8,
    },
    sectionHeaderText: {
        fontWeight: 'bold',
        fontSize: 17, // 기존 16 +1
    },
    item: {
        paddingVertical: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 0.5,
        borderBottomColor: '#ccc',
        gap: 2,
    },
    lastItem: {
        borderBottomWidth: 0,
    },
    itemText: {
        fontSize: 15, // 기존 14 +1
        color: '#333',
    },
    itemAmount: {
        fontSize: 15,
        color: '#333',
    },
    stickyHeaderWrapper: {
        backgroundColor: '#F9F5FB', // account 배경색과 동일하게
        paddingTop: 8, // 위쪽에 배경 더 채우기
    },

    sectionHeaderContainer: {
        paddingVertical: 6,
        paddingHorizontal: 4,
        marginTop: 14, // 요일 간격
    },

    sectionLabel: {
        backgroundColor: '#ECE6F3', // 라벨 배경
        borderRadius: 14,
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
});

export default SpendingList;