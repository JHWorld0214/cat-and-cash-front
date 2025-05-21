import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuthStore } from 'store/slices/auth';

export default function IndexPage() {
    const router = useRouter();
    const token = useAuthStore(state => state.token);

    useEffect(() => {
        if (token) {
            router.replace('/shop');
        } else {
            // router.replace('/login');
            router.replace('/shop');
        }
    }, [token]);

    return null;
}