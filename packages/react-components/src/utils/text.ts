export const appendSuffix = (val: string, suffix: string): string =>
  suffix ? `${val} ${suffix}` : `${val}`;

export const getUniqueList = (array: string[]): string[] =>
  Array.from(new Set(array.filter((value) => value.trim())));

export const getUniqueCommaString = (array: string[]): string => {
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
  getUniqueCommaString(
    getUniqueList(array).map((s) => `${appendSuffix(s, suffix)}`),
  );
