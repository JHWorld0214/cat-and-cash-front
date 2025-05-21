import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { useAuthStore } from '@/store/slices/auth';
import { Alert } from 'react-native';
import { useFetch } from '@/hooks/useFetch';

export default function useGoogleLogin() {
    const { setAuth } = useAuthStore();
    const { get } = useFetch();

    const login = async () => {
        try {
            const redirectUri = Linking.createURL('login');

            const loginUrl = await get<string>('/login/page/google', {
                params: { redirectUri },
            });

            if (!loginUrl) throw new Error('리디렉트 URL 없음');

            const result = await WebBrowser.openAuthSessionAsync(loginUrl, redirectUri);

            if (result.type === 'success' && result.url) {
                console.log('WebBrowser 리다이렉트 성공 URL:', result.url);

                const parsed = Linking.parse(result.url);
                const token = parsed.queryParams?.token;

                if (token && typeof token === 'string') {
                    console.log('토큰 감지됨 (WebBrowser):', token.substring(0, 30) + '...');
                    setAuth(token, 'google');
                } else {
                    Alert.alert('로그인 실패', '토큰이 전달되지 않았어요.');
                }
            } else if (result.type === 'cancel') {
                console.warn('사용자가 로그인 창을 닫았어요.');
            }
        } catch (error) {
            console.error('Google 로그인 오류:', error);
            Alert.alert('로그인 실패', '알 수 없는 오류가 발생했어요.');
        }
    };

    return { login };
}