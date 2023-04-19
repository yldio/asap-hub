import { InputUser, RestUser, SquidexRestClient } from '@asap-hub/squidex';
import FormData from 'form-data';
import mime from 'mime-types';
import { ListResponse } from '@asap-hub/model';
import { appName, baseUrl } from '../config';
import { AssetDataProvider, AssetCreateData } from './types';

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

  async create({ id, avatar, contentType }: AssetCreateData): Promise<string> {
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
