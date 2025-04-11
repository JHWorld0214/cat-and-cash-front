import { Redirect } from 'expo-router';

export default function IndexPage() {
    // @ts-ignore
    return <Redirect href="/(tabs)/login" />;
}