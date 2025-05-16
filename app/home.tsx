// HomeScreen.tsx
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
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

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
  const navigation = useNavigation<any>();
  const [money, setMoney] = useState<number>(0);
  const [hunger, setHunger] = useState<number>(100);
  const [love, setLove] = useState<number>(100);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const appState = useRef<AppStateStatus>(AppState.currentState);

  // 더미 로드 (money만)
  useEffect(() => {
    AsyncStorage.setItem('money', '150');
    AsyncStorage.getItem('money').then(v => setMoney(Number(v || 0)));
  }, []);

  // hunger/love 보정 & 업데이트
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

    const sub = AppState.addEventListener('change', status => {
      if (
        appState.current.match(/inactive|background/) &&
        status === 'active'
      ) {
        recalcAndSave().catch(console.error);
      }
      appState.current = status;
    });

    recalcAndSave().catch(console.error);
    intervalRef.current = setInterval(() => recalcAndSave().catch(console.error), 60000);

    return () => {
      sub.remove();
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const goTo = (screen: string) => () => navigation.navigate(screen);

  const screenWidth = Dimensions.get('window').width;
  const gaugeWidth = screenWidth / 3;

  return (
    <ImageBackground source={uis.fullBg} style={styles.fullBg}>
      <View style={styles.container}>
        {/* 상단 바: 돈 + 상태 */}
        <View style={styles.topRow}>
          <View style={styles.statusCard}>
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
  
          <ImageBackground source={uis.moneyBorder} style={styles.moneyContainer}>
            <Text style={styles.moneyText}>💰 {money}</Text>
          </ImageBackground>
        </View>
  
        {/* 고양이 이미지 */}
        <View style={styles.catWrapper}>
          <Image source={uis.catImage} style={styles.catImage} />
        </View>
  
        {/* 오른쪽 사이드 버튼 */}
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
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  fullBg: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  // 상단 헤더 (돈 + 상태)
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 24,
    marginHorizontal: 16,
  },

  moneyContainer: {
    width: 100,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginTop: 50
  },
  moneyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 32,
    paddingBottom: 16,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  statusCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    width: '40%',
    marginTop: 110,
  },
  statusItem: {
    marginBottom: 12,
  },
  statusLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  gauge: {
    width: '100%',
    height: 6,
    backgroundColor: '#eee',
    borderRadius: 3,
    overflow: 'hidden',
  },
  gaugeFill: {
    height: 6,
    backgroundColor: '#ff6b4a',
  },
  gaugeFillBlue: {
    height: 6,
    backgroundColor: '#4a90e2',
  },
  // 고양이 중앙 위치
  catWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 150
  },
  catImage: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
  },

  // 사이드 버튼 (절대 위치 유지)
  sideButtons: {
    position: 'absolute',
    right: 16,
    top: '18%',
  },
  iconButton: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    width: 28,
    height: 28,
    marginBottom: 4,
  },
  iconText: {
    fontSize: 12,
    color: '#333',
    fontWeight: 'bold',
  },

  // 채팅창 (하단 고정)
  chatWrapper: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  chatBox: {
    height: 56,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  chatText: {
    textAlign: 'left',
    fontSize: 14,
    color: '#555',
  },
});