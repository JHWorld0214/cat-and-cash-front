import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import axios from 'axios';
import Constants from 'expo-constants';
import { Alert } from 'react-native';

const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;

export default function useGoogleLogin() {
    const login = async () => {
        try {
            const redirectUri = Linking.createURL('login');

            const { data: loginUrl } = await axios.get<string>(
                `${API_BASE_URL}/login/page/google`,
                { params: { redirectUri } }
            );

            if (!loginUrl) throw new Error('리디렉트 URL 없음');

            // 외부 브라우저로 로그인 URL 열기
            await WebBrowser.openBrowserAsync(loginUrl);
        } catch (error) {
            console.error('🔴 Google 로그인 오류:', error);
            Alert.alert('로그인 실패', '알 수 없는 오류가 발생했어요.');
        }
    };

    return { login };
}