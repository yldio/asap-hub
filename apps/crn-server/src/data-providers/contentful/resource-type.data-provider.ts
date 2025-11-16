import {
  FetchResourceTypesOptions,
  ListResourceTypeDataObject,
  ResourceTypeDataObject,
} from '@asap-hub/model';
import {
  GraphQLClient,
  FETCH_RESOURCE_TYPES,
  ResourceTypeOrder,
} from '@asap-hub/contentful';
import { ResourceTypeDataProvider } from '../types';

type ResourceTypeItem = {
  sys: { id: string };
  name: string | null;
};

export class ResourceTypeContentfulDataProvider
  implements ResourceTypeDataProvider
{
  constructor(private contentfulClient: GraphQLClient) {}

  async fetch(
    options: FetchResourceTypesOptions,
  ): Promise<ListResourceTypeDataObject> {
    const { take = 100, skip = 0 } = options;

    const response = await this.contentfulClient.request<{
      resourceTypeCollection: {
        total: number;
        items: (ResourceTypeItem | null)[];
      } | null;
    }>(FETCH_RESOURCE_TYPES, {
      limit: take,
      skip,
      order: [ResourceTypeOrder.NameAsc],
    });

    const { resourceTypeCollection } = response;

    return {
      total: resourceTypeCollection?.total || 0,
      items:
        resourceTypeCollection?.items
          ?.filter((item): item is ResourceTypeItem => item !== null)
          .map(parseResourceType) || [],
    };
  }
}

export const parseResourceType = (
  item: ResourceTypeItem,
): ResourceTypeDataObject => ({
  id: item.sys.id,
  name: item.name || '',
});
