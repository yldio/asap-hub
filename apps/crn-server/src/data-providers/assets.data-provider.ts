import {
  config,
  RestUser,
  SquidexRest,
  SquidexRestClient,
} from '@asap-hub/squidex';
import FormData from 'form-data';
import mime from 'mime-types';

export interface AssetDataProvider {
  create(id: string, avatar: Buffer, contentType: string): Promise<string>;
}
export default class Assets implements AssetDataProvider {
  userSquidexRestClient: SquidexRestClient<RestUser>;

  constructor() {
    this.userSquidexRestClient = new SquidexRest<RestUser>('users');
  }

  async create(
    id: string,
    avatar: Buffer,
    contentType: string,
  ): Promise<string> {
    const form = new FormData();
    form.append('file', avatar, {
      filename: `${id}.${mime.extension(contentType)}`,
      contentType,
    });

    const { id: assetId } = await this.userSquidexRestClient.client
      .post('assets', {
        prefixUrl: `${config.baseUrl}/api/apps/${config.appName}`,
        headers: form.getHeaders(),
        body: form,
      })
      .json();
    return assetId;
  }
}
