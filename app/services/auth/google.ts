import axios from 'axios';
import * as WebBrowser from 'expo-web-browser';
import Constants from 'expo-constants';

const BACKEND_API = Constants.expoConfig?.extra?.API_BASE_URL;

export default function useGoogleLogin() {
    const login = async () => {
        try {
            // 1. 백엔드에 로그인 URL 요청
            const response = await axios.get(`${BACKEND_API}/login/page/google`);

            const redirectUrl = response.data;

            if (redirectUrl) {
                // 3. 웹 브라우저로 구글 로그인 페이지 열기
                await WebBrowser.openBrowserAsync(redirectUrl);
            } else {
                console.warn("리디렉트 URL이 응답에 없습니다.");
            }
        } catch (error) {
            console.error('🔴 Google 로그인 요청 실패:', error);
        }
    };

    return { login };
}