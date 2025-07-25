import { ManuscriptsFilter } from '@asap-hub/contentful';
import { NotFoundError } from '@asap-hub/errors';
import Boom from '@hapi/boom';
import {
  FetchOptions,
  ListPartialManuscriptResponse,
  ManuscriptCreateControllerDataObject,
  ManuscriptFileResponse,
  ManuscriptFileType,
  ManuscriptPostAuthor,
  ManuscriptPutRequest,
  ManuscriptResponse,
  ManuscriptResubmitControllerDataObject,
  ValidationErrorResponse,
} from '@asap-hub/model';

import {
  AssetDataProvider,
  ManuscriptDataProvider,
} from '../data-providers/types';
import { ExternalAuthorDataProvider } from '../data-providers/types/external-authors.data-provider.types';

export default class ManuscriptController {
  constructor(
    private manuscriptDataProvider: ManuscriptDataProvider,
    private externalAuthorDataProvider: ExternalAuthorDataProvider,
    private assetDataProvider: AssetDataProvider,
  ) {}

  async fetchById(
    manuscriptId: string,
    userId: string,
  ): Promise<ManuscriptResponse> {
    const manuscript = await this.manuscriptDataProvider.fetchById(
      manuscriptId,
      userId,
    );

    if (!manuscript) {
      throw new NotFoundError(
        undefined,
        `Manuscript with id ${manuscriptId} not found`,
      );
    }

    return manuscript;
  }

  async fetch(
    options: FetchOptions<ManuscriptsFilter>,
  ): Promise<ListPartialManuscriptResponse> {
    const { take = 8, skip = 0 } = options;

    return this.manuscriptDataProvider.fetch({
      take,
      skip,
    });
  }

  private async validateTitleUniqueness(
    manuscriptData:
      | ManuscriptCreateControllerDataObject
      | ManuscriptResubmitControllerDataObject
      | ManuscriptPutRequest,
    manuscriptId?: string,
  ): Promise<ValidationErrorResponse['data'][0] | null> {
    if (!('title' in manuscriptData)) return null;

    const result = await this.manuscriptDataProvider.fetch({
      filter: {
        title: manuscriptData.title,
      },
    });

    if (result.total === 0) {
      return null;
    }

    if (result.total === 1 && result.items[0]?.id === manuscriptId) {
      return null;
    }

    throw Boom.badData('Title must be unique', {
      team: result.items[0]?.team?.displayName || '',
      manuscriptId: result.items[0]?.manuscriptId || '',
    });
  }

  async create(
    manuscriptCreateData: ManuscriptCreateControllerDataObject,
  ): Promise<ManuscriptResponse | null> {
    await this.validateTitleUniqueness(manuscriptCreateData);

    const version = manuscriptCreateData?.versions?.[0];

    if (version) {
      const versionData = await this.getManuscriptVersionData(version);

      const manuscriptId = await this.manuscriptDataProvider.create({
        ...manuscriptCreateData,
        versions: [versionData],
      });

      return this.fetchById(manuscriptId, manuscriptCreateData.userId);
    }

    const manuscriptId = await this.manuscriptDataProvider.create({
      ...manuscriptCreateData,
      versions: [],
    });

    return this.fetchById(manuscriptId, manuscriptCreateData.userId);
  }

  async createVersion(
    manuscriptId: string,
    manuscriptResubmitData: ManuscriptResubmitControllerDataObject,
  ): Promise<ManuscriptResponse | null> {
    await this.validateTitleUniqueness(manuscriptResubmitData, manuscriptId);

    const version = manuscriptResubmitData?.versions?.[0];

    if (version) {
      const versionData = await this.getManuscriptVersionData(version);

      await this.manuscriptDataProvider.createVersion(manuscriptId, {
        ...manuscriptResubmitData,
        versions: [versionData],
      });
    }

    return this.fetchById(manuscriptId, manuscriptResubmitData.userId);
  }

  async createFile({
    fileType,
    filename,
    content,
    contentType,
  }: ManuscruptFileCreateDataObject): Promise<ManuscriptFileResponse> {
    const isS3Url = typeof content === 'string';

    const manuscriptFileAsset = isS3Url
      ? await this.assetDataProvider.createFromUrl({
          id: '',
          url: content,
          filename,
          fileType,
        })
      : await this.assetDataProvider.create({
          id: '',
          title: fileType,
          description: fileType,
          content,
          contentType,
          filename,
          publish: false,
        });

    return manuscriptFileAsset;
  }

