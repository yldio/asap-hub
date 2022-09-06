import { ProjectDataProvider } from '../../src/data-providers/project.data-provider';

export const projectDataProviderMock: jest.Mocked<ProjectDataProvider> = {
  fetchById: jest.fn(),
  fetch: jest.fn(),
};
