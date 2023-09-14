import { gp2 } from '@asap-hub/model';
import {
  atomFamily,
  DefaultValue,
  selectorFamily,
  useRecoilState,
} from 'recoil';
import { getAlgoliaNews, NewsListOptions } from './api';
import { useAlgolia } from '../hooks/algolia';

const newsIndexState = atomFamily<
  | {
      ids: ReadonlyArray<string>;
      total: number;
      algoliaQueryId?: string;
      algoliaIndexName?: string;
    }
  | Error
  | undefined,
  NewsListOptions
>({ key: 'newsIndex', default: undefined });

export const newsState = selectorFamily<
  gp2.ListNewsResponse | Error | undefined,
  NewsListOptions
>({
  key: 'news',
  get:
    (options) =>
    ({ get }) => {
      const index = get(
        newsIndexState({
          ...options,
        }),
      );
      if (index === undefined || index instanceof Error) return index;
      const news: gp2.NewsResponse[] = [];
      for (const id of index.ids) {
        const newsItem = get(newsItemState(id));
        if (newsItem === undefined) return undefined;
        news.push(newsItem);
      }

      return {
        total: index.total,
        items: news,
        algoliaIndexName: index.algoliaIndexName,
        algoliaQueryId: index.algoliaQueryId,
      };
    },
  set:
    (options) =>
    ({ get, set, reset }, news) => {
      const indexStateOptions = { ...options };
      if (news === undefined || news instanceof DefaultValue) {
        const oldNews = get(newsIndexState(indexStateOptions));
        if (!(oldNews instanceof Error)) {
          oldNews?.ids.forEach((id) => reset(newsItemState(id)));
        }
        reset(newsIndexState(indexStateOptions));
      } else if (news instanceof Error) {
        set(newsIndexState(indexStateOptions), news);
      } else {
        news.items.forEach((newsItem) =>
          set(newsItemState(newsItem.id), newsItem),
        );
        set(newsIndexState(indexStateOptions), {
          total: news.total,
          ids: news.items.map(({ id }) => id),
          algoliaIndexName: news.algoliaIndexName,
          algoliaQueryId: news.algoliaQueryId,
        });
      }
    },
});

export const useNews = (options: NewsListOptions) => {
  const [news, setNews] = useRecoilState(newsState(options));
  const { client } = useAlgolia();
  if (news === undefined) {
    throw getAlgoliaNews(client, options)
      .then(
        (data): gp2.ListNewsResponse => ({
          total: data.nbHits,
          items: data.hits,
          algoliaQueryId: data.queryID,
          algoliaIndexName: data.index,
        }),
      )
      .then(setNews)
      .catch(setNews);
  }
  if (news instanceof Error) {
    throw news;
  }
  return news;
};

const newsItemState = atomFamily<gp2.NewsResponse | undefined, string>({
  key: 'newsItem',
  default: undefined,
});
