import { NotFoundError } from '@asap-hub/errors';
import { DiscussionCreateDataObject, Reply } from '@asap-hub/model';
import DiscussionController from '../../src/controllers/discussion.controller';
import { DiscussionDataProvider } from '../../src/data-providers/types';
import { getDiscussionDataObject } from '../fixtures/discussions.fixtures';

import { getDataProviderMock } from '../mocks/data-provider.mock';

describe('Discussion Controller', () => {
  const discussionDataProviderMock: jest.Mocked<DiscussionDataProvider> =
    getDataProviderMock();

  const discussionController = new DiscussionController(
    discussionDataProviderMock,
  );

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Fetch-by-ID method', () => {
    test('Should throw when discussion is not found', async () => {
      discussionDataProviderMock.fetchById.mockResolvedValueOnce(null);

      await expect(discussionController.fetchById('not-found')).rejects.toThrow(
        NotFoundError,
      );
    });

    test('Should return the discussion when found', async () => {
      const discussionResponse = getDiscussionDataObject();
      discussionDataProviderMock.fetchById.mockResolvedValueOnce(
        discussionResponse,
      );
      const result = await discussionController.fetchById('discussion-id');

      expect(result).toEqual(discussionResponse);
    });
  });

  describe('Update method', () => {
    const reply: Reply = {
      text: 'test reply',
      isOpenScienceMember: true,
    };

    test('Should return the updated discussion', async () => {
      const mockResponse = getDiscussionDataObject();
      discussionDataProviderMock.fetchById.mockResolvedValue(mockResponse);
      const result = await discussionController.update(
        'discussion-id',
        'user-id-0',
        reply,
        'manuscript-id-1',
        true,
        '',
      );

      expect(result).toEqual(mockResponse);
    });

    test('Should call the data provider with input data', async () => {
      discussionDataProviderMock.fetchById.mockResolvedValue(
        getDiscussionDataObject(),
      );

      await discussionController.update(
        'discussion-id',
        'user-id-0',
        reply,
        'manuscript-id-1',
        true,
        '',
      );

      expect(discussionDataProviderMock.update).toHaveBeenCalledWith(
        'discussion-id',
        {
          userId: 'user-id-0',
          reply,
          manuscriptId: 'manuscript-id-1',
          sendNotifications: true,
          notificationList: '',
        },
      );
    });
  });

  describe('Mark as read method', () => {
    test('Should return the updated discussion', async () => {
      const mockResponse = getDiscussionDataObject();
      discussionDataProviderMock.fetchById.mockResolvedValue(mockResponse);
      const result = await discussionController.markAsRead(
        'discussion-id',
        'user-id-0',
      );

      expect(result).toEqual(mockResponse);
    });
  });

  describe('Create method', () => {
    const input: DiscussionCreateDataObject = {
      text: 'test message',
      userId: 'user-id-0',
      manuscriptId: 'manuscript-id-1',
      title: 'Test discussion title',
    };

    test('Should return the created discussion', async () => {
      const mockResponse = getDiscussionDataObject();
      discussionDataProviderMock.fetchById.mockResolvedValue(mockResponse);
      const result = await discussionController.create(
        input.userId,
        input.manuscriptId,
        input.title,
        input.text,
        false,
        '',
      );

      expect(result).toEqual(mockResponse);
    });

    test('Should call the data provider with input data', async () => {
      discussionDataProviderMock.fetchById.mockResolvedValue(
        getDiscussionDataObject(),
      );

      await discussionController.create(
        input.userId,
        input.manuscriptId,
        input.title,
        input.text,
        false,
        '',
      );

      expect(discussionDataProviderMock.create).toHaveBeenCalledWith({
        ...input,
        sendNotifications: false,
        notificationList: '',
      });
    });
  });
});
