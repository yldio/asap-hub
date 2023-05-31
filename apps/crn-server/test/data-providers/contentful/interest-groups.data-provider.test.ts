import {
  getContentfulGraphqlClientMockServer,
  InterestGroupLeaders,
  FETCH_INTEREST_GROUPS,
  FETCH_INTEREST_GROUPS_BY_USER_ID,
} from '@asap-hub/contentful';
import {
  getContentfulGraphql,
  getInterestGroupDataObject,
  getContentfulGraphqlInterestGroup,
} from '../../fixtures/interest-groups.fixtures';

import { InterestGroupDataProvider } from '../../../src/data-providers/types';
import { InterestGroupContentfulDataProvider } from '../../../src/data-providers/contentful/interest-groups.data-provider';
import { getContentfulGraphqlClientMock } from '../../mocks/contentful-graphql-client.mock';

describe('User data provider', () => {
  const contentfulGraphqlClientMock = getContentfulGraphqlClientMock();
  const contentfulGraphqlClientMockServer =
    getContentfulGraphqlClientMockServer(getContentfulGraphql());

  const dataProvider: InterestGroupDataProvider =
    new InterestGroupContentfulDataProvider(contentfulGraphqlClientMock);
  const dataProviderWithMockServer: InterestGroupDataProvider =
    new InterestGroupContentfulDataProvider(contentfulGraphqlClientMockServer);

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Fetch-by-ID', () => {
    test('it should return the interest group', async () => {
      const result = await dataProviderWithMockServer.fetchById('123');

      const expectation = getInterestGroupDataObject();

      // TODO: team proposal
      expectation.teams.forEach((team) => {
        delete team.proposalURL;
      });

      expect(result).toEqual(expectation);
    });

    test("Should return null when the group doesn't exist", async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        interestGroups: null,
      });

      expect(await dataProvider.fetchById('123')).toBeNull();
    });

    test('Should return the group when the leader user is null (ie entity marked as a draft) and skip the leader', async () => {
      const response = getContentfulGraphqlInterestGroup();

      response.leadersCollection!.items[0] = {
        user: null,
        inactiveSinceDate: null,
        role: 'Chair',
      } as InterestGroupLeaders;

      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        interestGroups: response,
      });

      const result = await dataProvider.fetchById('123');

      const expectation = getInterestGroupDataObject().leaders[1];

      expect(result!.leaders).toEqual([expectation]);
    });

    test('Should return the group when the calendars is null', async () => {
      const response = getContentfulGraphqlInterestGroup();
      response.calendar = null;

      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        interestGroups: response,
      });

      const result = await dataProvider.fetchById('123');

      expect(result!.calendars).toEqual([]);
    });
  });

  describe('Fetch', () => {
    test('should fetch a list of interest groups', async () => {
      const result = await dataProviderWithMockServer.fetch({});

      const expectation = getInterestGroupDataObject();

      // TODO: team proposal
      expectation.teams.forEach((team) => {
        delete team.proposalURL;
      });

      expect(result).toMatchObject({
        total: 1,
        items: [expectation],
      });
    });

    test('Should return an empty result when the client returns an empty list', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        interestGroupsCollection: { total: 0, items: [] },
      });

      const result = await dataProvider.fetch({});
      expect(result).toEqual({ items: [], total: 0 });
    });

    test('Should return an empty result when the client returns a response with interestGroupsCollection property set to null', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        interestGroupsCollection: null,
      });

      const result = await dataProvider.fetch({});
      expect(result).toEqual({ items: [], total: 0 });
    });

    test('Should return an empty result when the client returns a response with items property set to null', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        interestGroupsCollection: { total: 0, items: null },
      });

      const result = await dataProvider.fetch({});
      expect(result).toEqual({ items: [], total: 0 });
    });

    describe('query options', () => {
      beforeEach(() => {
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          interestGroupsCollection: {
            total: 0,
            items: [],
          },
        });
      });

      test('Should apply pagination parameters', async () => {
        await dataProvider.fetch({
          take: 13,
          skip: 3,
        });

        expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
          FETCH_INTEREST_GROUPS,
          expect.objectContaining({
            limit: 13,
            skip: 3,
          }),
        );
      });

      test('Should pass default pagination parameters', async () => {
        await dataProvider.fetch({});

        expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
          FETCH_INTEREST_GROUPS,
          expect.objectContaining({
            limit: 20,
            skip: 0,
          }),
        );
      });

      test('should query with single term search filters', async () => {
        await dataProvider.fetch({ search: 'test' });
        expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
          FETCH_INTEREST_GROUPS,
          expect.objectContaining({
            where: {
              AND: [
                {
                  OR: [
                    { name_contains: 'test' },
                    { description_contains: 'test' },
                    { tags_contains_all: ['test'] },
                  ],
                },
              ],
            },
          }),
        );
      });

      test('should query with multiple term search filters', async () => {
        await dataProvider.fetch({ search: 'test search' });
        expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
          FETCH_INTEREST_GROUPS,
          expect.objectContaining({
            where: {
              AND: [
                {
                  OR: [
                    { name_contains: 'test' },
                    { description_contains: 'test' },
                    { tags_contains_all: ['test'] },
                  ],
                },
                {
                  OR: [
                    { name_contains: 'search' },
                    { description_contains: 'search' },
                    { tags_contains_all: ['search'] },
                  ],
                },
              ],
            },
          }),
        );
      });

      test.each`
        active
        ${true} | ${false}
      `(
        'Should filter by active field when its value is $active',
        async ({ active }) => {
          contentfulGraphqlClientMock.request.mockResolvedValueOnce({
            interestGroupsCollection: { total: 0, items: [] },
          });

          await dataProvider.fetch({ filter: { active } });

          expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
            FETCH_INTEREST_GROUPS,
            expect.objectContaining({
              where: {
                AND: [{ active }],
              },
            }),
          );
        },
      );

      test('can apply an active filter as well as a text search', async () => {
        await dataProvider.fetch({ filter: { active: false }, search: 'test' });

        expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
          FETCH_INTEREST_GROUPS,
          expect.objectContaining({
            where: {
              AND: [
                {
                  OR: [
                    { name_contains: 'test' },
                    { description_contains: 'test' },
                    { tags_contains_all: ['test'] },
                  ],
                },
                { active: false },
              ],
            },
          }),
        );
      });

      test('can filter by team id', async () => {
        await dataProvider.fetch({ filter: { teamId: ['abc'] } });

        expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
          FETCH_INTEREST_GROUPS,
          expect.objectContaining({
            where: {
              AND: [{ teams: { sys: { id_in: ['abc'] } } }],
            },
          }),
        );
      });

      test('can filter by multiple team IDs', async () => {
        await dataProvider.fetch({ filter: { teamId: ['abc', 'def'] } });

        expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
          FETCH_INTEREST_GROUPS,
          expect.objectContaining({
            where: {
              AND: [{ teams: { sys: { id_in: ['abc', 'def'] } } }],
            },
          }),
        );
      });

      test('can filter by user id', async () => {
        await dataProvider.fetch({ filter: { userId: '1234567' } });
        expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
          FETCH_INTEREST_GROUPS_BY_USER_ID,
          expect.objectContaining({ id: '1234567' }),
        );

        const contentfulGraphqlClientMockServer =
          getContentfulGraphqlClientMockServer({
            InterestGroupLeadersCollection: () => ({
              total: 2,
              items: [
                {
                  linkedFrom: {
                    interestGroupsCollection: {
                      total: 1,
                      items: [...Array(1)],
                    },
                  },
                },
                {
                  linkedFrom: {
                    interestGroupsCollection: {
                      total: 1,
                      items: [...Array(1)],
                    },
                  },
                },
              ],
            }),
          });

        const dataProviderWithMockServer: InterestGroupDataProvider =
          new InterestGroupContentfulDataProvider(
            contentfulGraphqlClientMockServer,
          );

        const result = await dataProviderWithMockServer.fetch({
          filter: { userId: '1234567' },
        });

        expect(result.total).toEqual(2);
        expect(result.items).toHaveLength(2);
      });
    });
  });
});
