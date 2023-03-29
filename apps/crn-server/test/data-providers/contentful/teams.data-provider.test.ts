import { GraphQLError } from 'graphql';
import {
  getContentfulGraphqlClientMockServer,
  Environment,
} from '@asap-hub/contentful';

import {
  getContenfulGraphqlTeam,
  getContentfulTeamsGraphqlResponse,
  getTeamCreateDataObject,
  getTeamDataObject,
} from '../../fixtures/teams.fixtures';
import { getContentfulGraphqlClientMock } from '../../mocks/contentful-graphql-client.mock';
import { getContentfulEnvironmentMock } from '../../mocks/contentful-rest-client.mock';
import {
  TeamContentfulDataProvider,
  teamUnreadyResponse,
} from '../../../src/data-providers/contentful/teams.data-provider';
import { getEntry } from '../../fixtures/contentful.fixtures';

describe('Teams data provider', () => {
  const contentfulGraphqlClientMock = getContentfulGraphqlClientMock();
  const environmentMock = getContentfulEnvironmentMock();
  const contentfulRestClientMock: () => Promise<Environment> = () =>
    Promise.resolve(environmentMock);

  const teamDataProvider = new TeamContentfulDataProvider(
    contentfulGraphqlClientMock,
    contentfulRestClientMock,
  );

  const contentfulGraphqlClientMockServer =
    getContentfulGraphqlClientMockServer({
      Teams: () => getContenfulGraphqlTeam(),
    });

  const teamDataProviderMock = new TeamContentfulDataProvider(
    contentfulGraphqlClientMockServer,
    contentfulRestClientMock,
  );

  afterEach(() => {
    jest.resetAllMocks();
  });

  const getContentfulTeamDataObject = () => ({
    ...getTeamDataObject(),
    ...teamUnreadyResponse,
  });

  describe('Fetch method', () => {
    test('Should fetch the list of teams from Contentful GraphQl', async () => {
      const result = await teamDataProviderMock.fetch({});

      expect(result.items[0]).toMatchObject(getContentfulTeamDataObject());
    });

    test('Should return an empty result when no teams exist', async () => {
      const contentfulGraphQLResponse = getContentfulTeamsGraphqlResponse();
      contentfulGraphQLResponse.teamsCollection!.total = 0;
      contentfulGraphQLResponse.teamsCollection!.items = [];

      contentfulGraphqlClientMock.request.mockResolvedValueOnce(
        contentfulGraphQLResponse,
      );

      const result = await teamDataProvider.fetch({});

      expect(result).toEqual({
        items: [],
        total: 0,
      });
    });

    test('Should throw an error with a specific error message when the graphql client throws one', async () => {
      contentfulGraphqlClientMock.request.mockRejectedValueOnce(
        new GraphQLError('some error message'),
      );

      await expect(teamDataProvider.fetch({})).rejects.toThrow(
        'some error message',
      );
    });

    test('Should return an empty result when the query is returned as null', async () => {
      const contentfulGraphQLResponse = getContentfulTeamsGraphqlResponse();
      contentfulGraphQLResponse.teamsCollection = null;

      contentfulGraphqlClientMock.request.mockResolvedValueOnce(
        contentfulGraphQLResponse,
      );

      const result = await teamDataProvider.fetch({});

      expect(result).toEqual({
        items: [],
        total: 0,
      });
    });

    test('Should use default query params when request does not have any', async () => {
      const contentfulGraphQLResponse = getContentfulTeamsGraphqlResponse();

      contentfulGraphqlClientMock.request.mockResolvedValueOnce(
        contentfulGraphQLResponse,
      );

      const result = await teamDataProvider.fetch({});

      expect(result).toEqual({
        total: 1,
        items: [getContentfulTeamDataObject()],
      });

      expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          limit: 8,
          order: ['displayName_ASC'],
          skip: 0,
          where: {},
        }),
      );
    });

    describe('Active Filter', () => {
      test('Should return active teams only when active filter is true', async () => {
        contentfulGraphqlClientMock.request.mockResolvedValueOnce(
          getContentfulTeamsGraphqlResponse(),
        );

        const result = await teamDataProvider.fetch({
          take: 8,
          skip: 5,
          filter: {
            active: true,
          },
        });

        expect(result).toEqual({
          total: 1,
          items: [getContentfulTeamDataObject()],
        });

        expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
          expect.anything(),
          expect.objectContaining({
            limit: 8,
            order: ['displayName_ASC'],
            skip: 5,
            where: { inactiveSince_exists: false },
          }),
        );
      });

      test('Should return inactive teams only when active filter is false', async () => {
        contentfulGraphqlClientMock.request.mockResolvedValueOnce(
          getContentfulTeamsGraphqlResponse(),
        );

        const result = await teamDataProvider.fetch({
          take: 8,
          skip: 5,
          filter: {
            active: false,
          },
        });

        expect(result).toEqual({
          total: 1,
          items: [getContentfulTeamDataObject()],
        });

        expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
          expect.anything(),
          expect.objectContaining({
            limit: 8,
            order: ['displayName_ASC'],
            skip: 5,
            where: { inactiveSince_exists: true },
          }),
        );
      });
    });

    describe('Text Filter', () => {
      test('Should query data properly when passing search param and active filter is not set', async () => {
        contentfulGraphqlClientMock.request.mockResolvedValueOnce(
          getContentfulTeamsGraphqlResponse(),
        );

        const search = 'Tony Stark';
        const result = await teamDataProvider.fetch({
          search,
        });

        expect(result).toEqual({
          total: 1,
          items: [getContentfulTeamDataObject()],
        });
        expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
          expect.anything(),
          expect.objectContaining({
            limit: 8,
            order: ['displayName_ASC'],
            skip: 0,
            where: {
              OR: [
                { displayName_contains: 'Tony' },
                { displayName_contains: 'Stark' },
                { projectTitle_contains: 'Tony' },
                { projectTitle_contains: 'Stark' },
                { expertiseAndResourceTags_contains_some: ['Tony', 'Stark'] },
              ],
            },
          }),
        );
      });

      test('Should query data properly when passing search param and active filter is set', async () => {
        contentfulGraphqlClientMock.request.mockResolvedValueOnce(
          getContentfulTeamsGraphqlResponse(),
        );

        const search = 'Tony Stark';
        const result = await teamDataProvider.fetch({
          take: 8,
          skip: 5,
          search,
          filter: {
            active: false,
          },
        });

        expect(result).toEqual({
          total: 1,
          items: [getContentfulTeamDataObject()],
        });
        expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
          expect.anything(),
          expect.objectContaining({
            limit: 8,
            order: ['displayName_ASC'],
            skip: 5,
            where: {
              OR: [
                { displayName_contains: 'Tony' },
                { displayName_contains: 'Stark' },
                { projectTitle_contains: 'Tony' },
                { projectTitle_contains: 'Stark' },
                { expertiseAndResourceTags_contains_some: ['Tony', 'Stark'] },
              ],
              inactiveSince_exists: true,
            },
          }),
        );
      });
    });

    describe('Tools', () => {
      const tools = [
        {
          url: 'testUrl',
          name: 'slack',
          description: 'this is a test',
        },
      ];

      test('Should return team tools by default', async () => {
        const team1 = getContenfulGraphqlTeam();
        team1.toolsCollection!.items! = [];

        const team2 = getContenfulGraphqlTeam();
        team2.toolsCollection!.items! = tools;

        const team3 = getContenfulGraphqlTeam();
        team3.toolsCollection!.items! = tools;

        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          teamsCollection: {
            total: 3,
            items: [team1, team2, team3],
          },
        });

        const result = await teamDataProvider.fetch({
          take: 8,
          skip: 0,
        });
        expect(result.items[0]!.tools).toEqual([]);
        expect(result.items[1]!.tools).toEqual(tools);
        expect(result.items[2]!.tools).toEqual(tools);
      });

      test('should only return team tools with name and url defined', async () => {
        const brokenUrlTools = [
          ...tools,
          {
            url: null,
            name: 'testTool',
            description: 'tool description',
          },
        ];
        const team1 = getContenfulGraphqlTeam();
        team1.toolsCollection!.items! = brokenUrlTools;

        const brokenNameTools = [
          ...tools,
          {
            url: 'testUrl',
            name: null,
            description: 'tool description',
          },
        ];
        const team2 = getContenfulGraphqlTeam();
        team2.toolsCollection!.items! = brokenNameTools;

        const fullTools = [
          ...tools,
          {
            url: 'testUrl',
            name: 'testTool',
            description: 'tool description',
          },
        ];
        const team3 = getContenfulGraphqlTeam();
        team3.toolsCollection!.items! = fullTools;

        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          teamsCollection: {
            total: 3,
            items: [team1, team2, team3],
          },
        });

        const result = await teamDataProvider.fetch({
          take: 8,
          skip: 0,
        });
        expect(result.items[0]!.tools).toEqual(tools);
        expect(result.items[1]!.tools).toEqual(tools);
        expect(result.items[2]!.tools).toEqual(fullTools);
      });
    });
  });

  describe('Fetch-by-id method', () => {
    test('Should fetch the team from Contentful GraphQl', async () => {
      const teamId = 'team-id-0';
      const result = await teamDataProviderMock.fetchById(teamId);

      expect(result).toMatchObject(getContentfulTeamDataObject());
    });

    test('Should return null when the team is not found', async () => {
      const teamId = 'not-found';

      const contentfulGraphQLResponse = getContentfulTeamsGraphqlResponse();
      contentfulGraphQLResponse.teamsCollection = null;

      contentfulGraphqlClientMock.request.mockResolvedValueOnce(
        contentfulGraphQLResponse,
      );

      expect(await teamDataProvider.fetchById(teamId)).toBeNull();
    });

    test('Should throw an error with a specific error message when the graphql client throws one', async () => {
      const id = 'some-id';
      contentfulGraphqlClientMock.request.mockRejectedValueOnce(
        new GraphQLError('some error message'),
      );

      await expect(teamDataProvider.fetchById(id)).rejects.toThrow(
        'some error message',
      );
    });

    test('Should return the result when the team exists', async () => {
      const id = 'some-id';
      const contentfulGraphQLResponse = {
        teams: getContenfulGraphqlTeam(),
      };

      contentfulGraphqlClientMock.request.mockResolvedValueOnce(
        contentfulGraphQLResponse,
      );

      const result = await teamDataProvider.fetchById(id);

      expect(result).toEqual(getContentfulTeamDataObject());
      expect(contentfulGraphqlClientMock.request).toBeCalledWith(
        expect.anything(),
        expect.objectContaining({
          id,
        }),
      );
    });
  });

  describe('Update method', () => {
    test('Should update the team', async () => {
      const teamId = 'team-id-1';
      const tool = {
        name: 'Youtube Channel',
        description: 'Youtube channel with team videos',
        url: 'http://www.youtube.com/abcde',
      };

      const toolMock = getEntry({});
      environmentMock.createEntry.mockResolvedValueOnce(toolMock);
      toolMock.publish = jest.fn().mockResolvedValueOnce(toolMock);

      const teamMock = getEntry({});
      environmentMock.getEntry.mockResolvedValueOnce(teamMock);
      const teamMockUpdated = getEntry({});
      teamMock.patch = jest.fn().mockResolvedValueOnce(teamMockUpdated);

      await teamDataProviderMock.update(teamId, { tools: [tool] });

      expect(environmentMock.getEntry).toHaveBeenCalledWith(teamId);
      expect(environmentMock.createEntry).toHaveBeenCalledWith(
        'externalTools',
        {
          fields: {
            description: { 'en-US': tool.description },
            name: { 'en-US': tool.name },
            url: { 'en-US': tool.url },
          },
        },
      );
      expect(teamMock.patch).toHaveBeenCalledWith([
        {
          op: 'replace',
          path: '/fields/tools/en-US',
          value: [
            {
              sys: {
                id: 'entry-id',
                linkType: 'Entry',
                type: 'Link',
              },
            },
          ],
        },
      ]);

      expect(teamMockUpdated.publish).toHaveBeenCalled();
    });

    test('Should clean tool payload by removing a property with empty string', async () => {
      const teamId = 'team-id-1';
      const tool = {
        url: 'https://example.com',
        name: 'good link',
        description: ' ',
      };

      const toolMock = getEntry({});
      environmentMock.createEntry.mockResolvedValueOnce(toolMock);
      toolMock.publish = jest.fn().mockResolvedValueOnce(toolMock);

      const teamMock = getEntry({});
      const teamMockUpdated = getEntry({});
      teamMock.patch = jest.fn().mockResolvedValueOnce(teamMockUpdated);

      environmentMock.getEntry.mockResolvedValueOnce(teamMock);

      await teamDataProviderMock.update(teamId, { tools: [tool] });

      expect(environmentMock.getEntry).toHaveBeenCalledWith(teamId);
      expect(environmentMock.createEntry).toHaveBeenCalledWith(
        'externalTools',
        {
          fields: {
            name: { 'en-US': tool.name },
            url: { 'en-US': tool.url },
          },
        },
      );
      expect(teamMock.patch).toHaveBeenCalledWith([
        {
          op: 'replace',
          path: '/fields/tools/en-US',
          value: [
            {
              sys: {
                id: 'entry-id',
                linkType: 'Entry',
                type: 'Link',
              },
            },
          ],
        },
      ]);
      expect(teamMockUpdated.publish).toHaveBeenCalled();
    });
  });

  describe('Create method', () => {
    test('Should create a team with tools', async () => {
      const toolMock = getEntry({
        sys: {
          id: 'tool-1',
        },
      });
      environmentMock.createEntry.mockResolvedValue(toolMock);
      toolMock.publish = jest.fn().mockResolvedValueOnce(toolMock);

      const teamDataObject = getTeamCreateDataObject();
      await teamDataProviderMock.create(teamDataObject);

      const tool = teamDataObject.tools![0];
      const createEntryFn = environmentMock.createEntry;
      expect(createEntryFn).toHaveBeenCalledTimes(2);
      expect(createEntryFn).toHaveBeenNthCalledWith(1, 'externalTools', {
        fields: {
          description: { 'en-US': tool?.description },
          name: { 'en-US': tool?.name },
          url: { 'en-US': tool?.url },
        },
      });
      expect(createEntryFn).toHaveBeenNthCalledWith(2, 'teams', {
        fields: {
          applicationNumber: { 'en-US': teamDataObject.applicationNumber },
          displayName: { 'en-US': teamDataObject.displayName },
          expertiseAndResourceTags: {
            'en-US': teamDataObject.expertiseAndResourceTags,
          },
          inactiveSince: { 'en-US': teamDataObject.inactiveSince },
          projectSummary: { 'en-US': teamDataObject.projectSummary },
          projectTitle: {
            'en-US': teamDataObject.projectTitle,
          },
          researchOutputIds: { 'en-US': teamDataObject.researchOutputIds },
          tools: {
            'en-US': [
              {
                sys: {
                  type: 'Link',
                  linkType: 'Entry',
                  id: 'entry-id',
                },
              },
            ],
          },
        },
      });
    });

    test('Should create a team without tools', async () => {
      const teamMock = getEntry({});
      environmentMock.createEntry.mockResolvedValue(teamMock);

      const { tools, ...teamDataObject } = getTeamCreateDataObject();
      await teamDataProviderMock.create(teamDataObject);

      const createEntryFn = environmentMock.createEntry;
      expect(createEntryFn).toHaveBeenCalledTimes(1);
      expect(createEntryFn).toHaveBeenCalledWith('teams', {
        fields: {
          applicationNumber: { 'en-US': teamDataObject.applicationNumber },
          displayName: { 'en-US': teamDataObject.displayName },
          expertiseAndResourceTags: {
            'en-US': teamDataObject.expertiseAndResourceTags,
          },
          inactiveSince: { 'en-US': teamDataObject.inactiveSince },
          projectSummary: { 'en-US': teamDataObject.projectSummary },
          projectTitle: {
            'en-US': teamDataObject.projectTitle,
          },
          researchOutputIds: { 'en-US': teamDataObject.researchOutputIds },
        },
      });
    });
  });
});
