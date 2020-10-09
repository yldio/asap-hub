import useFetch from 'use-http';
import { API_BASE_URL } from '../config';
import { useFetchOptions } from './util';

export interface BasicOptions {
  searchQuery?: string;
  filters?: string[];
}

export const useApiGet = <T>(
  endpoint: string,
  parameters: Record<string, string | string[] | undefined> = {},
  options?: Parameters<typeof useFetchOptions>[0],
) => {
  const url = new URL(endpoint, `${API_BASE_URL}/`);
  Object.entries(parameters).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => url.searchParams.append(key, item));
    } else if (typeof value === 'string') {
      url.searchParams.set(key, value);
    }
  });
  return useFetch<T>(url.toString(), useFetchOptions(options), [
    url.toString(),
  ]);
};
