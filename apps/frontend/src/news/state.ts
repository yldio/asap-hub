import { ListNewsResponse, NewsResponse } from '@asap-hub/model';
import {
  atomFamily,
  DefaultValue,
  selectorFamily,
  useRecoilState,
  useRecoilValue,
} from 'recoil';
import { GetListOptions } from '../api-util';
import { authorizationState } from '../auth/state';
import { getNews, getNewsById } from './api';

const newsIndexState = atomFamily<
  { ids: ReadonlyArray<string>; total: number } | Error | undefined,
  GetListOptions
>({
  key: 'newsIndex',
  default: undefined,
});

export const refreshNewsItemState = atomFamily<number, string>({
  key: 'refreshNewsItem',
  default: 0,
});

export const fetchNewsItemState = selectorFamily<
  NewsResponse | undefined,
  string
>({
  key: 'fetchNewsItem',
  get:
    (id) =>
    async ({ get }) => {
      get(refreshNewsItemState(id));
      const authorization = get(authorizationState);
      return getNewsById(id, authorization);
    },
});

const newsItemState = atomFamily<NewsResponse | undefined, string>({
  key: 'newsItem',
  default: fetchNewsItemState,
});

const newsListState = selectorFamily<
  ListNewsResponse | Error | undefined,
  GetListOptions
>({
  key: 'newsList',
  get:
    (options) =>
    ({ get }) => {
      const index = get(newsIndexState(options));
      if (index === undefined || index instanceof Error) return index;
      const newsList = index.ids.reduce((acc: NewsResponse[], id) => {
        const newsItem = get(newsItemState(id));
        if (newsItem === undefined) {
          return acc;
        }
        return [...acc, newsItem];
      }, []);
      return { total: index.total, items: newsList };
    },
  set:
    (options) =>
    ({ get, set, reset }, updatedNews) => {
      if (updatedNews === undefined || updatedNews instanceof DefaultValue) {
        const oldNews = get(newsIndexState(options));
        if (!(oldNews instanceof Error)) {
          oldNews?.ids?.forEach((id) => reset(newsItemState(id)));
        }
        reset(newsIndexState(options));
      } else if (updatedNews instanceof Error) {
        set(newsIndexState(options), updatedNews);
      } else {
        updatedNews?.items.forEach((news) => set(newsItemState(news.id), news));
        set(newsIndexState(options), {
          total: updatedNews.total,
          ids: updatedNews.items.map((news) => news.id),
        });
      }
    },
});

export const useNews = (options: GetListOptions) => {
  const authorization = useRecoilValue(authorizationState);
  const [newsList, setNewsList] = useRecoilState(newsListState(options));
  if (newsList === undefined) {
    throw getNews(options, authorization).then(setNewsList).catch(setNewsList);
  }
  if (newsList instanceof Error) throw newsList;
  return newsList;
};

export const useNewsById = (id: string) => useRecoilValue(newsItemState(id));
