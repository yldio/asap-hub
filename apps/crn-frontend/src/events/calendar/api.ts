import { ListCalendarResponse } from '@asap-hub/model';

import { API_BASE_URL } from '@asap-hub/crn-frontend/src/config';
import {
  createSentryHeaders,
  createFeatureFlagHeaders,
} from '@asap-hub/frontend-utils';

export const getCalendars = async (
  authorization: string,
): Promise<ListCalendarResponse> => {
  const resp = await fetch(`${API_BASE_URL}/calendars`, {
    headers: {
      authorization,
      ...createSentryHeaders(),
      ...createFeatureFlagHeaders(),
    },
  });
  if (!resp.ok) {
    throw new Error(
      `Failed to fetch calendars. Expected status 2xx. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
    );
  }
  return resp.json();
};
