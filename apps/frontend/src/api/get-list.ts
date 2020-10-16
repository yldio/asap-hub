import useFetch, { UseFetchObjectReturn } from 'use-http';

import { API_BASE_URL } from '../config';
import { useFetchOptions } from './util';

export interface GetListOptions {
  searchQuery?: string;
  filters?: string[];
}

export const createListApiUrl = (
  endpoint: string,
  { searchQuery, filters = [] }: GetListOptions = {},
): URL => {
  const url = new URL(endpoint, `${API_BASE_URL}/`);
  if (searchQuery) url.searchParams.set('search', searchQuery);
  filters.forEach((filter) => url.searchParams.append('filter', filter));
  return url;
};

export type ListResult<T> = Omit<UseFetchObjectReturn<T>, 'error'> &
  ({ loading: true; data: T | undefined } | { loading: false; data: T });
export const useGetList = <T>(
  endpoint: string,
  parameters?: GetListOptions,
): ListResult<T> => {
  const url = createListApiUrl(endpoint, parameters).toString();
  const { error, ...result } = useFetch<T>(url, useFetchOptions(), [url]);

  if (error) {
    const { name, message, stack } = error;
    const {
      response: { status, statusText },
    } = result;
    throw Object.assign(
      new Error(
        `Failed to GET '${endpoint}'. Expected status 2xx. Received status ${status} ${statusText}. Original message: ${message}`,
      ),
      { name, stack },
    );
  }

  const { loading, data } = result;
  if (loading) {
    return { ...result, loading };
  }
  /* istanbul ignore else */
  if (data !== undefined) {
    return { ...result, data };
  }
  /* istanbul ignore next */
  throw new Error(
    `Failed to GET '${endpoint}'. Invalid state - neither loading, nor error, nor data.`,
  );
};
