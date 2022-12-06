import { PageDataProvider } from '../../src/data-providers/pages.data-provider';

export const pageDataProviderMock: jest.Mocked<PageDataProvider> = {
  fetch: jest.fn(),
};
