import { TutorialsDataProvider } from '../../src/data-providers/tutorials.data-provider';

export const tutorialDataProviderMock: jest.Mocked<TutorialsDataProvider> = {
  fetchById: jest.fn(),
};
