import { IncomingOptions as UseFetchOptions, Interceptors } from 'use-http';
import { useAuth0 } from '@asap-hub/react-context';

export const useFetchOptions = ({
  interceptors: {
    request: overrideRequestInterceptor = ({
      options,
    }: Parameters<Required<Interceptors>['request']>[0]) => options,
    ...interceptors
  } = {},
  headers: overrideHeaders,
  ...overrideOptions
}: UseFetchOptions = {}): UseFetchOptions => {
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
