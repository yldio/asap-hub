import { DataProvider } from '@asap-hub/model';

export type AssetCreateData = {
  id: string;
  avatar: Buffer;
  contentType: string;
};

export type AssetDataProvider = DataProvider<null, null, AssetCreateData>;
