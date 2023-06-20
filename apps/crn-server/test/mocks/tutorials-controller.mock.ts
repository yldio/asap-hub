import { TutorialsController } from '../../src/controllers/tutorials.controller';

export const tutorialsControllerMock: jest.Mocked<TutorialsController> = {
  fetchById: jest.fn(),
};
