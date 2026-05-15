export const buildAlgoliaFilters = (
  filterName: string,
  filterValues?: readonly string[] | undefined,
): string | undefined =>
  filterValues?.length
    ? filterValues.map((value) => `${filterName}:"${value}"`).join(' OR ')
    : undefined;
