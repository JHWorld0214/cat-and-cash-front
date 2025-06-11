import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface MissionDialogProps {
    visible: boolean;
    onClose: () => void;
    missionContent: string; // 예: "오늘 하루 동안 커피 안 마시기"
    reward: {
        exp: number;      // 경험치
        coin: number;     // 냥코인
    };
}

const MissionDialog: React.FC<MissionDialogProps> = ({ visible, onClose, missionContent, reward }) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
        >
            <View style={styles.overlay}>
                <View style={styles.dialog}>
                    <Text style={styles.title}>🎯 오늘의 미션</Text>
                    <Text style={styles.content}>{missionContent}</Text>

                    <View style={styles.rewardContainer}>
                        <Text style={styles.rewardText}>🎁 보상</Text>
                        <Text style={styles.rewardItem}>+{reward.exp} 경험치</Text>
                        <Text style={styles.rewardItem}>+{reward.coin} 냥코인</Text>
                    </View>

                    <TouchableOpacity onPress={onClose} style={styles.button}>
                        <Text style={styles.buttonText}>뒤로가기</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default MissionDialog;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dialog: {
        width: '80%',
        backgroundColor: '#fff',
        padding: 24,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 8,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    content: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
        color: '#333',
    },
    rewardContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    rewardText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 6,
    },
    rewardItem: {
        fontSize: 14,
        color: '#6C47FF',
    },
    button: {
        backgroundColor: '#6C47FF',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 12,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 15,
    },
});