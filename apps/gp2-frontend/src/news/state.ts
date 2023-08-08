import { gp2 } from '@asap-hub/model';
import { atomFamily, selectorFamily, useRecoilValue } from 'recoil';
import { GetListOptions } from '@asap-hub/frontend-utils';
import { authorizationState } from '../auth/state';
import { getNews } from './api';

const fetchNewsState = selectorFamily<gp2.ListNewsResponse, GetListOptions>({
  key: 'fetchNews',
  get:
    (options) =>
    async ({ get }) => {
      const authorization = get(authorizationState);
      const newsList = await getNews(options, authorization);

      if (newsList instanceof Error) throw newsList;
      return newsList;
    },
});

const newsState = atomFamily<gp2.ListNewsResponse, GetListOptions>({
  key: 'newsList',
  default: fetchNewsState,
});

export const useNews = (options: GetListOptions) =>
  useRecoilValue(newsState(options));
