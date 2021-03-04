import { API_BASE_URL } from './config';

export type GetListOptions = {
  searchQuery?: string;
  filters?: string[];
  currentPage?: number | null;
  pageSize?: number | null;
  sort?: {
    sortBy: string; // column name ie startDate or endDate
    sortOrder: 'asc' | 'desc';
  };
};

export const createListApiUrl = (
  endpoint: string,
  {
    searchQuery,
    filters = [],
    currentPage = 0,
    pageSize = 10,
    sort,
  }: GetListOptions = {},
): URL => {
  const url = new URL(endpoint, `${API_BASE_URL}/`);
  if (searchQuery) url.searchParams.set('search', searchQuery);
  if (pageSize !== null) {
    url.searchParams.set('take', String(pageSize));
    if (currentPage !== null) {
      url.searchParams.set('skip', String(currentPage * pageSize));
    }
  }
  if (sort) {
    url.searchParams.set('sortBy', sort.sortBy);
    url.searchParams.set('sortOrder', sort.sortOrder);
  }
  filters.forEach((filter) => url.searchParams.append('filter', filter));

  return url;
};
