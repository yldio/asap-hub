export const appendSuffix = (val: string, suffix: string): string =>
  suffix ? `${val} ${suffix}` : `${val}`;

export const getUniqueList = (array: string[]): string[] =>
  Array.from(new Set(array.filter((value) => value.trim())));

export const getUniqueCommaString = (array: string[]): string => {
  const [last, ...head] = array.reverse().map((v) => v.trim());

  return array.length > 1
    ? `${head.reverse().join(', ')}, and ${last}`
    : `${last}`;
};

export const getUniqueCommaStringWithSuffix = (
  array: string[],
  suffix: string,
): string =>
  getUniqueCommaString(
    getUniqueList(array).map((s) => `${appendSuffix(s, suffix)}`),
  );
