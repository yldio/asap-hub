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
