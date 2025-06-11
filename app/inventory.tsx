import React, { useState, useEffect } from 'react';
import {
  SafeAreaView, View, Text, TouchableOpacity,
  StyleSheet, FlatList, Image, Dimensions, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import Constants from 'expo-constants';
import {itemImageMap, itemMetaMap} from "@constants/ItemMetaData";
import { ItemData } from "@store/slices/catStore";


const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;

export default function UseItemScreen() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<'food' | 'interior'>('food');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [foodItems, setFoodItems] = useState<ItemData[]>([]);
  const [interiorItems, setInteriorItems] = useState<ItemData[]>([]);

  // 로컬에 저장된 아이템 목록 불러오기
  useEffect(() => {
    const loadItemsFromStorage = async () => {
      try {
        const json = await AsyncStorage.getItem('storageItems');
        if (!json) return;

        const data: Record<string, number> = JSON.parse(json);
        const items: ItemData[] = Object.entries(data).map(([id, count]) => ({
          id,
          name: itemMetaMap[id].name,
          image: itemImageMap[id],
          count,
          category: itemMetaMap[id].category,
        }));

        setFoodItems(items.filter(i => itemMetaMap[i.id].category === 'food'));
        setInteriorItems(items.filter(i => itemMetaMap[i.id].category === 'interior'));
      } catch (e) {
        console.error('저장된 아이템 로딩 실패', e);
      }
    };

    loadItemsFromStorage();
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
          // 토큰 가져오기
          const tokenObj = await AsyncStorage.getItem('auth-storage');
          const token = tokenObj ? JSON.parse(tokenObj).state.token : null;
          if (!token) return;

          // 서버에 사용 요청
          const res = await fetch(`${API_BASE_URL}/storage/use/${item.id}`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` },
          });

          if (res.status !== 200) {
            const msg = await res.text();
            Alert.alert('사용 실패', msg || '서버 오류');
            return;
          }

          // food 아이템이면 포만감·친밀도 반영
          if (itemMetaMap[item.id].category === 'food') {
            const { hunger, love } = itemMetaMap[item.id];
            const prevHunger = await AsyncStorage.getItem('hunger');
            const prevLove = await AsyncStorage.getItem('love');
            await AsyncStorage.multiSet([
              ['hunger', String((hunger || 0) + Number(prevHunger || 0))],
              ['love', String((love || 0) + Number(prevLove || 0))],
            ]);
          }

          // 상태 업데이트: count 차감 혹은 제거
          let newItems: ItemData[];
          if (item.count - 1 <= 0) {
            newItems = items.filter(i => i.id !== item.id);
          } else {
            newItems = items.map(i =>
                i.id === item.id ? { ...i, count: i.count - 1 } : i
            );
          }
          if (selectedTab === 'food') setFoodItems(newItems);
          else setInteriorItems(newItems);

          // AsyncStorage 동기화
          try {
            const json = await AsyncStorage.getItem('storageItems');
            if (json) {
              const data: Record<string, number> = JSON.parse(json);
              if (item.count - 1 <= 0) {
                delete data[item.id];
              } else {
                data[item.id] = item.count - 1;
              }
              await AsyncStorage.setItem('storageItems', JSON.stringify(data));
            }
          } catch (e) {
            console.error('로컬 아이템 업데이트 실패', e);
          }

          Alert.alert('사용 완료', `${item.name}을 사용했습니다.`);
          setSelectedId(null);
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: ItemData }) => {
    const isOwned = item.id === '103';

    return (
        <TouchableOpacity
            style={[styles.itemCard, selectedId === item.id && styles.selectedItem]}
            onPress={() => setSelectedId(item.id)}
        >
          {isOwned && (
              <View style={styles.ownedBadge}>
                <Text style={styles.ownedText}>장착 중</Text>
              </View>
          )}
          <Image source={item.image} style={styles.itemImage} />
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemCount}>보유: {item.count}개</Text>
        </TouchableOpacity>
    );
  };

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
  container: { flex: 1, backgroundColor: '#F7F5F0', paddingVertical: 50 },
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
  ownedBadge: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#A086FF',
    paddingVertical: 4,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    zIndex: 1,
  },
  ownedText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});