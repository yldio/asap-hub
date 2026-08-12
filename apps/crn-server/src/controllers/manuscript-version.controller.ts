import { ManuscriptVersionRecord } from '@asap-hub/algolia';
import { ManuscriptsFilter } from '@asap-hub/contentful';
import { NotFoundError } from '@asap-hub/errors';
import {
  FetchOptions,
  ListManuscriptVersionExportResponse,
  ListResponse,
} from '@asap-hub/model';

import { ManuscriptVersionDataProvider } from '../data-providers/types';

export default class ManuscriptVersionController {
  constructor(
    private manuscriptVersionDataProvider: ManuscriptVersionDataProvider,
  ) {}

  async fetch(
    options: FetchOptions<ManuscriptsFilter>,
  ): Promise<ListResponse<ManuscriptVersionRecord>> {
    const { take = 8, skip = 0 } = options;

    return this.manuscriptVersionDataProvider.fetch({
      take,
      skip,
    });
  }

  async fetchById(
    manuscriptVersionId: string,
  ): Promise<ManuscriptVersionRecord | null> {
    const response =
      await this.manuscriptVersionDataProvider.fetchById(manuscriptVersionId);

    if (!response || !response.versionFound) {
      throw new NotFoundError(
        undefined,
        `Manuscript Version with id ${manuscriptVersionId} not found`,
      );
    }

    return response.latestManuscriptVersion || null;
  }

  async fetchComplianceManuscriptVersions(
    options: FetchOptions<string[]>,
  ): Promise<ListManuscriptVersionExportResponse> {
    return this.manuscriptVersionDataProvider.fetchComplianceManuscriptVersions(
      options,
    );
  }

  async fetchManuscriptVersionIdsByLinkedEntry(
    entryId: string,
    entryType: string,
  ): Promise<string[]> {
    return this.manuscriptVersionDataProvider.fetchManuscriptVersionIdsByLinkedEntry(
      entryId,
      entryType,
    );
  }
}
