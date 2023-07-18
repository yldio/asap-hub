import {
  addLocaleToFields,
  AssetFileProp,
  Environment,
} from '@asap-hub/contentful';
import { ListResponse } from '@asap-hub/model';
import mime from 'mime-types';
import { AssetCreateData, AssetDataProvider } from './types';

export class AssetContentfulDataProvider implements AssetDataProvider {
  constructor(private getRestClient: () => Promise<Environment>) {}

  async fetch(): Promise<ListResponse<null>> {
    throw new Error('Method not implemented.');
  }

  async fetchById(): Promise<null> {
    throw new Error('Method not implemented.');
  }

  async create({ id, avatar, contentType }: AssetCreateData) {
    const fileName = `${id}.${mime.extension(contentType)}`;

    const environment = await this.getRestClient();
    const asset = await environment.createAssetFromFiles({
      fields: addLocaleToFields({
        title: `${id} Avatar`,
        description: `Avatar for id ${id}.`,
        file: {
          contentType,
          fileName,
          file: avatar,
        },
      }) as AssetFileProp['fields'],
    });
    const processed = await asset.processForAllLocales();
    const published = await processed.publish();

    return published.sys.id;
  }
}
