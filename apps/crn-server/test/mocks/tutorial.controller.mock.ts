import TutorialController from '../../src/controllers/tutorial.controller';

export const tutorialControllerMock = {
  fetchById: jest.fn(),
} as unknown as jest.Mocked<TutorialController>;
