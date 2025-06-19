import { createSentryHeaders } from '@asap-hub/frontend-utils';
import { FetchOptions, ListImpactsResponse } from '@asap-hub/model';
import qs from 'qs';

import { API_BASE_URL } from '../config';

export const getImpacts = async (
  options: FetchOptions,
  authorization: string,
): Promise<ListImpactsResponse> => {
  const query = qs.stringify(options);

  const resp = await fetch(`${API_BASE_URL}/impact?${query}`, {
    headers: { authorization, ...createSentryHeaders() },
  });
  if (!resp.ok) {
    throw new Error(
      `Failed to fetch the impacts. Expected status 2xx. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
    );
  }
  return resp.json();
};
