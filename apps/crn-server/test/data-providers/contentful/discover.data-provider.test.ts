import { DiscoverDataProvider } from '../../../src/data-providers/types';
import { DiscoverContentfulDataProvider } from '../../../src/data-providers/contentful/discover.data-provider';
import { getContentfulGraphqlClientMockServer } from '@asap-hub/contentful';
import {
  getDiscoverDataObject,
  getContentfulGraphqlDiscover,
  getContentfulGraphqlDiscoverResponse,
  getContentfulGraphqlDiscoverMembers,
} from '../../fixtures/discover.fixtures';
import { getContentfulGraphqlClientMock } from '../../mocks/contentful-graphql-client.mock';

describe('Discover data provider', () => {
  const contentfulGraphqlClientMock = getContentfulGraphqlClientMock();
  const dataProvider: DiscoverDataProvider = new DiscoverContentfulDataProvider(
    contentfulGraphqlClientMock,
  );

  describe('Fetch', () => {
    test('it should return the tutorial from the mock server', async () => {
      const contentfulGraphqlClientMockServer =
        getContentfulGraphqlClientMockServer({
          Discover: () => getContentfulGraphqlDiscover(),
        });
      const dataProviderWithMockServer: DiscoverDataProvider =
        new DiscoverContentfulDataProvider(contentfulGraphqlClientMockServer);
      const result = await dataProviderWithMockServer.fetch();

      const expectation = getDiscoverDataObject();

      expect(result).toMatchObject(expectation);
    });

    test('parses rich text into html', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        ...getContentfulGraphqlDiscoverResponse({
          aboutUs: {
            json: {
              nodeType: 'document',
              data: {},
              content: [
                {
                  nodeType: 'paragraph',
                  data: {},
                  content: [
                    {
                      nodeType: 'text',
                      value: 'rich text',
                      marks: [],
                      data: {},
                    },
                  ],
                },
              ],
            },
            links: {
              entries: {
                inline: [],
              },
              assets: {
                block: [],
              },
            },
          },
        }),
      });

      const result = await dataProvider.fetch();

      expect(result!.aboutUs).toEqual('<p>rich text</p>');
    });

    test('defaults entries to empty arrays if no value is found', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        ...getContentfulGraphqlDiscoverResponse({
          pagesCollection: null,
          membersCollection: null,
          trainingCollection: null,
          scientificAdvisoryBoardCollection: null,
          membersTeam: null,
          aboutUs: null,
        }),
      });

      const result = await dataProvider.fetch();

      expect(result).toEqual({
        members: [],
        pages: [],
        scientificAdvisoryBoard: [],
        training: [],
        membersTeamId: undefined,
        aboutUs: '',
      });
    });

    test('removes null items from collections', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        ...getContentfulGraphqlDiscoverResponse({
          membersCollection: {
            items: [null, ...getContentfulGraphqlDiscoverMembers()],
          },
        }),
      });

      const result = await dataProvider.fetch();
      const expectation = getDiscoverDataObject();

      expect(result.members).toHaveLength(2);
      expect(result).toMatchObject(expectation);
    });

    test('it should return empty data if no discover collection is found', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        discoverCollection: null,
      });

      const result = await dataProvider.fetch();

      expect(result).toEqual({
        members: [],
        pages: [],
        scientificAdvisoryBoard: [],
        training: [],
        membersTeamId: undefined,
        aboutUs: '',
      });
    });

    test('it should return empty data if no discover page is found', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        discoverCollection: {
          items: [],
        },
      });

      const result = await dataProvider.fetch();

      expect(result).toEqual({
        members: [],
        pages: [],
        scientificAdvisoryBoard: [],
        training: [],
        membersTeamId: undefined,
        aboutUs: '',
      });
    });
  });
});
