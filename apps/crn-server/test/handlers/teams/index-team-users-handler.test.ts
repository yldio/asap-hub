import Boom from '@hapi/boom';
import { toPayload } from '../../helpers/algolia';
import { indexTeamUsersHandler } from '../../../src/handlers/teams/index-team-users-handler';
import {
  getListUserResponse,
  getUserResponse,
} from '../../fixtures/users.fixtures';

import {
  createEvent,
  updateEvent,
  unpublishedEvent,
  deleteEvent,
  TeamEventGenerator,
} from '../../fixtures/teams.fixtures';

import { algoliaSearchClientMock } from '../../mocks/algolia-client.mock';
import { userControllerMock } from '../../mocks/user-controller.mock';

const mapPayload = toPayload('user');

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
  const indexHandler = indexTeamUsersHandler(
    userControllerMock,
    algoliaSearchClientMock,
  );
  afterEach(() => jest.clearAllMocks());

  test('Should throw an error and do not trigger algolia when the team request fails with another error code', async () => {
    userControllerMock.fetch.mockRejectedValue(Boom.badData());

    await expect(indexHandler(createEvent('team-1234'))).rejects.toThrow(
      Boom.badData(),
    );
    expect(algoliaSearchClientMock.saveMany).not.toHaveBeenCalled();
  });

  test('Should throw the algolia error when saving the record fails', async () => {
    const algoliaError = new Error('ERROR');

    userControllerMock.fetch.mockResolvedValueOnce(getListUserResponse());
    algoliaSearchClientMock.saveMany.mockRejectedValueOnce(algoliaError);

    await expect(indexHandler(updateEvent('team-1234'))).rejects.toThrow(
      algoliaError,
    );
  });

  test('Should omit non-onboarded and Hidden users', async () => {
    userControllerMock.fetch.mockResolvedValueOnce({
      total: 3,
      items: [
        getUserResponse(),
        { ...getUserResponse(), role: 'Hidden' },
        { ...getUserResponse(), onboarded: false },
      ],
    });

    await indexHandler(updateEvent('lab-1234'));

    expect(algoliaSearchClientMock.saveMany).toHaveBeenCalledWith([
      mapPayload(getUserResponse()),
    ]);
  });

  test.each(possibleEvents)(
    'Should index users when team event %s occurs',
    async (name, eventA) => {
      const usersResponse = getListUserResponse();

      const event = eventA('team-1234');
      userControllerMock.fetch.mockResolvedValueOnce(usersResponse);

      await indexHandler(event);

      expect(algoliaSearchClientMock.saveMany).toHaveBeenCalledWith(
        usersResponse.items.map(mapPayload),
      );
    },
  );

  describe('Should process the events, handle race conditions and not rely on the order of the events', () => {
    test.each(possibleRacingConditionEvents)(
      'recieves the events %s when team exists',
      async (name, eventA, eventB) => {
        const userID = 'user-1234';
        const usersResponse = {
          ...getListUserResponse(),
          id: userID,
        };
        userControllerMock.fetch.mockResolvedValue(usersResponse);

        await indexHandler(eventA(userID));
        await indexHandler(eventB(userID));

        expect(algoliaSearchClientMock.saveMany).toHaveBeenCalledTimes(2);
        expect(algoliaSearchClientMock.saveMany).toHaveBeenNthCalledWith(
          1,
          usersResponse.items.map(mapPayload),
        );
        expect(algoliaSearchClientMock.saveMany).toHaveBeenNthCalledWith(
          2,
          usersResponse.items.map(mapPayload),
        );
      },
    );
  });
});
