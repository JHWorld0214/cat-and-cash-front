import * as WebBrowser from 'expo-web-browser';
import { Linking } from 'react-native';
import { useAuthStore } from '@/store/slices/auth';
import { useEffect } from 'react';

function parseQueryParams(url: string): Record<string, string> {
    const queryString = url.split('?')[1];
    const params: Record<string, string> = {};

    if (queryString) {
        queryString.split('&').forEach((part) => {
            const [key, value] = part.split('=');
            if (key && value) {
                params[key] = decodeURIComponent(value);
            }
        });
    }

    return params;
}

export default function useGoogleDeepLink() {
    const { setAuth } = useAuthStore();

    const handleDeepLink = async (url: string) => {
        console.log('🧾 URL 수신:', url);
        const queryParams = parseQueryParams(url);
        const token = queryParams?.token;

        if (token && typeof token === 'string') {
            console.log('✅ JWT 토큰 감지:', token);
            setAuth(token, 'google'); // 저장만
            await WebBrowser.dismissBrowser();
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