import { createSentryHeaders } from '@asap-hub/frontend-utils';
import { gp2 } from '@asap-hub/model';
import { API_BASE_URL } from '../config';

export const getNews = async (
  authorization: string,
): Promise<gp2.ListNewsResponse> => {
  const resp = await fetch(`${API_BASE_URL}/news`, {
    headers: { authorization, ...createSentryHeaders() },
  });
  if (!resp.ok) {
    throw new Error(
      `Failed to fetch the News. Expected status 2xx. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
    );
  }
  return resp.json();
};

export const getDashboardStats = async (
  authorization: string,
): Promise<gp2.ListDashboardResponse> => {
  const response = await fetch(`${API_BASE_URL}/dashboard`, {
    headers: { authorization, ...createSentryHeaders() },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch the Dashboard Stats. Expected status 2xx. Received status ${`${response.status} ${response.statusText}`.trim()}.`,
    );
  }

  return response.json();
};
