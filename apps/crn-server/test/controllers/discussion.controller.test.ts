import { NotFoundError } from '@asap-hub/errors';
import { DiscussionType } from '@asap-hub/model';
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
    const reply = {
      text: 'test reply',
      userId: 'user-id-0',
    };

    test('Should return the updated discussion', async () => {
      const mockResponse = getDiscussionDataObject();
      discussionDataProviderMock.fetchById.mockResolvedValue(mockResponse);
      const result = await discussionController.update('discussion-id', reply);

      expect(result).toEqual(mockResponse);
    });

    test('Should call the data provider with input data', async () => {
      discussionDataProviderMock.fetchById.mockResolvedValue(
        getDiscussionDataObject(),
      );

      await discussionController.update('discussion-id', reply);

      expect(discussionDataProviderMock.update).toHaveBeenCalledWith(
        'discussion-id',
        {
          reply,
        },
      );
    });
  });

  describe('Create method', () => {
    const message = {
      text: 'test message',
      userId: 'user-id-0',
      type: 'compliance-report' as DiscussionType,
      complianceReportId: 'compliance-report-id',
    };

    test('Should return the created discussion', async () => {
      const mockResponse = getDiscussionDataObject();
      discussionDataProviderMock.fetchById.mockResolvedValue(mockResponse);
      const result = await discussionController.create(message);

      expect(result).toEqual(mockResponse);
    });

    test('Should call the data provider with input data', async () => {
      discussionDataProviderMock.fetchById.mockResolvedValue(
        getDiscussionDataObject(),
      );

      await discussionController.create(message);

      expect(discussionDataProviderMock.create).toHaveBeenCalledWith(message);
    });
  });
  describe('End Discussion method', () => {
    const endedBy = 'user-id-0';

    test('Should return the ended discussion', async () => {
      const mockResponse = getDiscussionDataObject();
      discussionDataProviderMock.fetchById.mockResolvedValue(mockResponse);

      const result = await discussionController.endDiscussion(
        'discussion-id',
        endedBy,
      );

      expect(result).toEqual(mockResponse);
    });

    test('Should call the data provider with the correct input data', async () => {
      discussionDataProviderMock.fetchById.mockResolvedValue(
        getDiscussionDataObject(),
      );

      await discussionController.endDiscussion('discussion-id', endedBy);

      expect(discussionDataProviderMock.update).toHaveBeenCalledWith(
        'discussion-id',
        {
          endedBy,
        },
      );
    });
  });
});
