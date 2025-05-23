import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

interface Props {
    total: number;
}

const TotalSpending: React.FC<Props> = ({ total }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>총 지출</Text>
            <Text style={styles.amount}>{total.toLocaleString()} 원</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 16,
        padding: 12,
        backgroundColor: '#f0eef9',
        borderRadius: 12,
        alignItems: 'center',
    },
    label: {
        fontSize: 14,
        color: '#888',
    },
    amount: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#715DF2',
    },
});

export default TotalSpending;