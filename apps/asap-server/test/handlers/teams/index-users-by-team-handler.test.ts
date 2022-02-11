import Boom from '@hapi/boom';
import { ListUserResponse } from '@asap-hub/model';
import { BatchRequest } from '@asap-hub/algolia';
import { indexTeamsUsersHandler } from '../../../src/handlers/teams/index-users-by-team-handler';
import {
  getUserResponse,
  getListUserResponse,
} from '../../fixtures/users.fixtures';

import {
  getTeamResponse,
  createEvent,
  updateEvent,
  unpublishedEvent,
  deleteEvent,
  TeamEventGenerator,
} from '../../fixtures/teams.fixtures';

import { algoliaSearchClientMock } from '../../mocks/algolia-client.mock';
import { userControllerMock } from '../../mocks/user-controller.mock';
import { teamControllerMock } from '../../mocks/team-controller.mock';

const getUsersBatchCall = (users: ListUserResponse): BatchRequest[] =>
  users.items.map((user) => ({
    action: 'updateObject',
    body: user,
  }));

const possibleEvents: [string, TeamEventGenerator][] = [
  ['created', createEvent],
  ['updated', updateEvent],
  ['unpublished', unpublishedEvent],
  ['deleted', deleteEvent],
];

const possibleRacingConditionEvents: [
  string,
  TeamEventGenerator,
  TeamEventGenerator,
][] = [
  ['created and updated', createEvent, updateEvent],
  ['updated and created', updateEvent, createEvent],

  ['created and unpublished', createEvent, unpublishedEvent],
  ['unpublished and created', unpublishedEvent, createEvent],

  ['created and deleted', createEvent, deleteEvent],
  ['deleted and created', deleteEvent, createEvent],

  ['updated and deleted', updateEvent, deleteEvent],
  ['deleted and updated', deleteEvent, updateEvent],

  ['updated and unpublished', updateEvent, unpublishedEvent],
  ['unpublished and updated', unpublishedEvent, updateEvent],
];

describe('Index Users on Team event handler', () => {
  const indexHandler = indexTeamsUsersHandler(
    teamControllerMock,
    userControllerMock,
    algoliaSearchClientMock,
  );

  afterEach(() => jest.clearAllMocks());

  test('Should throw an error and do not trigger algolia when the team request fails with another error code', async () => {
    teamControllerMock.fetchById.mockRejectedValue(Boom.badData());

    await expect(indexHandler(createEvent('team-1234'))).rejects.toThrow(
      Boom.badData(),
    );
    expect(algoliaSearchClientMock.batch).not.toHaveBeenCalled();
  });

  test('Should throw the algolia error when saving the record fails', async () => {
    const algoliaError = new Error('ERROR');

    teamControllerMock.fetchById.mockResolvedValueOnce(getTeamResponse());
    algoliaSearchClientMock.batch.mockRejectedValueOnce(algoliaError);

    await expect(indexHandler(updateEvent('team-1234'))).rejects.toThrow(
      algoliaError,
    );
  });

  test.concurrent.each(possibleEvents)(
    'Should index users when team event %s occurs',
    async (name, eventA) => {
      const usersBatchResponse = getUsersBatchCall(getListUserResponse());
      teamControllerMock.fetchById.mockResolvedValueOnce(getTeamResponse());
      userControllerMock.fetchById.mockResolvedValueOnce(getUserResponse());

      await indexHandler(eventA('team-1234'));

      expect(algoliaSearchClientMock.batch).toHaveBeenCalledWith(
        usersBatchResponse,
      );
    },
  );

  describe('Should process the events, handle race conditions and not rely on the order of the events', () => {
    test.concurrent.each(possibleRacingConditionEvents)(
      'recieves the events %s',
      async (name, eventA, eventB) => {
        teamControllerMock.fetchById.mockResolvedValue(getTeamResponse());
        userControllerMock.fetchById.mockResolvedValue(getUserResponse());

        await indexHandler(eventA('team-1234'));
        await indexHandler(eventB('team-1234'));

        expect(algoliaSearchClientMock.batch).toHaveBeenCalledTimes(2);
        expect(algoliaSearchClientMock.batch).toHaveBeenCalledWith(
          getUsersBatchCall(getListUserResponse()),
        );
      },
    );

    test.concurrent.each(possibleRacingConditionEvents)(
      'recieves the events %s when team is not found',
      async (name, eventA, eventB) => {
        teamControllerMock.fetchById.mockRejectedValue(Boom.notFound());

        await indexHandler(eventA('team-1234'));
        const updateResonse = await indexHandler(eventB('team-1234'));

        expect(updateResonse).toBeUndefined();
        expect(algoliaSearchClientMock.batch).not.toHaveBeenCalled();
      },
    );
  });
});
