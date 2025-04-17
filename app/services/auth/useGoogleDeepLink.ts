import { useEffect } from 'react';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { Alert } from 'react-native';
import { useAuthStore } from 'store/slices/auth';

export default function useGoogleDeepLink(onSuccess?: () => void) {
    const { setToken } = useAuthStore();

    const handleDeepLink = async (url: string) => {
        if (!url.includes('token=')) return; // ✅ 토큰이 없으면 무시

        const { queryParams } = Linking.parse(url);
        const token = queryParams?.token;

        if (token && typeof token === 'string') {
            console.log('✅ JWT 토큰 감지:', token);
            setToken(token);
            await WebBrowser.dismissBrowser(); // ✅ 웹뷰 닫기
            onSuccess?.();
        } else {
            Alert.alert('로그인 실패 😢', '토큰이 전달되지 않았어요.');
        }
    };

    useEffect(() => {
        // ✅ 앱이 실행 중일 때 링크 감지
        const sub = Linking.addEventListener('url', ({ url }) => {
            if (url) handleDeepLink(url);
        });

        // ✅ 앱이 백그라운드 → 포그라운드로 돌아올 때 또는 cold start일 때
        Linking.getInitialURL().then((url) => {
            if (url) handleDeepLink(url);
        });

        return () => sub.remove();
    }, []);
}