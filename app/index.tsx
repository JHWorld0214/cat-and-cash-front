import { useEffect } from 'react';
import { useRouter, useRootNavigation } from 'expo-router'; // ✅ RootNavigation 추가
import { useAuthStore } from 'store/slices/auth';

export default function IndexPage() {
    const router = useRouter();
    const rootNavigation = useRootNavigation(); // ✅ RootLayout 준비 여부 확인
    const token = useAuthStore(state => state.token);

    useEffect(() => {
        if (!rootNavigation?.isReady()) return; // ✅ 아직 레이아웃 준비 안 됐으면 아무 것도 하지 않음

        if (token) {
            router.replace('/home');
        } else {
            // router.replace('/login');
            router.replace('/home');
        }
    }, [token, rootNavigation?.isReady()]);

    return null;
}