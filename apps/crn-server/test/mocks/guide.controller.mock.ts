import GuideController from '../../src/controllers/guide.controller';

export const guideControllerMock = {
  fetch: jest.fn(),
} as unknown as jest.Mocked<GuideController>;
