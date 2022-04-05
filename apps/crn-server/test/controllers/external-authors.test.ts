import nock from 'nock';
import { config } from '@asap-hub/squidex';
import ExternalAuthors from '../../src/controllers/external-authors';
import { identity } from '../helpers/squidex';
import {
  getExternalAuthor,
  getExternalAuthorResponse,
  getExternalAuthorRestResponse,
  getSquidexExternalAuthorGraphqlResponse,
  getSquidexExternalAuthorsGraphqlResponse,
} from '../fixtures/external-authors.fixtures';
import { getSquidexGraphqlClientMockServer } from '../mocks/squidex-graphql-client-with-server.mock';
import { getSquidexGraphqlClientMock } from '../mocks/squidex-graphql-client.mock';

describe('External Authors controller', () => {
  const squidexGraphqlClientMock = getSquidexGraphqlClientMock();
  const usersMockGraphqlClient = new ExternalAuthors(squidexGraphqlClientMock);

  const squidexGraphqlClientMockServer = getSquidexGraphqlClientMockServer();
  const usersMockGraphqlServer = new ExternalAuthors(
    squidexGraphqlClientMockServer,
  );

  beforeAll(() => {
    identity();
  });

  describe('Fetch', () => {
    test('Should fetch the users from squidex graphql', async () => {
      const result = await usersMockGraphqlServer.fetch({});

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

      const result = await usersMockGraphqlClient.fetch({});
      expect(result).toEqual({ items: [], total: 0 });
    });

    test('Should return an empty result when the client returns a response with query property set to null', async () => {
      const mockResponse = getSquidexExternalAuthorsGraphqlResponse();
      mockResponse.queryExternalAuthorsContentsWithTotal = null;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(mockResponse);

      const result = await usersMockGraphqlClient.fetch({});
      expect(result).toEqual({ total: 0, items: [] });
    });

    test('Should return an empty result when the client returns a response with items property set to null', async () => {
      const mockResponse = getSquidexExternalAuthorsGraphqlResponse();
      mockResponse.queryExternalAuthorsContentsWithTotal!.items = null;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(mockResponse);

      const result = await usersMockGraphqlClient.fetch({});
      expect(result).toEqual({ total: 0, items: [] });
    });

    test('Should use take and skip parameters', async () => {
      const mockResponse = getSquidexExternalAuthorsGraphqlResponse();
      mockResponse.queryExternalAuthorsContentsWithTotal!.items = [];
      mockResponse.queryExternalAuthorsContentsWithTotal!.total = 0;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(mockResponse);

      const result = await usersMockGraphqlClient.fetch({ take: 15, skip: 11 });
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
      const result = await usersMockGraphqlServer.fetchById('user-id');

      expect(result).toMatchObject(getExternalAuthorResponse());
    });

    test('Should throw when user is not found', async () => {
      const mockResponse = getSquidexExternalAuthorGraphqlResponse();
      mockResponse.findExternalAuthorsContent = null;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(mockResponse);

      await expect(
        usersMockGraphqlClient.fetchById('not-found'),
      ).rejects.toThrow('Not Found');
    });

    test('Should return the user when it finds it', async () => {
      const mockResponse = getSquidexExternalAuthorGraphqlResponse();
      squidexGraphqlClientMock.request.mockResolvedValueOnce(mockResponse);

      const result = await usersMockGraphqlClient.fetchById('user-id');
      expect(result).toEqual(getExternalAuthorResponse());
    });
  });

  describe('Create', () => {
    afterEach(() => {
      expect(nock.isDone()).toBe(true);
    });

    afterEach(() => {
      nock.cleanAll();
    });

    test('Should create an external author from squidex rest', async () => {
      const response = getExternalAuthorRestResponse();

      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/external-authors?publish=true`)
        .reply(201, response);

      const result = await usersMockGraphqlServer.create(getExternalAuthor());
      expect(result).toEqual(response);
    });

    test('Should throw an error when data is not valid - 400', async () => {
      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/external-authors?publish=true`)
        .reply(400);

      await expect(usersMockGraphqlServer.create({})).rejects.toThrow(
        'Bad Request',
      );
    });

    test('Should throw an error when fails to create the external author - 500', async () => {
      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/external-authors?publish=true`)
        .reply(500);

      await expect(
        usersMockGraphqlServer.create(getExternalAuthor()),
      ).rejects.toThrow('Internal Server');
    });
  });
});
