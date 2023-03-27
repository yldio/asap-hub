import {
  ExternalAuthorCreateDataObject,
  ExternalAuthorDataObject,
  FetchOptions,
  ListExternalAuthorDataObject,
} from '@asap-hub/model';

import {
  addLocaleToFields,
  Environment,
  ExternalAuthorsOrder,
  FETCH_EXTERNAL_AUTHOR_BY_ID,
  FETCH_EXTERNAL_AUTHORS,
  FetchExternalAuthorByIdQuery,
  FetchExternalAuthorByIdQueryVariables,
  FetchExternalAuthorsQuery,
  FetchExternalAuthorsQueryVariables,
  GraphQLClient,
} from '@asap-hub/contentful';

import { ExternalAuthorDataProvider } from '../external-authors.data-provider';

export type ExternalAuthorItem = NonNullable<
  NonNullable<
    FetchExternalAuthorsQuery['externalAuthorsCollection']
  >['items'][number]
>;

export class ExternalAuthorContentfulDataProvider
  implements ExternalAuthorDataProvider
{
  constructor(
    private contentfulClient: GraphQLClient,
    private getRestClient: () => Promise<Environment>,
  ) {}

  async fetch(options: FetchOptions): Promise<ListExternalAuthorDataObject> {
    const { take = 8, skip = 0 } = options;

    const { externalAuthorsCollection } = await this.contentfulClient.request<
      FetchExternalAuthorsQuery,
      FetchExternalAuthorsQueryVariables
    >(FETCH_EXTERNAL_AUTHORS, {
      limit: take,
      skip,
      order: [ExternalAuthorsOrder.NameAsc],
    });

    if (!externalAuthorsCollection?.items) {
      return {
        total: 0,
        items: [],
      };
    }

    return {
      total: externalAuthorsCollection?.total,
      items: externalAuthorsCollection?.items
        .filter((x): x is ExternalAuthorItem => x !== null)
        .map(parseGraphQLExternalAuthor),
    };
  }

  async fetchById(id: string): Promise<ExternalAuthorDataObject | null> {
    const { externalAuthors } = await this.contentfulClient.request<
      FetchExternalAuthorByIdQuery,
      FetchExternalAuthorByIdQueryVariables
    >(FETCH_EXTERNAL_AUTHOR_BY_ID, { id });

    if (!externalAuthors) {
      return null;
    }

    return parseGraphQLExternalAuthor(externalAuthors);
  }

  async create(input: ExternalAuthorCreateDataObject): Promise<string> {
    const environment = await this.getRestClient();

    const payload = {
      ...input,
      orcid: input.orcid ?? undefined,
    };

    const newEntry = await environment.createEntry('externalAuthors', {
      fields: {
        ...addLocaleToFields(payload),
      },
    });

    await newEntry.publish();
    return newEntry.sys.id;
  }
}

export const parseGraphQLExternalAuthor = (
  item: ExternalAuthorItem,
): ExternalAuthorDataObject => ({
  id: item.sys.id,
  orcid: item.orcid || undefined,
  displayName: item.name || '',
});
