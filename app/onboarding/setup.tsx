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

const savingLevels = [
  { label: "약 (20% 절약)", value: "low" },
  { label: "중 (40% 절약)", value: "medium" },
  { label: "강 (60% 절약)", value: "high" },
];

const categories = [
  "식비", "교통", "문화/소비", "편의점", "선물", "술/음료",
  "뷰티/미용", "여행", "기부"
];

export default function SetupScreen() {
  const [income, setIncome] = useState("");
  const [fixedExpense, setFixedExpense] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const router = useRouter();

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleSubmit = async () => {
    const userSetupData = {
      income,
      fixedExpense,
      selectedLevel,
      selectedCategories,
    }

    await AsyncStorage.setItem("userSetup", JSON.stringify(userSetupData));

    router.replace("home");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={{ marginTop: 40, marginBottom: 24 }}>
        <Text style={styles.title}>저축냥의 집사가 되어주세요!</Text>
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.inputLabel}>월간 평균 수입</Text>
        <TextInput
          style={styles.input}
          placeholder="예: 250만원"
          placeholderTextColor="#888"
          keyboardType="numeric"
          value={income}
          onChangeText={setIncome}
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.inputLabel}>월간 고정 지출</Text>
        <TextInput
          style={styles.input}
          placeholder="예: 100만원"
          placeholderTextColor="#888"
          keyboardType="numeric"
          value={fixedExpense}
          onChangeText={setFixedExpense}
        />
      </View>

      <Text style={styles.label}>목표 절약 난이도</Text>
      <View style={styles.rowWrap}>
        {savingLevels.map(level => (
          <TouchableOpacity
            key={level.value}
            style={[
              styles.option,
              selectedLevel === level.value && styles.optionSelected
            ]}
            onPress={() => setSelectedLevel(level.value)}
          >
            <Text
              style={{
                color: selectedLevel === level.value ? "white" : "black",
              }}
            >
              {level.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>소비 카테고리</Text>
      <View style={styles.rowWrap}>
        {categories.map(cat => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.option,
              selectedCategories.includes(cat) && styles.optionSelected
            ]}
            onPress={() => toggleCategory(cat)}
          >
            <Text
              style={{
                color: selectedCategories.includes(cat) ? "white" : "black",
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