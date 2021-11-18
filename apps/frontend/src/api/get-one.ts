import { UseFetchObjectReturn } from 'use-http';

import { API_BASE_URL } from '../config';
import { useFetchOptions } from './util';
import useSafeFetch from './use-safe-fetch';
import { createSentryHeaders } from '../api-util';

export type OneResult<T> = Omit<UseFetchObjectReturn<T>, 'error'>;
export const useGetOne = <T>(
  endpoint: string,
  { authenticated = true } = {},
): OneResult<T> => {
  const url = new URL(endpoint, `${API_BASE_URL}/`).toString();
  const { error, ...result } = useSafeFetch<T>(
    url,
    useFetchOptions({ authenticated }, { headers: createSentryHeaders() }),
  );
  const {
    response: { status, statusText },
  } = result;
  if (error) {
    const { name, message, stack } = error;
    if (status === 404) {
      return {
        ...result,
        data: undefined,
      };
    }
    throw Object.assign(
      new Error(
        `Failed to GET '${endpoint}'. Expected status 2xx or 404. Received status ${status} ${statusText}. Original message: ${message}`,
      ),
      { name, stack },
    );
  }
  return result;
};
