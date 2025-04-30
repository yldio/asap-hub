import { getContentfulGraphqlClientMockServer } from '@asap-hub/contentful';
import { FetchOptions } from '@asap-hub/model';
import { LabContentfulDataProvider } from '../../../src/data-providers/contentful/lab.data-provider';
import { LabDataProvider } from '../../../src/data-providers/types';
import {
  getListLabsResponse,
  getContentfulGraphqlLabs,
  getContentfulLabsGraphqlResponse,
} from '../../fixtures/labs.fixtures';
import { getContentfulGraphqlClientMock } from '../../mocks/contentful-graphql-client.mock';

describe('Labs data provider', () => {
  const contentfulGraphqlClientMock = getContentfulGraphqlClientMock();

  const labDataProvider: LabDataProvider = new LabContentfulDataProvider(
    contentfulGraphqlClientMock,
  );

  const contentfulGraphqlClientMockServer =
    getContentfulGraphqlClientMockServer({
      Labs: () => getContentfulGraphqlLabs(),
      TeamMembership: () => ({
        team: null,
      }),
    });

  const labDataProviderMockGraphql = new LabContentfulDataProvider(
    contentfulGraphqlClientMockServer,
  );

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Fetch', () => {
    test('Should fetch the list of Labs from Contentful GraphQl', async () => {
      const result = await labDataProviderMockGraphql.fetch({});

      expect(result).toMatchObject(getListLabsResponse());
    });

    test('Should query with search query and return labs', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce(
        getContentfulLabsGraphqlResponse(),
      );
      const fetchOptions: FetchOptions<string[]> = {
        search: 'lab name',
      };
      await labDataProvider.fetch(fetchOptions);
      expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
        expect.anything(),
        {
          limit: 8,
          skip: null,
          where: {
            AND: [{ name_contains: 'lab' }, { name_contains: 'name' }],
          },
        },
      );
    });

    test('Should filter labPi inactive teams', async () => {
      const graphqlResponse = getContentfulLabsGraphqlResponse();
      graphqlResponse.labsCollection!.items[0]!.labPi = {
        teamsCollection: {
          items: [
            {
              inactiveSinceDate: null,
              team: {
                sys: { id: 'inactive-team' },
                inactiveSince: '2021-01-01',
              },
            },
            {
              inactiveSinceDate: '2021-01-01',
              team: {
                sys: { id: 'inactive-team-membership' },
                inactiveSince: null,
              },
            },
            {
              inactiveSinceDate: null,
              team: {
                sys: { id: 'active-team' },
                inactiveSince: null,
              },
            },
          ],
        },
      };

      contentfulGraphqlClientMock.request.mockResolvedValueOnce(
        graphqlResponse,
      );

      const result = await labDataProvider.fetch({});
      const expected = getListLabsResponse();
      expected.items[0]!.labPITeamIds = ['active-team'];
      expect(result).toMatchObject(expected);
    });

    test('Should return an empty array when the client returns null', async () => {
      const graphqlResponse = getContentfulLabsGraphqlResponse();
      graphqlResponse.labsCollection = null;
      contentfulGraphqlClientMock.request.mockResolvedValueOnce(
        graphqlResponse,
      );
      const result = await labDataProvider.fetch({});
      expect(result).toMatchObject({ items: [], total: 0 });
    });

    test('Should return an empty array when items is empty', async () => {
      const graphqlResponse = getContentfulLabsGraphqlResponse();
      graphqlResponse.labsCollection = {
        total: 0,
        items: [],
      };
      contentfulGraphqlClientMock.request.mockResolvedValueOnce(
        graphqlResponse,
      );
      const result = await labDataProvider.fetch({});
      expect(result).toMatchObject({ items: [], total: 0 });
    });
  });

  describe('Fetch by ID', () => {
    test('not implemented', async () => {
      await expect(labDataProvider.fetchById('lab-1')).rejects.toThrow();
    });
  });
});
