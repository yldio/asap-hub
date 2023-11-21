import { gp2 as gp2Model } from '@asap-hub/model';
import Boom from '@hapi/boom';
import { EventBridgeEvent } from 'aws-lambda';
import { WorkingGroupPayload } from '../../../src/handlers/event-bus';
import { indexUserWorkingGroupHandler } from '../../../src/handlers/user/algolia-index-working-group-handler';
import {
  getListUsersResponse,
  getUserResponse,
} from '../../fixtures/user.fixtures';
import {
  createWorkingGroupMembersResponse,
  getWorkingGroupEvent,
  getWorkingGroupResponse,
} from '../../fixtures/working-group.fixtures';
import { getAlgoliaSearchClientMock } from '../../mocks/algolia-client.mock';
import { userControllerMock } from '../../mocks/user.controller.mock';
import { workingGroupControllerMock } from '../../mocks/working-group.controller.mock';
import {
  createAlgoliaResponse,
  createUserAlgoliaRecord,
  toPayload,
} from '../../utils/algolia';

const mapPayload = toPayload('user');

const algoliaSearchClientMock = getAlgoliaSearchClientMock();
const workingGroupId = '42';
const possibleEvents: [
  string,
  EventBridgeEvent<gp2Model.WorkingGroupEvent, WorkingGroupPayload>,
][] = [
  ['published', getWorkingGroupEvent(workingGroupId, 'WorkingGroupsPublished')],
  [
    'unpublished',
    getWorkingGroupEvent(workingGroupId, 'WorkingGroupsUnpublished'),
  ],
];

