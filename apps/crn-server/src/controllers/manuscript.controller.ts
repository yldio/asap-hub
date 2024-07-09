import { NotFoundError } from '@asap-hub/errors';
import {
  ManuscriptCreateDataObject,
  ManuscriptFileResponse,
  ManuscriptResponse,
} from '@asap-hub/model';

import {
  AssetDataProvider,
  ManuscriptDataProvider,
} from '../data-providers/types';

export default class ManuscriptController {
  constructor(
    private manuscriptDataProvider: ManuscriptDataProvider,
    private assetDataProvider: AssetDataProvider,
  ) {}

  async fetchById(manuscriptId: string): Promise<ManuscriptResponse> {
    const manuscript =
      await this.manuscriptDataProvider.fetchById(manuscriptId);

    if (!manuscript) {
      throw new NotFoundError(
        undefined,
        `Manuscript with id ${manuscriptId} not found`,
      );
    }

    return manuscript;
  }

  async create(
    manuscriptCreateData: ManuscriptCreateDataObject,
  ): Promise<ManuscriptResponse | null> {
    const manuscriptId =
      await this.manuscriptDataProvider.create(manuscriptCreateData);

    return this.fetchById(manuscriptId);
  }

  async createFile({
    filename,
    content,
    contentType,
  }: ManuscruptFileCreateDataObject): Promise<ManuscriptFileResponse> {
    const manuscriptFileAsset = await this.assetDataProvider.create({
      id: '',
      title: 'Manuscript File',
      description: 'Manuscript File',
      content,
      contentType,
      filename,
      publish: false,
    });

    return manuscriptFileAsset;
  }
}

export type ManuscruptFileCreateDataObject = {
  filename: string;
  content: Buffer;
  contentType: string;
};
