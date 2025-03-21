import {
  FetchUserResearchOutputsQuery,
  FETCH_TEAM_PRODUCTIVITY,
  FETCH_USER_PRODUCTIVITY,
  getContentfulGraphqlClientMockServer,
} from '@asap-hub/contentful';
import { AnalyticsContentfulDataProvider } from '../../../../src/data-providers/contentful/analytics.data-provider';
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

describe('fetchUserProductivity', () => {
  beforeAll(() => {
    jest.useFakeTimers();

    jest.setSystemTime(new Date('2023-09-10T03:00:00.000Z'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  const graphqlUser = getContentfulGraphqlUser();

  const contentfulGraphqlClientMockServer =
    getContentfulGraphqlClientMockServer({
      Users: () => ({
        ...graphqlUser,
        linkedFrom: () => graphqlUser.linkedFrom,
        teamsCollection: () => graphqlUser.teamsCollection,
      }),
      ResearchOutputs: () => ({
        addedDate: '2023-09-03T03:00:00.000Z',
        asapFunded: 'Yes',
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

  test('Should return only asap funded research outputs', async () => {
    const graphqlResponse = getUserProductivityQuery();
    const authorDetails = {
      items: [
        {
          __typename: 'Users',
          sys: {
            id: 'user-1',
          },
        },
      ],
    } as AuthorsCollection;

    graphqlResponse.usersCollection!.items[0]!.linkedFrom!.researchOutputsCollection!.items =
      [
        {
          addedDate: '2023-09-05T03:00:00.000Z',
          sharingStatus: 'Network Only',
          asapFunded: 'No',
          authorsCollection: authorDetails,
        },
        {
          addedDate: '2023-09-05T03:00:00.000Z',
          sharingStatus: 'Public',
          asapFunded: 'Not Sure',
          authorsCollection: authorDetails,
        },
        {
          addedDate: '2023-09-03T03:00:00.000Z',
          sharingStatus: 'Public',
          asapFunded: 'Yes',
          authorsCollection: authorDetails,
        },
        {
          addedDate: '2023-09-03T03:00:00.000Z',
          sharingStatus: 'Network Only',
          asapFunded: 'Yes',
          authorsCollection: authorDetails,
        },
      ];

    contentfulGraphqlClientMock.request.mockResolvedValueOnce(graphqlResponse);

    const result = await analyticsDataProvider.fetchUserProductivity({});

    expect(result).toEqual({
      items: [
        {
          ...getUserProductivityDataObject(),
          asapOutput: 2,
          asapPublicOutput: 1,
          ratio: '0.50',
        },
      ],
      total: 1,
    });
  });

  test('Should return the user productivity considering all publications', async () => {
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
          sys: { id: '1' },
          displayName: null,
          inactiveSince: null,
        },
      },
      {
        role: 'Collaborating PI',
        inactiveSinceDate: null,
        team: {
          sys: { id: '2' },
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
          id: '2',
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
          sys: { id: '1' },
          displayName: 'Team Alessi',
          inactiveSince: null,
        },
      },
      {
        role: null,
        inactiveSinceDate: null,
        team: {
          sys: { id: '2' },
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
          id: '1',
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
  const graphqlTeam = getContentfulGraphqlTeam();
  const contentfulGraphqlClientMockServer =
    getContentfulGraphqlClientMockServer({
      Teams: () => ({
        ...graphqlTeam,
        linkedFrom: () => graphqlTeam.linkedFrom,
      }),
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
          'Lab Material': 0,
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
          'Lab Material': 0,
          Protocol: 0,
        },
      ],
    });
  });

  test('Should return only asap funded research outputs', async () => {
    const graphqlResponse = getTeamProductivityQuery();
    graphqlResponse.teamsCollection!.items[0]!.linkedFrom!.researchOutputsCollection!.items =
      [
        {
          addedDate: '2023-09-05T03:00:00.000Z',
          documentType: 'Article',
          asapFunded: 'No',
        },
        {
          addedDate: '2023-09-05T03:00:00.000Z',
          documentType: 'Article',
          asapFunded: 'Yes',
        },
        {
          addedDate: '2023-09-03T03:00:00.000Z',
          documentType: 'Bioinformatics',
          asapFunded: 'No',
        },
        {
          addedDate: '2023-09-03T03:00:00.000Z',
          documentType: 'Bioinformatics',
          asapFunded: 'Yes',
        },
      ];
    contentfulGraphqlClientMock.request.mockResolvedValueOnce(graphqlResponse);

    const result = await analyticsDataProvider.fetchTeamProductivity({});

    expect(result).toEqual({
      total: 1,
      items: [
        {
          ...getTeamProductivityDataObject(),
          Article: 1,
          Bioinformatics: 1,
          Dataset: 0,
          'Lab Material': 0,
          Protocol: 0,
        },
      ],
    });
  });

  test('Should only count the research outputs with the sharing status Public when the public output type filter is applied', async () => {
    const graphqlResponse = getTeamProductivityQuery();
    graphqlResponse.teamsCollection!.items[0]!.linkedFrom!.researchOutputsCollection!.items =
      [
        {
          addedDate: '2023-09-05T03:00:00.000Z',
          asapFunded: 'Yes',
          documentType: 'Article',
          sharingStatus: 'Network Only',
        },
        {
          addedDate: '2023-09-05T03:00:00.000Z',
          asapFunded: 'Yes',
          documentType: 'Article',
          sharingStatus: 'Public',
        },
        {
          addedDate: '2023-09-03T03:00:00.000Z',
          asapFunded: 'Yes',
          documentType: 'Bioinformatics',
          sharingStatus: 'Public',
        },
        {
          addedDate: '2023-09-03T03:00:00.000Z',
          asapFunded: 'Yes',
          documentType: 'Bioinformatics',
          sharingStatus: 'Network Only',
        },
      ];
    contentfulGraphqlClientMock.request.mockResolvedValueOnce(graphqlResponse);

    const result = await analyticsDataProvider.fetchTeamProductivity({
      filter: {
        outputType: 'public',
      },
    });

    expect(result).toEqual({
      total: 1,
      items: [
        {
          ...getTeamProductivityDataObject(),
          Article: 1,
          Bioinformatics: 1,
          Dataset: 0,
          'Lab Material': 0,
          Protocol: 0,
        },
      ],
    });
  });

  test('Should count research outputs with all sharing statuses output type filter of "all" is applied', async () => {
    const graphqlResponse = getTeamProductivityQuery();
    graphqlResponse.teamsCollection!.items[0]!.linkedFrom!.researchOutputsCollection!.items =
      [
        {
          addedDate: '2023-09-05T03:00:00.000Z',
          asapFunded: 'Yes',
          documentType: 'Article',
          sharingStatus: 'Network Only',
        },
        {
          addedDate: '2023-09-05T03:00:00.000Z',
          asapFunded: 'Yes',
          documentType: 'Article',
          sharingStatus: 'Public',
        },
        {
          addedDate: '2023-09-03T03:00:00.000Z',
          asapFunded: 'Yes',
          documentType: 'Bioinformatics',
          sharingStatus: 'Public',
        },
        {
          addedDate: '2023-09-03T03:00:00.000Z',
          asapFunded: 'Yes',
          documentType: 'Bioinformatics',
          sharingStatus: 'Network Only',
        },
      ];
    contentfulGraphqlClientMock.request.mockResolvedValueOnce(graphqlResponse);

    const result = await analyticsDataProvider.fetchTeamProductivity({
      filter: {
        outputType: 'all',
      },
    });

    expect(result).toEqual({
      total: 1,
      items: [
        {
          ...getTeamProductivityDataObject(),
          Article: 2,
          Bioinformatics: 2,
          Dataset: 0,
          'Lab Material': 0,
          Protocol: 0,
        },
      ],
    });
  });

  test('Should return the number of research outputs published since launch', async () => {
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

type AuthorsCollection = NonNullable<
  NonNullable<
    NonNullable<
      NonNullable<
        NonNullable<
          FetchUserResearchOutputsQuery['usersCollection']
        >['items'][number]
      >['linkedFrom']
    >['researchOutputsCollection']
  >['items'][number]
>['authorsCollection'];
