import useFetch, {
  IncomingOptions as UseFetchOptions,
  Interceptors,
  CachePolicies,
} from 'use-http';
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
    cachePolicy:
      process.env.NODE_ENV === 'production'
        ? CachePolicies.CACHE_FIRST
        : CachePolicies.NO_CACHE,
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

export interface GetListOptions {
  searchQuery?: string;
  filters?: string[];
  currentPage?: number;
  pageSize?: number;
}

export const createListApiUrl = (
  endpoint: string,
  {
    searchQuery,
    filters = [],
    currentPage = 0,
    pageSize = 10,
  }: GetListOptions = {},
): URL => {
  const url = new URL(endpoint, `${API_BASE_URL}/`);

  if (searchQuery) url.searchParams.set('search', searchQuery);
  filters.forEach((filter) => url.searchParams.append('filter', filter));

  url.searchParams.set('take', String(pageSize));
  url.searchParams.set('skip', String(currentPage * pageSize));

  return url;
};

export const useGetList = <T>(
  endpoint: string,
  parameters?: GetListOptions,
) => {
  const url = createListApiUrl(endpoint, parameters).toString();
  return useFetch<T>(url, useFetchOptions(), [url]);
};
