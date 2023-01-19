import { AssetDataProvider } from '../../src/data-providers/assets.data-provider';

export const assetDataProviderMock: jest.Mocked<AssetDataProvider> = {
  create: jest.fn(),
};
