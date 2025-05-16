import { useEffect } from 'react';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { Alert } from 'react-native';
import { useAuthStore } from 'store/slices/auth';

export default function useGoogleDeepLink(
    onSuccess?: (type: '0' | '1') => void,
) {
    const setAuth = useAuthStore((state) => state.setAuth);

    const handleDeepLink = async (url: string) => {
        const { queryParams } = Linking.parse(url);
        const token = queryParams?.token;
        const u = queryParams?.u;
        const provider = queryParams?.provider;

        if (typeof token === 'string' && (u === '0' || u === '1')) {
            console.log('✅ JWT 토큰 감지:', token, 'userType:', u, 'provider:', provider);
            setAuth(token, (provider === 'kakao' ? 'kakao' : 'google'));
            await WebBrowser.dismissBrowser();
            onSuccess?.(u);
        } else {
            Alert.alert('로그인 실패 😢', '토큰 또는 사용자 유형(u)가 올바르지 않습니다.');
        }
    };

    useEffect(() => {
        const sub = Linking.addEventListener('url', ({ url }) => {
            if (url) handleDeepLink(url);
        });

        Linking.getInitialURL().then((url) => {
            if (url) handleDeepLink(url);
        });

        return () => {
            sub.remove();
        };
    }, []);
}