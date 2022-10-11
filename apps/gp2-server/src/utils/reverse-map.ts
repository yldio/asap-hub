export const reverseMap = <T extends PropertyKey, U extends PropertyKey>(
  map: Record<T, U>,
): Record<U, T> => {
  const reversedKeyValue = Object.entries(map).map(([key, value]) => [
    value,
    key,
  ]);
  return Object.fromEntries(reversedKeyValue);
};
