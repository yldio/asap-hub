import { AlgoliaClient, EntityResponses } from '@asap-hub/algolia';
import { GetListOptions } from '@asap-hub/frontend-utils';

export type TagSearchListOptions = GetListOptions & {
  tags: string[];
};

export const getTagSearch = <ResponsesKey extends keyof EntityResponses['crn']>(
  client: AlgoliaClient<'crn'>,
  entityTypes: ResponsesKey[],
  options: TagSearchListOptions,
) =>
  client.search(entityTypes, options.searchQuery, {
    page: options.currentPage ?? 0,
    hitsPerPage: options.pageSize ?? 10,
    tagFilters: options.tags,
  });
