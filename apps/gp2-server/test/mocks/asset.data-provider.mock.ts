import { AssetDataProvider } from '../../src/data-providers/types';

export const assetDataProviderMock: jest.Mocked<AssetDataProvider> = {
  fetch: jest.fn(),
  fetchById: jest.fn(),
  create: jest.fn(),
};
