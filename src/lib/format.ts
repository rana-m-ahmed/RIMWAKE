export const date = (t: string) =>
  new Date(t).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
export const time = (t: string) => t.slice(11, 16);
export const signed = (value: number | null, digits = 3) =>
  value === null ? 'Unavailable' : `${value < 0 ? '−' : '+'}${Math.abs(value).toFixed(digits)}°`;
export const bearing = (value: number | null) =>
  value === null ? 'Unavailable' : `${value.toFixed(3)}°`;
export const shortName = (name: string) => name.split(' · ')[0];
