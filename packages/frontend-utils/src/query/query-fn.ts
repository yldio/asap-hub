// Errors re-throw to the error boundary; non-Error rejections become the
// fallback so the page keeps rendering.
export const withEmptyListFallback = async <T>(
  fetch: () => Promise<T>,
  empty: T,
): Promise<T> => {
  try {
    return await fetch();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    return empty;
  }
};

// A queryFn must not return undefined — cache null instead and let the
// consumer map it back.
export const nullOnUndefined = async <T>(
  fetch: () => Promise<T | undefined>,
): Promise<T | null> => (await fetch()) ?? null;
