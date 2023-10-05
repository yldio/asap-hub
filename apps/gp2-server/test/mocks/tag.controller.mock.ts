import TagController from '../../src/controllers/tag.controller';

export const tagControllerMock = {
  fetch: jest.fn(),
} as unknown as jest.Mocked<TagController>;
