import { GenericError } from '@asap-hub/errors';
import { gp2 as gp2Squidex, SquidexRest } from '@asap-hub/squidex';
import nock from 'nock';
import { appName, baseUrl } from '../../src/config';

import { ExternalUserSquidexDataProvider } from '../../src/data-providers/external-user.data-provider';
import { getAuthToken } from '../../src/utils/auth';
import {
  getExternalUserCreateDataObject,
  getExternalUserDataObject,
  getSquidexExternalUsersGraphqlResponse,
} from '../fixtures/external-users.fixtures';
import { identity } from '../helpers/squidex';
import { getSquidexGraphqlClientMockServer } from '../mocks/squidex-graphql-client-with-server.mock';
import { getSquidexGraphqlClientMock } from '../mocks/squidex-graphql-client.mock';

import { FetchOptions } from '@asap-hub/model';

describe('External User data provider', () => {
  const externalUserRestClient = new SquidexRest<gp2Squidex.RestExternalUser>(
    getAuthToken,
    'external-users',
    { appName, baseUrl },
  );
  const squidexGraphqlClientMock = getSquidexGraphqlClientMock();
  const externalUsersDataProvider = new ExternalUserSquidexDataProvider(
    squidexGraphqlClientMock,
    externalUserRestClient,
  );
  const squidexGraphqlClientMockServer = getSquidexGraphqlClientMockServer();
  const externalUsersMockGraphqlServer = new ExternalUserSquidexDataProvider(
    squidexGraphqlClientMockServer,
    externalUserRestClient,
  );

  beforeAll(() => {
    identity();
  });
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetch method', () => {
    test('Should fetch the external users from squidex graphql', async () => {
      const result = await externalUsersMockGraphqlServer.fetch({});
      expect(result).toMatchObject({
        total: 1,
        items: [getExternalUserDataObject()],
      });
    });
    test('Should return an empty result', async () => {
      const mockResponse = getSquidexExternalUsersGraphqlResponse();
      mockResponse.queryExternalUsersContentsWithTotal!.items = [];
      mockResponse.queryExternalUsersContentsWithTotal!.total = 0;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(mockResponse);

      const result = await externalUsersDataProvider.fetch({});
      expect(result).toEqual({ total: 0, items: [] });
    });
  });

  describe('search', () => {
    test('Should query with filters and return the external-users', async () => {
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        getSquidexExternalUsersGraphqlResponse(),
      );
      const fetchOptions: FetchOptions = {
        take: 12,
        skip: 2,
        search: 'tony stark',
      };
      const users = await externalUsersDataProvider.fetch(fetchOptions);

      const filterQuery =
        "(contains(data/name/iv, 'tony'))" +
        ' or' +
        " (contains(data/name/iv, 'stark'))";
      expect(squidexGraphqlClientMock.request).toBeCalledWith(
        expect.anything(),
        {
          top: 12,
          skip: 2,
          filter: filterQuery,
        },
      );
      expect(users).toMatchObject({
        total: 1,
        items: [getExternalUserDataObject()],
      });
    });
  });

  describe('Create method', () => {
    test('Should create an external user', async () => {
      const externalUserCreateDataObject = getExternalUserCreateDataObject();

      nock(baseUrl)
        .post(`/api/content/${appName}/external-users?publish=true`, {
          name: { iv: externalUserCreateDataObject.name },
          orcid: { iv: externalUserCreateDataObject.orcid },
        })
        .reply(200, { id: 'user-1' });

      const result = await externalUsersDataProvider.create(
        externalUserCreateDataObject,
      );
      expect(result).toEqual('user-1');
    });

    test('Should create an external user without ORCID', async () => {
      const externalUserCreateDataObject = getExternalUserCreateDataObject();
      delete externalUserCreateDataObject.orcid;

      nock(baseUrl)
        .post(`/api/content/${appName}/external-users?publish=true`, {
          name: { iv: externalUserCreateDataObject.name },
          orcid: undefined,
        })
        .reply(200, { id: 'user-1' });

      const result = await externalUsersDataProvider.create(
        externalUserCreateDataObject,
      );
      expect(result).toEqual('user-1');
    });

    test('Should throw when fails to create the external user - 500', async () => {
      const externalUserCreateDataObject = getExternalUserCreateDataObject();

      nock(baseUrl)
        .post(`/api/content/${appName}/external-users?publish=true`, {
          name: { iv: externalUserCreateDataObject.name },
          orcid: undefined,
        })
        .reply(500);

      await expect(
        externalUsersDataProvider.create(externalUserCreateDataObject),
      ).rejects.toThrow(GenericError);
    });
  });
  describe('Fetch-by-id method', () => {
    test('not implemented', async () => {
      expect(async () =>
        externalUsersDataProvider.fetchById(),
      ).rejects.toThrow();
    });
  });
});
