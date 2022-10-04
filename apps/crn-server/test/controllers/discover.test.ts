import Discover from '../../src/controllers/discover';
import { SquidexGraphql } from '@asap-hub/squidex';
import { identity } from '../helpers/squidex';
import { DiscoverResponse } from '@asap-hub/model';
import nock from 'nock';
import {
  squidexDiscoverResponse,
  getDiscoverResponse,
} from '../fixtures/discover.fixtures';
import { FETCH_DISCOVER } from '../../src/queries/discover.queries';
import { print } from 'graphql';
import { getSquidexGraphqlClientMockServer } from '../mocks/squidex-graphql-client-with-server.mock';
import { getAuthToken } from '../../src/utils/auth';
import { appName, baseUrl } from '../../src/config';

describe('Discover controller', () => {
  const squidexGraphqlClient = new SquidexGraphql(getAuthToken, {
    appName,
    baseUrl,
  });
  const discover = new Discover(squidexGraphqlClient);

  const squidexGraphqlClientMockServer = getSquidexGraphqlClientMockServer();
  const discoverMockGraphql = new Discover(squidexGraphqlClientMockServer);

  beforeAll(() => {
    identity();
  });

  describe('Fetch method', () => {
    describe('with mock-server', () => {
      test('Should fetch the discover from squidex graphql', async () => {
        const result = await discoverMockGraphql.fetch();

        const expected = getDiscoverResponse();
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

      // eslint-disable-next-line jest/no-disabled-tests
      test.skip('Should return an empty result', async () => {
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

        const result = await discover.fetch();

        const expectedResponse: DiscoverResponse = {
          aboutUs: '',
          training: [],
          members: [],
          scientificAdvisoryBoard: [],
          pages: [],
          workingGroups: [],
        };
        expect(result).toEqual(expectedResponse);
      });

      // eslint-disable-next-line jest/no-disabled-tests
      test.skip('Should return an empty membersTeamId when the members team ID is an empty array', async () => {
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

        const result = await discover.fetch();

        const expectedResponse: DiscoverResponse = {
          aboutUs: '',
          training: [],
          members: [],
          scientificAdvisoryBoard: [],
          pages: [],
          workingGroups: [],
        };
        expect(result).toEqual(expectedResponse);
      });

      // eslint-disable-next-line jest/no-disabled-tests
      test.skip('Should return an empty result when no resource exists', async () => {
        nock(baseUrl)
          .post(`/api/content/${appName}/graphql`, {
            query: print(FETCH_DISCOVER),
          })
          .reply(200, {
            data: {
              queryDiscoverContents: [],
            },
          });

        const result = await discover.fetch();

        const expectedResponse: DiscoverResponse = {
          aboutUs: '',
          training: [],
          members: [],
          scientificAdvisoryBoard: [],
          pages: [],
          workingGroups: [],
        };
        expect(result).toEqual(expectedResponse);
      });

      // eslint-disable-next-line jest/no-disabled-tests
      test.skip('Should return the discover information', async () => {
        nock(baseUrl)
          .post(`/api/content/${appName}/graphql`, {
            query: print(FETCH_DISCOVER),
          })
          .reply(200, {
            data: squidexDiscoverResponse,
          });

        const result = await discover.fetch();

        const discoverResponse = getDiscoverResponse();
        expect(result).toMatchObject(discoverResponse);
      });
    });
  });
});
