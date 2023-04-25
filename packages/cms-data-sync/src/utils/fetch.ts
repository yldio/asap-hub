type FetchFunction<T> = (
  take: number,
  skip: number,
) => Promise<{ total: number; items: T[] | null } | null>;

export async function paginatedFetch<T>(
  fetchFn: FetchFunction<T>,
  skip: number = 0,
): Promise<T[]> {
  const PAGE_SIZE = 100;
  const result = await fetchFn(PAGE_SIZE, skip);
  if (!result || !result.items) {
    return [];
  }
  if (result.total > skip + result.items.length) {
    const nextPage = await paginatedFetch(fetchFn, skip + PAGE_SIZE);
    return [...(result.items || []), ...nextPage];
  }
  return result.items || [];
}
