import { OutputDataProvider } from '../../src/data-providers/types';

export const outputDataProviderMock: jest.Mocked<OutputDataProvider> = {
  fetch: jest.fn(),
  fetchById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
};
