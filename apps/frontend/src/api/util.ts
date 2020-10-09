import useFetch, {
  IncomingOptions as UseFetchOptions,
  Interceptors,
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

export const useApiGet = <T>(
  endpoint: string,
  parameters: Record<string, string | string[] | undefined> = {},
  options?: Parameters<typeof useFetchOptions>[0],
) => {
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  Object.entries(parameters).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => url.searchParams.append(key, item));
    } else if (value) {
      url.searchParams.set(key, value);
    }
  });
  return useFetch<T>(url.toString(), useFetchOptions(options), [
    url.toString(),
  ]);
};
