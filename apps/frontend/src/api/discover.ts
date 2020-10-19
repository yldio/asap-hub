import useFetch from 'use-http';
import { DiscoverResponse } from '@asap-hub/model';

import { API_BASE_URL } from '../config';
import { useFetchOptions } from './util';

export const useDiscover = () =>
  useFetch<DiscoverResponse>(`${API_BASE_URL}/discover`, useFetchOptions(), []);
