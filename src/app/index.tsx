import { useCallback, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import PagerView from 'react-native-pager-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSharedValue } from 'react-native-reanimated';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';

import { SegmentedControl } from '@/components/SegmentedControl';
import { PagerPage } from '@/components/PagerPage';
import { useTheme } from '@/core/ThemeContext';
import { TabIndex } from '@/core/types';
import { DashboardScreen } from '@/features/dashboard';
import { CategoriesScreen } from '@/features/categories';
import { RecurringsScreen } from '@/features/recurrings';
import { GoalsScreen } from '@/features/goals';

const logoSource = require('@/../assets/images/image.png');

export default function Index() {
  const insets = useSafeAreaInsets();
  const { themeColors, setColorScheme, colorScheme } = useTheme();
  const [selectedIndex, setSelectedIndex] = useState(TabIndex.Dashboard);
  const [focusKeys, setFocusKeys] = useState(() => [0, 0, 0, 0]);
  const pagerRef = useRef<PagerView>(null);
  const scrollPosition = useSharedValue(0);
  const scrollOffset = useSharedValue(0);

  const onPageScroll = useCallback(
    (e: { nativeEvent: { position: number; offset: number } }) => {
      scrollPosition.value = e.nativeEvent.position;
      scrollOffset.value = e.nativeEvent.offset;
    },
    [scrollPosition, scrollOffset]
  );

  const onPageSelected = useCallback((e: { nativeEvent: { position: number } }) => {
    const position = e.nativeEvent.position;
    setSelectedIndex(position);
    setFocusKeys((prev) => {
      const next = [...prev];
      next[position] = (next[position] ?? 0) + 1;
      return next;
    });
  }, []);

  const onSelectIndex = useCallback((index: number) => {
    setSelectedIndex(index);
    pagerRef.current?.setPage(index);
  }, []);

  const headerBg = { backgroundColor: themeColors.primary };

  const scaleAnim = useRef(new Animated.Value(1)).current;

  const toggleTheme = useCallback(() => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.88,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 300,
        useNativeDriver: true,
      }),
    ]).start();
    setColorScheme(colorScheme === 'light' ? 'dark' : 'light');
  }, [colorScheme, setColorScheme, scaleAnim]);

  return (
    <View style={styles.container}>
      <View style={[styles.headerSection, headerBg, { paddingTop: insets.top }]}>
        <View style={[styles.header, headerBg]}>
          <View style={styles.containerLogo}>
            <Image source={logoSource} contentFit="contain" style={styles.logo} />
            <Text style={styles.logoText}>TrashLab Copilot</Text>
          </View>
          <Pressable
            onPress={toggleTheme}
            style={[styles.themeToggle, styles.themeToggleButton]}
            hitSlop={8}
          >
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              <Ionicons
                name={colorScheme === 'light' ? 'moon-outline' : 'sunny-outline'}
                size={22}
                color={themeColors.primary}
              />
            </Animated.View>
          </Pressable>
        </View>
        <View style={[styles.segmentBar, headerBg]}>
          <SegmentedControl
            selectedIndex={selectedIndex}
            onSelectIndex={onSelectIndex}
            onPrimaryBackground
          />
        </View>
      </View>
      <PagerView
        ref={pagerRef}
        style={[styles.pager, { backgroundColor: themeColors.background }]}
        initialPage={TabIndex.Dashboard}
        onPageScroll={onPageScroll}
        onPageSelected={onPageSelected}
      >
        <View key="0" style={styles.page}>
          <PagerPage pageIndex={0} scrollPosition={scrollPosition} scrollOffset={scrollOffset}>
            <DashboardScreen />
          </PagerPage>
        </View>
        <View key="1" style={styles.page}>
          <PagerPage pageIndex={1} scrollPosition={scrollPosition} scrollOffset={scrollOffset}>
            <CategoriesScreen focusKey={focusKeys[1]} />
          </PagerPage>
        </View>
        <View key="2" style={styles.page}>
          <PagerPage pageIndex={2} scrollPosition={scrollPosition} scrollOffset={scrollOffset}>
            <RecurringsScreen focusKey={focusKeys[2]} />
          </PagerPage>
        </View>
        <View key="3" style={styles.page}>
          <PagerPage pageIndex={3} scrollPosition={scrollPosition} scrollOffset={scrollOffset}>
            <GoalsScreen focusKey={focusKeys[3]} />
          </PagerPage>
        </View>
      </PagerView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerSection: {},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  containerLogo: {
    marginLeft: -20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    height: 48,
    width: 90,
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  segmentBar: {
    paddingHorizontal: 0,
  },
  themeToggle: {
    padding: 4,
  },
  themeToggleButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 8,
  },
  pager: {
    flex: 1,
  },
  page: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  bottomBar: {
    paddingTop: 12,
    paddingHorizontal: 24,
  },
  bottomIcons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});
