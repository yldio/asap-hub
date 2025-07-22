import { ManuscriptsFilter } from '@asap-hub/contentful';
import { NotFoundError } from '@asap-hub/errors';
import {
  FetchOptions,
  ListManuscriptVersionResponse,
  ManuscriptVersionResponse,
} from '@asap-hub/model';

import { ManuscriptVersionDataProvider } from '../data-providers/types';

export default class ManuscriptVersionController {
  constructor(
    private manuscriptVersionDataProvider: ManuscriptVersionDataProvider,
  ) {}

  async fetchById(
    manuscriptVersionId: string,
  ): Promise<ManuscriptVersionResponse | null> {
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

  async fetch(
    options: FetchOptions<ManuscriptsFilter>,
  ): Promise<ListManuscriptVersionResponse> {
    const { take = 8, skip = 0 } = options;

    return this.manuscriptVersionDataProvider.fetch({
      take,
      skip,
    });
  }

  //   private getManuscriptVersionData = async (
  //     version: ManuscriptCreateControllerDataObject['versions'][number],
  //   ) => {
  //     const {
  //       firstAuthors,
  //       correspondingAuthor,
  //       additionalAuthors,
  //       ...versionData
  //     } = version;

  //     const firstAuthorsValues = await this.mapAuthorsPostRequestToId(
  //       firstAuthors ?? [],
  //     );
  //     const correspondingAuthorValues = correspondingAuthor
  //       ? await this.mapAuthorsPostRequestToId([correspondingAuthor] ?? [])
  //       : [];

  //     const additionalAuthorsValues = await this.mapAuthorsPostRequestToId(
  //       additionalAuthors ?? [],
  //     );

  //     const getValidAuthorIds = (authorIds: (string | null)[]) =>
  //       authorIds.filter((id): id is string => id !== null);

  //     return {
  //       ...versionData,
  //       firstAuthors: getValidAuthorIds(firstAuthorsValues),
  //       correspondingAuthor: getValidAuthorIds(correspondingAuthorValues),
  //       additionalAuthors: getValidAuthorIds(additionalAuthorsValues),
  //     };
  //   };
}
