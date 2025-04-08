// import { Tabs } from 'expo-router';
// import React from 'react';
// import { Platform } from 'react-native';
//
// import { HapticTab } from '@/components/HapticTab';
// import { IconSymbol } from '@/components/ui/IconSymbol';
// import TabBarBackground from '@/components/ui/TabBarBackground';
// import { Colors } from '@/constants/Colors';
// import { useColorScheme } from '@/hooks/useColorScheme';
//
// export default function TabLayout() {
//   const colorScheme = useColorScheme();
//
//   return (
//     <Tabs
//       screenOptions={{
//         tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
//         headerShown: false,
//         tabBarButton: HapticTab,
//         tabBarBackground: TabBarBackground,
//         tabBarStyle: Platform.select({
//           ios: {
//             position: 'absolute',
//               height: 70,
//           },
//           default: {},
//         }),
//       }}>
//       <Tabs.Screen
//         name="index"
//         options={{
//           title: 'Home',
//           tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
//         }}
//       />
//       <Tabs.Screen
//         name="chat"
//         options={{
//           title: 'Chat',
//           tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
//         }}
//       />
//         <Tabs.Screen
//             name="my"
//             options={{
//                 title: 'My',
//                 tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
//             }}
//         />
//         <Tabs.Screen
//             name="account"
//             options={{
//                 title: 'Account',
//                 tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
//             }}
//         />
//     </Tabs>
//   );
// }
