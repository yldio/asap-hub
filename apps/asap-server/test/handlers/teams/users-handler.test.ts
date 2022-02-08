import Boom from '@hapi/boom';
import { EventBridgeEvent } from 'aws-lambda';

import { ListUserResponse } from '@asap-hub/model';
import { BatchRequest } from '@asap-hub/algolia';
import { indexTeamsUsersHandler } from '../../../src/handlers/teams/users-handler';
import {
  TeamsEventType,
  SquidexWebhookTeamPayload,
} from '../../../src/handlers/webhooks/webhook-teams';
import { getListUserResponse } from '../../fixtures/users.fixtures';

import { getTeamsEventbridgeEvent } from '../../fixtures/teams.fixtures';

import { algoliaSearchClientMock } from '../../mocks/algolia-client.mock';
import { userControllerMock } from '../../mocks/user-controller.mock';

const getUsersBatchCall = (users: ListUserResponse): BatchRequest[] =>
  users.items.map((user) => ({
    action: 'updateObject',
    body: user,
  }));

describe('Team Users handler', () => {
  const indexHandler = indexTeamsUsersHandler(
    userControllerMock,
    algoliaSearchClientMock,
  );
  afterEach(() => jest.clearAllMocks());

  test('Should fetch the user and create a record in Algolia when team is created', async () => {
    const usersResponse = getListUserResponse();
    const usersBatchResponse = getUsersBatchCall(usersResponse);
    userControllerMock.fetchByRelationship.mockResolvedValueOnce(usersResponse);

    await indexHandler(createEvent('team-1234'));

    expect(algoliaSearchClientMock.batch).toHaveBeenCalledWith(
      usersBatchResponse,
    );
  });

  test('Should fetch the user and create a record in Algolia when team is updated', async () => {
    const usersResponse = getListUserResponse();
    const usersBatchResponse = getUsersBatchCall(usersResponse);
    userControllerMock.fetchByRelationship.mockResolvedValueOnce(usersResponse);

    await indexHandler(updateEvent('team-1234'));

    expect(algoliaSearchClientMock.batch).toHaveBeenCalledWith(
      usersBatchResponse,
    );
  });

  test('Should fetch the user and update the record in Algolia when team is unpublished', async () => {
    const usersResponse = getListUserResponse();
    const usersBatchResponse = getUsersBatchCall(usersResponse);

    const event = unpublishedEvent('team-1234');
    userControllerMock.fetchByRelationship.mockResolvedValueOnce(usersResponse);

    await indexHandler(event);

    expect(algoliaSearchClientMock.batch).toHaveBeenCalledWith(
      usersBatchResponse,
    );
  });

  test('Should fetch the user and remove the record in Algolia when team is deleted', async () => {
    const usersResponse = getListUserResponse();
    const usersBatchResponse = getUsersBatchCall(usersResponse);

    const event = deleteEvent('team-1234');
    userControllerMock.fetchByRelationship.mockResolvedValueOnce(usersResponse);

    await indexHandler(event);

    expect(algoliaSearchClientMock.batch).toHaveBeenCalledWith(
      usersBatchResponse,
    );
  });

  test('Should throw an error and do not trigger algolia when the team request fails with another error code', async () => {
    userControllerMock.fetchByRelationship.mockRejectedValue(Boom.badData());

    await expect(indexHandler(createEvent('team-1234'))).rejects.toThrow(
      Boom.badData(),
    );
    expect(algoliaSearchClientMock.batch).not.toHaveBeenCalled();
  });

  test('Should throw the algolia error when saving the record fails', async () => {
    const algoliaError = new Error('ERROR');

    userControllerMock.fetchByRelationship.mockResolvedValueOnce(
      getListUserResponse(),
    );
    algoliaSearchClientMock.batch.mockRejectedValueOnce(algoliaError);

    await expect(indexHandler(updateEvent('team-1234'))).rejects.toThrow(
      algoliaError,
    );
  });

  describe('Should process the events, handle race conditions and not rely on the order of the events', () => {
    test('receives the events created and updated in correct order', async () => {
      const userID = 'user-1234';
      const usersResponse = {
        ...getListUserResponse(),
        id: userID,
      };
      const usersBatchResponse = getUsersBatchCall(usersResponse);

      userControllerMock.fetchByRelationship.mockResolvedValue({
        ...usersResponse,
      });

      await indexHandler(createEvent(userID));
      await indexHandler(updateEvent(userID));

      expect(algoliaSearchClientMock.batch).toHaveBeenCalledTimes(2);
      expect(algoliaSearchClientMock.batch).toHaveBeenCalledWith(
        usersBatchResponse,
      );
    });

    test('receives the events created and updated in reverse order', async () => {
      const userID = 'user-1234';
      const usersResponse = {
        ...getListUserResponse(),
        id: userID,
      };
      const usersBatchResponse = getUsersBatchCall(usersResponse);

      userControllerMock.fetchByRelationship.mockResolvedValue(usersResponse);

      await indexHandler(updateEvent(userID));
      await indexHandler(createEvent(userID));

      expect(algoliaSearchClientMock.batch).toHaveBeenCalledTimes(2);
      expect(algoliaSearchClientMock.batch).toHaveBeenCalledWith(
        usersBatchResponse,
      );
    });

    test('receives the events created and unpublished in correct order', async () => {
      const userID = 'user-1234';
      const createEv = createEvent(userID);
      const unpublishedEv = unpublishedEvent(userID);
      const algoliaError = new Error('ERROR');

      userControllerMock.fetchByRelationship.mockRejectedValue(Boom.notFound());
      algoliaSearchClientMock.batch.mockResolvedValueOnce(undefined);
      algoliaSearchClientMock.batch.mockRejectedValue(algoliaError);

      await indexHandler(createEv);
      const updateResonse = await indexHandler(unpublishedEv);
      expect(updateResonse).toBeUndefined();

      expect(algoliaSearchClientMock.batch).not.toHaveBeenCalled();
    });

    test('receives the events created and unpublished in reverse order', async () => {
      const userID = 'user-1234';
      const createEv = createEvent(userID);
      const unpublishedEv = unpublishedEvent(userID);
      const algoliaError = new Error('ERROR');

      userControllerMock.fetchByRelationship.mockRejectedValue(Boom.notFound());
      algoliaSearchClientMock.batch.mockResolvedValueOnce(undefined);
      algoliaSearchClientMock.batch.mockRejectedValue(algoliaError);

      await indexHandler(unpublishedEv);
      const updateResonse = await indexHandler(createEv);
      expect(updateResonse).toBeUndefined();

      expect(algoliaSearchClientMock.batch).not.toHaveBeenCalled();
    });

    test('receives the events created and deleted in correct order', async () => {
      const userID = 'user-1234';
      const createEv = createEvent(userID);
      const deleteEv = deleteEvent(userID);
      const algoliaError = new Error('ERROR');

      userControllerMock.fetchByRelationship.mockRejectedValue(Boom.notFound());
      algoliaSearchClientMock.batch.mockResolvedValueOnce(undefined);
      algoliaSearchClientMock.batch.mockRejectedValue(algoliaError);

      await indexHandler(createEv);

      const updateResonse = await indexHandler(deleteEv);
      expect(updateResonse).toBeUndefined();

      expect(algoliaSearchClientMock.batch).not.toHaveBeenCalled();
    });

    test('receives the events created and deleted in reverse order', async () => {
      const userID = 'user-1234';
      const createEv = createEvent(userID);
      const deleteEv = deleteEvent(userID);
      const algoliaError = new Error('ERROR');

      userControllerMock.fetchByRelationship.mockRejectedValue(Boom.notFound());
      algoliaSearchClientMock.batch.mockResolvedValueOnce(undefined);
      algoliaSearchClientMock.batch.mockRejectedValue(algoliaError);

      await indexHandler(deleteEv);

      const updateResonse = await indexHandler(createEv);
      expect(updateResonse).toBeUndefined();

      expect(algoliaSearchClientMock.batch).not.toHaveBeenCalled();
    });

    test('receives the events updated and deleted in correct order', async () => {
      const userID = 'user-1234';
      const updateEv = updateEvent(userID);
      const deleteEv = deleteEvent(userID);
      const algoliaError = new Error('ERROR');

      userControllerMock.fetchByRelationship.mockRejectedValue(Boom.notFound());
      algoliaSearchClientMock.batch.mockResolvedValueOnce(undefined);
      algoliaSearchClientMock.batch.mockRejectedValue(algoliaError);

      await indexHandler(updateEv);

      const updateResonse = await indexHandler(deleteEv);
      expect(updateResonse).toBeUndefined();

      expect(algoliaSearchClientMock.batch).not.toHaveBeenCalled();
    });

    test('receives the events updated and deleted in reverse order', async () => {
      const userID = 'user-1234';
      const updateEv = updateEvent(userID);
      const deleteEv = deleteEvent(userID);
      const algoliaError = new Error('ERROR');

      userControllerMock.fetchByRelationship.mockRejectedValue(Boom.notFound());
      algoliaSearchClientMock.batch.mockResolvedValueOnce(undefined);
      algoliaSearchClientMock.batch.mockRejectedValue(algoliaError);

      await indexHandler(deleteEv);

      const updateResonse = await indexHandler(updateEv);
      expect(updateResonse).toBeUndefined();

      expect(algoliaSearchClientMock.batch).not.toHaveBeenCalled();
    });

    test('receives the events updated and unpublished in correct order', async () => {
      const userID = 'user-1234';
      const updateEv = updateEvent(userID);
      const unpublishedEv = unpublishedEvent(userID);
      const algoliaError = new Error('ERROR');

      userControllerMock.fetchByRelationship.mockRejectedValue(Boom.notFound());
      algoliaSearchClientMock.batch.mockResolvedValueOnce(undefined);
      algoliaSearchClientMock.batch.mockRejectedValue(algoliaError);

      await indexHandler(updateEv);

      const updateResonse = await indexHandler(unpublishedEv);
      expect(updateResonse).toBeUndefined();

      expect(algoliaSearchClientMock.batch).not.toHaveBeenCalled();
    });

    test('receives the events updated and unpublished in reverse order', async () => {
      const userID = 'user-1234';
      const updateEv = updateEvent(userID);
      const unpublishedEv = unpublishedEvent(userID);
      const algoliaError = new Error('ERROR');

      userControllerMock.fetchByRelationship.mockRejectedValue(Boom.notFound());
      algoliaSearchClientMock.batch.mockResolvedValueOnce(undefined);
      algoliaSearchClientMock.batch.mockRejectedValue(algoliaError);

      await indexHandler(unpublishedEv);

      const updateResonse = await indexHandler(updateEv);
      expect(updateResonse).toBeUndefined();

      expect(algoliaSearchClientMock.batch).not.toHaveBeenCalled();
    });
  });
});

const unpublishedEvent = (id: string) =>
  getTeamsEventbridgeEvent(
    id,
    'TeamsUnpublished',
    'TeamsDeleted',
  ) as EventBridgeEvent<TeamsEventType, SquidexWebhookTeamPayload>;

const deleteEvent = (id: string) =>
  getTeamsEventbridgeEvent(
    id,
    'TeamsDeleted',
    'TeamsDeleted',
  ) as EventBridgeEvent<TeamsEventType, SquidexWebhookTeamPayload>;

const createEvent = (id: string) =>
  getTeamsEventbridgeEvent(
    id,
    'TeamsPublished',
    'TeamsUpdated',
  ) as EventBridgeEvent<TeamsEventType, SquidexWebhookTeamPayload>;

const updateEvent = (id: string) =>
  getTeamsEventbridgeEvent(
    id,
    'TeamsUpdated',
    'TeamsUpdated',
  ) as EventBridgeEvent<TeamsEventType, SquidexWebhookTeamPayload>;
