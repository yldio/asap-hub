import { PageDataProvider } from '../../src/data-providers/page.data-provider';

export const pageDataProviderMock: jest.Mocked<PageDataProvider> = {
  fetch: jest.fn(),
};
