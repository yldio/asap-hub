import { IncomingOptions as UseFetchOptions, Interceptors } from 'use-http';
import { useAuth0 } from '@asap-hub/react-context';
import { API_BASE_URL } from '../config';

export const useFetchOptions = ({
  interceptors: {
    request: overrideRequestInterceptor = ({
      options,
    }: Parameters<Required<Interceptors>['request']>[0]) => options,
    ...interceptors
  } = {},
  headers: overrideHeaders,
  ...overrideOptions
}: UseFetchOptions & RequestInit = {}): UseFetchOptions & RequestInit => {
  const { isAuthenticated, getTokenSilently } = useAuth0();
  const requestInterceptor: Interceptors['request'] = async ({
    options: { headers, ...options },
    ...args
  }) => {
    if (!isAuthenticated) {
      throw new Error('No authorization bearer token available');
    }
    return overrideRequestInterceptor({
      ...args,
      options: {
        ...options,
        headers: {
          authorization: `Bearer ${await getTokenSilently()}`,
          ...headers,
        },
      },
    });
  };

  return {
    ...overrideOptions,
    interceptors: {
      ...interceptors,
      request: requestInterceptor,
    },
    headers: {
      'content-type': 'application/json',
      ...overrideHeaders,
    },
  };
};

export interface BasicOptions {
  searchQuery?: string;
  filters?: string[];
}

export const createApiListUrl = (
  endpoint: string,
  { searchQuery, filters }: BasicOptions,
): URL => {
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  if (searchQuery) {
    url.searchParams.set('search', searchQuery);
  }
  if (filters && filters.length) {
    filters.map((filter) => url.searchParams.append('filter', filter));
  }
  return url;
};
