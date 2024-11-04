import DiscussionController from '../../src/controllers/discussion.controller';

export const discussionControllerMock = {
  fetchById: jest.fn(),
  update: jest.fn(),
} as unknown as jest.Mocked<DiscussionController>;
