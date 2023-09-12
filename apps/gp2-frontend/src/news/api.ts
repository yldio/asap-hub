import { gp2 } from '@asap-hub/model';
import { AlgoliaClient } from '@asap-hub/algolia';
import { GetListOptions, createSentryHeaders } from '@asap-hub/frontend-utils';
import { API_BASE_URL } from '../config';
import createListApiUrl from '../CreateListApiUrl';

export const getNews = async (
  options: GetListOptions,
  authorization: string,
): Promise<gp2.ListNewsResponse> => {
  const resp = await fetch(createListApiUrl('news', options), {
    headers: { authorization, ...createSentryHeaders() },
  });
  if (!resp.ok) {
    throw new Error(
      `Failed to fetch the news. Expected status 2xx. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
    );
  }
  return resp.json();
};

export type NewsListOptions = GetListOptions;
export const getAlgoliaNews = async (
  client: AlgoliaClient<'gp2'>,
  options: NewsListOptions,
) =>
  client
    .search(['news'], options.searchQuery, {
      page: options.currentPage ?? 0,
      hitsPerPage: options.pageSize ?? 10,
    })
    .catch((error: Error) => {
      throw new Error(`Could not search: ${error.message}`);
    });

export const getNewsById = async (
  id: string,
  authorization: string,
): Promise<gp2.NewsResponse | undefined> => {
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
