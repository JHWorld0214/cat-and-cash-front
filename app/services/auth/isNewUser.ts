import axios from 'axios';
import Constants from 'expo-constants';

const BACKEND_API = Constants.expoConfig?.extra?.API_BASE_URL;

export async function isNewUser(token: string): Promise<boolean> {
    try {
        console.log('📤 서버에 유저 상태 확인 요청');
        const res = await axios.post(
            `${BACKEND_API}/login/new`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        console.log('📥 응답:', res.data);

        const userType = res.data.isNew;

        if (typeof userType !== 'number') {
            throw new Error('userType 누락됨');
        }

        return userType === 0;
    } catch (err) {
        console.error('❌ isNewUser 실패:', err);
        throw err; // 호출부에서 alert로 처리됨
    }
}