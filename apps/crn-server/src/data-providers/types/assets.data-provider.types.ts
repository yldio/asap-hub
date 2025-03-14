import { DataProvider } from '@asap-hub/model';

export type AssetCreateData = {
  id: string;
  title: string;
  description: string;
  content: Buffer | string;
  contentType: string;
  filename?: string;
  publish?: boolean;
};

export type AssetCreateDataObject = {
  id: string;
  url: string;
  filename: string;
};

export interface AssetDataProvider extends DataProvider {
  create(data: AssetCreateData): Promise<AssetCreateDataObject>;
  createFromUrl(
    data: AssetCreateDataObject & { fileType?: string },
  ): Promise<AssetCreateDataObject>;
}
