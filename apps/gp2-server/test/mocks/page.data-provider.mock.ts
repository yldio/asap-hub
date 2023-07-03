import { PageDataProvider } from '../../src/data-providers/types';

export const pageDataProviderMock: jest.Mocked<PageDataProvider> = {
  fetch: jest.fn(),
  fetchById: jest.fn(),
};
