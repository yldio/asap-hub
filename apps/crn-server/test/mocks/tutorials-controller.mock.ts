import { TutorialsController } from '../../src/controllers/tutorials';

export const tutorialsControllerMock: jest.Mocked<TutorialsController> = {
  fetchById: jest.fn(),
};
