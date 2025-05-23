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
import { useAuthStore } from 'store/slices/auth';
import ExpBar from '@/components/ExpBar';
import FakeChatInput from '@/components/FakeChatInput';
import axios from "axios";
import {useSpendingStore} from "@store/slices/spending";
import Constants from 'expo-constants';
export const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;

const uis = {
  fullBg: require('@/assets/ui/fullBg.png'),
  catImage: require('@/assets/ui/cat.png'),
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
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const appState = useRef<AppStateStatus>(AppState.currentState);

  const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;

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

  // 가계부 - 소비 내역 전체 불러오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = useAuthStore.getState().token;
        const res = await axios.get(`${API_BASE_URL}/budget/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        useSpendingStore.getState().setList(res.data.budgets);
      } catch (e) {
        console.error('지출 내역 불러오기 실패', e);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/user/enter/datas`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        console.log(response);

        if (!response.ok) {
          console.error('Error fetching data:', response.statusText);
          throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        const { money, exp } = data;

        console.log('money:', money);
        console.log('exp:', exp);

        await AsyncStorage.setItem('money', String(money));
        await AsyncStorage.setItem('exp', String(exp));
        setMoney(Number(money));
        updateExpAndLevel(Number(exp));
      } catch (error) {
        console.error('데이터 불러오기 실패:', error);
      }
    };

    if (token) {
      fetchData();
    }
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
    }, [])
  );

  const goTo = (screen: string) => () => {
    router.push(`/${screen.toLowerCase()}`);
  };

  const screenWidth = Dimensions.get('window').width;
  const gaugeWidth = screenWidth / 3;


  const [exp, setExp] = useState(0);
  const [level, setLevel] = useState(1);

  return (
    console.log(exp, level),
    <ImageBackground source={uis.fullBg} style={styles.fullBg}>
      <View style={styles.headerContainer}>
        <View style={styles.topBar}>
          <ExpBar level={level} expRatio={exp/(level*100)} />
          <View style={styles.moneyBox}>
            <Image source={require('@/assets/ui/coin.png')} style={styles.coinIcon} />
            <Text style={styles.moneyText}>{money}</Text>
          </View>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => {
              logout();
              router.replace('/login');
            }}
          >
            <Text style={styles.logoutText}>로그아웃</Text>
          </TouchableOpacity>
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
            <TouchableOpacity style={styles.iconButton} onPress={goTo('Missions')}>
              <Image source={uis.missionsIcon} style={styles.icon} />
              <Text style={styles.iconText}>미션</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={goTo('account/Account')}>
              <Image source={uis.ledgerIcon} style={styles.icon} />
              <Text style={styles.iconText}>가계부</Text>
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
  );
}

const styles = StyleSheet.create({
  fullBg: { flex: 1, width: '100%', height: '100%' },
  headerContainer: { position: 'absolute', top: 32, left: 16, right: 16 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: 30 },
  moneyText: { fontSize: 16, fontWeight: 'bold', color: '#000' },
  logoutButton: {
    paddingHorizontal: 12, paddingVertical: 6,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 8, marginTop: 16,
  },
  logoutText: { fontSize: 12, color: '#333' },
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
    position: 'absolute', bottom: '15%', left: 0, right: 0, alignItems: 'center'
  },
  catImage: { width: 250, height: 250, resizeMode: 'contain' },
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
