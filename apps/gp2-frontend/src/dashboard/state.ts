import { gp2 } from '@asap-hub/model';
import { atom, selector, useRecoilValue } from 'recoil';
import { authorizationState } from '../auth/state';
import { getNews } from './api';

const fetchNewsState = selector<gp2.ListNewsResponse>({
  key: 'fetchNewsState',
  get: ({ get }) => getNews(get(authorizationState)),
});

const newsState = atom<gp2.ListNewsResponse>({
  key: 'news',
  default: fetchNewsState,
});

export const useNews = () => useRecoilValue(newsState);
