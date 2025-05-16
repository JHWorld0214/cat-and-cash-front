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
import { useRouter } from 'expo-router';
import { useAuthStore } from 'store/slices/auth';

const uis = {
  fullBg: require('@/assets/ui/fullBg.png'),
  moneyBorder: require('@/assets/ui/moneyBorder.png'),
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

  const goTo = (screen: string) => () => {
    router.push(`/${screen.toLowerCase()}`);
  };

  useEffect(() => {
    if (token) {
      Alert.alert('디버그', `토큰: ${token}`);
    }
  }, [token]);

  useEffect(() => {
    AsyncStorage.setItem('money', '150');
    AsyncStorage.getItem('money').then(v => setMoney(Number(v || 0)));
  }, []);

  useEffect(() => {
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

    const sub = AppState.addEventListener('change', (nextState: AppStateStatus) => {
      if (
          appState.current.match(/inactive|background/) &&
          nextState === 'active'
      ) {
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

  const screenWidth = Dimensions.get('window').width;
  const gaugeWidth = screenWidth / 3;

  return (
      <ImageBackground source={uis.fullBg} style={styles.fullBg}>
        <View style={styles.headerContainer}>
          <View style={styles.topBar}>
            <ImageBackground source={uis.moneyBorder} style={styles.moneyContainer}>
              <Text style={styles.moneyText}>💰 {money}</Text>
            </ImageBackground>
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
          <View style={[styles.statusCard, { width: gaugeWidth + 16 }]}>
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>배고픔 {hunger}</Text>
              <View style={styles.gauge}>
                <View style={[styles.gaugeFill, { width: `${hunger}%` }]} />
              </View>
            </View>
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>친밀도 {love}</Text>
              <View style={styles.gauge}>
                <View style={[styles.gaugeFillBlue, { width: `${love}%` }]} />
              </View>
            </View>
          </View>
        </View>

        {/* 고양이 이미지 */}
        <View style={styles.catWrapper}>
          <Image source={uis.catImage} style={styles.catImage} />
        </View>

        {/* 사이드 버튼 */}
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
          <TouchableOpacity style={styles.iconButton} onPress={goTo('Ledger')}>
            <Image source={uis.ledgerIcon} style={styles.icon} />
            <Text style={styles.iconText}>가계부</Text>
          </TouchableOpacity>
        </View>

        {/* 채팅 입력창 */}
        <TouchableOpacity style={styles.chatWrapper} onPress={goTo('Chat')}>
          <ImageBackground
              source={uis.chatBoxBg}
              style={styles.chatBox}
              resizeMode="stretch"
          >
            <Text style={styles.chatText}>메시지를 입력해 주세요</Text>
          </ImageBackground>
        </TouchableOpacity>
      </ImageBackground>
  );
}

const styles = StyleSheet.create({
  fullBg: { flex: 1, width: '100%', height: '100%' },
  headerContainer: { position: 'absolute', top: 32, left: 16, right: 16 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  moneyContainer: {
    width: 100, height: 36, justifyContent: 'center', alignItems: 'center',
    paddingHorizontal: 6, backgroundColor: '#fff', borderRadius: 8, marginTop: 50
  },
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
  statusLabel: { fontSize: 12, marginBottom: 4 },
  gauge: { width: '100%', height: 6, backgroundColor: '#eee', borderRadius: 3, overflow: 'hidden' },
  gaugeFill: { height: 6, backgroundColor: '#ff6b4a' },
  gaugeFillBlue: { height: 6, backgroundColor: '#4a90e2' },
  catWrapper: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 150 },
  catImage: { width: 250, height: 250, resizeMode: 'contain' },
  sideButtons: { position: 'absolute', right: 16, top: '18%' },
  iconButton: {
    backgroundColor: '#fff', borderRadius: 8,
    paddingHorizontal: 8, paddingVertical: 6,
    alignItems: 'center', marginBottom: 16,
  },
  icon: { width: 28, height: 28, marginBottom: 4 },
  iconText: { fontSize: 12, color: '#333', fontWeight: 'bold' },
  chatWrapper: { position: 'absolute', bottom: 16, left: 16, right: 16 },
  chatBox: { height: 56, justifyContent: 'center', paddingHorizontal: 16 },
  chatText: { fontSize: 14, color: '#555' },
});