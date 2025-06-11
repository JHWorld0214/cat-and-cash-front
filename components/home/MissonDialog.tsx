import React from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';

interface MissionDialogProps {
    visible: boolean;
    onClose: () => void;
    missionContent: string; // 예: "오늘 하루 동안 커피 안 마시기"
    reward: {
        exp: number;      // 경험치
        coin: number;     // 냥코인
    };
}

const MissionDialog: React.FC<MissionDialogProps> = ({
                                                         visible,
                                                         onClose,
                                                         missionContent,
                                                         reward
                                                     }) => {
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
                        <View style={styles.rewardRow}>
                            <View style={styles.rewardItem}>
                                <Text style={styles.rewardLabel}>경험치</Text>
                                <Text style={styles.rewardValue}>+{reward.exp}</Text>
                            </View>
                            <View style={styles.divider} />
                            <View style={styles.rewardItem}>
                                <Text style={styles.rewardLabel}>냥코인</Text>
                                <Text style={styles.rewardValue}>+{reward.coin}</Text>
                            </View>
                        </View>
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
        width: '100%',
    },
    rewardText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    rewardRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 20,
    },
    rewardItem: {
        flex: 1,
        alignItems: 'center',
    },
    rewardLabel: {
        fontSize: 14,
        color: '#888',
        marginBottom: 4,
    },
    rewardValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#6C47FF',
    },
    divider: {
        width: 1,
        height: 40,
        backgroundColor: '#ccc',
        marginHorizontal: 12,
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