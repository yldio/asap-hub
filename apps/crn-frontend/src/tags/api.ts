import { AlgoliaClient, CRNTagSearchEntities } from '@asap-hub/algolia';
import { GetListOptions } from '@asap-hub/frontend-utils';

export type TagSearchListOptions = Omit<GetListOptions, 'filters'> & {
  tags: string[];
};

export const getTagSearch = <ResponsesKey extends CRNTagSearchEntities>(
  client: AlgoliaClient<'crn'>,
  entityTypes: ResponsesKey[],
  options: TagSearchListOptions,
) =>
  client.search(entityTypes, options.searchQuery, {
    page: options.currentPage ?? 0,
    hitsPerPage: options.pageSize ?? 10,
    facetFilters: options.tags.map((tag) => `_tags:${tag}`),
  });
