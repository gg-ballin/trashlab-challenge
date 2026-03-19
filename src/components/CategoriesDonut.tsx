import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Canvas, Path, Skia } from '@shopify/react-native-skia';
import type { SkPath } from '@shopify/react-native-skia';
import { useSharedValue, useDerivedValue, withTiming } from 'react-native-reanimated';

const TOP_ANGLE_DEG = -90;
const FILL_FRACTION = 0.9;

export type DonutSegment = { color: string; value: number };

/** Creates an arc path (centerline only) for stroked ring segment. Starts at top, sweep in degrees. */
function makeArcPath(
  skia: typeof Skia,
  cx: number,
  cy: number,
  r: number,
  startDeg: number,
  sweepDeg: number
): SkPath {
  const path = skia.Path.Make();
  const rect = skia.XYWHRect(cx - r, cy - r, r * 2, r * 2);
  path.addArc(rect, startDeg, sweepDeg);
  return path;
}

function AnimatedSegment({
  path,
  color,
  cumulativeStart,
  fraction,
  progress,
  strokeWidth,
}: {
  path: SkPath;
  color: string;
  cumulativeStart: number;
  fraction: number;
  progress: ReturnType<typeof useSharedValue<number>>;
  strokeWidth: number;
}) {
  const end = useDerivedValue(() => {
    'worklet';
    const p = progress.value;
    if (p <= cumulativeStart) return 0;
    if (p >= cumulativeStart + fraction) return 1;
    return (p - cumulativeStart) / fraction;
  }, [progress, cumulativeStart, fraction]);
  return (
    <Path
      path={path}
      start={0}
      end={end}
      color={color}
      style="stroke"
      strokeWidth={strokeWidth}
      strokeCap="round"
    />
  );
}

const TRACK_COLOR = '#4E6B8A';

type CategoriesDonutProps = {
  segments: DonutSegment[];
  size?: number;
  /** When this value changes, the donut animation re-runs (e.g. pass focusKey from pager so it animates on every visit). */
  triggerKey?: number;
};

export function CategoriesDonut({ segments, size = 56, triggerKey = 0 }: CategoriesDonutProps) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = 0;
    progress.value = withTiming(1, { duration: 700 });
  }, [progress, triggerKey]);

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
  const rIn = Math.max(2, rOut * 0.45);
  const rMid = (rOut + rIn) / 2;
  const strokeWidth = rOut - rIn;

  const trackPath = useMemo(() => {
    return makeArcPath(Skia, cx, cy, rMid, TOP_ANGLE_DEG, fullSweepDeg);
  }, [cx, cy, rMid, fullSweepDeg]);

  const segmentPaths = useMemo(() => {
    return segments.map((_, i) => {
      const startDeg = TOP_ANGLE_DEG + cumulative[i] * fullSweepDeg;
      const sweepDeg = fractions[i] * fullSweepDeg;
      return makeArcPath(Skia, cx, cy, rMid, startDeg, sweepDeg);
    });
  }, [segments, cumulative, fractions, cx, cy, rMid, fullSweepDeg]);

  if (segments.length === 0) {
    return <View style={[styles.wrap, { width: size, height: size }]} />;
  }

  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      <Canvas style={StyleSheet.absoluteFill}>
        {/* Full ring track (muted) so the donut outline is always visible */}
        <Path
          path={trackPath}
          start={0}
          end={1}
          color={TRACK_COLOR}
          style="stroke"
          strokeWidth={strokeWidth}
          strokeCap="round"
        />
        {segmentPaths.map((path, i) => (
          <AnimatedSegment
            key={i}
            path={path}
            color={segments[i].color}
            cumulativeStart={cumulative[i]}
            fraction={fractions[i]}
            progress={progress}
            strokeWidth={strokeWidth}
          />
        ))}
      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'relative' },
});
