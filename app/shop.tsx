// screens/ShopScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// UI 리소스
const uis = {
  shopIcon: require('@/assets/ui/shop.png'),
  coinIcon: require('@/assets/ui/coin.png'),
};

// 데모용 상품 데이터
const foodItems = [
  { id: 'f1', name: '값 싼 츄르', image: require('@/assets/shop/churu1.png'), price: 50 },
  { id: 'f2', name: '인기 츄르', image: require('@/assets/shop/churu2.png'), price: 80 },
  { id: 'f3', name: '프리미엄 츄르', image: require('@/assets/shop/churu3.png'), price: 120 },
];

const interiorItems = [
  { id: 'i1', name: '고양이 해먹', image: require('@/assets/shop/hammock.png'), price: 300 },
  { id: 'i2', name: '장식 화분', image: require('@/assets/shop/plant.png'), price: 200 },
];

export default function ShopScreen() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<'food' | 'interior'>('food');
  const [money, setMoney] = useState<number>(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // AsyncStorage에서 현재 보유 금액 불러오기
  useEffect(() => {
    AsyncStorage.getItem('money').then(v => setMoney(Number(v) || 0));
  }, []);

  const items = selectedTab === 'food' ? foodItems : interiorItems;

  // 구매 처리 함수
  const handleBuy = async () => {
    if (!selectedId) return;
    const item = items.find(i => i.id === selectedId);
    if (!item) return;
    if (money >= item.price) {
      Alert.alert(
        '구매 확인',
        `${item.name}을 ${item.price}냥에 구매하시겠습니까?`,
        [
          { text: '취소', style: 'cancel' },
          {
            text: '확인',
            onPress: async () => {
              const newMoney = money - item.price;
              setMoney(newMoney);
              await AsyncStorage.setItem('money', newMoney.toString());
              Alert.alert('구매 완료', `${item.name}을 구매했습니다!`);
              setSelectedId(null);
            }
          }
        ]
      );
    } else {
      Alert.alert('잔액 부족', '냥이코인이 부족합니다!');
    }
  };

  // FlatList 렌더러
  const renderItem = ({ item }: { item: typeof foodItems[0] }) => (
    <TouchableOpacity
      style={[
        styles.itemCard,
        selectedId === item.id && styles.selectedItem
      ]}
      onPress={() => setSelectedId(item.id)}
    >
      <Image source={item.image} style={styles.itemImage} />
      <Text style={styles.itemName}>{item.name}</Text>
      <View style={styles.priceRow}>
        <Image source={uis.coinIcon} style={styles.coinIconSmall} />
        <Text style={styles.itemPrice}>{item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Image source={uis.shopIcon} style={styles.shopIcon} />
          <Text style={styles.title}>상점</Text>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.moneyBox}>
            <Image source={uis.coinIcon} style={styles.moneyIcon} />
            <Text style={styles.moneyText}>{money}</Text>
          </View>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
            <Ionicons name="close" size={32} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[
            styles.tab,
            selectedTab === 'food' && styles.activeTab
          ]}
          onPress={() => { setSelectedTab('food'); setSelectedId(null); }}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === 'food' && styles.activeTabText
            ]}
          >사료 / 간식</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            selectedTab === 'interior' && styles.activeTab
          ]}
          onPress={() => { setSelectedTab('interior'); setSelectedId(null); }}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === 'interior' && styles.activeTabText
            ]}
          >냥테리어</Text>
        </TouchableOpacity>
      </View>

      {/* 상품 목록 */}
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={3}
        contentContainerStyle={styles.grid}
      />

      {/* 구매하기 버튼 */}
      <View style={styles.purchaseContainer}>
        <TouchableOpacity
          style={[
            styles.purchaseButton,
            !selectedId && styles.disabledButton
          ]}
          onPress={handleBuy}
          disabled={!selectedId}
        >
          <Text style={styles.purchaseButtonText}>구매하기</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// 카드 너비 계산
const { width } = Dimensions.get('window');
const CARD_MARGIN = 8;
const CARD_WIDTH = (width-CARD_MARGIN*8) / 3;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F5F0' },
  // Header 영역
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  titleRow: { flexDirection: 'row', alignItems: 'center' },
  shopIcon: { width: 34, height: 34, marginRight: 8, resizeMode: 'contain' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  headerRight: { flexDirection: 'row', alignItems: 'center' },

  // 통일된 Money Box 스타일
  moneyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 13,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  moneyIcon: { width: 24, height: 24, marginRight: 8, resizeMode: 'contain' },
  moneyText: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  closeButton: { marginLeft: 12 },

  tabs: {
    flexDirection: 'row',
    paddingVertical: 12,
    marginTop: 16,
    marginBottom: 16,
  },
  tab: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    marginHorizontal: 8,
  },
  activeTab: {
    borderColor: '#A086FF',
    borderWidth: 2,
  },
  tabText: { fontSize: 14, color: '#555' },
  activeTabText: { color: '#A086FF', fontWeight: 'bold' },

  grid: { padding: CARD_MARGIN },

  itemCard: {
    width: CARD_WIDTH,
    margin: CARD_MARGIN,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedItem: {
    borderColor: '#A086FF',
  },
  itemImage: {
    width: CARD_WIDTH - 24,
    height: CARD_WIDTH - 24,
    resizeMode: 'contain',
    marginBottom: 8,
  },
  itemName: { fontSize: 12, color: '#333', marginBottom: 4, textAlign: 'center' },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  coinIconSmall: { width: 16, height: 16, marginRight: 4 },
  itemPrice: { fontSize: 12, color: '#333' },

  purchaseContainer: {
    padding: 16,
  },
  purchaseButton: {
    backgroundColor: '#A086FF',
    paddingVertical: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  purchaseButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});