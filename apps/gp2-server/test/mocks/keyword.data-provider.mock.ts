import { KeywordDataProvider } from '../../src/data-providers/types';

export const keywordDataProviderMock: jest.Mocked<KeywordDataProvider> = {
  fetch: jest.fn(),
  fetchById: jest.fn(),
  create: jest.fn(),
};
