const reducer =
  <T, K>(fn: (item: NonNullable<T>) => K) =>
  (acc: K[], item: T) => {
    if (!item) {
      return acc;
    }
    return [...acc, fn(item)];
  };

export default reducer;
