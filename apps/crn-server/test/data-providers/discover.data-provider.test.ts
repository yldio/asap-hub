import { DiscoverSquidexDataProvider } from '../../src/data-providers/discover.data-provider';
import {
  getDiscoverDataObject,
  squidexDiscoverResponse,
} from '../fixtures/discover.fixtures';
import { getSquidexGraphqlClientMockServer } from '../mocks/squidex-graphql-client-with-server.mock';
import { DiscoverDataObject } from '@asap-hub/model';
import { getSquidexGraphqlClientMock } from '../mocks/squidex-graphql-client.mock';

describe('Discover Data Provider', () => {
  const squidexGraphqlClientMock = getSquidexGraphqlClientMock();
  const discoverDataProvider = new DiscoverSquidexDataProvider(
    squidexGraphqlClientMock,
  );
  const squidexGraphqlClientMockServer = getSquidexGraphqlClientMockServer();
  const discoverDataProviderGraphqlMockGraphql =
    new DiscoverSquidexDataProvider(squidexGraphqlClientMockServer);

  describe('Fetch method', () => {
    describe('with mock-server', () => {
      test('Should fetch discover from squidex graphql', async () => {
        const result = await discoverDataProviderGraphqlMockGraphql.fetch();

        const expected = getDiscoverDataObject();
        expect(result).toMatchObject(expected);
      });
    });

    describe('with intercepted http layer', () => {
      test('Should return an empty result', async () => {
        squidexGraphqlClientMock.request.mockResolvedValueOnce({
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
        squidexGraphqlClientMock.request.mockResolvedValueOnce({
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
        squidexGraphqlClientMock.request.mockResolvedValueOnce({
          queryDiscoverContents: [],
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
        squidexGraphqlClientMock.request.mockResolvedValueOnce({
          ...squidexDiscoverResponse,
        });

        const result = await discoverDataProvider.fetch();

        const discoverResponse = getDiscoverDataObject();
        expect(result).toMatchObject(discoverResponse);
      });
    });
  });
});
