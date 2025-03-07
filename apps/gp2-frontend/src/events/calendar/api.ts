import { gp2 } from '@asap-hub/model';
import { createSentryHeaders } from '@asap-hub/frontend-utils';

import { API_BASE_URL } from '../../config';

export const getCalendars = async (
  authorization: string,
): Promise<gp2.ListCalendarResponse> => {
  const resp = await fetch(`${API_BASE_URL}/calendars`, {
    headers: { authorization, ...createSentryHeaders() },
  });
  if (!resp.ok) {
    throw new Error(
      `Failed to fetch calendars. Expected status 2xx. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
    );
  }
  return resp.json();
};
