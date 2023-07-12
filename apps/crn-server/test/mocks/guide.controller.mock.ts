import GuideController from '../../src/controllers/guide.controller';

export const guideControllerMock = {
  fetchByCollectionTitle: jest.fn(),
} as unknown as jest.Mocked<GuideController>;
