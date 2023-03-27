import {
  Environment,
  getContentfulGraphqlClientMockServer,
} from '@asap-hub/contentful';
import { GenericError } from '@asap-hub/errors';
import { ExternalAuthorContentfulDataProvider } from '../../../src/data-providers/contentful/external-authors.data-provider';
import { getEntry } from '../../fixtures/contentful.fixtures';
import {
  getContentfulGraphqlExternalAuthorsResponse,
  getContentfulGraphqlExternalAuthor,
  getExternalAuthorResponse,
  getExternalAuthorCreateDataObject,
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

    test('Should use take and skip parameters', async () => {
      const contentfulGraphqlResponse =
        getContentfulGraphqlExternalAuthorsResponse();
      contentfulGraphqlClientMock.request.mockResolvedValueOnce(
        contentfulGraphqlResponse,
      );

      const result = await externalAuthorsDataProvider.fetch({
        take: 15,
        skip: 11,
      });

      expect(result).toEqual({
        items: [getExternalAuthorResponse()],
        total: 1,
      });

      expect(contentfulGraphqlClientMock.request).toBeCalledWith(
        expect.anything(),
        {
          limit: 15,
          skip: 11,
          order: ['name_ASC'],
        },
      );
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
        externalAuthors: null,
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

  describe('Create method', () => {
    test('Should create an external author', async () => {
      const externalAuthorCreateDataObject =
        getExternalAuthorCreateDataObject();

      const externalAuthorMock = getEntry({});
      externalAuthorMock.sys.id = 'author-1';
      environmentMock.createEntry.mockResolvedValueOnce(externalAuthorMock);
      externalAuthorMock.publish = jest
        .fn()
        .mockResolvedValueOnce(externalAuthorMock);

      const result = await externalAuthorsDataProvider.create(
        externalAuthorCreateDataObject,
      );

      expect(environmentMock.createEntry).toHaveBeenCalledWith(
        'externalAuthors',
        {
          fields: {
            name: { 'en-US': externalAuthorCreateDataObject.name },
            orcid: { 'en-US': externalAuthorCreateDataObject.orcid },
          },
        },
      );
      expect(result).toEqual('author-1');
    });

    test('Should create an external author without ORCID', async () => {
      const externalAuthorCreateDataObject =
        getExternalAuthorCreateDataObject();
      delete externalAuthorCreateDataObject.orcid;

      const externalAuthorMock = getEntry({});
      externalAuthorMock.sys.id = 'author-1';
      environmentMock.createEntry.mockResolvedValueOnce(externalAuthorMock);
      externalAuthorMock.publish = jest
        .fn()
        .mockResolvedValueOnce(externalAuthorMock);

      const result = await externalAuthorsDataProvider.create(
        externalAuthorCreateDataObject,
      );

      expect(environmentMock.createEntry).toHaveBeenCalledWith(
        'externalAuthors',
        {
          fields: {
            name: { 'en-US': externalAuthorCreateDataObject.name },
            orcid: { 'en-US': undefined },
          },
        },
      );
      expect(result).toEqual('author-1');
    });

    test('Should throw when fails to create the external author', async () => {
      const externalAuthorCreateDataObject =
        getExternalAuthorCreateDataObject();

      environmentMock.createEntry.mockRejectedValueOnce(new GenericError());

      await expect(
        externalAuthorsDataProvider.create(externalAuthorCreateDataObject),
      ).rejects.toThrow(GenericError);
    });
  });
});
