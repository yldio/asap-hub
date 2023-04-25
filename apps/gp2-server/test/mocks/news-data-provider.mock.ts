import { NewsDataProvider } from '../../src/data-providers/types';

export const newsDataProviderMock: jest.Mocked<NewsDataProvider> = {
  fetch: jest.fn(),
  fetchById: jest.fn(),
};
