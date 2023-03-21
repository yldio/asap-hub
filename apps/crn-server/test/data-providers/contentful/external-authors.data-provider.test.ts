import {
  Environment,
  getContentfulGraphqlClientMockServer,
} from '@asap-hub/contentful';
import { ExternalAuthorContentfulDataProvider } from '../../../src/data-providers/contentful/external-authors.data-provider';
import {
  getContentfulGraphqlExternalAuthorsResponse,
  getContentfulGraphqlExternalAuthor,
  getExternalAuthorResponse,
} from '../../fixtures/external-authors.fixtures';
import { getContentfulGraphqlClientMock } from '../../mocks/contentful-graphql-client.mock';
import { getContentfulEnvironmentMock } from '../../mocks/contentful-rest-client.mock';

describe('External Authors Contentful Data Provider', () => {
  const contentfulGraphqlClientMock = getContentfulGraphqlClientMock();
  const environmentMock = getContentfulEnvironmentMock();
  const contentfulRestClientMock: () => Promise<Environment> = () =>
    Promise.resolve(environmentMock);

  const externalAuthorsDataProvider = new ExternalAuthorContentfulDataProvider(
    contentfulGraphqlClientMock,
    contentfulRestClientMock,
  );

  const contentfulGraphqlClientMockServer =
    getContentfulGraphqlClientMockServer({
      ExternalAuthors: () => getContentfulGraphqlExternalAuthor(),
    });

  const externalAuthorsDataProviderMockGraphql =
    new ExternalAuthorContentfulDataProvider(
      contentfulGraphqlClientMockServer,
      contentfulRestClientMock,
    );

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Fetch method', () => {
    test('Should fetch the list of external authors from Contentful Graphql', async () => {
      const result = await externalAuthorsDataProviderMockGraphql.fetch({});

      expect(result).toMatchObject({
        total: 1,
        items: [getExternalAuthorResponse()],
      });
    });

    test('Should return an empty result when no external authors are found', async () => {
      const contentfulGraphqlResponse =
        getContentfulGraphqlExternalAuthorsResponse();
      contentfulGraphqlResponse.externalAuthorsCollection!.total = 0;
      contentfulGraphqlResponse.externalAuthorsCollection!.items = [];
      contentfulGraphqlClientMock.request.mockResolvedValueOnce(
        contentfulGraphqlResponse,
      );

      const result = await externalAuthorsDataProvider.fetch({});

      expect(result).toEqual({
        items: [],
        total: 0,
      });
    });

    test('Should return an empty result when the client returns a response with query property set to null', async () => {
      const contentfulGraphqlResponse =
        getContentfulGraphqlExternalAuthorsResponse();
      contentfulGraphqlResponse.externalAuthorsCollection = null;
      contentfulGraphqlClientMock.request.mockResolvedValueOnce(
        contentfulGraphqlResponse,
      );

      const result = await externalAuthorsDataProvider.fetch({});

      expect(result).toEqual({
        items: [],
        total: 0,
      });
    });
  });

  describe('Fetch-by-id method', () => {
    test('Should fetch the user from Contentful Graphql', async () => {
      const result = await externalAuthorsDataProviderMockGraphql.fetchById(
        'user-id',
      );

      expect(result).toMatchObject(getExternalAuthorResponse());
    });

    test('Should return null when user is not found', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        externalAuthorsDataProvider: null,
      });

      const result = await externalAuthorsDataProvider.fetchById('not-found');
      expect(result).toEqual(null);
    });

    test('Should return the user when it finds it', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        externalAuthors: getContentfulGraphqlExternalAuthor(),
      });

      const result = await externalAuthorsDataProvider.fetchById('user-id');
      expect(result).toEqual(getExternalAuthorResponse());
    });
  });
});
