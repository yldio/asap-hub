import {
  IncomingOptions as UseFetchOptions,
  Interceptors,
  CachePolicies,
} from 'use-http';
import { useAuth0 } from '@asap-hub/react-context';

export const useFetchOptions = (
  { authenticated = true } = {},
  {
    interceptors: {
      request: overrideRequestInterceptor = ({
        options,
      }: Parameters<Required<Interceptors>['request']>[0]) => options,
      ...interceptors
    } = {},
    headers: overrideHeaders,
    ...overrideOptions
  }: UseFetchOptions & RequestInit = {},
): UseFetchOptions & RequestInit => {
  const { isAuthenticated, getIdTokenClaims } = useAuth0();
  const requestInterceptor: Interceptors['request'] = authenticated
    ? async ({ options: { headers, ...options }, ...args }) => {
        if (!isAuthenticated) {
          throw new Error('No authorization bearer token available');
        }

        const claims = await getIdTokenClaims();

        /* eslint-disable no-underscore-dangle */
        return overrideRequestInterceptor({
          ...args,
          options: {
            ...options,
            headers: {
              authorization: `Bearer ${claims.__raw}`,
              ...headers,
            },
          },
        });
      }
    : overrideRequestInterceptor;

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
