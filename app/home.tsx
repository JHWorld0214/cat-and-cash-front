import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  AppState,
  AppStateStatus,
  Image,
  ImageBackground,
  Dimensions,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import { useAuthStore } from '@store/slices/authStore';
import ExpBar from '@components/home/ExpBar';
import FakeChatInput from '@components/home/FakeChatInput';
import Constants from 'expo-constants';
import { useChatStore } from '@store/slices/chatStore';
import { getChatLog } from '@services/chat/getChat';
import { checkFirstVisitToday } from '@services/home/checkFirstVisitToday';
import { getBudgetAll } from '@services/home/getBudgetAll';
import { fetchMoneyExp } from '@services/home/fetchMoneyExp';
import MissionDialog from "@components/home/MissonDialog";
// import {registerFcmToken} from "@services/home/getFcmToken";

const { width, height } = Dimensions.get('window');

const uis = {
  fullBg: require('@/assets/ui/home_frame.png'),
  catImage: require('@/assets/ui/real_cat.png'),
  chatBoxBg: require('@/assets/ui/chatBox.png'),
  shopIcon: require('@/assets/ui/shop.png'),
  inventoryIcon: require('@/assets/ui/inventory.png'),
  missionsIcon: require('@/assets/ui/missions.png'),
  ledgerIcon: require('@/assets/ui/ledger.png'),
};

function clamp(value: number) {
  return Math.max(0, Math.min(100, value));
}

