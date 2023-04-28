import nock from 'nock';
import { SquidexGraphql } from '@asap-hub/squidex';
import { print } from 'graphql';
import { appName, baseUrl } from '../../src/config';
import { DiscoverSquidexDataProvider } from '../../src/data-providers/discover.data-provider';
import { getAuthToken } from '../../src/utils/auth';
import {
  getDiscoverDataObject,
  squidexDiscoverResponse,
} from '../fixtures/discover.fixtures';
import { getSquidexGraphqlClientMockServer } from '../mocks/squidex-graphql-client-with-server.mock';
import { FETCH_DISCOVER } from '../../src/queries/discover.queries';
import { DiscoverDataObject } from '@asap-hub/model';
import { identity } from '../helpers/squidex';

describe('Discover Data Provider', () => {
  const squidexGraphqlClientMock = new SquidexGraphql(getAuthToken, {
    appName,
    baseUrl,
  });
  const discoverDataProvider = new DiscoverSquidexDataProvider(
    squidexGraphqlClientMock,
  );
  const squidexGraphqlClientMockServer = getSquidexGraphqlClientMockServer();
  const discoverDataProviderGraphqlMockGraphql =
    new DiscoverSquidexDataProvider(squidexGraphqlClientMockServer);

  beforeAll(() => {
    identity();
  });

  describe('Fetch method', () => {
    describe('with mock-server', () => {
      test('Should fetch the dashboard from squidex graphql', async () => {
        const result = await discoverDataProviderGraphqlMockGraphql.fetch();

        const expected = getDiscoverDataObject();
        expect(result).toMatchObject(expected);
      });
    });

    describe('with intercepted http layer', () => {
      afterEach(() => {
        expect(nock.isDone()).toBe(true);
      });
      afterEach(() => {
        nock.cleanAll();
      });

      test('Should return an empty result', async () => {
        nock(baseUrl)
          .post(`/api/content/${appName}/graphql`, {
            query: print(FETCH_DISCOVER),
          })
          .reply(200, {
            data: {
              queryDiscoverContents: [
                {
                  flatData: {
                    aboutUs: null,
                    pages: null,
                    members: null,
                    membersTeam: null,
                  },
                },
              ],
            },
          });

        const result = await discoverDataProvider.fetch();

        const expectedResponse: DiscoverDataObject = {
          aboutUs: '',
          training: [],
          members: [],
          scientificAdvisoryBoard: [],
          pages: [],
        };
        expect(result).toEqual(expectedResponse);
      });

      test('Should return an empty membersTeamId when the members team ID is an empty array', async () => {
        nock(baseUrl)
          .post(`/api/content/${appName}/graphql`, {
            query: print(FETCH_DISCOVER),
          })
          .reply(200, {
            data: {
              queryDiscoverContents: [
                {
                  flatData: {
                    aboutUs: null,
                    pages: null,
                    members: null,
                    membersTeam: [],
                  },
                },
              ],
            },
          });

        const result = await discoverDataProvider.fetch();

        const expectedResponse: DiscoverDataObject = {
          aboutUs: '',
          training: [],
          members: [],
          scientificAdvisoryBoard: [],
          pages: [],
        };
        expect(result).toEqual(expectedResponse);
      });

      test('Should return an empty result when no resource exists', async () => {
        nock(baseUrl)
          .post(`/api/content/${appName}/graphql`, {
            query: print(FETCH_DISCOVER),
          })
          .reply(200, {
            data: {
              queryDiscoverContents: [],
            },
          });

        const result = await discoverDataProvider.fetch();

        const expectedResponse: DiscoverDataObject = {
          aboutUs: '',
          training: [],
          members: [],
          scientificAdvisoryBoard: [],
          pages: [],
        };
        expect(result).toEqual(expectedResponse);
      });

      test('Should return the discover information', async () => {
        nock(baseUrl)
          .post(`/api/content/${appName}/graphql`, {
            query: print(FETCH_DISCOVER),
          })
          .reply(200, {
            data: squidexDiscoverResponse,
          });

        const result = await discoverDataProvider.fetch();

        const discoverResponse = getDiscoverDataObject();
        expect(result).toMatchObject(discoverResponse);
      });
    });
  });
});
