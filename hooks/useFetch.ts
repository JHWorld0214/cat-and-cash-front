import axios from 'axios';
import Constants from 'expo-constants';
import { useAuthStore } from '@/store/slices/auth';

const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;

export function useFetch() {
    const token = useAuthStore((state) => state.token);

    const instance = axios.create({
        baseURL: API_BASE_URL,
        headers: {
            Authorization: token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json',
        },
    });

    const get = async <T>(url: string, config = {}) => {
        const res = await instance.get<T>(url, config);
        return res.data;
    };

    const post = async <T>(url: string, data = {}, config = {}) => {
        const res = await instance.post<T>(url, data, config);
        return res.data;
    };

    const put = async <T>(url: string, data = {}, config = {}) => {
        const res = await instance.put<T>(url, data, config);
        return res.data;
    };

    const del = async <T>(url: string, config = {}) => {
        const res = await instance.delete<T>(url, config);
        return res.data;
    };

    return { get, post, put, delete: del };
}