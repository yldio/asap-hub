import useFetch from 'use-http';

import { API_BASE_URL } from '../config';
import { useFetchOptions } from './util';

export const usePagesByPath = (path: string) =>
  useFetch<object>(`${API_BASE_URL}/pages${path}`, useFetchOptions(), [path]);
