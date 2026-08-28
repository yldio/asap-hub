// m:ss.cc, the way the transport and the ruler already read, so a creator never
// has to think in milliseconds. Hundredths are optional on the way in, and both
// m:ss and a bare number of seconds are accepted.
const pattern = /^(?:(\d+):)?([0-5]?\d)(?:\.(\d{1,3}))?$/;

export const formatMs = (ms: number): string => {
  const safe = Math.max(0, Math.round(ms));
  const minutes = Math.floor(safe / 60000);
  const seconds = Math.floor(safe / 1000) % 60;
  const hundredths = Math.round((safe % 1000) / 10);
  return `${minutes}:${String(seconds).padStart(2, '0')}.${String(
    hundredths,
  ).padStart(2, '0')}`;
};

export const parseMs = (value: string): number | undefined => {
  const match = pattern.exec(value.trim());
  if (!match) {
    return undefined;
  }
  const [, minutes, seconds, fraction = ''] = match;
  const fractionMs = Number(fraction.padEnd(3, '0') || 0);
  return (
    (minutes ? Number(minutes) * 60000 : 0) +
    Number(seconds) * 1000 +
    fractionMs
  );
};
