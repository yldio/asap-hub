import { NewsDataProvider } from '../../src/data-providers/news.data-provider';

export const newsDataProviderMock: jest.Mocked<NewsDataProvider> = {
  fetch: jest.fn(),
  fetchById: jest.fn(),
};
