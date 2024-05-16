import { NotFoundError } from '@asap-hub/errors';
import {
  ManuscriptCreateDataObject,
  ManuscriptResponse,
} from '@asap-hub/model';

import { ManuscriptDataProvider } from '../data-providers/types';

export default class ManuscriptController {
  constructor(private manuscriptDataProvider: ManuscriptDataProvider) {}

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
}
