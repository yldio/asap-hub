import {
  CRNTagSearchEntities,
  EMPTY_ALGOLIA_RESPONSE,
} from '@asap-hub/algolia';
import { GetListOptions } from '@asap-hub/frontend-utils';
import { TagSearchResponse, ListResponse } from '@asap-hub/model';

import {
  atom,
  atomFamily,
  DefaultValue,
  selectorFamily,
  useRecoilState,
} from 'recoil';

import { useAlgolia } from '../hooks/algolia';
import { getTagSearch, TagSearchListOptions } from './api';

type RefreshTagSearchListOptions = GetListOptions & {
  refreshToken: number;
};

const tagSearchIndexState = atomFamily<
  | {
      ids: ReadonlyArray<string>;
      total: number;
      algoliaQueryId?: string;
      algoliaIndexName?: string;
    }
  | Error
  | undefined,
  RefreshTagSearchListOptions
>({
  key: 'tagSearchIndex',
  default: undefined,
});

export const refreshTagSearchIndex = atom<number>({
  key: 'refreshTagSearchIndex',
  default: 0,
});

export const tagsSearchState = selectorFamily<
  ListResponse<TagSearchResponse> | Error | undefined,
  TagSearchListOptions
>({
  key: 'tagSearch',
  get:
    (options) =>
    ({ get }) => {
      const refreshToken = get(refreshTagSearchIndex);
      const index = get(
        tagSearchIndexState({
          ...options,
          refreshToken,
        }),
      );
      if (index === undefined || index instanceof Error) return index;
      const tagSearchList: TagSearchResponse[] = [];
      for (const id of index.ids) {
        const tagSearch = get(tagSearchListState(id));
        if (tagSearch === undefined) return undefined;
        tagSearchList.push(tagSearch);
      }
      return {
        total: index.total,
        items: tagSearchList,
        algoliaQueryId: index.algoliaQueryId,
        algoliaIndexName: index.algoliaIndexName,
      };
    },
  set:
    (options) =>
    ({ get, set, reset }, tagSearch) => {
      const refreshToken = get(refreshTagSearchIndex);
      const indexStateOptions = { ...options, refreshToken };

      if (tagSearch === undefined || tagSearch instanceof DefaultValue) {
        reset(tagSearchIndexState(indexStateOptions));
      } else if (tagSearch instanceof Error) {
        set(tagSearchIndexState(indexStateOptions), tagSearch);
      } else {
        tagSearch.items.forEach((item) =>
          set(tagSearchListState(item.id), item),
        );
        set(tagSearchIndexState(indexStateOptions), {
          total: tagSearch.total,
          ids: tagSearch.items.map(({ id }) => id),
          algoliaIndexName: tagSearch.algoliaIndexName,
          algoliaQueryId: tagSearch.algoliaQueryId,
        });
      }
    },
});

export const tagSearchState = atomFamily<TagSearchResponse | undefined, string>(
  {
    key: 'tagSearch',
    default: undefined,
  },
);

export const tagSearchListState = atomFamily<
  TagSearchResponse | undefined,
  string
>({
  key: 'tagSearchList',
  default: tagSearchState,
});

export const useTagSearch = <ResponsesKey extends CRNTagSearchEntities>(
  entityTypes: ResponsesKey[],
  options: TagSearchListOptions,
) => {
  const [tagSearch, setTagSearch] = useRecoilState(tagsSearchState(options));
  const { client } = useAlgolia();

  if (tagSearch === undefined) {
    if (
      options.searchQuery === '' &&
      options.filters.size === 0 &&
      (options.tags?.length ?? 0) === 0
    ) {
      return EMPTY_ALGOLIA_RESPONSE;
    }

    throw getTagSearch(client, entityTypes, options)
      .then((data) => ({
        total: data.nbHits,
        items: data.hits,
        algoliaQueryId: data.queryID,
        algoliaIndexName: data.index,
      }))
      .then(setTagSearch)
      .catch(setTagSearch);
  }
  if (tagSearch instanceof Error) {
    throw tagSearch;
  }
  return tagSearch;
};
