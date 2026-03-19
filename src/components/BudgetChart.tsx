import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  Canvas,
  Path,
  Circle,
  Skia,
  DashPathEffect,
  LinearGradient,
} from '@shopify/react-native-skia';

const PAD = 8;
const DASHED_COLOR = '#4E6B8A';
const GRADIENT_COLORS = ['#A3E635', '#FDE047', '#F97316', '#EF4444'] as const;
const CALLOUT_RED = '#EF4444';

type BudgetChartProps = {
  totalBudget: number;
  totalSpent: number;
  over: number;
  fontFamily?: string;
};

export function BudgetChart({ totalBudget, totalSpent, over, fontFamily }: BudgetChartProps) {
  const [layout, setLayout] = useState({ width: 0, height: 0 });
  const w = layout.width;
  const h = layout.height;
  const chartW = Math.max(0, w - PAD * 2);
  const chartH = Math.max(0, h - PAD * 2);

  const paths = useMemo(() => {
    if (chartW <= 0 || chartH <= 0) return null;
    const x0 = PAD;
    const y0 = PAD + chartH;
    const x1 = PAD + chartW;
    const y1 = PAD;
    const baselinePath = Skia.Path.Make();
    baselinePath.moveTo(x0, y0);
    baselinePath.lineTo(x1, y1);

    const progress = totalBudget > 0 ? Math.min(totalSpent / totalBudget, 1.5) : 0;
    const endY = y0 - progress * chartH;
    const pts = [
      { x: x0, y: y0 },
      { x: x0 + chartW * 0.33, y: y0 - chartH * 0.25 },
      { x: x0 + chartW * 0.66, y: y0 - chartH * 0.55 },
      { x: x1, y: endY },
    ];
    const progressPath = Skia.Path.Make();
    progressPath.moveTo(pts[0].x, pts[0].y);
    pts.slice(1).forEach((p) => progressPath.lineTo(p.x, p.y));
    const firstPoint = pts[0];
    const lastPoint = pts[pts.length - 1];
    return { baselinePath, progressPath, firstPoint, lastPoint };
  }, [chartW, chartH, totalBudget, totalSpent]);

  if (!paths) {
    return (
      <View
        style={styles.canvasWrap}
        onLayout={(e) => {
          const { width, height } = e.nativeEvent.layout;
          setLayout({ width, height });
        }}
      />
    );
  }

  const { baselinePath, progressPath, firstPoint, lastPoint } = paths;
  const showCallout = over > 0;

  return (
    <View
      style={styles.canvasWrap}
      onLayout={(e) => {
        const { width, height } = e.nativeEvent.layout;
        setLayout({ width, height });
      }}
    >
      <Canvas style={StyleSheet.absoluteFill}>
        <Path
          path={baselinePath}
          start={0}
          end={1}
          style="stroke"
          strokeWidth={2}
          color={DASHED_COLOR}
        >
          <DashPathEffect intervals={[6, 4]} />
        </Path>
        <Path
          path={progressPath}
          start={0}
          end={1}
          style="stroke"
          strokeWidth={2.5}
          strokeCap="round"
          strokeJoin="round"
        >
          <LinearGradient
            start={{ x: firstPoint.x, y: firstPoint.y }}
            end={{ x: lastPoint.x, y: lastPoint.y }}
            colors={[...GRADIENT_COLORS]}
          />
        </Path>
        <Circle cx={lastPoint.x} cy={lastPoint.y} r={5} color={CALLOUT_RED} />
        <Circle cx={lastPoint.x} cy={lastPoint.y} r={2} color="#1a1a1a" />
      </Canvas>
      {showCallout && (
        <View
          style={[
            styles.callout,
            {
              left: Math.min(lastPoint.x - 36, w - 88),
              top: Math.max(lastPoint.y - 44, 4),
            },
          ]}
          pointerEvents="none"
        >
          <View style={styles.calloutTriangle} />
          <Text style={[styles.calloutText, fontFamily ? { fontFamily } : undefined]}>
            ${Math.round(over).toLocaleString()} over
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  canvasWrap: {
    height: 120,
    width: '100%',
    position: 'relative',
  },
  callout: {
    position: 'absolute',
    backgroundColor: CALLOUT_RED,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    minWidth: 72,
    alignItems: 'center',
  },
  calloutTriangle: {
    position: 'absolute',
    top: -6,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: CALLOUT_RED,
    alignSelf: 'center',
  },
  calloutText: {
    color: '#1a1a1a',
    fontSize: 13,
    fontWeight: '700',
  },
});
