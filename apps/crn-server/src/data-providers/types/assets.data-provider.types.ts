import { DataProvider } from '@asap-hub/model';

export type AssetCreateData = {
  id: string;
  content: Buffer;
  contentType: string;
  publish?: boolean;
};

export type AssetDataProvider = DataProvider<null, null, null, AssetCreateData>;
