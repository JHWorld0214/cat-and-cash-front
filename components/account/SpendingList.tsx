import React, { useEffect, useState } from 'react';
import { SectionList, Text, View, StyleSheet } from 'react-native';
import { useSpendingStore } from '@store/slices/spendingStore';
import { calDecAmount } from '@services/account/calDecAmount';

interface Props {
    year: number;
    month: number;
    onTotalAmountCalculated?: (total: number) => void;
}

const categoryIconMap: { [key: number]: string } = {
    1: '🍚', 2: '🚗', 3: '📦', 4: '🧻', 5: '💄', 6: '✈️', 7: '🏠', 8: '📚',
};

const getFormattedDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const weekday = date.toLocaleDateString('ko-KR', { weekday: 'short' });
    return `${day}일 ${weekday}`;
};

const SpendingList: React.FC<Props> = ({ year, month, onTotalAmountCalculated }) => {
    const { list: allItems } = useSpendingStore();
    const [sectionData, setSectionData] = useState<any[]>([]);

    useEffect(() => {
        const processData = async () => {
            const filtered = allItems.filter(item => {
                const date = new Date(item.create_time);
                return date.getFullYear() === year && date.getMonth() + 1 === month;
            });

            let total = 0;
            const grouped: { [key: string]: any[] } = {};

            // 냥 값 계산
            for (const item of filtered) {
                const nyang = await calDecAmount(item.amount);
                const newItem = { ...item, nyang };
                const dateKey = getFormattedDate(item.create_time);

                if (!grouped[dateKey]) grouped[dateKey] = [];
                grouped[dateKey].push(newItem);

                total += item.amount;
            }

            const sorted = Object.keys(grouped)
                .sort((a, b) => {
                    const dayA = parseInt(a.split('일')[0]);
                    const dayB = parseInt(b.split('일')[0]);
                    return dayB - dayA;
                })
                .map(title => ({ title, data: grouped[title] }));

            setSectionData(sorted);
            if (onTotalAmountCalculated) onTotalAmountCalculated(total);
        };

        processData();
    }, [year, month, allItems]);

    return (
        <SectionList
            sections={sectionData}
            keyExtractor={(item, index) => item.create_time + index}
            renderSectionHeader={({ section: { title } }) => {
                let color = '#333';
                if (title.includes('토')) color = '#4A6CF7';
                else if (title[-1] == '일') color = '#FF4C4C';

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
                        <Text style={styles.itemText}>
                            {icon} {item.content}
                        </Text>
                        <Text style={styles.itemAmount}>
                            {item.amount.toLocaleString()}원
                            {item.nyang != null && ` (= ${item.nyang}냥)`}
                        </Text>
                    </View>
                );
            }}
        />
    );
};

const styles = StyleSheet.create({
    stickyHeaderWrapper: {
        backgroundColor: '#F9F5FB',
        paddingTop: 8,
    },
    sectionHeaderContainer: {
        paddingVertical: 6,
        paddingHorizontal: 4,
        marginTop: 14,
    },
    sectionLabel: {
        backgroundColor: '#ECE6F3',
        borderRadius: 14,
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    sectionHeaderText: {
        fontWeight: 'bold',
        fontSize: 17,
    },
    item: {
        paddingVertical: 10,
        paddingHorizontal: 5,
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
        fontSize: 15,
        color: '#333',
    },
    itemAmount: {
        fontSize: 15,
        color: '#333',
    },
});

export default SpendingList;