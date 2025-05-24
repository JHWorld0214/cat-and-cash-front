import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useAuthStore } from 'store/slices/auth'
import Constants from "expo-constants";

const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;

const savingLevels = [
  { label: "약 (20%)", value: 0 },
  { label: "중 (30%)", value: 1 },
  { label: "강 (40%)", value: 2 },
];

const categories = [
  "식비", "교통", "온라인쇼핑", "생활", "뷰티/미용",
  "여행", "주거/통신", "교육/학습"
];

const categoriesToInt: { [key: string]: number } = {
  "식비": 1,
  "교통": 2,
  "온라인쇼핑": 3,
  "생활": 4,
  "뷰티/미용": 5,
  "여행": 6,
  "주거/통신": 7,
  "교육/학습": 8,
};

const personPayingCategories = [
  "충동형", "절약형", "루틴형", "무계획형"
]

export default function SetupScreen() {
  const [income, setIncome] = useState("");
  const [fixedExpenditure, setFixedExpense] = useState("");
  const [savingProportion, setSavingProportion] = useState<number | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [expenseType, setExpenseType] = useState<string>("");

  const router = useRouter();
  const token = useAuthStore(state => state.token);

  const toggleCategory = (category: string) => {
    const categoryKey = category.replace(/\s/g, ""); // 공백 제거 ("온라인 쇼핑" → "온라인쇼핑")
    const categoryValue = categoriesToInt[categoryKey];
  
    if (!categoryValue) return; // 매핑 실패 시 무시
  
    setSelectedCategories(prev =>
      prev.includes(categoryValue)
        ? prev.filter(c => c !== categoryValue)
        : [...prev, categoryValue]
    );
  };

  const togglePayingType = (category: string) => {
    setExpenseType(prev =>
      prev === category ? "" : category
    );
  };

  const handleSubmit = async () => {
    const userSetupData = {
      username: await AsyncStorage.getItem("userName"),
      income,
      fixedExpenditure,
      savingProportion,
      categoryIdList: selectedCategories,
      expenseType
    }

    try {
      await AsyncStorage.setItem("userSetup", JSON.stringify(userSetupData));

      console.log("token", token);

      console.log("userSetupData", JSON.stringify(userSetupData));
      console.log("server url", `${API_BASE_URL}/user/onboard`);
  
      const response = await fetch(`${API_BASE_URL}/user/onboard`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(userSetupData)
      });

      console.log("서버 응답:", response.status, response.statusText);
  
      if (!response.ok) {
        console.error("서버 응답 오류:", response.statusText);
        throw new Error("서버 전송 실패");
      }
        
      router.replace("home");
    } catch (error) {
      console.error("설정 저장 중 에러:", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={{ marginTop: 40, marginBottom: 24 }}>
        <Text style={styles.title}>머냥이의 집사가 되어주세요!</Text>
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.inputLabel}>한 달에 얼마나 벌고 있냥?</Text>
        <TextInput
          style={styles.input}
          placeholder="예: 250(만원)"
          placeholderTextColor="#888"
          keyboardType="numeric"
          value={income}
          onChangeText={setIncome}
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.inputLabel}>한 달에 고정적으로 지출하는 돈은 얼마냥?</Text>
        <TextInput
          style={styles.input}
          placeholder="예: 100(만원)"
          placeholderTextColor="#888"
          keyboardType="numeric"
          value={fixedExpenditure}
          onChangeText={setFixedExpense}
        />
      </View>

      <Text style={styles.label}>얼마나 절약하고 싶냥?</Text>
      <View style={styles.rowWrap}>
        {savingLevels.map(level => (
          <TouchableOpacity
            key={level.value}
            style={[
              styles.option,
              savingProportion === level.value && styles.optionSelected
            ]}
            onPress={() => setSavingProportion(level.value)}
          >
            <Text
              style={{
                color: savingProportion === level.value ? "white" : "black",
              }}
            >
              {level.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>어느 카테고리에서 과소비를 많이 하냥?</Text>
      <View style={styles.rowWrap}>
        {categories.map(cat => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.option,
              selectedCategories.includes(categoriesToInt[cat]) && styles.optionSelected
            ]}
            onPress={() => toggleCategory(cat)}
          >
            <Text
              style={{
                color: selectedCategories.includes(categoriesToInt[cat]) ? "white" : "black",
              }}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>집사의 소비 MBTI는 뭐냥?</Text>
      <View style={styles.rowWrap}>
        {personPayingCategories.map(cat => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.option,
              expenseType.includes(cat) && styles.optionSelected
            ]}
            onPress={() => togglePayingType(cat)}
          >
            <Text
              style={{
                color: expenseType.includes(cat) ? "white" : "black",
              }}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={{ color: "white", fontWeight: "bold" }}>결정하기</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    padding: 24,
    backgroundColor: "#f7f3f7",
    flexGrow: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  fieldGroup: {
    width: "100%",
    marginBottom: 36,
  },
  inputLabel: {
    fontWeight: "bold",
    marginBottom: 6,
    color: "#333",
  },
  input: {
    width: "100%",
    height: 44,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  label: {
    alignSelf: "flex-start",
    marginVertical: 8,
    fontWeight: "bold",
    color: "#333",
  },
  rowWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    gap: 8,
    marginBottom: 16,
  },
  option: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#eee",
    margin: 4,
  },
  optionSelected: {
    backgroundColor: "#6C63FF",
  },
  button: {
    marginTop: 24,
    width: "100%",
    backgroundColor: "#6C63FF",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
});