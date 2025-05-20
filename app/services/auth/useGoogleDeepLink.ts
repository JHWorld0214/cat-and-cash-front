import * as WebBrowser from 'expo-web-browser';
import { Alert } from 'react-native';
import { useAuthStore } from '@/store/slices/auth';

export default function useGoogleDeepLink() {
    const { setAuth } = useAuthStore();

    const handleDeepLink = async (url: string) => {
        const { queryParams } = Linking.parse(url);
        const token = queryParams?.token;

        if (token && typeof token === 'string') {
            console.log('✅ JWT 토큰 감지:', token);
            setAuth(token, 'google'); // ✅ 저장만 하고 화면 전환은 안 함
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