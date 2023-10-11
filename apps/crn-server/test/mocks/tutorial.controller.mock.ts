import TutorialController from '../../src/controllers/tutorial.controller';

export const tutorialControllerMock = {
  fetch: jest.fn(),
  fetchById: jest.fn(),
} as unknown as jest.Mocked<TutorialController>;
