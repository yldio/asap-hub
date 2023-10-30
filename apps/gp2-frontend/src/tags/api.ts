import { AlgoliaClient } from '@asap-hub/algolia';
import { GetListOptions } from '@asap-hub/frontend-utils';
import { gp2 } from '@asap-hub/model';

export type TagSearchOptions = Omit<GetListOptions, 'filters'> & {
  entityType: Set<gp2.EntityType>;
};

export const getItemTypes = (types: gp2.EntityType[]) => {
  if (types.length === 0) {
    return ['event', 'news', 'output', 'project', 'user'] as gp2.EntityType[];
  }
  return types;
};

export const getTagSearchResults = async (
  client: AlgoliaClient<'gp2'>,
  options: TagSearchOptions,
) =>
  client
    .search(getItemTypes(Array.from(options.entityType)), options.searchQuery, {
      page: options.currentPage ?? 0,
      hitsPerPage: options.pageSize ?? 10,
    })
    .catch((error: Error) => {
      throw new Error(`Could not search: ${error.message}`);
    });