jest.mock('../../../src/utils/logger');
describe('Index Users on Working Group event handler', () => {
  const indexHandler = indexUserWorkingGroupHandler(
    workingGroupControllerMock,
    userControllerMock,
    algoliaSearchClientMock,
  );
  beforeEach(jest.resetAllMocks);

  test('Should throw an error and do not trigger algolia when the working group request fails with another error code', async () => {
    workingGroupControllerMock.fetchById.mockRejectedValue(Boom.badData());

    await expect(
      indexHandler(
        getWorkingGroupEvent(workingGroupId, 'WorkingGroupsPublished'),
      ),
    ).rejects.toThrow(Boom.badData());
    expect(userControllerMock.fetch).not.toHaveBeenCalled();
    expect(algoliaSearchClientMock.search).not.toHaveBeenCalled();
    expect(algoliaSearchClientMock.saveMany).not.toHaveBeenCalled();
  });

  test('Should throw the algolia error when saving the record fails', async () => {
    const algoliaError = new Error('ERROR');

    const workingGroupResponse = getWorkingGroupResponse();
    const userListResponse = getListUsersResponse();
    const previousUserResponse = getUserResponse();
    const algoliaRecord = createUserAlgoliaRecord(previousUserResponse);
    const algoliaResponse = createAlgoliaResponse<'user'>([algoliaRecord]);
    workingGroupControllerMock.fetchById.mockResolvedValueOnce(
      workingGroupResponse,
    );
    algoliaSearchClientMock.search.mockResolvedValueOnce(algoliaResponse);
    userControllerMock.fetch.mockResolvedValueOnce(userListResponse);
    algoliaSearchClientMock.saveMany.mockRejectedValueOnce(algoliaError);

    await expect(
      indexHandler(
        getWorkingGroupEvent(workingGroupId, 'WorkingGroupsPublished'),
      ),
    ).rejects.toThrow(algoliaError);
  });
  test('Should throw the algolia error when searching the record fails', async () => {
    const algoliaError = new Error('ERROR');

    const workingGroupResponse = getWorkingGroupResponse();
    const listUserResponse = getListUsersResponse();
    workingGroupControllerMock.fetchById.mockResolvedValueOnce(
      workingGroupResponse,
    );
    algoliaSearchClientMock.search.mockRejectedValueOnce(algoliaError);
    userControllerMock.fetch.mockResolvedValueOnce(listUserResponse);
    algoliaSearchClientMock.saveMany.mockRejectedValueOnce(algoliaError);

    await expect(
      indexHandler(
        getWorkingGroupEvent(workingGroupId, 'WorkingGroupsPublished'),
      ),
    ).rejects.toThrow(algoliaError);
    expect(userControllerMock.fetch).not.toHaveBeenCalled();
    expect(algoliaSearchClientMock.saveMany).not.toHaveBeenCalled();
  });
  test('Should throw the an error when fetching the user record fails', async () => {
    const workingGroupResponse = getWorkingGroupResponse();
    const previousUserResponse = getUserResponse();
    const algoliaRecord = createUserAlgoliaRecord(previousUserResponse);
    const algoliaResponse = createAlgoliaResponse<'user'>([algoliaRecord]);
    workingGroupControllerMock.fetchById.mockResolvedValueOnce(
      workingGroupResponse,
    );
    algoliaSearchClientMock.search.mockResolvedValueOnce(algoliaResponse);
    userControllerMock.fetch.mockRejectedValue(Boom.badData());

    await expect(
      indexHandler(
        getWorkingGroupEvent(workingGroupId, 'WorkingGroupsPublished'),
      ),
    ).rejects.toThrow(Boom.badData());
    expect(algoliaSearchClientMock.saveMany).not.toHaveBeenCalled();
  });

  test.each(possibleEvents)(
    'Should index user when workingGroup event %s occurs',
    async (_name, event) => {
      const userId = '32';
      const memberId = '11';
      const workingGroupResponse = getWorkingGroupResponse({
        members: [
          {
            userId: memberId,
            firstName: 'Tony',
            lastName: 'Stark',
            role: 'Lead',
          },
        ],
      });
      const previousUserResponse = getUserResponse({ id: userId });
      const listUserResponse = getListUsersResponse();
      const algoliaRecord = createUserAlgoliaRecord(previousUserResponse);
      const algoliaResponse = createAlgoliaResponse<'user'>([algoliaRecord]);
      workingGroupControllerMock.fetchById.mockResolvedValueOnce(
        workingGroupResponse,
      );
      algoliaSearchClientMock.search.mockResolvedValueOnce(algoliaResponse);
      userControllerMock.fetch.mockResolvedValueOnce(listUserResponse);
      await indexHandler(event);

      expect(workingGroupControllerMock.fetchById).toHaveBeenCalledWith(
        workingGroupId,
      );
      expect(algoliaSearchClientMock.search).toHaveBeenCalledWith(
        ['user'],
        workingGroupId,
        { page: 0, hitsPerPage: 10 },
      );
      expect(userControllerMock.fetch).toBeCalledTimes(1);
      expect(userControllerMock.fetch).toBeCalledWith({
        filter: {
          userIds: [memberId, userId],
        },
        take: 10,
      });
      expect(algoliaSearchClientMock.saveMany).toBeCalledTimes(1);
      expect(algoliaSearchClientMock.saveMany).toHaveBeenCalledWith(
        listUserResponse.items.map(mapPayload),
      );
    },
  );
  test.each(possibleEvents)(
    'Should page though possible previous users for event %s',
    async (_name, event) => {
      const userId = '32';
      const memberId = '11';
      const projectResponse = getWorkingGroupResponse({
        members: [
          {
            userId: memberId,
            firstName: 'Tony',
            lastName: 'Stark',
            role: 'Lead',
          },
        ],
      });
      const previousUserResponse = getUserResponse({ id: userId });
      const listUserResponse = getListUsersResponse();
      const algoliaRecord = createUserAlgoliaRecord(previousUserResponse);
      const firstAlgoliaResponse = createAlgoliaResponse<'user'>(
        [algoliaRecord],
        { nbPages: 2 },
      );
      const secondAlgoliaResponse = createAlgoliaResponse<'user'>(
        [algoliaRecord],
        { nbPages: 2 },
      );
      workingGroupControllerMock.fetchById.mockResolvedValueOnce(
        projectResponse,
      );
      algoliaSearchClientMock.search
        .mockResolvedValueOnce(firstAlgoliaResponse)
        .mockResolvedValueOnce(secondAlgoliaResponse);
      userControllerMock.fetch.mockResolvedValueOnce(listUserResponse);
      await indexHandler(event);

      expect(workingGroupControllerMock.fetchById).toHaveBeenCalledWith(
        workingGroupId,
      );
      expect(algoliaSearchClientMock.search).toBeCalledTimes(2);
      expect(algoliaSearchClientMock.search).toHaveBeenNthCalledWith(
        1,
        ['user'],
        workingGroupId,
        { page: 0, hitsPerPage: 10 },
      );
      expect(algoliaSearchClientMock.search).toHaveBeenNthCalledWith(
        2,
        ['user'],
        workingGroupId,
        { page: 1, hitsPerPage: 10 },
      );
    },
  );
  test.each(possibleEvents)(
    'removes duplicate users for event %s',
    async (_name, event) => {
      const userId = '32';
      const workingGroupResponse = getWorkingGroupResponse({
        members: [
          {
            userId,
            firstName: 'Tony',
            lastName: 'Stark',
            role: 'Lead',
          },
        ],
      });
      const previousUserResponse = getUserResponse({ id: userId });
      const listUserResponse = getListUsersResponse();
      const algoliaRecord = createUserAlgoliaRecord(previousUserResponse);
      const algoliaResponse = createAlgoliaResponse<'user'>([algoliaRecord]);
      workingGroupControllerMock.fetchById.mockResolvedValueOnce(
        workingGroupResponse,
      );
      algoliaSearchClientMock.search.mockResolvedValueOnce(algoliaResponse);
      userControllerMock.fetch.mockResolvedValueOnce(listUserResponse);
      await indexHandler(event);

      expect(userControllerMock.fetch).toBeCalledWith({
        filter: {
          userIds: [userId],
        },
        take: 10,
      });
    },
  );
  test.each(possibleEvents)(
    'more than 10 users for event %s',
    async (_name, event) => {
      const members = createWorkingGroupMembersResponse(11);
      const workingGroupResponse = getWorkingGroupResponse({
        members,
      });
      const previousUserResponse = getUserResponse({ id: '11' });
      const listUserResponse = getListUsersResponse();
      const algoliaRecord = createUserAlgoliaRecord(previousUserResponse);
      const algoliaResponse = createAlgoliaResponse<'user'>([algoliaRecord]);
      workingGroupControllerMock.fetchById.mockResolvedValueOnce(
        workingGroupResponse,
      );
      algoliaSearchClientMock.search.mockResolvedValueOnce(algoliaResponse);
      userControllerMock.fetch
        .mockResolvedValueOnce(listUserResponse)
        .mockResolvedValueOnce(listUserResponse);
      await indexHandler(event);

      expect(userControllerMock.fetch).toBeCalledTimes(2);
      expect(algoliaSearchClientMock.saveMany).toBeCalledTimes(2);
    },
  );
});
