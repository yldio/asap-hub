import { GenericError } from '@asap-hub/errors';
import { RestExternalAuthor, SquidexRest } from '@asap-hub/squidex';
import nock from 'nock';
import { appName, baseUrl } from '../../src/config';
import { ExternalAuthorSquidexDataProvider } from '../../src/data-providers/external-authors.data-provider';
import { getAuthToken } from '../../src/utils/auth';
import {
  getExternalAuthorResponse,
  getSquidexExternalAuthorGraphqlResponse,
  getSquidexExternalAuthorsGraphqlResponse,
  getExternalAuthorCreateDataObject,
} from '../fixtures/external-authors.fixtures';
import { identity } from '../helpers/squidex';
import { getSquidexGraphqlClientMock } from '../mocks/squidex-graphql-client.mock';
import { getSquidexGraphqlClientMockServer } from '../mocks/squidex-graphql-client-with-server.mock';

describe('External Authors data provider', () => {
  const externalAuthorRestClient = new SquidexRest<RestExternalAuthor>(
    getAuthToken,
    'external-authors',
    { appName, baseUrl },
  );
  const squidexGraphqlClientMock = getSquidexGraphqlClientMock();
  const squidexGraphqlClientMockServer = getSquidexGraphqlClientMockServer();
  const externalAuthorsDataProvider = new ExternalAuthorSquidexDataProvider(
    externalAuthorRestClient,
    squidexGraphqlClientMock,
  );
  const externalAuthorsDataProviderWithServer =
    new ExternalAuthorSquidexDataProvider(
      externalAuthorRestClient,
      squidexGraphqlClientMockServer,
    );

  beforeAll(() => {
    identity();
  });
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Create method', () => {
    test('Should create an external author', async () => {
      const externalAuthorCreateDataObject =
        getExternalAuthorCreateDataObject();

      nock(baseUrl)
        .post(`/api/content/${appName}/external-authors?publish=true`, {
          name: { iv: externalAuthorCreateDataObject.name },
          orcid: { iv: externalAuthorCreateDataObject.orcid },
        })
        .reply(200, { id: 'author-1' });

      const result = await externalAuthorsDataProvider.create(
        externalAuthorCreateDataObject,
      );
      expect(result).toEqual('author-1');
    });

    test('Should create an external author without ORCID', async () => {
      const externalAuthorCreateDataObject =
        getExternalAuthorCreateDataObject();
      delete externalAuthorCreateDataObject.orcid;

      nock(baseUrl)
        .post(`/api/content/${appName}/external-authors?publish=true`, {
          name: { iv: externalAuthorCreateDataObject.name },
          orcid: undefined,
        })
        .reply(200, { id: 'author-1' });

      const result = await externalAuthorsDataProvider.create(
        externalAuthorCreateDataObject,
      );
      expect(result).toEqual('author-1');
    });

    test('Should throw when fails to create the external author - 500', async () => {
      const externalAuthorCreateDataObject =
        getExternalAuthorCreateDataObject();

      nock(baseUrl)
        .post(`/api/content/${appName}/external-authors?publish=true`, {
          name: { iv: externalAuthorCreateDataObject.name },
          orcid: undefined,
        })
        .reply(500);

      await expect(
        externalAuthorsDataProvider.create(externalAuthorCreateDataObject),
      ).rejects.toThrow(GenericError);
    });
  });

  describe('Fetch', () => {
    test('Should fetch the users from squidex graphql', async () => {
      const result = await externalAuthorsDataProviderWithServer.fetch({});

      expect(result).toMatchObject({
        total: 8,
        items: [getExternalAuthorResponse(), getExternalAuthorResponse()],
      });
    });

    test('Should return an empty result', async () => {
      const mockResponse = getSquidexExternalAuthorsGraphqlResponse();
      mockResponse.queryExternalAuthorsContentsWithTotal!.items = [];
      mockResponse.queryExternalAuthorsContentsWithTotal!.total = 0;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(mockResponse);

      const result = await externalAuthorsDataProvider.fetch({});
      expect(result).toEqual({ items: [], total: 0 });
    });

    test('Should return an empty result when the client returns a response with query property set to null', async () => {
      const mockResponse = getSquidexExternalAuthorsGraphqlResponse();
      mockResponse.queryExternalAuthorsContentsWithTotal = null;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(mockResponse);

      const result = await externalAuthorsDataProvider.fetch({});
      expect(result).toEqual({ total: 0, items: [] });
    });

    test('Should return an empty result when the client returns a response with items property set to null', async () => {
      const mockResponse = getSquidexExternalAuthorsGraphqlResponse();
      mockResponse.queryExternalAuthorsContentsWithTotal!.items = null;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(mockResponse);

      const result = await externalAuthorsDataProvider.fetch({});
      expect(result).toEqual({ total: 0, items: [] });
    });

    test('Should use take and skip parameters', async () => {
      const mockResponse = getSquidexExternalAuthorsGraphqlResponse();
      mockResponse.queryExternalAuthorsContentsWithTotal!.items = [];
      mockResponse.queryExternalAuthorsContentsWithTotal!.total = 0;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(mockResponse);

      const result = await externalAuthorsDataProvider.fetch({
        take: 15,
        skip: 11,
      });
      expect(result).toEqual({ items: [], total: 0 });

      expect(squidexGraphqlClientMock.request).toBeCalledWith(
        expect.anything(),
        {
          top: 15,
          skip: 11,
        },
      );
    });
  });

  describe('FetchById', () => {
    test('Should fetch the user from squidex graphql', async () => {
      const result = await externalAuthorsDataProviderWithServer.fetchById(
        'user-id',
      );

      expect(result).toMatchObject(getExternalAuthorResponse());
    });

    test('Should throw when user is not found', async () => {
      const mockResponse = getSquidexExternalAuthorGraphqlResponse();
      mockResponse.findExternalAuthorsContent = null;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(mockResponse);

      await expect(
        externalAuthorsDataProvider.fetchById('not-found'),
      ).rejects.toThrow('Not Found');
    });

    test('Should return the user when it finds it', async () => {
      const mockResponse = getSquidexExternalAuthorGraphqlResponse();
      squidexGraphqlClientMock.request.mockResolvedValueOnce(mockResponse);

      const result = await externalAuthorsDataProvider.fetchById('user-id');
      expect(result).toEqual(getExternalAuthorResponse());
    });
  });
});
