import { OutputDataProvider } from '../../src/data-providers/output.data-provider';

export const outputDataProviderMock: jest.Mocked<OutputDataProvider> = {
  fetch: jest.fn(),
  fetchById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
};
