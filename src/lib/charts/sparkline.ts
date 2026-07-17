/** Builds an SVG path `d` string plotting `points` across a `width`×`height` viewport. */
export function buildSparklinePath(
  points: readonly number[],
  width: number,
  height: number,
): string {
  if (points.length === 0) return "";
  const max = Math.max(...points, 1);
  const step = points.length > 1 ? width / (points.length - 1) : 0;

  return points
    .map((point, i) => {
      const x = i * step;
      const y = height - (point / max) * height;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

/** Same path, closed into a filled area shape (path + drop to baseline + back to start). */
export function buildSparklineAreaPath(
  points: readonly number[],
  width: number,
  height: number,
): string {
  const linePath = buildSparklinePath(points, width, height);
  if (!linePath) return "";
  return `${linePath} L${width},${height} L0,${height} Z`;
}
