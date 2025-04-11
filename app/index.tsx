import { Redirect } from 'expo-router';
import { useAuthStore } from 'store/slices/auth';

export default function IndexPage() {
    const token = useAuthStore((state: { token: any; }) => state.token);

    if (!token) {
      return <Redirect href="/login" />;
    }
    return <Redirect href="/home" />;
}