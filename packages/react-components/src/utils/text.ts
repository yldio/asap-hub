export const appendSuffix = (val: string, suffix?: string): string =>
  suffix ? `${val} ${suffix}` : `${val}`;

export const getUniqueList = (array: string[]): string[] =>
  Array.from(new Set(array.filter((value) => value.trim())));

export const getUniqueOxfordCommaString = (
  array: string[],
  suffix?: string,
): string => {
  const [last, ...head] = getUniqueList(array)
    .reverse()
    .map((v) => (suffix ? appendSuffix(v, suffix) : v));

  return array.length > 1
    ? `${head?.reverse().join(', ') || ''}, and ${last}`
    : `${last}`;
};
