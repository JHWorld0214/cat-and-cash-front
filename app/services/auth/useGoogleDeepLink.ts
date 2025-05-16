import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';

const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID'; // 실제 클라이언트 ID로 교체
const REDIRECT_URI = Linking.createURL('login');

export default function useGoogleLogin() {
    const login = async () => {
        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
            `client_id=${GOOGLE_CLIENT_ID}` +
            `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
            `&response_type=code` +
            `&scope=profile email` +
            `&prompt=select_account`; // ✅ 여기 추가!

        await WebBrowser.openAuthSessionAsync(authUrl, REDIRECT_URI);
    };

    return { login };
}