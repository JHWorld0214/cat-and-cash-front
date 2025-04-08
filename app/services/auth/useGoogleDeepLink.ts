import { useEffect } from 'react';
import * as Linking from 'expo-linking';
import { Alert } from 'react-native';
import { useAuthStore } from '@/store/slices/auth';

export default function useGoogleDeepLink(onSuccess?: () => void) {
    const { setToken } = useAuthStore();

    const handleDeepLink = (url: string) => {
        const { queryParams } = Linking.parse(url);
        const token = queryParams?.token;

        if (token && typeof token === 'string') {
            console.log('✅ JWT 토큰 감지:', token);
            setToken(token);
            if (onSuccess) onSuccess();
        } else {
            Alert.alert('로그인 실패 😢', '토큰이 전달되지 않았어요.');
        }
    };

    useEffect(() => {
        const sub = Linking.addEventListener('url', ({ url }) => {
            handleDeepLink(url);
        });

        Linking.getInitialURL().then((url) => {
            if (url) handleDeepLink(url);
        });

        return () => sub.remove();
    }, []);
}