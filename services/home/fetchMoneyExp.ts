import axios from "axios";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuthStore } from "@store/slices/authStore";

const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;

export const fetchMoneyExp = async (
    setMoney: (money: number) => void,
    setExpAndLevel?: (exp: number) => void
) => {
    try {
        const token = useAuthStore.getState().token;

        const res = await axios.get(`${API_BASE_URL}/user/enter/datas`, {
            headers: {
                Authorization: `Bearer ${token}`},
        });

        const { money, exp } = res.data;

        setMoney(money);
        await AsyncStorage.setItem("money", money.toString());
        await AsyncStorage.setItem("exp", exp.toString());

        if (setExpAndLevel) {
            setExpAndLevel(exp);
        }

        console.log('돈 & 경험치 불러오기 성공, 돈: ',money.toString(), ' 경험치: ', exp.toString() )
    } catch (error) {
        console.error("돈/경험치 가져오기 실패:", error);
    }
};
