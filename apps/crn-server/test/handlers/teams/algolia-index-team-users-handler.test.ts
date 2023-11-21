import { UserResponse } from '@asap-hub/model';
import Boom from '@hapi/boom';
import { indexTeamUsersHandler } from '../../../src/handlers/teams/algolia-index-team-users-handler';
import {
  getListUserResponse,
  getUserResponse,
} from '../../fixtures/users.fixtures';
import { toPayload } from '../../helpers/algolia';

import {
  getTeamPublishedEvent,
  TeamEventGenerator,
  getTeamUnpublishedEvent,
} from '../../fixtures/teams.fixtures';

import { getAlgoliaSearchClientMock } from '../../mocks/algolia-client.mock';
import { userControllerMock } from '../../mocks/user.controller.mock';

jest.mock('../../../src/utils/logger');
const mapPayload = toPayload('user');

const algoliaSearchClientMock = getAlgoliaSearchClientMock();

const possibleEvents: [string, TeamEventGenerator][] = [
  ['published', getTeamPublishedEvent],
  ['unpublished', getTeamUnpublishedEvent],
];

const possibleRacingConditionEvents: [
  string,
  TeamEventGenerator,
  TeamEventGenerator,
][] = [
  ['published and unpublished', getTeamPublishedEvent, getTeamUnpublishedEvent],
  ['unpublished and published', getTeamUnpublishedEvent, getTeamPublishedEvent],
];

describe('Index Users on Team event handler', () => {
  const indexHandler = indexTeamUsersHandler(
    userControllerMock,
    algoliaSearchClientMock,
  );
  afterEach(() => jest.clearAllMocks());

  test('Should throw an error and do not trigger algolia when the team request fails with another error code', async () => {
    userControllerMock.fetch.mockRejectedValue(Boom.badData());

    await expect(
      indexHandler(getTeamPublishedEvent('team-1234')),
    ).rejects.toThrow(Boom.badData());
    expect(algoliaSearchClientMock.saveMany).not.toHaveBeenCalled();
  });

  test('Should throw the algolia error when saving the record fails', async () => {
    const algoliaError = new Error('ERROR');

    userControllerMock.fetch.mockResolvedValueOnce(getListUserResponse());
    algoliaSearchClientMock.saveMany.mockRejectedValueOnce(algoliaError);

    await expect(
      indexHandler(getTeamPublishedEvent('team-1234')),
    ).rejects.toThrow(algoliaError);
  });

  test('Should omit non-onboarded and Hidden users', async () => {
    const userResponse = getUserResponse();
    userControllerMock.fetch.mockResolvedValueOnce({
      total: 3,
      items: [
        userResponse,
        { ...userResponse, role: 'Hidden' },
        { ...userResponse, onboarded: false },
      ],
    });

    await indexHandler(getTeamPublishedEvent('lab-1234'));

    expect(algoliaSearchClientMock.saveMany).toHaveBeenCalledWith([
      mapPayload({
        ...userResponse,
        _tags: userResponse.expertiseAndResourceTags,
      } as UserResponse & { _tags: string[] }),
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
        usersResponse.items.map((item) =>
          mapPayload({
            ...item,
            _tags: item.expertiseAndResourceTags,
          } as UserResponse & { _tags: string[] }),
        ),
      );
    },
  );

  describe('Should process the events, handle race conditions and not rely on the order of the events', () => {
    test.each(possibleRacingConditionEvents)(
      'receives the events %s when team exists',
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
          usersResponse.items.map((item) =>
            mapPayload({
              ...item,
              _tags: item.expertiseAndResourceTags,
            } as UserResponse & { _tags: string[] }),
          ),
        );
        expect(algoliaSearchClientMock.saveMany).toHaveBeenNthCalledWith(
          2,
          usersResponse.items.map((item) =>
            mapPayload({
              ...item,
              _tags: item.expertiseAndResourceTags,
            } as UserResponse & { _tags: string[] }),
          ),
        );
      },
    );
  });
});
