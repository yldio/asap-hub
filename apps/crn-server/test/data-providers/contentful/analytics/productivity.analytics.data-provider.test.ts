import {
  FETCH_TEAM_PRODUCTIVITY,
  FETCH_USER_PRODUCTIVITY,
  getContentfulGraphqlClientMockServer,
} from '@asap-hub/contentful';
import { TimeRangeOption } from '@asap-hub/model';
import {
  AnalyticsContentfulDataProvider,
  getFilterOutputByRange,
} from '../../../../src/data-providers/contentful/analytics.data-provider';
import {
  getResearchOutputTeamProductivity,
  getTeamProductivityDataObject,
  getTeamProductivityQuery,
  getUserProductivityDataObject,
  getUserProductivityQuery,
} from '../../../fixtures/analytics.fixtures';
import { getContentfulGraphqlTeam } from '../../../fixtures/teams.fixtures';
import { getContentfulGraphqlUser } from '../../../fixtures/users.fixtures';
import { getContentfulGraphqlClientMock } from '../../../mocks/contentful-graphql-client.mock';

const contentfulGraphqlClientMock = getContentfulGraphqlClientMock();
const analyticsDataProvider = new AnalyticsContentfulDataProvider(
  contentfulGraphqlClientMock,
);

describe('filtering', () => {
  beforeAll(() => {
    jest.useFakeTimers();

    jest.setSystemTime(new Date('2023-09-10T03:00:00.000Z'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });
  describe('getFilterOutputByRange', () => {
    it.each<{
      key?: TimeRangeOption;
      inRange: string;
      out: string;
    }>([
      {
        inRange: '2023-09-05T03:00:00.000Z',
        out: '2023-08-05T03:00:00.000Z',
      },
      {
        key: '30d',
        inRange: '2023-09-05T03:00:00.000Z',
        out: '2023-08-05T03:00:00.000Z',
      },
      {
        key: '90d',
        inRange: '2023-08-05T03:00:00.000Z',
        out: '2023-06-05T03:00:00.000Z',
      },
      {
        key: 'current-year',
        inRange: '2023-09-10T03:00:00.000Z',
        out: '2022-12-31T03:00:00.000Z',
      },
      {
        key: 'last-year',
        inRange: '2022-09-10T03:00:00.000Z',
        out: '2022-09-09T03:00:00.000Z',
      },
    ])('filters outputs for time range $key', ({ key, inRange, out }) => {
      const items = [
        { sys: { publishedAt: inRange } },
        { sys: { publishedAt: out } },
      ];

      expect(items.filter(getFilterOutputByRange(key)).length).toBe(1);
    });
    it('does not filter when rangeKey is "all"', () => {
      const items = [
        { sys: { publishedAt: '1980-09-10T03:00:00.000Z' } },
        { sys: { publishedAt: '2022-09-10T03:00:00.000Z' } },
        { sys: { publishedAt: '2040-09-10T03:00:00.000Z' } },
      ];

      expect(items.filter(getFilterOutputByRange('all')).length).toBe(3);
    });
  });
});

describe('fetchUserProductivity', () => {
  beforeAll(() => {
    jest.useFakeTimers();

    jest.setSystemTime(new Date('2023-09-10T03:00:00.000Z'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  const contentfulGraphqlClientMockServer =
    getContentfulGraphqlClientMockServer({
      Users: () => getContentfulGraphqlUser(),
      ResearchOutputs: () => ({
        sys: {
          publishedAt: '2023-09-03T03:00:00.000Z',
        },
        sharingStatus: 'Network Only',
        authorsCollection: {
          items: [
            {
              __typename: 'Users',
              sys: {
                id: 'user-id-1',
              },
            },
          ],
        },
      }),
    });
  const analyticsDataProviderMockGraphql = new AnalyticsContentfulDataProvider(
    contentfulGraphqlClientMockServer,
  );

  describe('Pagination', () => {
    test('Should apply pagination parameters', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce(
        getUserProductivityQuery(),
      );

      await analyticsDataProvider.fetchUserProductivity({
        take: 13,
        skip: 3,
      });

      expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
        FETCH_USER_PRODUCTIVITY,
        expect.objectContaining({
          limit: 13,
          skip: 3,
        }),
      );
    });

    test('Should pass default pagination parameters', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce(
        getUserProductivityQuery(),
      );

      await analyticsDataProvider.fetchUserProductivity({});

      expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
        FETCH_USER_PRODUCTIVITY,
        expect.objectContaining({
          limit: 10,
          skip: 0,
        }),
      );
    });
  });

  test('Should fetch the list of user productivity from Contentful GraphQl', async () => {
    const result = await analyticsDataProviderMockGraphql.fetchUserProductivity(
      {},
    );

    expect(result).toMatchObject({
      total: 1,
      items: [
        {
          asapOutput: 1,
          asapPublicOutput: 0,
          id: 'user-id-1',
          isAlumni: true,
          name: 'Tom (Iron Man) Hardy',
          ratio: '0.00',
          teams: [
            {
              isTeamInactive: false,
              isUserInactiveOnTeam: false,
              role: 'Lead PI (Core Leadership)',
              team: 'Team A',
            },
          ],
        },
      ],
    });
  });

  test('Should return an empty result when the client returns an empty list', async () => {
    contentfulGraphqlClientMock.request.mockResolvedValueOnce({
      usersCollection: {
        items: [],
        total: 0,
      },
    });

    const result = await analyticsDataProvider.fetchUserProductivity({});

    expect(result).toEqual({
      total: 0,
      items: [],
    });
  });

  test('Should return an empty result when the client returns usersCollection as null', async () => {
    contentfulGraphqlClientMock.request.mockResolvedValueOnce({
      usersCollection: null,
    });

    const result = await analyticsDataProvider.fetchUserProductivity({});

    expect(result).toEqual({
      total: 0,
      items: [],
    });
  });

  test('Should return the count of outputs as zero when the client returns researchOutputCollection as null', async () => {
    const graphqlResponse = getUserProductivityQuery();
    graphqlResponse.usersCollection!.items[0]!.linkedFrom!.researchOutputsCollection =
      null;
    contentfulGraphqlClientMock.request.mockResolvedValueOnce(graphqlResponse);

    const result = await analyticsDataProvider.fetchUserProductivity({});

    expect(result).toEqual({
      total: 1,
      items: [
        {
          ...getUserProductivityDataObject(),
          asapOutput: 0,
          asapPublicOutput: 0,
          ratio: '0.00',
        },
      ],
    });
  });

  test('Should return the user productivity considering publications from last month', async () => {
    contentfulGraphqlClientMock.request.mockResolvedValueOnce(
      getUserProductivityQuery(),
    );

    const result = await analyticsDataProvider.fetchUserProductivity({});

    expect(result).toEqual({
      items: [getUserProductivityDataObject()],
      total: 1,
    });
  });

  test('Should return an empty teams list when teamsCollection is null', async () => {
    const graphqlResponse = getUserProductivityQuery();
    graphqlResponse.usersCollection!.items[0]!.teamsCollection = null;
    contentfulGraphqlClientMock.request.mockResolvedValueOnce(graphqlResponse);

    const result = await analyticsDataProvider.fetchUserProductivity({});

    expect(result.items[0]).toEqual({
      ...getUserProductivityDataObject(),
      teams: [],
    });
  });

  test('Should filter teams without display name', async () => {
    const graphqlResponse = getUserProductivityQuery();
    graphqlResponse.usersCollection!.items[0]!.teamsCollection!.items = [
      {
        role: 'Co-PI (Core Leadership)',
        inactiveSinceDate: null,
        team: {
          displayName: null,
          inactiveSince: null,
        },
      },
      {
        role: 'Collaborating PI',
        inactiveSinceDate: null,
        team: {
          displayName: 'Team De Camilli',
          inactiveSince: null,
        },
      },
    ];
    contentfulGraphqlClientMock.request.mockResolvedValueOnce(graphqlResponse);

    const result = await analyticsDataProvider.fetchUserProductivity({});

    expect(result.items[0]).toEqual({
      ...getUserProductivityDataObject(),
      teams: [
        {
          isTeamInactive: false,
          isUserInactiveOnTeam: false,
          role: 'Collaborating PI',
          team: 'Team De Camilli',
        },
      ],
    });
  });
  test('Should filter team membership without roles', async () => {
    const graphqlResponse = getUserProductivityQuery();
    graphqlResponse.usersCollection!.items[0]!.teamsCollection!.items = [
      {
        role: 'Co-PI (Core Leadership)',
        inactiveSinceDate: null,
        team: {
          displayName: 'Team Alessi',
          inactiveSince: null,
        },
      },
      {
        role: null,
        inactiveSinceDate: null,
        team: {
          displayName: 'Team De Camilli',
          inactiveSince: null,
        },
      },
    ];
    contentfulGraphqlClientMock.request.mockResolvedValueOnce(graphqlResponse);

    const result = await analyticsDataProvider.fetchUserProductivity({});

    expect(result.items[0]).toEqual({
      ...getUserProductivityDataObject(),
      teams: [
        {
          isTeamInactive: false,
          isUserInactiveOnTeam: false,
          role: 'Co-PI (Core Leadership)',
          team: 'Team Alessi',
        },
      ],
    });
  });
});

describe('fetchTeamProductivity', () => {
  beforeAll(() => {
    jest.useFakeTimers();

    jest.setSystemTime(new Date('2023-09-10T03:00:00.000Z'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  const contentfulGraphqlClientMockServer =
    getContentfulGraphqlClientMockServer({
      Users: () => getContentfulGraphqlUser(),
      Teams: () => getContentfulGraphqlTeam(),
      ResearchOutputs: () => getResearchOutputTeamProductivity()[0],
    });

  const analyticsDataProviderMockGraphql = new AnalyticsContentfulDataProvider(
    contentfulGraphqlClientMockServer,
  );

  describe('Pagination', () => {
    test('Should apply pagination parameters', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce(
        getTeamProductivityQuery(),
      );

      await analyticsDataProvider.fetchTeamProductivity({
        take: 13,
        skip: 3,
      });

      expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
        FETCH_TEAM_PRODUCTIVITY,
        expect.objectContaining({
          limit: 13,
          skip: 3,
        }),
      );
    });

    test('Should pass default pagination parameters', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce(
        getTeamProductivityQuery(),
      );

      await analyticsDataProvider.fetchTeamProductivity({});

      expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
        FETCH_TEAM_PRODUCTIVITY,
        expect.objectContaining({
          limit: 10,
          skip: 0,
        }),
      );
    });
  });

  test('Should fetch the list of team productivity from Contentful GraphQl', async () => {
    const result = await analyticsDataProviderMockGraphql.fetchTeamProductivity(
      {},
    );

    expect(result).toMatchObject({
      total: 1,
      items: [
        {
          ...getTeamProductivityDataObject(),
          Article: 1,
          Bioinformatics: 0,
          Dataset: 0,
          'Lab Resource': 0,
          Protocol: 0,
        },
      ],
    });
  });

  test('Should return an empty result when the client returns an empty list', async () => {
    contentfulGraphqlClientMock.request.mockResolvedValueOnce({
      teamsCollection: {
        items: [],
        total: 0,
      },
    });

    const result = await analyticsDataProvider.fetchTeamProductivity({});

    expect(result).toEqual({
      total: 0,
      items: [],
    });
  });

  test('Should return an empty result when the client returns teamsCollection as null', async () => {
    contentfulGraphqlClientMock.request.mockResolvedValueOnce({
      teamsCollection: null,
    });

    const result = await analyticsDataProvider.fetchTeamProductivity({});

    expect(result).toEqual({
      total: 0,
      items: [],
    });
  });

  test('Should return the count of outputs as zero when the client returns researchOutputCollection as null', async () => {
    const graphqlResponse = getTeamProductivityQuery();
    graphqlResponse.teamsCollection!.items[0]!.linkedFrom!.researchOutputsCollection =
      null;
    contentfulGraphqlClientMock.request.mockResolvedValueOnce(graphqlResponse);

    const result = await analyticsDataProvider.fetchTeamProductivity({});

    expect(result).toEqual({
      total: 1,
      items: [
        {
          ...getTeamProductivityDataObject(),
          Article: 0,
          Bioinformatics: 0,
          Dataset: 0,
          'Lab Resource': 0,
          Protocol: 0,
        },
      ],
    });
  });

  test('Should return the number of research outputs published in the last month', async () => {
    contentfulGraphqlClientMock.request.mockResolvedValueOnce(
      getTeamProductivityQuery(),
    );

    const result = await analyticsDataProvider.fetchTeamProductivity({});

    expect(result).toEqual({
      total: 1,
      items: [getTeamProductivityDataObject()],
    });
  });
});
