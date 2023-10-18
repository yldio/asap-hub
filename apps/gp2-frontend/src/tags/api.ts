import { AlgoliaClient } from '@asap-hub/algolia';
import { GetListOptions } from '@asap-hub/frontend-utils';

export type TagSearchOptions = GetListOptions;

export const getTagSearchResults = async (
  client: AlgoliaClient<'gp2'>,
  options: TagSearchOptions,
) =>
  client
    .search(
      ['event', 'news', 'output', 'project', 'user'],
      options.searchQuery,
      {
        page: options.currentPage ?? 0,
        hitsPerPage: options.pageSize ?? 10,
      },
    )
    .catch((error: Error) => {
      throw new Error(`Could not search: ${error.message}`);
    });
