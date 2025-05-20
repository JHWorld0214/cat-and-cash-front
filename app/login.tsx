import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Dimensions,
    Animated,
    Easing,
    ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
// @ts-ignore
import GoogleLogo from "../assets/images/google-logo.svg";
import useGoogleLogin from '../app/services/auth/useGoogleLogin';
import useGoogleDeepLink from '../app/services/auth/useGoogleDeepLink';
import { useRouter } from 'expo-router';
import { isNewUser } from '@app/services/auth/isNewUser';
import {useAuthStore} from "@store/slices/auth";

export default function LoginScreen() {
    const router = useRouter();
    const { login } = useGoogleLogin();
    const [fadeAnim] = useState(new Animated.Value(0));
    const [loading, setLoading] = useState(false); // 로딩 상태 추가
    const token = useAuthStore((state) => state.token);


    useEffect(() => {
        const redirect = async () => {
            if (token) {
                setLoading(true);
                try {
                    const existing = await isNewUser(token);
                    if (existing) {
                        router.replace('/home');
                    } else {
                        router.replace('/onboarding/intro');
                    }
                } catch {
                    Alert.alert('에러', '유저 상태 확인 실패');
                } finally {
                    setLoading(false);
                }
            }
        };
        redirect();
    }, [token]);

    return (
        <LinearGradient colors={['#7F00FF', '#E100FF']} style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>CAT & CASH</Text>
                <Text style={styles.subtitle}>나만의 저축 고양이</Text>
            </View>

            <TouchableOpacity style={styles.googleButton} onPress={login} disabled={loading}>
                <GoogleLogo width={25} height={25} />
                <Text style={styles.googleButtonText}>Google로 시작하기</Text>
            </TouchableOpacity>

            {loading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#FFD54F" />
                    <Text style={styles.loadingText}>로그인 중입니다...</Text>
                </View>
            )}

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
    loadingOverlay: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(255,255,255,0.85)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#444',
    },
});