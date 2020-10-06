import useFetch from 'use-http';
import { ListNewsAndEventsResponse } from '@asap-hub/model';

import { API_BASE_URL } from '../config';
import { useFetchOptions } from './util';

export const useNewsAndEvents = () =>
  useFetch<ListNewsAndEventsResponse>(
    `${API_BASE_URL}/news-and-events`,
    useFetchOptions(),
    [],
  );
