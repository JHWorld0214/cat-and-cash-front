import axios from "axios";
import Constants from "expo-constants";
import { useAuthStore } from "@store/slices/authStore";

const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;

export const checkFirstVisitToday = async (): Promise<boolean> => {
    try {
        const token = useAuthStore.getState().token;
        const res = await axios.get(`${API_BASE_URL}/user/first-visit-today`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.data;
        return data?.isFirstVisitToday ?? false;
    } catch (error) {
        console.error("출석체크 실패:", error);
        return false;
    }
};