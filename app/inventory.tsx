// screens/UseItemScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  SafeAreaView, View, Text, TouchableOpacity,
  StyleSheet, FlatList, Image, Dimensions, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import Constants from 'expo-constants';

// 아이템 이미지 매핑
const itemImageMap: Record<string, any> = {
  '1': require('@/assets/shop/churu1.png'),
  '2': require('@/assets/shop/churu2.png'),
  '3': require('@/assets/shop/churu3.png'),
  '101': require('@/assets/shop/hammock.png'),
  '102': require('@/assets/shop/plant.png'),
};

const itemMetaMap: Record<string, { name: string; category: 'food' | 'interior', hunger: number | null, love: number | null }> = {
  '1': { name: '값 싼 츄르', category: 'food', hunger: 10, love: 0 },
  '2': { name: '인기 츄르', category: 'food', hunger: 20, love: 5 },
  '3': { name: '프리미엄 츄르', category: 'food', hunger: 30, love: 10 },
  '101': { name: '고양이 해먹', category: 'interior', hunger: null, love: null },
  '102': { name: '장식 화분', category: 'interior', hunger: null, love: null },
};

const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;

interface ItemData {
  id: string;
  name: string;
  image: any;
  count: number;
}

export default function UseItemScreen() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<'food' | 'interior'>('food');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [foodItems, setFoodItems] = useState<ItemData[]>([]);
  const [interiorItems, setInteriorItems] = useState<ItemData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const tokenObj = await AsyncStorage.getItem('auth-storage');
      const token = tokenObj ? JSON.parse(tokenObj).state.token : null;
      if (!token) return;

      const res = await fetch(`${API_BASE_URL}/storage/items`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if(!res.ok) {
        Alert.alert('인벤토리 로딩 실패...')
        const errorText = await res.text();
        throw new Error(errorText)
      }

      const data: Record<string, number> = await res.json();
      const items: ItemData[] = Object.entries(data).map(([id, count]) => ({
        id,
        name: itemMetaMap[id].name,
        image: itemImageMap[id],
        count,
      }));

      setFoodItems(items.filter(i => itemMetaMap[i.id].category === 'food'));
      setInteriorItems(items.filter(i => itemMetaMap[i.id].category === 'interior'));
    };

    fetchData();
  }, []);

  const items = selectedTab === 'food' ? foodItems : interiorItems;

  const handleUse = async () => {
    const item = items.find(i => i.id === selectedId);
    if (!item || item.count <= 0) {
      Alert.alert('사용 불가', '해당 아이템을 보유하고 있지 않습니다.');
      return;
    }

    Alert.alert('아이템 사용', `${item.name}을 사용하시겠습니까?`, [
      { text: '취소', style: 'cancel' },
      {
        text: '사용',
        onPress: async () => {
          const tokenObj = await AsyncStorage.getItem('auth-storage');
          const token = tokenObj ? JSON.parse(tokenObj).state.token : null;
          if (!token) return;

          console.log(`엔드포인트 : ${API_BASE_URL}/storage/use/${item.id}`);

          const res = await fetch(`${API_BASE_URL}/storage/use/${item.id}`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          console.log(res.status);

          if (res.status !== 200) {
            const msg = await res.text();
            Alert.alert('사용 실패', msg || '서버 오류');
            return;
          }

          if(itemMetaMap[item.id].category === 'food') {
            const { hunger, love } = itemMetaMap[item.id];
            const prevHunger = await AsyncStorage.getItem('hunger');
            const prevLove = await AsyncStorage.getItem('love');
            await AsyncStorage.multiSet([
              ['hunger', String((hunger || 0) + Number(prevHunger || 0))],
              ['love', String((love || 0) + Number(prevLove || 0))],
            ]);
          }

          const updateItems = items.map(i =>
            i.id === item.id ? { ...i, count: i.count - 1 } : i
          );

          selectedTab === 'food'
            ? setFoodItems(updateItems)
            : setInteriorItems(updateItems);

          Alert.alert('사용 완료', `${item.name}을 사용했습니다.`);
          setSelectedId(null);
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: ItemData }) => (
    <TouchableOpacity
      style={[styles.itemCard, selectedId === item.id && styles.selectedItem]}
      onPress={() => setSelectedId(item.id)}
    >
      <Image source={item.image} style={styles.itemImage} />
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemCount}>보유: {item.count}개</Text>
    </TouchableOpacity>
  );

  const inventoryIcon = require('@/assets/ui/inventory.png');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Image source={inventoryIcon} style={styles.inventoryIcon} />
          <Text style={styles.title}>인벤토리</Text>
        </View>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={28} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'food' && styles.activeTab]}
          onPress={() => { setSelectedTab('food'); setSelectedId(null); }}
        >
          <Text style={[styles.tabText, selectedTab === 'food' && styles.activeTabText]}>사료 / 간식</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'interior' && styles.activeTab]}
          onPress={() => { setSelectedTab('interior'); setSelectedId(null); }}
        >
          <Text style={[styles.tabText, selectedTab === 'interior' && styles.activeTabText]}>냥테리어</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={3}
        contentContainerStyle={styles.grid}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.useButton, !selectedId && styles.disabledButton]}
          onPress={handleUse}
          disabled={!selectedId}
        >
          <Text style={styles.buttonText}>사용하기</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get('window');
const CARD_MARGIN = 8;
const CARD_WIDTH = (width - CARD_MARGIN * 8) / 3;

const styles = StyleSheet.create({
  inventoryIcon: { width: 34, height: 34, marginRight: 8, resizeMode: 'contain' },
  titleRow: { flexDirection: 'row', alignItems: 'center' },
  container: { flex: 1, backgroundColor: '#F7F5F0' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', padding: 16,
  },
  title: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  tabs: {
    flexDirection: 'row', paddingVertical: 12,
    marginTop: 16, marginBottom: 16,
    justifyContent: 'center',
  },
  tab: {
    paddingVertical: 6, paddingHorizontal: 16,
    borderRadius: 20, borderWidth: 1, borderColor: '#ddd',
    backgroundColor: '#fff', marginHorizontal: 8,
  },
  activeTab: { borderColor: '#A086FF', borderWidth: 2 },
  tabText: { fontSize: 14, color: '#555' },
  activeTabText: { color: '#A086FF', fontWeight: 'bold' },
  grid: { padding: CARD_MARGIN },
  itemCard: {
    width: CARD_WIDTH, margin: CARD_MARGIN,
    backgroundColor: '#fff', borderRadius: 12, padding: 12,
    alignItems: 'center', borderWidth: 1, borderColor: 'transparent',
  },
  selectedItem: { borderColor: '#A086FF' },
  itemImage: {
    width: CARD_WIDTH - 24, height: CARD_WIDTH - 24,
    resizeMode: 'contain', marginBottom: 8,
  },
  itemName: { fontSize: 12, color: '#333', marginBottom: 4, textAlign: 'center' },
  itemCount: { fontSize: 12, color: '#666' },
  buttonContainer: { padding: 16 },
  useButton: {
    backgroundColor: '#A086FF', paddingVertical: 20,
    borderRadius: 8, alignItems: 'center',
  },
  disabledButton: { backgroundColor: '#ccc' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
