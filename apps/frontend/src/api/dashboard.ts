import useFetch from 'use-http';
import { DashboardResponse } from '@asap-hub/model';

import { API_BASE_URL } from '../config';
import { useFetchOptions } from './util';

export const useDashboard = () =>
  useFetch<DashboardResponse>(
    `${API_BASE_URL}/dashboard`,
    useFetchOptions(),
    [],
  );
