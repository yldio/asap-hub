import { ListResponse } from '@asap-hub/model';
import { gp2 as gp2Squidex, SquidexRestClient } from '@asap-hub/squidex';
import FormData from 'form-data';
import mime from 'mime-types';
import { appName, baseUrl } from '../config';
import {
  AssetCreateData,
  AssetDataProvider,
} from './types/asset.data-provider.type';

export class AssetSquidexDataProvider implements AssetDataProvider {
  constructor(
    private userSquidexRestClient: SquidexRestClient<
      gp2Squidex.RestUser,
      gp2Squidex.InputUser
    >,
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
