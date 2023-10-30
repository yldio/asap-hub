import { AlgoliaClient } from '@asap-hub/algolia';
import { GetListOptions } from '@asap-hub/frontend-utils';
import { EntityType } from '@asap-hub/model/build/gp2';

export type TagSearchOptions = Omit<GetListOptions, 'filters'> & {
  entityType: Set<EntityType>;
};

export const getItemTypes = (types: EntityType[]) => {
  if (types.length === 0) {
    return ['event', 'news', 'output', 'project', 'user'] as EntityType[];
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
