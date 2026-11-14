// UI projection only. No interpolation or ephemeris calculation. North is -Z, east is +X.
export function direction(az: number, el: number, radius = 2.5): [number, number, number] {
  const a = (az * Math.PI) / 180,
    e = (el * Math.PI) / 180;
  return [
    radius * Math.sin(a) * Math.cos(e),
    radius * Math.sin(e),
    -radius * Math.cos(a) * Math.cos(e),
  ];
}
