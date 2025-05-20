// components/ExpBar.tsx
import React from 'react';
import { View, Text, StyleSheet, Image, ImageBackground } from 'react-native';

export default function ExpBar({ level = 1, expRatio = 0.3 }) {
  return (
    <ImageBackground
      source={require('@/assets/ui/expBarBg.png')}
      style={styles.container}
      resizeMode="stretch"
    >
      <Text style={styles.levelText}>Lv. {level}</Text>
      <View style={styles.barWrapper}>
        <View style={styles.barBackground}>
          <View style={[styles.barFill, { width: `${expRatio * 100}%` }]} />
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 200,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginBottom: 8,
  },
  icon: {
    width: 18,
    height: 18,
    marginRight: 4,
  },
  levelText: {
    fontWeight: 'bold',
    fontSize: 13,
    color: '#333',
    marginRight: 6,
    marginLeft: 30,
  },
  barWrapper: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: 10,
  },
  barBackground: {
    width: '100%',
    height: 6,
    backgroundColor: '#ffe5e5',
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#ff947a',
    borderRadius: 3,
  },
});