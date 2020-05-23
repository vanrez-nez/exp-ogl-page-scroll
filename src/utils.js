export function lerp(a, b, t) {
  return (1 - t) * a + t * b;
}

export function clamp(val, min, max) {
  return Math.min(Math.max(min, val), max);
}

export function fixedDecimal(num, precision) {
  const n = Math.pow(10, precision);
  return Math.round(num * n) / n;
}