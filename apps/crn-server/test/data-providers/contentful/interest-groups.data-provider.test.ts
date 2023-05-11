import {
  getContentfulGraphqlClientMockServer,
  InterestGroups,
  InterestGroupLeaders,
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
      const response = getContentfulGraphqlInterestGroup() as InterestGroups;

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

    test('Should apply pagination parameters', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        interestGroupsCollection: { total: 0, items: [] },
      });

      await dataProvider.fetch({
        take: 13,
        skip: 3,
      });

      expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          limit: 13,
          skip: 3,
        }),
      );
    });

    test('Should pass default pagination parameters', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        interestGroupsCollection: { total: 0, items: [] },
      });

      await dataProvider.fetch({});

      expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          limit: 20,
          skip: 0,
        }),
      );
    });

    test('should query with single term search filters', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        interestGroupsCollection: { total: 0, items: [] },
      });

      await dataProvider.fetch({ search: 'test' });
      expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
        expect.anything(),
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
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        interestGroupsCollection: { total: 0, items: [] },
      });

      await dataProvider.fetch({ search: 'test search' });
      expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
        expect.anything(),
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

    test('should apply an active filter if defined', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        interestGroupsCollection: { total: 0, items: [] },
      });

      await dataProvider.fetch({ filter: { active: false } });

      expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          where: {
            AND: [
              { active: false },
            ],
          },
        }),
      );
    });

    test('can apply an active filter as well as a text search', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        interestGroupsCollection: { total: 0, items: [] },
      });

      await dataProvider.fetch({ filter: { active: false }, search: 'test' });

      expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
        expect.anything(),
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

    /*test('Should query with filters and return the groups', async () => {
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        getSquidexInterestGroupsGraphqlResponse(),
      );

      const fetchOptions: FetchGroupOptions = {
        take: 12,
        skip: 2,
        search: 'first last',
      };
      const expectedFilter =
        "((contains(data/name/iv,'first'))" +
        " or (contains(data/description/iv,'first'))" +
        " or (contains(data/tags/iv,'first')))" +
        ' and' +
        " ((contains(data/name/iv,'last'))" +
        " or (contains(data/description/iv,'last'))" +
        " or (contains(data/tags/iv,'last')))";

      const result = await dataProvider.fetch(fetchOptions);

      expect(squidexGraphqlClientMock.request).toHaveBeenCalledWith(
        expect.anything(),
        {
          filter: expectedFilter,
          top: 12,
          skip: 2,
        },
      );
      expect(result).toEqual({
        total: 1,
        items: [getInterestGroupDataObject()],
      });
    });

    test('Should sanitise single quotes by doubling them', async () => {
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        getSquidexInterestGroupsGraphqlResponse(),
      );

      const fetchOptions: FetchGroupOptions = {
        take: 12,
        skip: 2,
        search: "'",
      };
      const expectedFilter =
        "((contains(data/name/iv,''''))" +
        " or (contains(data/description/iv,''''))" +
        " or (contains(data/tags/iv,'''')))";

      await dataProvider.fetch(fetchOptions);

      expect(squidexGraphqlClientMock.request).toHaveBeenCalledWith(
        expect.anything(),
        {
          filter: expectedFilter,
          top: 12,
          skip: 2,
        },
      );
    });

    test('Should sanitise double quotation mark by escaping it', async () => {
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        getSquidexInterestGroupsGraphqlResponse(),
      );

      const fetchOptions: FetchGroupOptions = {
        take: 12,
        skip: 2,
        search: '"',
      };
      const expectedFilter =
        "((contains(data/name/iv,'\"'))" +
        " or (contains(data/description/iv,'\"'))" +
        " or (contains(data/tags/iv,'\"')))";

      await dataProvider.fetch(fetchOptions);

      expect(squidexGraphqlClientMock.request).toHaveBeenCalledWith(
        expect.anything(),
        {
          filter: expectedFilter,
          top: 12,
          skip: 2,
        },
      );
    });

    test('Should apply the team and pagination filters', async () => {
      const teamId = 'eb531b6e-195c-46e2-b347-58fb86715033';
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        getSquidexInterestGroupsGraphqlResponse(),
      );

      await dataProvider.fetch({
        filter: { teamId: [teamId] },
        take: 13,
        skip: 3,
      });

      const expectedFilter = `data/teams/iv eq '${teamId}'`;
      expect(squidexGraphqlClientMock.request).toHaveBeenCalledWith(
        expect.anything(),
        {
          filter: expectedFilter,
          top: 13,
          skip: 3,
        },
      );
    });

    test('Should filter by multiple team IDs', async () => {
      const teamIds = [
        'eb531b6e-195c-46e2-b347-58fb86715033',
        'dc312b6e-195c-46e2-b347-58fb86715033',
      ];
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        getSquidexInterestGroupsGraphqlResponse(),
      );

      await dataProvider.fetch({
        filter: { teamId: teamIds },
        take: 13,
        skip: 3,
      });

      const expectedFilter = `data/teams/iv in ('${teamIds[0]}','${teamIds[1]}')`;
      expect(squidexGraphqlClientMock.request).toHaveBeenCalledWith(
        expect.anything(),
        {
          filter: expectedFilter,
          top: 13,
          skip: 3,
        },
      );
    });

    test('Should filter by user ID', async () => {
      const userId = 'eb531b6e-195c-46e2-b347-58fb86715033';
      squidexGraphqlClientMock.request.mockResolvedValue(
        getSquidexInterestGroupsGraphqlResponse(),
      );

      await dataProvider.fetch({ filter: { userId } });

      const userFilter = `data/leaders/iv/user eq '${userId}'`;
      expect(squidexGraphqlClientMock.request).toHaveBeenCalledWith(
        expect.anything(),
        {
          filter: userFilter,
          top: 50,
          skip: 0,
        },
      );
    });

    test.each`
      active
      ${true} | ${false}
    `(
      'Should filter by active field when its value is $active',
      async ({ active }) => {
        squidexGraphqlClientMock.request.mockResolvedValue(
          getSquidexInterestGroupsGraphqlResponse(),
        );

        await dataProvider.fetch({ filter: { active } });

        expect(squidexGraphqlClientMock.request).toHaveBeenCalledWith(
          expect.anything(),
          {
            filter: `data/active/iv eq ${active}`,
            top: 50,
            skip: 0,
          },
        );
      },
    );

    test('Should apply the team, user and active filters', async () => {
      const userId = 'eb531b6e-195c-46e2-b347-58fb86715033';
      const teamIds = ['team-id-1', 'team-id-3'];
      const active = true;

      squidexGraphqlClientMock.request.mockResolvedValue(
        getSquidexInterestGroupsGraphqlResponse(),
      );

      await dataProvider.fetch({
        filter: { userId, teamId: teamIds, active },
      });

      const teamFilter = `data/teams/iv in ('${teamIds[0]}','${teamIds[1]}')`;
      const userFilter = `data/leaders/iv/user eq '${userId}'`;
      const activeFilter = `data/active/iv eq ${active}`;
      expect(squidexGraphqlClientMock.request).toHaveBeenCalledWith(
        expect.anything(),
        {
          filter: [teamFilter, userFilter, activeFilter].join(' and '),
          top: 50,
          skip: 0,
        },
      );
    });

    test('Should return the deduped result', async () => {
      const userId = 'eb531b6e-195c-46e2-b347-58fb86715033';
      const teamIds = ['team-id-1', 'team-id-3'];

      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        getSquidexInterestGroupsGraphqlResponse(),
      );
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        getSquidexInterestGroupsGraphqlResponse(),
      );

      const result = await dataProvider.fetch({
        filter: { userId, teamId: teamIds },
      });

      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result).toMatchObject(getListInterestGroupResponse());
    });*/
  });
});
