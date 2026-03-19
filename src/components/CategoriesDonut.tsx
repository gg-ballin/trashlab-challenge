import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Canvas, Path, Skia } from '@shopify/react-native-skia';
import type { SkPath } from '@shopify/react-native-skia';
import { useSharedValue, useDerivedValue, withTiming } from 'react-native-reanimated';

const TOP_ANGLE_DEG = -90;
const FILL_FRACTION = 0.9;

export type DonutSegment = { color: string; value: number };

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = (deg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function makeSegmentPath(
  skia: typeof Skia,
  cx: number,
  cy: number,
  rOut: number,
  rIn: number,
  startDeg: number,
  sweepDeg: number
): SkPath {
  const path = skia.Path.Make();
  const outerRect = skia.XYWHRect(cx - rOut, cy - rOut, rOut * 2, rOut * 2);
  const innerRect = skia.XYWHRect(cx - rIn, cy - rIn, rIn * 2, rIn * 2);
  const startOut = polar(cx, cy, rOut, startDeg);
  path.moveTo(startOut.x, startOut.y);
  path.arcToOval(outerRect, startDeg, sweepDeg, false);
  const endIn = polar(cx, cy, rIn, startDeg + sweepDeg);
  path.lineTo(endIn.x, endIn.y);
  path.arcToOval(innerRect, startDeg + sweepDeg, -sweepDeg, false);
  path.close();
  return path;
}

function AnimatedSegment({
  path,
  color,
  cumulativeStart,
  fraction,
  progress,
}: {
  path: SkPath;
  color: string;
  cumulativeStart: number;
  fraction: number;
  progress: ReturnType<typeof useSharedValue<number>>;
}) {
  const end = useDerivedValue(() => {
    'worklet';
    const p = progress.value;
    if (p <= cumulativeStart) return 0;
    if (p >= cumulativeStart + fraction) return 1;
    return (p - cumulativeStart) / fraction;
  }, [progress, cumulativeStart, fraction]);
  return <Path path={path} start={0} end={end} color={color} />;
}

type CategoriesDonutProps = {
  segments: DonutSegment[];
  size?: number;
};

export function CategoriesDonut({ segments, size = 56 }: CategoriesDonutProps) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(1, { duration: 700 });
  }, [progress]);

  const total = useMemo(
    () => segments.reduce((s, seg) => s + seg.value, 0) || 1,
    [segments]
  );
  const fractions = useMemo(
    () => segments.map((seg) => seg.value / total),
    [segments, total]
  );
  const cumulative = useMemo(() => {
    const c: number[] = [];
    let acc = 0;
    fractions.forEach((f) => {
      c.push(acc);
      acc += f;
    });
    return c;
  }, [fractions]);

  const fullSweepDeg = 360 * FILL_FRACTION;
  const cx = size / 2;
  const cy = size / 2;
  const rOut = size / 2 - 2;
  const rIn = rOut * 0.45;

  const segmentPaths = useMemo(() => {
    return segments.map((_, i) => {
      const startDeg = TOP_ANGLE_DEG + cumulative[i] * fullSweepDeg;
      const sweepDeg = fractions[i] * fullSweepDeg;
      return makeSegmentPath(Skia, cx, cy, rOut, rIn, startDeg, sweepDeg);
    });
  }, [segments, cumulative, fractions, cx, cy, rOut, rIn, fullSweepDeg]);

  if (segments.length === 0) {
    return <View style={[styles.wrap, { width: size, height: size }]} />;
  }

  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      <Canvas style={StyleSheet.absoluteFill}>
        {segmentPaths.map((path, i) => (
          <AnimatedSegment
            key={i}
            path={path}
            color={segments[i].color}
            cumulativeStart={cumulative[i]}
            fraction={fractions[i]}
            progress={progress}
          />
        ))}
      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'relative' },
});
