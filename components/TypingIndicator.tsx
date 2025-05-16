import React, { useEffect, useRef } from 'react';
import { View, Animated, Text, StyleSheet } from 'react-native';

export default function TypingIndicator() {
    const anim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(anim, { toValue: 1, duration: 300, useNativeDriver: true }),
                Animated.timing(anim, { toValue: 0, duration: 300, useNativeDriver: true }),
            ]),
        ).start();
    }, [anim]);

    const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [0, -4] });

    return (
        <View style={styles.container}>
            <Text style={styles.label}>머냥이가 입력중…</Text>
            <View style={styles.dots}>
                {[0,1,2].map(i => (
                    <Animated.View
                        key={i}
                        style={[styles.dot, { transform: [{ translateY }] , opacity: anim }]}
                    />
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flexDirection: 'row', alignItems: 'center', padding: 8 },
    label: { fontSize: 12, color: '#888', marginRight: 6 },
    dots: { flexDirection: 'row' },
    dot: {
        width: 6, height: 6, borderRadius: 3,
        backgroundColor: '#888', marginHorizontal: 2,
    },
});