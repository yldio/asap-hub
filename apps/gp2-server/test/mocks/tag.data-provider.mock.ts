import { TagDataProvider } from '../../src/data-providers/types';

export const tagDataProviderMock: jest.Mocked<TagDataProvider> = {
  fetch: jest.fn(),
  fetchById: jest.fn(),
  create: jest.fn(),
};
