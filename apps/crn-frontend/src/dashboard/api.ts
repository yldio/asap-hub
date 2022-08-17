import { createSentryHeaders } from '@asap-hub/frontend-utils';
import { DashboardResponse, ListReminderResponse } from '@asap-hub/model';

import { API_BASE_URL } from '../config';

export const getDashboard = async (
  authorization: string,
): Promise<DashboardResponse> => {
  const resp = await fetch(`${API_BASE_URL}/dashboard`, {
    headers: { authorization, ...createSentryHeaders() },
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
  const resp = await fetch(`${API_BASE_URL}/reminders`, {
    headers: { authorization, ...createSentryHeaders() },
  });
  if (!resp.ok) {
    throw new Error(
      `Failed to fetch reminders. Expected status 2xx. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
    );
  }
  return resp.json();
};
