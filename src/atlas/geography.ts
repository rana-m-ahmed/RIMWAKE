// Geographic display transform. Longitude zero is texture centre (+Z), east is +X.
export function moonPoint(lat: number, lon: number, radius = 2): [number, number, number] {
  const p = (lat * Math.PI) / 180,
    l = (lon * Math.PI) / 180;
  return [
    radius * Math.cos(p) * Math.sin(l),
    radius * Math.sin(p),
    radius * Math.cos(p) * Math.cos(l),
  ];
}