  private mapAuthorsPostRequestToId = async (
    data: ManuscriptPostAuthor[],
  ): Promise<(string | null)[]> =>
    Promise.all(
      data.map(async (author) => {
        if ('userId' in author && !!author.userId) return author.userId;

        if ('externalAuthorName' in author) {
          if (author.externalAuthorId) {
            await this.externalAuthorDataProvider.update(
              author.externalAuthorId,
              {
                email: author.externalAuthorEmail,
              },
            );
            return author.externalAuthorId;
          }

          const externalAuthorId = await this.externalAuthorDataProvider.create(
            {
              name: author.externalAuthorName,
              email: author.externalAuthorEmail,
            },
          );

          return externalAuthorId;
        }

        return null;
      }),
    );

  private getManuscriptVersionData = async (
    version: ManuscriptCreateControllerDataObject['versions'][number],
  ) => {
    const {
      firstAuthors,
      correspondingAuthor,
      additionalAuthors,
      ...versionData
    } = version;

    const firstAuthorsValues = await this.mapAuthorsPostRequestToId(
      firstAuthors ?? [],
    );
    const correspondingAuthorValues = correspondingAuthor
      ? await this.mapAuthorsPostRequestToId([correspondingAuthor] ?? [])
      : [];

    const additionalAuthorsValues = await this.mapAuthorsPostRequestToId(
      additionalAuthors ?? [],
    );

    const getValidAuthorIds = (authorIds: (string | null)[]) =>
      authorIds.filter((id): id is string => id !== null);

    return {
      ...versionData,
      firstAuthors: getValidAuthorIds(firstAuthorsValues),
      correspondingAuthor: getValidAuthorIds(correspondingAuthorValues),
      additionalAuthors: getValidAuthorIds(additionalAuthorsValues),
    };
  };

  async update(
    id: string,
    manuscriptData: ManuscriptPutRequest,
    userId: string,
  ): Promise<ManuscriptResponse> {
    await this.validateTitleUniqueness(manuscriptData, id);

    const currentManuscript = await this.manuscriptDataProvider.fetchById(
      id,
      userId,
    );

    if (!currentManuscript) {
      throw new NotFoundError(undefined, `manuscript with id ${id} not found`);
    }

    if (
      ('status' in manuscriptData && manuscriptData.status) ||
      ('assignedUsers' in manuscriptData && manuscriptData.assignedUsers) ||
      ('apcRequested' in manuscriptData &&
        manuscriptData.apcRequested !== undefined)
    ) {
      await this.manuscriptDataProvider.update(id, manuscriptData, userId);
      return this.fetchById(id, userId);
    }

    if ('versions' in manuscriptData && manuscriptData.versions?.[0]) {
      const {
        firstAuthors,
        correspondingAuthor,
        additionalAuthors,
        ...versionData
      } = manuscriptData.versions[0];

      const firstAuthorsValues = await this.mapAuthorsPostRequestToId(
        firstAuthors ?? [],
      );
      const correspondingAuthorValues = correspondingAuthor
        ? await this.mapAuthorsPostRequestToId([correspondingAuthor] ?? [])
        : [];

      const additionalAuthorsValues = await this.mapAuthorsPostRequestToId(
        additionalAuthors ?? [],
      );

      const getValidAuthorIds = (authorIds: (string | null)[]) =>
        authorIds.filter((authorId): authorId is string => authorId !== null);

      await this.manuscriptDataProvider.update(
        id,
        {
          ...manuscriptData,
          versions: [
            {
              ...versionData,
              firstAuthors: getValidAuthorIds(firstAuthorsValues),
              correspondingAuthor: getValidAuthorIds(correspondingAuthorValues),
              additionalAuthors: getValidAuthorIds(additionalAuthorsValues),
            },
          ],
        },
        userId,
      );
    }

    return this.fetchById(id, userId);
  }
}

export type ManuscruptFileCreateDataObject = {
  fileType: ManuscriptFileType;
  filename: string;
  content: Buffer | string;
  contentType: string;
};
