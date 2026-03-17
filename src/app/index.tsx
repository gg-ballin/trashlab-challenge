import { useCallback, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import PagerView from 'react-native-pager-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSharedValue } from 'react-native-reanimated';

import { SegmentedControl } from '@/components/SegmentedControl';
import { PagerPage } from '@/components/PagerPage';
import { useTheme } from '@/core/ThemeContext';
import { TabIndex } from '@/core/types';
import { CategoriesScreen } from '@/features/categories';
import { DashboardScreen } from '@/features/dashboard';
import { GoalsScreen } from '@/features/goals';
import { RecurringsScreen } from '@/features/recurrings';

export default function Index() {
  const insets = useSafeAreaInsets();
  const { themeColors } = useTheme();
  const [selectedIndex, setSelectedIndex] = useState(TabIndex.Dashboard);
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
    setSelectedIndex(e.nativeEvent.position);
  }, []);

  const onSelectIndex = useCallback((index: number) => {
    setSelectedIndex(index);
    pagerRef.current?.setPage(index);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background, paddingTop: insets.top }]}>
      <View style={styles.segmentBar}>
        <SegmentedControl selectedIndex={selectedIndex} onSelectIndex={onSelectIndex} />
      </View>
      <PagerView
        ref={pagerRef}
        style={styles.pager}
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
            <CategoriesScreen />
          </PagerPage>
        </View>
        <View key="2" style={styles.page}>
          <PagerPage pageIndex={2} scrollPosition={scrollPosition} scrollOffset={scrollOffset}>
            <RecurringsScreen />
          </PagerPage>
        </View>
        <View key="3" style={styles.page}>
          <PagerPage pageIndex={3} scrollPosition={scrollPosition} scrollOffset={scrollOffset}>
            <GoalsScreen />
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
  segmentBar: {
    paddingHorizontal: 0,
  },
  pager: {
    flex: 1,
  },
  page: {
    flex: 1,
  },
});
