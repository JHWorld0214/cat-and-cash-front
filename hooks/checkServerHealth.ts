import axios from 'axios';
import Constants from 'expo-constants';

const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 5000,
});

export const checkServerHealth = async () => {
    try {
        const response = await api.get('/healthcheck/test');
        console.log('✅ 서버 응답:', response.data); // "The server is currently running"
    } catch (error) {
        console.error('❌ 서버에 연결할 수 없습니다:', error);
    }
};