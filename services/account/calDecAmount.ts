import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * AsyncStorage에 저장된 userSetup 값을 바탕으로
 * 사용금액(usedAmount)에 대해 줄어드는 냥(y)을 계산합니다.
 *
 * @param usedAmount - 사용자가 이번에 소비한 금액 (단위: 원)
 * @returns 줄어드는 냥 수치 (반올림 정수) 또는 null (에러 시)
 */
export async function calDecAmount(usedAmount: number): Promise<number | null> {
    try {
        const setup = await AsyncStorage.getItem("userSetup");
        if (!setup) {
            console.warn("userSetup 값이 AsyncStorage에 없습니다.");
            return null;
        }

        const parsed = JSON.parse(setup);

        // 문자열 → 숫자 변환 + 만원 단위 → 원 단위
        const income = parseFloat(parsed.income) * 10000;
        const fixedCost = parseFloat(parsed.fixedExpenditure) * 10000;
        const savingRate = [0.2, 0.3, 0.4][parsed.savingProportion];

        const usableBudget = income * (1 - savingRate) - fixedCost;

        if (usableBudget <= 0) {
            console.warn("사용 가능한 예산이 0 이하입니다. 감점량 계산 불가.");
            return null;
        }

        const nyang = (6000 / usableBudget) * usedAmount;
        return Math.round(nyang);
    } catch (error) {
        console.error("냥 계산 중 오류:", error);
        return null;
    }
}