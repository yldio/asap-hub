import GuideController from '../../src/controllers/guides.controller';

export const guideControllerMock = {
  fetch: jest.fn(),
} as unknown as jest.Mocked<GuideController>;
