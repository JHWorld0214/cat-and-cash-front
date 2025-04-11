import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import GoogleLogo from "@/assets/images/google-logo.svg";
import useGoogleLogin from '@/app/services/auth/google';
import useGoogleDeepLink from '@/app/services/auth/useGoogleDeepLink';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
    const router = useRouter();
    const { login } = useGoogleLogin();
    const [fadeAnim] = useState(new Animated.Value(0));

    // ✅ 딥링크 감지 및 토큰 수신 시 UI 전환
    useGoogleDeepLink(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 600,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
        }).start(() => {
            setTimeout(() => {
                router.push('/chat');
            }, 800);
        });
    });

    return (
        <LinearGradient colors={['#7F00FF', '#E100FF']} style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>CAT & CASH</Text>
                <Text style={styles.subtitle}>나만의 저축 고양이</Text>
            </View>

            <TouchableOpacity style={styles.googleButton} onPress={login}>
                <GoogleLogo width={25} height={25} />
                <Text style={styles.googleButtonText}>Google로 시작하기</Text>
            </TouchableOpacity>

            <Animated.View
                style={[
                    StyleSheet.absoluteFillObject,
                    {
                        backgroundColor: "#FFFBEA",
                        justifyContent: "center",
                        alignItems: "center",
                        opacity: fadeAnim,
                    },
                ]}
                pointerEvents="none"
            >
                <Text style={{ fontSize: 20, fontWeight: "bold", color: "#FF9800" }}>
                    로그인 성공! ✨
                </Text>
            </Animated.View>
        </LinearGradient>
    );
}

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    content: { alignItems: 'center', marginBottom: 80 },
    title: { fontSize: 42, fontWeight: '700', color: '#FFD54F', marginBottom: 12 },
    subtitle: { fontSize: 16, color: '#fff' },
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 24,
    },
    googleButtonText: {
        color: '#555',
        fontSize: 16,
        fontWeight: '600',
        marginHorizontal: 12,
    },
});