import { createSentryHeaders } from '@asap-hub/frontend-utils';
import { DashboardResponse, ListReminderResponse } from '@asap-hub/model';

import { API_BASE_URL } from '../config';

export const getDashboard = async (
  authorization: string,
): Promise<DashboardResponse> => {
  const resp = await fetch(`${API_BASE_URL}/dashboard`, {
    headers: {
      authorization,
      ...createSentryHeaders(),
    },
  });
  if (!resp.ok) {
    throw new Error(
      `Failed to fetch the dashboard. Expected status 2xx. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
    );
  }
  return resp.json();
};

export const getReminders = async (
  authorization: string,
): Promise<ListReminderResponse> => {
  const timezone =
    Intl.DateTimeFormat().resolvedOptions().timeZone || getTimezone(new Date());
  const resp = await fetch(
    `${API_BASE_URL}/reminders?${new URLSearchParams({
      timezone,
    })}`,
    {
      headers: {
        authorization,
        ...createSentryHeaders(),
      },
    },
  );
  if (!resp.ok) {
    throw new Error(
      `Failed to fetch reminders. Expected status 2xx. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
    );
  }
  return resp.json();
};

export const getTimezone = (date: Date) => {
  const offset = date.getTimezoneOffset();
  // The number of minutes returned by getTimezoneOffset() is positive if the local time zone is behind UTC,
  // and negative if the local time zone is ahead of UTC. For example, for UTC+10, -600 will be returned.
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getTimezoneOffset#negative_values_and_positive_values

  if (offset > 0) {
    return `UTC-${offset / 60}`;
  }

  if (offset < 0) {
    return `UTC+${offset / -60}`;
  }

  return 'UTC';
};
