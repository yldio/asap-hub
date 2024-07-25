import mime from 'mime-types';
import {
  addLocaleToFields,
  AssetFileProp,
  Environment,
} from '@asap-hub/contentful';
import { ListResponse } from '@asap-hub/model';
import {
  AssetDataProvider,
  AssetCreateData,
  AssetCreateDataObject,
} from '../types';

export class AssetContentfulDataProvider implements AssetDataProvider {
  constructor(private getRestClient: () => Promise<Environment>) {}

  async fetch(): Promise<ListResponse<null>> {
    throw new Error('Method not implemented.');
  }

  async fetchById(): Promise<null> {
    throw new Error('Method not implemented.');
  }

  async create({
    id,
    title,
    description,
    content,
    contentType,
    filename,
    publish = true,
  }: AssetCreateData): Promise<AssetCreateDataObject> {
    const assetFilename = filename ?? `${id}.${mime.extension(contentType)}`;

    const environment = await this.getRestClient();
    const asset = await environment.createAssetFromFiles({
      fields: addLocaleToFields({
        title,
        description,
        file: {
          contentType,
          fileName: assetFilename,
          file: content,
        },
      }) as AssetFileProp['fields'],
    });
    const processed = await asset.processForAllLocales();

    if (publish) {
      await processed.publish();
    }

    return {
      id: asset.sys.id,
      filename: asset.fields.file['en-US']?.fileName || assetFilename,
      url: asset.fields.file['en-US']?.url || '',
    };
  }
}
