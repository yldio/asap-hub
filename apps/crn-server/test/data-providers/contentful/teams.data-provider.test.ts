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
  const contentfulRestClientMock: Environment = getContentfulEnvironmentMock();

  const teamDataProvider = new TeamContentfulDataProvider(
    contentfulGraphqlClientMock,
    contentfulRestClientMock,
  );

  const contentfulGraphqlClientMockServer =
    getContentfulGraphqlClientMockServer({
      Teams: () => getContenfulGraphqlTeam({}),
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

    test('Should return teams', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce(
        getContentfulTeamsGraphqlResponse(),
      );
      const result = await teamDataProvider.fetch({ take: 8, skip: 5 });

      expect(result).toEqual({
        total: 1,
        items: [getContentfulTeamDataObject()],
      });
    });

    test('Should query data properly when request does not have options', async () => {
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
      test('Should query data properly when active filter is true', async () => {
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
            where: {},
          }),
        );
      });

      test('Should query data properly when active filter is false', async () => {
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
        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          teamsCollection: {
            total: 3,
            items: [
              getContenfulGraphqlTeam({ tools: [] }),
              getContenfulGraphqlTeam({ tools }),
              getContenfulGraphqlTeam({ tools }),
            ],
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
        const brokenNameTools = [
          ...tools,
          {
            url: 'testUrl',
            name: null,
            description: 'tool description',
          },
        ];
        const fullTools = [
          ...tools,
          {
            url: 'testUrl',
            name: 'testTool',
            description: 'tool description',
          },
        ];

        contentfulGraphqlClientMock.request.mockResolvedValueOnce({
          teamsCollection: {
            total: 3,
            items: [
              {
                ...getContenfulGraphqlTeam({}),
                toolsCollection: {
                  items: brokenUrlTools,
                },
              },
              {
                ...getContenfulGraphqlTeam({}),
                toolsCollection: {
                  items: brokenNameTools,
                },
              },
              getContenfulGraphqlTeam({ tools: fullTools }),
            ],
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
        teams: getContenfulGraphqlTeam({}),
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
      jest
        .spyOn(contentfulRestClientMock, 'createEntry')
        .mockResolvedValueOnce(toolMock);
      jest.spyOn(toolMock, 'publish').mockResolvedValueOnce(toolMock);

      const teamMock = getEntry({});

      jest
        .spyOn(contentfulRestClientMock, 'getEntry')
        .mockResolvedValueOnce(teamMock);

      await teamDataProviderMock.update(teamId, { tools: [tool] });

      expect(contentfulRestClientMock.getEntry).toHaveBeenCalledWith(teamId);
      expect(contentfulRestClientMock.createEntry).toHaveBeenCalledWith(
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
    });

    test('Should clean tool payload by removing a property with empty string', async () => {
      const teamId = 'team-id-1';
      const tool = {
        url: 'https://example.com',
        name: 'good link',
        description: ' ',
      };

      const toolMock = getEntry({});
      jest
        .spyOn(contentfulRestClientMock, 'createEntry')
        .mockResolvedValueOnce(toolMock);
      jest.spyOn(toolMock, 'publish').mockResolvedValueOnce(toolMock);

      const teamMock = getEntry({});

      jest
        .spyOn(contentfulRestClientMock, 'getEntry')
        .mockResolvedValueOnce(teamMock);

      await teamDataProviderMock.update(teamId, { tools: [tool] });

      expect(contentfulRestClientMock.getEntry).toHaveBeenCalledWith(teamId);
      expect(contentfulRestClientMock.createEntry).toHaveBeenCalledWith(
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
    });
  });

  describe('Create method', () => {
    test('Should create a team', async () => {
      const teamMock = getEntry({});
      jest
        .spyOn(contentfulRestClientMock, 'createEntry')
        .mockResolvedValueOnce(teamMock);

      const teamDataObject = getTeamCreateDataObject();
      await teamDataProviderMock.create(teamDataObject);

      expect(contentfulRestClientMock.createEntry).toHaveBeenCalledWith(
        'teams',
        {
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
              'en-US': teamDataObject.tools,
            },
          },
        },
      );
    });
  });
});
