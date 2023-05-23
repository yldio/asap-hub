import { gp2 as gp2Model } from '@asap-hub/model';

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
    options: gp2Model.FetchExternalUsersOptions,
  ): Promise<gp2Model.ListExternalUserDataObject> {
    const { take = 8, skip = 0 } = options;

    const where = generateFetchQueryFilter(options);
    const { externalUsersCollection } = await this.contentfulClient.request<
      gp2Contentful.FetchExternalUsersQuery,
      gp2Contentful.FetchExternalUsersQueryVariables
    >(
      gp2Contentful.FETCH_EXTERNAL_USERS,
      expect.objectContaining({
        limit: take,
        skip,
        where,
        order: [gp2Contentful.ExternalUsersOrder.NameAsc],
      }),
    );

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
        .map(parseGraphQLExternalUser),
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

export const parseGraphQLExternalUser = (
  item: ExternalUserItem,
): gp2Model.ExternalUserDataObject => ({
  id: item.sys.id,
  orcid: item.orcid || undefined,
  name: item.name || '',
});

const generateFetchQueryFilter = ({
  search,
}: gp2Model.FetchExternalUsersOptions): gp2Contentful.ExternalUsersFilter => {
  const searchFilter = search ? getSearchFilter(search) : {};
  return {
    ...searchFilter,
  };
};

const getSearchFilter = (search: string) => {
  type SearchFields = {
    OR: {
      name_contains: string;
    }[];
  };

  const filter = search
    .split(' ')
    .filter(Boolean) // removes whitespaces
    .reduce<SearchFields[]>(
      (acc, word: string) => [
        ...acc,
        {
          OR: [{ name_contains: word }],
        },
      ],
      [],
    );

  return { AND: [...filter] };
};
