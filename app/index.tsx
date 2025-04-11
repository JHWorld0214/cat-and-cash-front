import { Redirect } from 'expo-router';
// import { useAuthStore } from '@/store/slices/auth';

export default function IndexPage() {
    // const token = useAuthStore((state) => state.token);

    return <Redirect href="/home" />;

    // if (!token) {
    //   return <Redirect href="/login" />;
    // }
    // return <Redirect href="/home" />;
}