export default function HomeScreen() {
  const router = useRouter();
  const logout = useAuthStore(state => state.logout);
  const token = useAuthStore(state => state.token);

  const [money, setMoney] = useState<number>(0);
  const [hunger, setHunger] = useState<number>(100);
  const [love, setLove] = useState<number>(100);
  const [exp, setExp] = useState(0);
  const [level, setLevel] = useState(1);
  const [missionVisible, setMissionVisible] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const appState = useRef<AppStateStatus>(AppState.currentState);
  const setChatLog = useChatStore((state) => state.setChatLog);

  const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;

  const missionContent = '오늘 하루 동안 커피 안 마시기';
  const missionReward = { exp: 10, coin: 50 };

  async function recalcAndSave() {
    const [lastT, storedH, storedL] = await Promise.all([
      AsyncStorage.getItem('lastUpdate'),
      AsyncStorage.getItem('hunger'),
      AsyncStorage.getItem('love'),
    ]);
    const now = Date.now();
    let newH = storedH != null ? Number(storedH) : 100;
    let newL = storedL != null ? Number(storedL) : 100;
    if (lastT) {
      const mins = Math.floor((now - Number(lastT)) / 60000);
      newH = clamp(newH - mins);
      newL = clamp(newL - mins);
    }
    setHunger(newH);
    setLove(newL);
    await AsyncStorage.multiSet([
      ['hunger', String(newH)],
      ['love', String(newL)],
      ['lastUpdate', String(now)],
    ]);
  }

  async function reloadMoneyExp() {
    const [money, exp] = await Promise.all([
      AsyncStorage.getItem('money'),
      AsyncStorage.getItem('exp'),
    ]);
    setMoney(money ? Number(money) : 0);
    setExp(exp ? Number(exp) : 0);
  }

  // useEffect(() => {
  //   if(token) {
  //     const checkAndRegisterPush = async () => {
  //       const alreadyRegistered = await AsyncStorage.getItem('FCM_TOKEN_KEY');
  //       if (alreadyRegistered) return; // 이미 등록했으면 끝
  //       await registerFcmToken(token);
  //     }
  //
  //     checkAndRegisterPush();
  //   }
  //
  // }, []);

  // useEffect(() => {
  //   AsyncStorage.removeItem('FCM_TOKEN_KEY');
  // }, []);

  // useEffect(() => {
  //   if (!token) return;
  //
  //   const testPush = async () => {
  //     const fcmToken = await AsyncStorage.getItem('FCM_TOKEN_KEY');
  //     console.log(`pushToken 꺼냈다잉: ${fcmToken}`);
  //     if (!fcmToken) return;
  //     console.log(`pushToken 보낸다잉: ${fcmToken}`);
  //     try {
  //       await fetch(`${API_BASE_URL}/push/test`, {
  //         method: 'POST',
  //         body: fcmToken,
  //         headers: {
  //           'Content-Type': 'application/json',
  //           Authorization: `Bearer ${token}` ,
  //         }
  //       });
  //     } catch (err) {
  //       console.error('푸시 테스트 실패:', err);
  //     }
  //   };
  //
  //   testPush();
  // }, [token]);

  useEffect(() => {
    const handleDailyCheck = async () => {
      const isFirst = await checkFirstVisitToday();
      if (isFirst) {
        Alert.alert(
            '500냥 지급!',
            '500냥이 지급되었습니다! 머냥이를 위해 아껴보세요~ 🐾',
            [
              {
                text: '확인',
                onPress: () => {
                  fetchMoneyExp(setMoney, updateExpAndLevel);
                },
              },
            ],
            { cancelable: false }
        );
      }
    };
    if (token) handleDailyCheck();
  }, [token]);

  useEffect(() => { getBudgetAll(); }, []);

  useEffect(() => {
    const loadChat = async () => {
      const chatData = await getChatLog();
      setChatLog(chatData);
    };
    loadChat();
  }, []);

  useEffect(() => {
    fetchMoneyExp(setMoney, updateExpAndLevel);
  }, []);

  useEffect(() => {
    const fetchAndStoreItems = async () => {
      try {
        const token = useAuthStore.getState().token;
        if (!token) return;
        const res = await fetch(`${API_BASE_URL}/storage/items`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const data: Record<string, number> = await res.json();
        await AsyncStorage.setItem('storageItems', JSON.stringify(data));
      } catch (e) {
        console.error('아이템 저장 실패', e);
      }
    };
    if (token) fetchAndStoreItems();
  }, [token]);

  const updateExpAndLevel = (expValue: number) => {
    let currentLevel = 1;
    let remainingExp = expValue;
    while (remainingExp >= currentLevel * 100) {
      remainingExp -= currentLevel * 100;
      currentLevel++;
    }
    setExp(remainingExp);
    setLevel(currentLevel);
  };

  useEffect(() => {
    const sub = AppState.addEventListener('change', (nextState: AppStateStatus) => {
      if (appState.current.match(/inactive|background/) && nextState === 'active') {
        recalcAndSave().catch(console.error);
      }
      appState.current = nextState;
    });
    recalcAndSave().catch(console.error);
    intervalRef.current = setInterval(() => recalcAndSave().catch(console.error), 60000);
    return () => {
      sub.remove();
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useFocusEffect(
      React.useCallback(() => {
        recalcAndSave().catch(console.error);
        reloadMoneyExp().catch(console.error);
      }, [])
  );

  const goTo = (screen: string) => () => {
    router.push(`/${screen.toLowerCase()}`);
  };

  const screenWidth = Dimensions.get('window').width;
  const gaugeWidth = screenWidth / 3;

  return (
      <>
        <ImageBackground source={uis.fullBg} style={styles.fullBg}>
          <View style={styles.headerContainer}>
            <View style={styles.topBar}>
              <ExpBar level={level} expRatio={exp / (level * 100)} />
              <View style={styles.moneyBox}>
                <Image source={require('@/assets/ui/coin.png')} style={styles.coinIcon} />
                <Text style={styles.moneyText}>{money}</Text>
              </View>
            </View>

            <View style={styles.statusAndButtons}>
              <View style={[styles.statusCard, { width: gaugeWidth + 16 }]}>
                <View style={styles.statusItem}>
                  <Text style={styles.statusLabel}>포만감</Text>
                  <View style={styles.gauge}>
                    <View style={[styles.gaugeFill, { width: `${hunger}%` }]} />
                  </View>
                </View>
                <View style={styles.statusItem}>
                  <Text style={styles.statusLabel}>친밀도</Text>
                  <View style={styles.gauge}>
                    <View style={[styles.gaugeFillBlue, { width: `${love}%` }]} />
                  </View>
                </View>
              </View>
              <View style={styles.sideButtons}>
                <TouchableOpacity style={styles.iconButton} onPress={goTo('Shop')}>
                  <Image source={uis.shopIcon} style={styles.icon} />
                  <Text style={styles.iconText}>상점</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton} onPress={goTo('Inventory')}>
                  <Image source={uis.inventoryIcon} style={styles.icon} />
                  <Text style={styles.iconText}>인벤토리</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton} onPress={() => setMissionVisible(true)}>
                  <Image source={uis.missionsIcon} style={styles.icon} />
                  <Text style={styles.iconText}>미션</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton} onPress={goTo('account/Account')}>
                  <Image source={uis.ledgerIcon} style={styles.icon} />
                  <Text style={styles.iconText}>가계부</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.logoutButton} onPress={() => {
                  logout();
                  router.replace('/login');
                }}>
                  <Text style={styles.logoutText}>로그아웃</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.catWrapper}>
            <Image source={uis.catImage} style={styles.catImage} />
          </View>

          <View style={styles.chatWrapper}>
            <FakeChatInput
                value=""
                onChangeText={() => {}}
                onPress={goTo('Chat')}
                disabled
            />
          </View>
        </ImageBackground>

        <MissionDialog
            visible={missionVisible}
            onClose={() => setMissionVisible(false)}
            missionContent={missionContent}
            reward={missionReward}
        />
      </>
  );
}

