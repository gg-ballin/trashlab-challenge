import React from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  interpolate,
  type SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';

const PARALLAX_OFFSET = 24;

type Props = {
  pageIndex: number;
  scrollPosition: SharedValue<number>;
  scrollOffset: SharedValue<number>;
  children: React.ReactNode;
};

export function PagerPage({ pageIndex, scrollPosition, scrollOffset, children }: Props) {
  const animatedStyle = useAnimatedStyle(() => {
    const progress = scrollPosition.value + scrollOffset.value;
    const opacity = interpolate(
      progress,
      [pageIndex - 1, pageIndex, pageIndex + 1],
      [0.5, 1, 0.5]
    );
    const translateX = interpolate(
      progress,
      [pageIndex - 1, pageIndex, pageIndex + 1],
      [-PARALLAX_OFFSET, 0, PARALLAX_OFFSET]
    );
    return {
      opacity,
      transform: [{ translateX }],
    };
  });

  return (
    <Animated.View style={[styles.page, animatedStyle]}>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
});
