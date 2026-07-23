/**
 * Recursively maps a value to its query-key-safe shape:
 * - `Set<U>` becomes a (sorted) `U[]`
 * - arrays and plain objects are mapped recursively
 * - everything else is left as-is
 */
export type Normalized<T> = T extends Set<infer U>
  ? Array<Normalized<U>>
  : T extends ReadonlyArray<infer U>
    ? Array<Normalized<U>>
    : T extends object
      ? { [K in keyof T]: Normalized<T[K]> }
      : T;

const compareNormalized = (a: unknown, b: unknown): number => {
  const left = typeof a === 'string' ? a : JSON.stringify(a) ?? '';
  const right = typeof b === 'string' ? b : JSON.stringify(b) ?? '';
  if (left < right) return -1;
  if (left > right) return 1;
  return 0;
};

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' &&
  value !== null &&
  (Object.getPrototypeOf(value) === Object.prototype ||
    Object.getPrototypeOf(value) === null);

const normalizeValue = (value: unknown): unknown => {
  if (value instanceof Set) {
    return [...value]
      .filter((entry) => entry !== undefined)
      .map(normalizeValue)
      .sort(compareNormalized);
  }
  if (Array.isArray(value)) {
    return value.map(normalizeValue);
  }
  if (isPlainObject(value)) {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => [key, normalizeValue(value[key])] as const)
        .filter(([, entry]) => entry !== undefined),
    );
  }
  return value;
};

/**
 * Normalizes an options object (e.g. `GetListOptions`) so it can be used
 * inside a React Query key. Query keys are hashed with a stable
 * `JSON.stringify`, but `Set`s serialize to `{}` — this converts them to
 * sorted arrays, drops `undefined` entries, and sorts object keys so that
 * equivalent options always produce the same key.
 */
export const normalizeListOptions = <T extends object>(
  options: T,
): Normalized<T> => normalizeValue(options) as Normalized<T>;
