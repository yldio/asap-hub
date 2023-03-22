import mime from 'mime-types';
import {
  addLocaleToFields,
  AssetFileProp,
  Environment,
} from '@asap-hub/contentful';
import { AssetDataProvider } from '../assets.data-provider';

export class AssetContentfulDataProvider implements AssetDataProvider {
  constructor(private getRestClient: () => Promise<Environment>) {}

  async create(
    id: string,
    avatar: Buffer,
    contentType: string,
  ): Promise<string> {
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
    const published = await processed.publish();

    return published.sys.id;
  }
}
