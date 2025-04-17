import { Redirect, router } from 'expo-router';
import { useEffect } from 'react';
import { useAuthStore } from 'store/slices/auth';

export default function IndexPage() {

  // 인트로 테스트용
    useEffect(() => {
      const timeout = setTimeout(() => {
        router.replace('onboarding/intro');
      }, 100);

      return () => clearTimeout(timeout);
    }, []);

    return null;

    const token = useAuthStore((state: { token: any; }) => state.token);

    if (!token) {
      return <Redirect href="/login" />;
    }
    return <Redirect href="/home" />;
}