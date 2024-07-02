import mime from 'mime-types';
import {
  addLocaleToFields,
  AssetFileProp,
  Environment,
} from '@asap-hub/contentful';
import { ListResponse } from '@asap-hub/model';
import { AssetDataProvider, AssetCreateData } from '../types';

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
    content: avatar,
    contentType,
    publish = true,
  }: AssetCreateData): Promise<string> {
    const fileName = `${id}.${mime.extension(contentType)}`;

    const environment = await this.getRestClient();
    const asset = await environment.createAssetFromFiles({
      fields: addLocaleToFields({
        title: 'Avatar',
        description: 'Avatar',
        file: {
          contentType,
          fileName,
          file: avatar,
        },
      }) as AssetFileProp['fields'],
    });
    const processed = await asset.processForAllLocales();

    if (publish) {
      await processed.publish();
    }

    return asset.sys.id;
  }
}
