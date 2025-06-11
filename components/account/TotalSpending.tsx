import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { calDecAmount} from "@services/account/calDecAmount";

interface Props {
    total: number;
}

const TotalSpending: React.FC<Props> = ({ total }) => {
    const [nyang, setNyang] = useState<number | null>(null);

    useEffect(() => {
        const calculate = async () => {
            const result = await calDecAmount(total);
            setNyang(result);
        };
        calculate();
    }, [total]);

    return (
        <View style={styles.container}>
            <Text style={styles.label}>총 지출</Text>
            <Text style={styles.amount}>
                {total.toLocaleString()} 원
                {nyang !== null && (
                    <Text style={styles.nyangText}>  ( = {nyang}냥 )</Text>
                )}
            </Text>
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
        textAlign: 'center',
    },
    nyangText: {
        fontSize: 16,
        color: '#333',
    },
});

export default TotalSpending;