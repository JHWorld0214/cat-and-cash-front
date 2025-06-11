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

        // create_time +9시간 처리
        const converted = res.data.budgets.map((item: any) => {
            const originalDate = new Date(item.create_time);
            const kstDate = new Date(originalDate.getTime() + 9 * 60 * 60 * 1000); // 9시간 더함

            return {
                ...item,
                create_time: kstDate.toISOString(),
            };
        });

        useSpendingStore.getState().setList(converted);
        console.log('전체 지출 기록 불러오기 성공');
        console.log(converted);
    } catch (e) {
        console.error('지출 내역 불러오기 실패', e);
    }
};