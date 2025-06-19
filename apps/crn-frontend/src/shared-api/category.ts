import { createSentryHeaders } from '@asap-hub/frontend-utils';
import { FetchOptions, ListCategoriesResponse } from '@asap-hub/model';
import qs from 'qs';

import { API_BASE_URL } from '../config';

export const getCategories = async (
  options: FetchOptions,
  authorization: string,
): Promise<ListCategoriesResponse> => {
  const query = qs.stringify(options);

  const resp = await fetch(`${API_BASE_URL}/categories?${query}`, {
    headers: { authorization, ...createSentryHeaders() },
  });
  if (!resp.ok) {
    throw new Error(
      `Failed to fetch the categories. Expected status 2xx. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
    );
  }
  return resp.json();
};
