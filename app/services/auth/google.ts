import * as WebBrowser from 'expo-web-browser';
import Constants from 'expo-constants';

const BACKEND_GOOGLE_LOGIN_URL = `${Constants.expoConfig?.extra?.API_BASE_URL}/login/page/google`;

export default function useGoogleLogin() {
    const login = async () => {
        try {
            await WebBrowser.openBrowserAsync(BACKEND_GOOGLE_LOGIN_URL);
        } catch (error) {
            console.error('Google 로그인 실패:', error);
        }
    };

    return { login };
}