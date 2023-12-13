import Boom from '@hapi/boom';
import { indexLabUsersHandler } from '../../../src/handlers/lab/algolia-index-lab-users-handler';
import {
  getLabPublishedEvent,
  LabEventGenerator,
  getLabUnpublishedEvent,
} from '../../fixtures/labs.fixtures';
import {
  getListUserResponse,
  getUserListItemResponse,
} from '../../fixtures/users.fixtures';
import { getAlgoliaSearchClientMock } from '../../mocks/algolia-client.mock';
import { userControllerMock } from '../../mocks/user.controller.mock';
import {} from '@asap-hub/model';
jest.mock('../../../src/utils/logger');
const algoliaSearchClientMock = getAlgoliaSearchClientMock();

const possibleEvents: [string, LabEventGenerator][] = [
  ['published', getLabPublishedEvent],
  ['unpublished', getLabUnpublishedEvent],
];

const possibleRacingConditionEvents: [
  string,
  LabEventGenerator,
  LabEventGenerator,
][] = [
  ['created and unpublished', getLabPublishedEvent, getLabUnpublishedEvent],
  ['unpublished and created', getLabUnpublishedEvent, getLabPublishedEvent],
];

describe('Index Users on Lab event handler', () => {
  const indexHandler = indexLabUsersHandler(
    userControllerMock,
    algoliaSearchClientMock,
  );
  afterEach(() => jest.clearAllMocks());

  test('Should throw an error and do not trigger algolia when the lab request fails with another error code', async () => {
    userControllerMock.fetch.mockRejectedValue(Boom.badData());

    await expect(
      indexHandler(getLabPublishedEvent('lab-1234')),
    ).rejects.toThrow(Boom.badData());
    expect(algoliaSearchClientMock.saveMany).not.toHaveBeenCalled();
  });

  test('Should throw the algolia error when saving the record fails', async () => {
    const algoliaError = new Error('ERROR');

    userControllerMock.fetch.mockResolvedValueOnce(getListUserResponse());
    algoliaSearchClientMock.saveMany.mockRejectedValueOnce(algoliaError);

    await expect(
      indexHandler(getLabPublishedEvent('lab-1234')),
    ).rejects.toThrow(algoliaError);
  });

  test('Should omit non-onboarded and Hidden users', async () => {
    userControllerMock.fetch.mockResolvedValueOnce({
      total: 3,
      items: [
        { ...getUserListItemResponse(), displayName: 'Person A' },
        {
          ...getUserListItemResponse(),
          role: 'Hidden',
          displayName: 'Person B',
        },
        {
          ...getUserListItemResponse(),
          onboarded: false,
          displayName: 'Person C',
        },
      ],
    });

    await indexHandler(getLabPublishedEvent('lab-1234'));

    expect(algoliaSearchClientMock.saveMany).toHaveBeenCalledWith([
      {
        data: expect.objectContaining({
          role: 'Grantee',
          displayName: 'Person A',
        }),
        type: 'user',
      },
    ]);
  });

  test.each(possibleEvents)(
    'Should index users when lab event %s occurs',
    async (name, eventA) => {
      const usersResponse = getListUserResponse();

      const event = eventA('lab-1234');
      userControllerMock.fetch.mockResolvedValueOnce(usersResponse);

      await indexHandler(event);

      expect(algoliaSearchClientMock.saveMany).toHaveBeenCalledWith(
        usersResponse.items.map((item) => ({
          data: item,
          type: 'user',
        })),
      );
    },
  );

  describe('Should process the events, handle race conditions and not rely on the order of the events', () => {
    test.each(possibleRacingConditionEvents)(
      'receives the events %s when lab exists',
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
          usersResponse.items.map((item) => ({
            data: item,
            type: 'user',
          })),
        );
        expect(algoliaSearchClientMock.saveMany).toHaveBeenNthCalledWith(
          2,
          usersResponse.items.map((item) => ({
            data: item,
            type: 'user',
          })),
        );
      },
    );
  });
});
