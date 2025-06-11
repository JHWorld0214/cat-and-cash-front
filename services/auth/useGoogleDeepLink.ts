import { useEffect } from 'react';
import { Linking } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { useAuthStore } from '@store/slices/authStore';

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
        const queryParams = parseQueryParams(url);
        const token = queryParams?.token;

        if (token) {
            console.log('JWT 토큰 감지:', token);
            setAuth(token, 'google');
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