import { ListNewsResponse, NewsResponse } from '@asap-hub/model';
import { createListApiUrl, GetListOptions } from '@asap-hub/api-util';
import { API_BASE_URL } from '../config';

export const getNews = async (
  options: GetListOptions,
  authorization: string,
): Promise<ListNewsResponse> => {
  const resp = await fetch(createListApiUrl('news', options).toString(), {
    headers: { authorization },
  });
  if (!resp.ok) {
    throw new Error(
      `Failed to fetch the news. Expected status 2xx. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
    );
  }
  return resp.json();
};

export const getNewsById = async (
  id: string,
  authorization: string,
): Promise<NewsResponse | undefined> => {
  const resp = await fetch(`${API_BASE_URL}/news/${id}`, {
    headers: { authorization },
  });
  if (!resp.ok) {
    if (resp.status === 404) {
      return undefined;
    }
    throw new Error(
      `Failed to fetch news with id ${id}. Expected status 2xx or 404. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
    );
  }
  return resp.json();
};
