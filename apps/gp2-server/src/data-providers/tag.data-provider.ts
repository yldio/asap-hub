import {
  addLocaleToFields,
  Environment,
  gp2 as gp2Contentful,
  GraphQLClient,
} from '@asap-hub/contentful';
import { gp2 as gp2Model } from '@asap-hub/model';
import { TagDataProvider } from './types';

type Tags = gp2Contentful.FetchTagsQuery['tagsCollection'];

export type TagItem = NonNullable<NonNullable<Tags>['items'][number]>;

export class TagContentfulDataProvider implements TagDataProvider {
  constructor(
    private graphQLClient: GraphQLClient,
    private getRestClient: () => Promise<Environment>,
  ) {}

  async fetch() {
    const { tagsCollection } = await this.graphQLClient.request<
      gp2Contentful.FetchTagsQuery,
      gp2Contentful.FetchTagsQueryVariables
    >(gp2Contentful.FETCH_TAGS, {
      limit: 300,
      order: [gp2Contentful.TagsOrder.NameAsc],
    });

    if (!tagsCollection?.items) {
      return { total: 0, items: [] };
    }

    return {
      total: tagsCollection.items.length,
      items: tagsCollection.items
        .filter((tag): tag is TagItem => tag !== null)
        .map(parseTag),
    };
  }

  async fetchById(): Promise<null> {
    throw new Error('Method not implemented.');
  }

  async create({ name }: gp2Model.TagCreateDataObject) {
    const environment = await this.getRestClient();
    const entry = await environment.createEntry('tags', {
      fields: addLocaleToFields({
        name,
      }),
    });

    try {
      await entry.publish();
    } catch (err) {
      entry.delete();
      throw err;
    }

    return entry.sys.id;
  }
}

export const parseTag = (tag: TagItem): gp2Model.TagDataObject => ({
  id: tag.sys.id,
  name: tag.name ?? '',
});
