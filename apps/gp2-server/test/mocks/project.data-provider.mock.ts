import { ProjectDataProvider } from '../../src/data-providers/types/project.data-provider.type';

export const projectDataProviderMock: jest.Mocked<ProjectDataProvider> = {
  fetchById: jest.fn(),
  fetch: jest.fn(),
  update: jest.fn(),
};
