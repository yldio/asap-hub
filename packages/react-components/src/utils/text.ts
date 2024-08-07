export const getCounterString = (count: number, term: string): string => {
  const int = Number(count.toFixed());
  return appendSuffix(int, int === 1 ? term : `${term}s`);
};

export const appendSuffix = (val: string | number, suffix: string): string =>
  `${val} ${suffix}`;

export const getUniqueList = (array: string[]): string[] =>
  Array.from(new Set(array.filter((value) => value.trim())));

export const getCommaAndString = (array: string[]): string => {
  const [last, ...head] = array.reverse().map((v) => v.trim());

  switch (array.length) {
    case 0: {
      return '';
    }
    case 1: {
      return `${last}`;
    }
    default: {
      return `${head.reverse().join(', ')} and ${last}`;
    }
  }
};

export const getUniqueCommaStringWithSuffix = (
  array: string[],
  suffix: string,
): string =>
  getCommaAndString(getUniqueList(array).map((s) => appendSuffix(s, suffix)));

export const titleCase = (string: string): string =>
  string.replace(
    /\w\S*/g,
    (str) => `${str.charAt(0).toUpperCase()}${str.substr(1).toLowerCase()}`,
  );
