import { NotFoundError } from '@asap-hub/errors';
import Teams from '../../src/controllers/team.controller';
import {
  getPublicTeamListItemDataObject,
  getTeamDataObject,
  getTeamResponse,
} from '../fixtures/teams.fixtures';

import { teamDataProviderMock } from '../mocks/team.data-provider.mock';

describe('Team Controller', () => {
  const teamController = new Teams(teamDataProviderMock);

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Fetch method', () => {
    test('Should return the teams', async () => {
      teamDataProviderMock.fetch.mockResolvedValueOnce({
        total: 1,
        items: [getTeamDataObject()],
      });

      const result = await teamController.fetch({});

      expect(result).toEqual({ items: [getTeamResponse()], total: 1 });
    });

    test('Should return an empty list when there are no teams', async () => {
      teamDataProviderMock.fetch.mockResolvedValueOnce({
        total: 0,
        items: [],
      });
      const result = await teamController.fetch({});

      expect(result).toEqual({ items: [], total: 0 });
    });

    test('Should call the data provider with correct parameters', async () => {
      teamDataProviderMock.fetch.mockResolvedValueOnce({
        total: 1,
        items: [getTeamDataObject()],
      });
      await teamController.fetch({ search: 'some-search', skip: 13, take: 9 });

      expect(teamDataProviderMock.fetch).toBeCalledWith({
        filter: {},
        search: 'some-search',
        skip: 13,
        take: 9,
      });
    });

    test.each`
      filter                    | filterValue
      ${['Active']}             | ${{ filter: { active: true } }}
      ${['Inactive']}           | ${{ filter: { active: false } }}
      ${[]}                     | ${{}}
      ${['Active', 'Inactive']} | ${{}}
    `(
      `Should call data provider with correct filter when filter is $filter`,
      async ({ filter, filterValue }) => {
        teamDataProviderMock.fetch.mockResolvedValueOnce({
          total: 1,
          items: [getTeamDataObject()],
        });

        await teamController.fetch({ filter });

        expect(teamDataProviderMock.fetch).toBeCalledWith(
          expect.objectContaining(filterValue),
        );
      },
    );
  });

  describe('FetchPublicTeams method', () => {
    test('Should return the teams', async () => {
      const publicTeam = getPublicTeamListItemDataObject();
      teamDataProviderMock.fetchPublicTeams.mockResolvedValue({
        total: 1,
        items: [publicTeam],
      });
      const result = await teamController.fetchPublicTeams({});

      expect(result).toEqual({ items: [publicTeam], total: 1 });
    });

    test('Should return empty list when there are no teams', async () => {
      teamDataProviderMock.fetchPublicTeams.mockResolvedValue({
        total: 0,
        items: [],
      });
      const result = await teamController.fetchPublicTeams({});

      expect(result).toEqual({ items: [], total: 0 });
    });
  });

  describe('Fetch-by-ID method', () => {
    test('Should throw when team is not found', async () => {
      teamDataProviderMock.fetchById.mockResolvedValueOnce(null);

      await expect(teamController.fetchById('not-found')).rejects.toThrow(
        NotFoundError,
      );
    });

    test('Should return the team when it finds it', async () => {
      teamDataProviderMock.fetchById.mockResolvedValueOnce(getTeamDataObject());
      const result = await teamController.fetchById('team-id');

      expect(result).toEqual(getTeamResponse());
    });

    test('Should not display the team tools if the parameter is set to false', async () => {
      const teamDataObject = getTeamDataObject();
      teamDataObject.tools = [
        {
          name: 'tool name',
          url: 'tool url',
        },
      ];
      teamDataProviderMock.fetchById.mockResolvedValueOnce(getTeamDataObject());
      const result = await teamController.fetchById('team-id', {
        showTools: false,
        internalAPI: true,
      });

      expect(result.tools).toBeUndefined();
    });
  });

  describe('Update method', () => {
    const teamTools = [
      {
        name: 'tool name',
        url: 'tool url',
      },
      {
        name: 'tool name',
        url: 'tool url',
      },
    ];

    test('Should return the newly updated user', async () => {
      const mockResponse = getTeamDataObject();
      teamDataProviderMock.fetchById.mockResolvedValue(mockResponse);
      const result = await teamController.update('user-id', teamTools);

      expect(result).toEqual(mockResponse);
    });

    test('Should call the data provider with input data', async () => {
      teamDataProviderMock.fetchById.mockResolvedValue(getTeamDataObject());

      await teamController.update('user-id', teamTools);

      expect(teamDataProviderMock.update).toHaveBeenCalledWith('user-id', {
        tools: teamTools,
      });
    });

    test('Should remove description from the payload when its an empty string', async () => {
      const teamToolsEmptyDescription = [
        {
          url: 'https://example.com',
          name: 'good link',
          description: '',
        },
      ];
      teamDataProviderMock.fetchById.mockResolvedValue(getTeamDataObject());

      await teamController.update('user-id', teamToolsEmptyDescription);

      const expectedTools = [
        {
          url: 'https://example.com',
          name: 'good link',
        },
      ];
      expect(teamDataProviderMock.update).toHaveBeenCalledWith('user-id', {
        tools: expectedTools,
      });
    });
  });
});
