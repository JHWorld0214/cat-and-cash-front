import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import GoogleLogo from "@/assets/images/google-logo.svg"; // svg 설정 완료된 상태여야 함

const BACKEND_GOOGLE_LOGIN_URL = "http://catandcash.site/login/google";

export default function LoginScreen() {
    useEffect(() => {
        const handleDeepLink = (event: Linking.EventType) => {
            const url = event.url;
            const { queryParams } = Linking.parse(url);
            const token = queryParams?.token;

            if (token) {
                Alert.alert("로그인 성공 🎉", `받은 토큰: ${token}`);
                // TODO: AsyncStorage에 저장하거나 글로벌 상태에 토큰 반영
            } else {
                Alert.alert("로그인 실패 😢", "토큰이 전달되지 않았어요.");
            }
        };

        const subscription = Linking.addEventListener("url", handleDeepLink);

        Linking.getInitialURL().then((url) => {
            if (url) {
                handleDeepLink({ url } as Linking.EventType);
            }
        });

        return () => {
            subscription.remove();
        };
    }, []);

    const handleLoginPress = async () => {
        try {
            await WebBrowser.openBrowserAsync(BACKEND_GOOGLE_LOGIN_URL);
        } catch (error) {
            console.error("로그인 중 오류 발생", error);
        }
    };

    return (
        <LinearGradient
            colors={['#7F00FF', '#E100FF']}
            style={styles.container}
        >
            <View style={styles.content}>
                <Text style={styles.title}>CAT & CASH</Text>
                <Text style={styles.subtitle}>나만의 저축 고양이</Text>
            </View>

            <TouchableOpacity style={styles.googleButton} onPress={handleLoginPress}>
                <GoogleLogo width={25} height={25} />
                <Text style={styles.googleButtonText}>Google로 시작하기</Text>
            </TouchableOpacity>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
        marginBottom: 80,
    },
    title: {
        fontSize: 42,
        fontWeight: '700',
        color: '#FFD54F',
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 16,
        color: '#fff',
    },
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