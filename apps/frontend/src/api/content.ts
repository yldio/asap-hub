import useFetch from 'use-http';

import { API_BASE_URL } from '../config';
import { useFetchOptions } from './util';

export const useNewsBySlug = (slug: string) =>
  useFetch<ReadonlyArray<object>>(
    `${API_BASE_URL}/content/news/${slug}`,
    useFetchOptions(),
    [slug],
  );
