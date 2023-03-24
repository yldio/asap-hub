import { InputUser, RestUser, SquidexRestClient } from '@asap-hub/squidex';
import FormData from 'form-data';
import mime from 'mime-types';
import { DataProvider, ListResponse } from '@asap-hub/model';
import { appName, baseUrl } from '../config';

type CreateData = {
  id: string;
  avatar: Buffer;
  contentType: string;
};

export type AssetDataProvider = DataProvider<null, null, CreateData>;

export class AssetSquidexDataProvider implements AssetDataProvider {
  constructor(
    private userSquidexRestClient: SquidexRestClient<RestUser, InputUser>,
  ) {}

  async fetch(): Promise<ListResponse<null>> {
    throw new Error('Method not implemented.');
  }

  async fetchById(): Promise<null> {
    throw new Error('Method not implemented.');
  }

  async create({ id, avatar, contentType }: CreateData): Promise<string> {
    const form = new FormData();
    form.append('file', avatar, {
      filename: `${id}.${mime.extension(contentType)}`,
      contentType,
    });

    const { id: assetId } = await this.userSquidexRestClient.client
      .post('assets', {
        prefixUrl: `${baseUrl}/api/apps/${appName}`,
        headers: form.getHeaders(),
        body: form,
      })
      .json<{ id: string }>();
    return assetId;
  }
}
