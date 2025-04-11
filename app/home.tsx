import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>🏠 홈 화면</Text>

            <TouchableOpacity
                style={styles.button}
                onPress={() => router.push('/chat')}
            >
                <Text style={styles.buttonText}>💬 채팅</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.button}
                onPress={() => router.push('/account')}
            >
                <Text style={styles.buttonText}>📒 가계부</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FDFDFD' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24 },
    button: {
        backgroundColor: '#A086FF',
        paddingVertical: 14,
        paddingHorizontal: 30,
        borderRadius: 12,
        marginVertical: 10,
    },
    buttonText: { fontSize: 18, color: '#fff', fontWeight: 'bold' },
});