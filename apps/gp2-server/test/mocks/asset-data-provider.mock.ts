import { AssetDataProvider } from '../../src/data-providers/asset.data-provider';

export const assetDataProviderMock: jest.Mocked<AssetDataProvider> = {
  create: jest.fn(),
};
