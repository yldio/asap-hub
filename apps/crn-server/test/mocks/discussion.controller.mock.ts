import DiscussionController from '../../src/controllers/discussion.controller';

export const discussionControllerMock = {
  fetchById: jest.fn(),
  update: jest.fn(),
  create: jest.fn(),
  endDiscussion: jest.fn(),
} as unknown as jest.Mocked<DiscussionController>;
