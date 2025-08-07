import { AnalyticsContentfulDataProvider } from '../../../../src/data-providers/contentful/analytics.data-provider';
import { getOsChampionQuery } from '../../../fixtures/analytics.fixtures';
import { getContentfulGraphqlClientMock } from '../../../mocks/contentful-graphql-client.mock';

const contentfulGraphqlClientMock = getContentfulGraphqlClientMock();
const analyticsDataProvider = new AnalyticsContentfulDataProvider(
  contentfulGraphqlClientMock,
);

test('Should return an empty result when the client returns an empty list', async () => {
  contentfulGraphqlClientMock.request.mockResolvedValueOnce({
    teamsCollection: {
      items: [],
      total: 0,
    },
  });

  const result = await analyticsDataProvider.fetchTeamCollaboration({});

  expect(result).toEqual({
    total: 0,
    items: [],
  });
});

test('Should return zero team awards and no users when the team membership collection is empty', async () => {
  const graphqlResponse = getOsChampionQuery();
  graphqlResponse.teamsCollection!.items[0]!.linkedFrom!.teamMembershipCollection!.items =
    [];
  contentfulGraphqlClientMock.request.mockResolvedValueOnce(graphqlResponse);

  const result = await analyticsDataProvider.fetchOSChampion({});

  expect(result).toEqual({
    total: 1,
    items: [
      {
        teamId: 'team-id-0',
        teamName: 'Team A',
        isTeamInactive: false,
        teamAwardsCount: 0,
        users: [],
      },
    ],
  });
});

test('Should return the correct team awards and user awards when the client returns a valid response', async () => {
  const graphqlResponse = getOsChampionQuery();
  contentfulGraphqlClientMock.request.mockResolvedValueOnce(graphqlResponse);

  const result = await analyticsDataProvider.fetchOSChampion({});

  expect(result).toEqual({
    total: 1,
    items: [
      {
        teamId: 'team-id-0',
        teamName: 'Team A',
        isTeamInactive: false,
        teamAwardsCount: 3,
        users: [
          {
            id: 'user-with-2-awards',
            name: 'Two-Awarded User',
            awardsCount: 2,
          },
          {
            id: 'user-with-1-award',
            name: 'One-Awarded User',
            awardsCount: 1,
          },
        ],
      },
    ],
  });
});
