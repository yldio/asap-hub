import { NotFoundError } from '@asap-hub/errors';
import Boom from '@hapi/boom';
import { indexUserHandler } from '../../../src/handlers/user/algolia-index-user-handler';
import { getUserEvent, getUserResponse } from '../../fixtures/users.fixtures';
import { getAlgoliaSearchClientMock } from '../../mocks/algolia-client.mock';
import { userControllerMock } from '../../mocks/user.controller.mock';

jest.mock('../../../src/utils/logger');
describe('User index handler', () => {
  const algoliaSearchClientMock = getAlgoliaSearchClientMock();
  const indexHandler = indexUserHandler(
    userControllerMock,
    algoliaSearchClientMock,
  );

  afterEach(() => jest.clearAllMocks());

  test('Should fetch the user and create a record in Algolia when the user is published', async () => {
    const event = publishedEvent();
    const userResponse = getUserResponse();
    userControllerMock.fetchById.mockResolvedValueOnce(userResponse);

    await indexHandler(event);
    expect(userControllerMock.fetchById).toHaveBeenCalledWith(
      event.detail.resourceId,
    );
    expect(algoliaSearchClientMock.save).toHaveBeenCalledWith({
      data: {
        _tags: [
          'expertise 1',
          'expertise 2',
          'expertise 3',
          'expertise 4',
          'expertise 5',
        ],
        alumniSinceDate: '2020-09-23T20:45:22.000Z',
        avatarUrl: undefined,
        city: 'London',
        country: 'United Kingdom',
        createdDate: '2020-09-23T20:45:22.000Z',
        degree: 'MPH',
        displayName: 'Tom Hardy',
        email: 'H@rdy.io',
        firstName: 'Tom',
        id: 'user-id-1',
        institution: 'some institution',
        jobTitle: 'some job title',
        labs: [
          {
            id: 'cd7be4902',
            name: 'Brighton',
          },
          {
            id: 'cd7be4903',
            name: 'Liverpool',
          },
        ],
        lastName: 'Hardy',
        membershipStatus: ['Alumni Member'],
        teams: [
          {
            displayName: 'Team A',
            id: 'team-id-0',
            inactiveSinceDate: undefined,
            proposal: 'proposalId1',
            role: 'Lead PI (Core Leadership)',
            teamInactiveSince: '',
          },
        ],
      },
      type: 'user',
    });
  });

  test('Should fetch the user and remove a record in Algolia when user is published but not onboarded', async () => {
    const userResponse = {
      ...getUserResponse(),
      onboarded: false,
    };
    userControllerMock.fetchById.mockResolvedValueOnce(userResponse);

    await indexHandler(publishedEvent(userResponse.id));

    expect(algoliaSearchClientMock.remove).toHaveBeenCalledWith(
      userResponse.id,
    );
  });

  test('Should fetch the user and remove a record in Algolia when user is published but Hidden', async () => {
    const userResponse = getUserResponse();
    userControllerMock.fetchById.mockResolvedValueOnce({
      ...userResponse,
      role: 'Hidden',
    });

    await indexHandler(publishedEvent(userResponse.id));

    expect(algoliaSearchClientMock.remove).toHaveBeenCalledWith(
      userResponse.id,
    );
  });

  test('Should fetch the user and remove the record in Algolia when user is unpublished', async () => {
    const event = unpublishedEvent();

    userControllerMock.fetchById.mockRejectedValue(Boom.notFound());

    await indexHandler(event);

    expect(algoliaSearchClientMock.remove).toHaveBeenCalledWith(
      event.detail.resourceId,
    );
  });

  test('Should fetch the user and remove the record in Algolia when controller throws NotFoundError', async () => {
    const event = unpublishedEvent();

    userControllerMock.fetchById.mockRejectedValue(
      new NotFoundError(undefined, 'not found'),
    );

    await indexHandler(event);

    expect(algoliaSearchClientMock.remove).toHaveBeenCalledWith(
      event.detail.resourceId,
    );
  });

  test('Should populate _tags field before saving the user to Algolia', async () => {
    const event = publishedEvent();
    const userResponse = getUserResponse();
    userResponse.expertiseAndResourceTags = [
      'Bitopertin',
      'A53T',
      'Adapter ligation',
    ];
    userControllerMock.fetchById.mockResolvedValueOnce(userResponse);

    await indexHandler(event);

    expect(algoliaSearchClientMock.save).toHaveBeenCalledWith({
      data: expect.objectContaining({
        _tags: ['Bitopertin', 'A53T', 'Adapter ligation'],
      }),
      type: 'user',
    });
  });

  test('Should throw an error and do not trigger algolia when the user request fails with another error code', async () => {
    userControllerMock.fetchById.mockRejectedValue(Boom.badData());

    await expect(indexHandler(publishedEvent())).rejects.toThrow(
      Boom.badData(),
    );
    expect(algoliaSearchClientMock.remove).not.toHaveBeenCalled();
  });

  test('Should throw the algolia error when saving the record fails', async () => {
    const algoliaError = new Error('ERROR');

    userControllerMock.fetchById.mockResolvedValueOnce(getUserResponse());
    algoliaSearchClientMock.save.mockRejectedValueOnce(algoliaError);

    await expect(indexHandler(publishedEvent())).rejects.toThrow(algoliaError);
  });

  test('Should throw the algolia error when deleting the record fails', async () => {
    const algoliaError = new Error('ERROR');

    userControllerMock.fetchById.mockRejectedValue(Boom.notFound());

    algoliaSearchClientMock.remove.mockRejectedValueOnce(algoliaError);

    await expect(indexHandler(unpublishedEvent())).rejects.toThrow(
      algoliaError,
    );
  });

  describe('Should process the events, handle race conditions and not rely on the order of the events', () => {
    test('receives the events published and unpublished in correct order', async () => {
      const userId = 'user-1234';
      const createEv = publishedEvent(userId);
      const unpublishedEv = unpublishedEvent(userId);
      const algoliaError = new Error('ERROR');

      userControllerMock.fetchById.mockRejectedValue(Boom.notFound());
      algoliaSearchClientMock.remove.mockResolvedValueOnce(undefined);
      algoliaSearchClientMock.remove.mockRejectedValue(algoliaError);

      await indexHandler(createEv);
      await expect(indexHandler(unpublishedEv)).rejects.toEqual(algoliaError);

      expect(algoliaSearchClientMock.save).not.toHaveBeenCalled();
      expect(algoliaSearchClientMock.remove).toHaveBeenCalledTimes(2);
      expect(algoliaSearchClientMock.remove).toHaveBeenCalledWith(
        unpublishedEv.detail.resourceId,
      );
    });

    test('receives the events published and unpublished in reverse order', async () => {
      const userId = 'user-1234';
      const createEv = publishedEvent(userId);
      const unpublishedEv = unpublishedEvent(userId);
      const algoliaError = new Error('ERROR');

      userControllerMock.fetchById.mockRejectedValue(Boom.notFound());
      algoliaSearchClientMock.remove.mockResolvedValueOnce(undefined);
      algoliaSearchClientMock.remove.mockRejectedValue(algoliaError);

      await indexHandler(unpublishedEv);
      await expect(indexHandler(createEv)).rejects.toEqual(algoliaError);

      expect(algoliaSearchClientMock.save).not.toHaveBeenCalled();
      expect(algoliaSearchClientMock.remove).toHaveBeenCalledTimes(2);
      expect(algoliaSearchClientMock.remove).toHaveBeenCalledWith(
        unpublishedEv.detail.resourceId,
      );
    });
  });
});

const unpublishedEvent = (id: string = 'user-1234') =>
  getUserEvent(id, 'UsersUnpublished');

const publishedEvent = (id: string = 'user-1234') =>
  getUserEvent(id, 'UsersPublished');
