import { FetchOptions, gp2 as gp2Model } from '@asap-hub/model';

import {
  addLocaleToFields,
  Environment,
  gp2 as gp2Contentful,
  GraphQLClient,
} from '@asap-hub/contentful';
import { ExternalUserDataProvider } from '../types/external-user.data-provider.type';

export type ExternalUserItem = NonNullable<
  NonNullable<
    gp2Contentful.FetchExternalUsersQuery['externalUsersCollection']
  >['items'][number]
>;

export class ExternalUserContentfulDataProvider
  implements ExternalUserDataProvider
{
  constructor(
    private contentfulClient: GraphQLClient,
    private getRestClient: () => Promise<Environment>,
  ) {}

  async fetch(
    options: FetchOptions,
  ): Promise<gp2Model.ListExternalUserDataObject> {
    const { take = 8, skip = 0 } = options;

    const { externalUsersCollection } = await this.contentfulClient.request<
      gp2Contentful.FetchExternalUsersQuery,
      gp2Contentful.FetchExternalUsersQueryVariables
    >(gp2Contentful.FETCH_EXTERNAL_USERS, {
      limit: take,
      skip,
      order: [gp2Contentful.ExternalUsersOrder.NameAsc],
    });

    if (!externalUsersCollection?.items) {
      return {
        total: 0,
        items: [],
      };
    }

    return {
      total: externalUsersCollection?.total,
      items: externalUsersCollection?.items
        .filter((user): user is ExternalUserItem => user !== null)
        .map(parseGraphQLExternalAuthor),
    };
  }

  async fetchById(): Promise<null> {
    throw new Error('Method not implemented.');
  }
  async create(input: gp2Model.ExternalUserCreateDataObject): Promise<string> {
    const environment = await this.getRestClient();

    const payload = {
      ...input,
      orcid: input.orcid ?? undefined,
    };

    const newEntry = await environment.createEntry('externalUsers', {
      fields: {
        ...addLocaleToFields(payload),
      },
    });

    await newEntry.publish();
    return newEntry.sys.id;
  }
}

export const parseGraphQLExternalAuthor = (
  item: ExternalUserItem,
): gp2Model.ExternalUserDataObject => ({
  id: item.sys.id,
  orcid: item.orcid || undefined,
  name: item.name || '',
});
