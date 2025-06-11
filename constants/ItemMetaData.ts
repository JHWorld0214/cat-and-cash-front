// 아이템 이미지 매핑
export const itemImageMap: Record<string, any> = {
    '1': require('@/assets/shop/churu1.png'),
    '2': require('@/assets/shop/churu2.png'),
    '3': require('@/assets/shop/churu3.png'),
    '4': require('@/assets/shop/water1.png'),
    '5': require('@/assets/shop/water2.png'),
    '6': require('@/assets/shop/water3.png'),
    '101': require('@/assets/shop/hammock.png'),
    '102': require('@/assets/shop/plant.png'),
    '103': require('@/assets/shop/frame.png'),
};

// 아이템 메타데이터 매핑
export const itemMetaMap: Record<
    string,
    { name: string; category: 'food' | 'interior'; hunger: number | null; love: number | null }
> = {
    '1': { name: '값 싼 츄르', category: 'food', hunger: 20, love: 0 },
    '2': { name: '인기 츄르', category: 'food', hunger: 30, love: 10 },
    '3': { name: '프리미엄 츄르', category: 'food', hunger: 40, love: 20 },
    '4': { name: '생수', category: 'food', hunger: 20, love: 0 },
    '5': { name: '약숫물', category: 'food', hunger: 30, love: 10 },
    '6': { name: '애비냥', category: 'food', hunger: 40, love: 20 },
    '101': { name: '고양이 해먹', category: 'interior', hunger: null, love: null },
    '102': { name: '장식 화분', category: 'interior', hunger: null, love: null },
    '103': { name:'고양이 액자', category: 'interior', hunger: null, love: null },
};