import { NotFoundError } from '@asap-hub/errors';
import Teams from '../../src/controllers/teams';
import { getTeamDataObject, getTeamResponse } from '../fixtures/teams.fixtures';

import { teamDataProviderMock } from '../mocks/team-data-provider.mock';

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

    test('Should only show selected team tools', async () => {
      const teamDataObject = getTeamDataObject();
      const teamTools = [
        {
          name: 'tool name',
          url: 'tool url',
        },
      ];
      teamDataObject.tools = teamTools;
      const teamItems = [
        {
          ...teamDataObject,
          id: 'team-id-1',
        },
        {
          ...teamDataObject,
          id: 'team-id-2',
        },
      ];
      teamDataProviderMock.fetch.mockResolvedValueOnce({
        total: 1,
        items: teamItems,
      });
      const result = await teamController.fetch({
        showTeamTools: ['team-id-2'],
      });

      expect(result.items[0]!.tools).toBeUndefined();
      expect(result.items[1]!.tools).toEqual(teamTools);
    });

    test('Should call the data provider with correct parameters', async () => {
      teamDataProviderMock.fetch.mockResolvedValueOnce({
        total: 1,
        items: [getTeamDataObject()],
      });
      await teamController.fetch({ search: 'some-search', skip: 13, take: 9 });

      expect(teamDataProviderMock.fetch).toBeCalledWith({
        search: 'some-search',
        skip: 13,
        take: 9,
      });
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
