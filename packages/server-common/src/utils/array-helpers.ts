/**
 * Returns the first non-null, non-undefined item from a possibly-sparse array,
 * or null if there is none (or the array itself is null/undefined).
 */
export const getFirstValid = <T>(
  items?: ReadonlyArray<T | null | undefined> | null,
): T | null => items?.find((item): item is T => item != null) ?? null;
