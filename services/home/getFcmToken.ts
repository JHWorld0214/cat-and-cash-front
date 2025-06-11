// import messaging from '@react-native-firebase/messaging';
// import axios from 'axios';
// import Constants from 'expo-constants';
// import AsyncStorage from '@react-native-async-storage/async-storage';
//
// const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;
// const FCM_TOKEN_KEY = 'fcmDeviceToken';
//
// export const registerFcmToken = async (userToken: string) => {
//     try {
//         // 1. 푸시 알림 권한 요청
//         const authStatus = await messaging().requestPermission();
//         const enabled =
//             authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//             authStatus === messaging.AuthorizationStatus.PROVISIONAL;
//
//         if (!enabled) {
//             console.log('[FCM] 사용자에게 권한 거부됨');
//             return;
//         }
//
//         // 2. FCM 토큰 발급
//         const fcmToken = await messaging().getToken();
//         if (!fcmToken) {
//             console.warn('[FCM] 토큰 발급 실패');
//             return;
//         }
//
//         console.log('[FCM] 발급된 토큰:', fcmToken);
//
//         // 3. 서버에 토큰 전송
//         await axios.post(
//             `${API_BASE_URL}/push/register`,
//             fcmToken,
//             {
//                 headers: { Authorization: `Bearer ${userToken}` },
//             }
//         );
//
//         console.log('[FCM] 서버 전송 성공');
//
//         // 4. AsyncStorage에 저장
//         await AsyncStorage.setItem(FCM_TOKEN_KEY, fcmToken);
//         console.log('[FCM] 토큰 AsyncStorage 저장 완료');
//
//         return fcmToken;
//     } catch (err) {
//         console.error('[FCM] 등록 실패:', err);
//     }
// };