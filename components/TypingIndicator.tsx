import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

export default function TypingIndicator() {
    const animations = [useRef(new Animated.Value(0)).current,
        useRef(new Animated.Value(0)).current,
        useRef(new Animated.Value(0)).current];

    useEffect(() => {
        const createBounce = (animatedValue: Animated.Value, delay: number) => {
            return Animated.loop(
                Animated.sequence([
                    Animated.delay(delay),
                    Animated.timing(animatedValue, {
                        toValue: -4,
                        duration: 150,
                        useNativeDriver: true,
                    }),
                    Animated.timing(animatedValue, {
                        toValue: 0,
                        duration: 150,
                        useNativeDriver: true,
                    }),
                ])
            );
        };

        const animationsSequence = animations.map((anim, index) =>
            createBounce(anim, index * 150)
        );

        Animated.stagger(150, animationsSequence).start();

        // cleanup if needed
        return () => {
            animations.forEach(anim => anim.stopAnimation());
        };
    }, []);

    return (
        <View style={styles.dots}>
            {animations.map((anim, index) => (
                <Animated.View
                    key={index}
                    style={[
                        styles.dot,
                        {
                            transform: [{ translateY: anim }],
                        },
                    ]}
                />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    dots: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: 20, // 말풍선 안 맞춤용 고정
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#888',
        marginHorizontal: 3,
    },
});