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
  gp2.ListEntityResponse | Error | undefined,
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
      const results: gp2.EntityResponse[] = [];
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
  const [results, setResults] = useRecoilState(tagSearchResultsState(options));
  const { client } = useAlgolia();
  if (options.tags.length === 0)
    return {
      total: 0,
      items: [],
      algoliaQueryId: '',
      algoliaIndexName: '',
    };
  if (results === undefined) {
    throw getTagSearchResults(client, options)
      .then(
        (data): gp2.ListEntityResponse => ({
          total: data.nbHits,
          items: data.hits,
          algoliaQueryId: data.queryID,
          algoliaIndexName: data.index,
        }),
      )
      .then(setResults)
      .catch(setResults);
  }
  if (results instanceof Error) {
    throw results;
  }
  return results;
};

const tagSearchResultsItemState = atomFamily<
  gp2.EntityResponse | undefined,
  string
>({
  key: 'tagSearchResultsItem',
  default: undefined,
});