const styles = StyleSheet.create({
  fullBg: { flex: 1, width: width, height: height, resizeMode: 'contain', top:0, left:0 },
  headerContainer: { position: 'absolute', top: 32, left: 16, right: 16 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: 30 },
  moneyText: { fontSize: 16, fontWeight: 'bold', color: '#000' },
  logoutButton: {
    paddingHorizontal: 12, paddingVertical: 6,
    backgroundColor: 'transparent',
    borderRadius: 8, marginTop: 16,
  },
  logoutText: { fontSize: 12, color: 'transparent' },
  statusCard: {
    backgroundColor: '#fff', borderRadius: 8,
    padding: 8, marginTop: 16,
  },
  statusItem: { marginBottom: 12 },
  statusLabel: { fontSize: 12, marginBottom: 4, fontWeight: 'bold' },
  gauge: { width: '100%', height: 6, backgroundColor: '#eee', borderRadius: 3, overflow: 'hidden' },
  gaugeFill: { height: 6, backgroundColor: '#ff6b4a' },
  gaugeFillBlue: { height: 6, backgroundColor: '#4a90e2' },
  catWrapper: {
    position: 'absolute', bottom: '5%', left: 0, right: 0, alignItems: 'center'
  },
  catImage: { width: 240, height: 240, resizeMode: 'contain', position: 'absolute', bottom: 50},
  sideButtons: {
    justifyContent: 'flex-start', alignItems: 'center',
  },
  iconButton: {
    backgroundColor: '#fff', borderRadius: 8,
    width: 60, height: 60,
    alignItems: 'center', marginBottom: 16, justifyContent: 'center',
  },
  icon: { width: 28, height: 28, marginBottom: 4 },
  iconText: { fontSize: 12, color: '#333', fontWeight: 'bold' },
  chatWrapper: { position: 'absolute', left: 20, right: 20, bottom: '4%' },
  moneyBox: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    borderRadius: 20, paddingVertical: 8, paddingHorizontal: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1,
    shadowRadius: 3, elevation: 2,
  },
  coinIcon: { width: 24, height: 24, marginRight: 8, resizeMode: 'contain' },
  statusAndButtons: {
    flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginTop: 16,
  },
});
