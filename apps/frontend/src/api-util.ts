import { API_BASE_URL } from './config';

export type GetListOptions = {
  searchQuery: string;
  filters: Set<string>;
  currentPage: number | null;
  pageSize: number | null;
  teamId?: string;
};

export const createListApiUrl = (
  endpoint: string,
  { searchQuery, filters, currentPage, pageSize }: GetListOptions,
): URL => {
  const url = new URL(endpoint, `${API_BASE_URL}/`);
  if (searchQuery) url.searchParams.set('search', searchQuery);
  if (pageSize !== null) {
    url.searchParams.set('take', String(pageSize));
    if (currentPage !== null) {
      url.searchParams.set('skip', String(currentPage * pageSize));
    }
  }
  filters.forEach((filter) => url.searchParams.append('filter', filter));

  return url;
};
