// app/intro.tsx
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ImageBackground,
  Pressable,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Keyboard,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const messages = [
  "(딩동~ 딩동~)\n(문 앞에는 상자와 편지가 놓여져 있다)\n\n이 시간에 누구지??",
  "(당신은 나에게 간택당했다냥)\n(앞으로 잘 부탁한다냥)\n\n 뭐야 누가 이런 장난을...",
  "(안녕 집사! 내 이름은 '머냥'이야. 집사 이름은 머냥?)",
  "",
  "(갑작스럽게 고양이의 집사가 된 나는\n고양이에게 들어가는 돈을 감당하기 위해\n절약하는 생활을 시작하게 되었다...)",
];

const backgroundImages = [
  require("@/assets/images/intro1.png"),
  require("@/assets/images/intro2.png"),
  require("@/assets/images/intro3.png"),
  require("@/assets/images/intro3.png"),
  null,
];

export default function IntroScreen() {
  const router = useRouter();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [userName, setUserName] = useState("");
  const [showNameInput, setShowNameInput] = useState(false);

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem("catName");
      if (saved) {
        setUserName(saved);
      }
    })();
  }, []);

  const getCurrentMessage = () => {
    if (currentIndex < 3) {
      return messages[currentIndex];
    }
    if (currentIndex === 3) {
      return `고양이가 말을...?!\n\n(안녕 ${userName}! 당분간 잘 지내보자!)`;
    }
    return messages[4];
  };

  const currentMessage = getCurrentMessage();
  const currentImage =
    currentIndex < backgroundImages.length
      ? backgroundImages[currentIndex]
      : null;

  // 타이핑 애니메이션
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isTyping && displayedText.length < currentMessage.length) {
      timeout = setTimeout(() => {
        setDisplayedText(
          currentMessage.slice(0, displayedText.length + 1)
        );
      }, 30);
    }
    return () => clearTimeout(timeout);
  }, [displayedText, isTyping, currentMessage]);

  // 배경 터치 핸들러
  const handleTap = () => {
    if (showNameInput) return;

    if (isTyping) {
      setDisplayedText(currentMessage);
      setIsTyping(false);
      return;
    }

    if (currentIndex < 2) {
      setCurrentIndex((i) => i + 1);
      setDisplayedText("");
      setIsTyping(true);
    } else if (currentIndex === 2) {
      setShowNameInput(true);
    } else if (currentIndex === 3) {
      setCurrentIndex(4);
      setDisplayedText("");
      setIsTyping(true);
    } else {
      router.replace("/onboarding/setup");
    }
  };

  const handleConfirm = async () => {
    if (!userName.trim()) return;
    await AsyncStorage.setItem("userName", userName);
    Keyboard.dismiss();
    setShowNameInput(false);
    setCurrentIndex(3);
    setDisplayedText("");
    setIsTyping(true);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {currentImage ? (
        <ImageBackground
          source={currentImage}
          style={{ flex: 1 }}
          resizeMode="cover"
        >
          {/* 배경 터치 전용 레이어 */}
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={handleTap}
          />

          {/* 텍스트/입력창 박스 */}
          <View
            pointerEvents="box-none"
            style={{
              position: "absolute",
              bottom: showNameInput ? "35%" : 60,
              alignSelf: "center",
              width: "90%",
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              borderRadius: 12,
              padding: 16,
            }}
          >
            {!showNameInput ? (
              <Text
                style={{
                  fontSize: 16,
                  color: "#000",
                  lineHeight: 24,
                  textAlign: "center",
                }}
              >
                {displayedText}
              </Text>
            ) : (
              <>
                <Text
                  style={{
                    fontSize: 16,
                    color: "#333",
                    marginBottom: 12,
                    textAlign: "center",
                  }}
                >
                  고양이의 이름을 입력해주세요.
                </Text>
                <TextInput
                  value={userName}
                  onChangeText={setUserName}
                  placeholder="이름"
                  style={{
                    width: "100%",
                    height: 44,
                    backgroundColor: "#fff",
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    marginBottom: 16,
                  }}
                  // onFocus나 dismiss 코드는 제거!
                />
                <TouchableOpacity
                  onPress={handleConfirm}
                  style={{
                    width: "100%",
                    backgroundColor: "#6C63FF",
                    paddingVertical: 12,
                    borderRadius: 8,
                  }}
                >
                  <Text
                    style={{
                      color: "#fff",
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    확인
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </ImageBackground>
      ) : (
        <View style={{ flex: 1, backgroundColor: "#000" }}>
          {/* 배경이 null인 마지막 스토리 */}
          <View
            style={{
              position: "absolute",
              bottom: 60,
              alignSelf: "center",
              width: "90%",
              backgroundColor: "rgba(128,128,128,0.8)",
              borderRadius: 12,
              padding: 16,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: "#fff",
                lineHeight: 24,
                textAlign: "center",
              }}
            >
              {displayedText}
            </Text>
          </View>
          {/* 마지막에도 터치로 홈 이동 */}
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={handleTap}
          />
        </View>
      )}
    </KeyboardAvoidingView>
  );
}