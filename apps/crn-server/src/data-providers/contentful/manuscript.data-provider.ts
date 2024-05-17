import {
  addLocaleToFields,
  Environment,
  FetchManuscriptByIdQuery,
  FetchManuscriptByIdQueryVariables,
  FETCH_MANUSCRIPT_BY_ID,
  getLinkEntities,
  GraphQLClient,
} from '@asap-hub/contentful';
import {
  ListResponse,
  ManuscriptCreateDataObject,
  ManuscriptDataObject,
} from '@asap-hub/model';

import { ManuscriptDataProvider } from '../types';

type ManuscriptItem = NonNullable<FetchManuscriptByIdQuery['manuscripts']>;

export class ManuscriptContentfulDataProvider
  implements ManuscriptDataProvider
{
  constructor(
    private contentfulClient: GraphQLClient,
    private getRestClient: () => Promise<Environment>,
  ) {}

  async fetch(): Promise<ListResponse<ManuscriptDataObject>> {
    throw new Error('Method not implemented.');
  }

  async fetchById(id: string): Promise<ManuscriptDataObject | null> {
    const { manuscripts } = await this.contentfulClient.request<
      FetchManuscriptByIdQuery,
      FetchManuscriptByIdQueryVariables
    >(FETCH_MANUSCRIPT_BY_ID, { id });

    if (!manuscripts) {
      return null;
    }

    return parseGraphQLManuscript(manuscripts);
  }

  async create(input: ManuscriptCreateDataObject): Promise<string> {
    const environment = await this.getRestClient();

    const { teamId, ...plainFields } = input;

    const manuscriptEntry = await environment.createEntry('manuscripts', {
      fields: addLocaleToFields({
        ...plainFields,
        teams: getLinkEntities([teamId]),
      }),
    });

    await manuscriptEntry.publish();

    return manuscriptEntry.sys.id;
  }
}

const parseGraphQLManuscript = (
  manuscripts: ManuscriptItem,
): ManuscriptDataObject => ({
  id: manuscripts.sys.id,
  title: manuscripts.title || '',
  teamId: manuscripts.teamsCollection?.items[0]?.sys.id || '',
});
