import axios from 'axios';
import * as WebBrowser from 'expo-web-browser';
import Constants from 'expo-constants';
import * as Linking from 'expo-linking';
import { useAuthStore } from '@/store/slices/auth';
import { Alert } from 'react-native';

const BACKEND_API = Constants.expoConfig?.extra?.API_BASE_URL;

export default function useGoogleLogin() {
    const { setAuth } = useAuthStore();

    const login = async () => {
        try {
            // 딥링크 URI 생성 및 로그
            const redirectUri = Linking.createURL('login');

            // 서버에서 로그인 URL 받아오기
            const { data: loginUrl } = await axios.get(
                `${BACKEND_API}/login/page/google`,
                { params: { redirectUri } }
            );

            if (!loginUrl) throw new Error("리디렉트 URL 없음");

            // 웹뷰 열기
            const result = await WebBrowser.openAuthSessionAsync(loginUrl, redirectUri);

            if (result.type === 'success' && result.url) {
                console.log('✅ WebBrowser 리다이렉트 성공 URL:', result.url);

                const parsed = Linking.parse(result.url);

                const token = parsed.queryParams?.token;

                if (token && typeof token === 'string') {
                    console.log('✅ 토큰 감지됨 (WebBrowser):', token.substring(0, 30) + '...');
                    setAuth(token, 'google');
                } else {
                    Alert.alert('로그인 실패 😢', '토큰이 전달되지 않았어요.');
                }

            } else if (result.type === 'cancel') {
                console.warn("사용자가 로그인 창을 닫았어요.");
            }

        } catch (error) {
            console.error('🔴 Google 로그인 오류:', error);
            Alert.alert('로그인 실패', '알 수 없는 오류가 발생했어요.');
        }
    };

    return { login };
}