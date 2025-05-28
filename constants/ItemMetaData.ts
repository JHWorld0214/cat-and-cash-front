// 아이템 이미지 매핑
export const itemImageMap: Record<string, any> = {
    '1': require('@/assets/shop/churu1.png'),
    '2': require('@/assets/shop/churu2.png'),
    '3': require('@/assets/shop/churu3.png'),
    '101': require('@/assets/shop/hammock.png'),
    '102': require('@/assets/shop/plant.png'),
};

// 아이템 메타데이터 매핑
export const itemMetaMap: Record<
    string,
    { name: string; category: 'food' | 'interior'; hunger: number | null; love: number | null }
> = {
    '1': { name: '값 싼 츄르', category: 'food', hunger: 10, love: 0 },
    '2': { name: '인기 츄르', category: 'food', hunger: 20, love: 5 },
    '3': { name: '프리미엄 츄르', category: 'food', hunger: 30, love: 10 },
    '101': { name: '고양이 해먹', category: 'interior', hunger: null, love: null },
    '102': { name: '장식 화분', category: 'interior', hunger: null, love: null },
};