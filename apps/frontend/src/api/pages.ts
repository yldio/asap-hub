import useFetch from 'use-http';
import { PageResponse } from '@asap-hub/model';

import { API_BASE_URL } from '../config';
import { useFetchOptions } from './util';

export const usePagesByPath = (path: string) =>
  useFetch<PageResponse>(`${API_BASE_URL}/pages${path}`, useFetchOptions(), [
    path,
  ]);
