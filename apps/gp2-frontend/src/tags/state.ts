import { gp2 } from '@asap-hub/model';
import {
  atomFamily,
  DefaultValue,
  selectorFamily,
  useRecoilState,
} from 'recoil';
import { getTagSearchResults, TagSearchOptions } from './api';
import { useAlgolia } from '../hooks/algolia';

const tagSearchResultsIndexState = atomFamily<
  | {
      ids: ReadonlyArray<string>;
      total: number;
      algoliaQueryId?: string;
      algoliaIndexName?: string;
    }
  | Error
  | undefined,
  TagSearchOptions
>({ key: 'tagSearchResultsIndex', default: undefined });

export const tagSearchResultsState = selectorFamily<
  gp2.ListNewsResponse | Error | undefined,
  TagSearchOptions
>({
  key: 'tagSearchResults',
  get:
    (options) =>
    ({ get }) => {
      const index = get(
        tagSearchResultsIndexState({
          ...options,
        }),
      );
      if (index === undefined || index instanceof Error) return index;
      const results: gp2.NewsResponse[] = [];
      for (const id of index.ids) {
        const resultItem = get(tagSearchResultsItemState(id));
        if (resultItem === undefined) return undefined;
        results.push(resultItem);
      }

      return {
        total: index.total,
        items: results,
        algoliaIndexName: index.algoliaIndexName,
        algoliaQueryId: index.algoliaQueryId,
      };
    },
  set:
    (options) =>
    ({ get, set, reset }, results) => {
      const indexStateOptions = { ...options };
      if (results === undefined || results instanceof DefaultValue) {
        const oldResults = get(tagSearchResultsIndexState(indexStateOptions));
        if (!(oldResults instanceof Error)) {
          oldResults?.ids.forEach((id) => reset(tagSearchResultsItemState(id)));
        }
        reset(tagSearchResultsIndexState(indexStateOptions));
      } else if (results instanceof Error) {
        set(tagSearchResultsIndexState(indexStateOptions), results);
      } else {
        results.items.forEach((resultItem) =>
          set(tagSearchResultsItemState(resultItem.id), resultItem),
        );
        set(tagSearchResultsIndexState(indexStateOptions), {
          total: results.total,
          ids: results.items.map(({ id }) => id),
          algoliaIndexName: results.algoliaIndexName,
          algoliaQueryId: results.algoliaQueryId,
        });
      }
    },
});

export const useTagSearchResults = (options: TagSearchOptions) => {
  const [news, setNews] = useRecoilState(tagSearchResultsState(options));
  const { client } = useAlgolia();
  if (news === undefined) {
    throw getTagSearchResults(client, options)
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
  return [];
};

const tagSearchResultsItemState = atomFamily<
  gp2.NewsResponse | undefined,
  string
>({
  key: 'tagSearchResultsItem',
  default: undefined,
});
