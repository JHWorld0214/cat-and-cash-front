import axios from 'axios';
import Constants from 'expo-constants';
import { Alert } from 'react-native';
import {useAuthStore} from "@store/slices/authStore";

const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;

export default function getMyToken() {
    const { setAuth } = useAuthStore();

    const login = async (): Promise<string | null> => {
        console.log('📦 getMyToken() 실행됨');

        try {
            const res = await axios.get(`${API_BASE_URL}/user/getToken`);
            console.log('✅ 토큰 받아옴:', res.data.body);

            let token = res.data.body;

            setAuth(token, 'google');

            return token; // 토큰 문자열 반환
        } catch (error: any) {
            console.error('❌ 인증 요청 실패:', error?.response ?? error);
            Alert.alert('로그인 실패', '서버에서 토큰을 받아오지 못했습니다.');
            return null;
        }
    };

    return { login };
}