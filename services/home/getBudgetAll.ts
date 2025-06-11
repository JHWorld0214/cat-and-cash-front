import {useAuthStore} from "@store/slices/authStore";
import axios from "axios";
import {useSpendingStore} from "@store/slices/spendingStore";
import Constants from "expo-constants";

const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;

export const getBudgetAll = async () => {
    try {
        const token = useAuthStore.getState().token;
        const res = await axios.get(`${API_BASE_URL}/budget/all`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        useSpendingStore.getState().setList(res.data.budgets);
        console.log('전체 지출 기록 불러오기 성공')
    } catch (e) {
        console.error('지출 내역 불러오기 실패', e);
    }
};