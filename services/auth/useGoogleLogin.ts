import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import axios from 'axios';
import Constants from 'expo-constants';
import { useAuthStore } from '@store/slices/authStore';
import { Alert } from 'react-native';

const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;

export default function useGoogleLogin() {
    const { setAuth } = useAuthStore();

    const login = async () => {
        try {
            const redirectUri = Linking.createURL('login');

            // 로그인 URL 요청
            const { data: loginUrl } = await axios.get<string>(
                `${API_BASE_URL}/login/page/google`,
                { params: { redirectUri } }
            );

            if (!loginUrl) throw new Error('리디렉트 URL 없음');

            // 로그인 웹뷰 실행
            const result = await WebBrowser.openAuthSessionAsync(loginUrl, redirectUri);

            if (result.type === 'success' && result.url) {

                const parsed = Linking.parse(result.url);
                const token = parsed.queryParams?.token;

                if (token && typeof token === 'string') {
                    setAuth(token, 'google');
                } else {
                    Alert.alert('로그인 실패', '토큰이 전달되지 않았어요.');
                }
            } else if (result.type === 'cancel') {
                console.warn('사용자가 로그인 창을 닫았어요.');
            }
        } catch (error) {
            console.error('🔴 Google 로그인 오류:', error);
            Alert.alert('로그인 실패', '알 수 없는 오류가 발생했어요.');
        }
    };

    return { login };
}