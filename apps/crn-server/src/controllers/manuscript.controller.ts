import { NotFoundError } from '@asap-hub/errors';
import {
  ManuscriptCreateControllerDataObject,
  ManuscriptFileResponse,
  ManuscriptFileType,
  ManuscriptPostAuthor,
  ManuscriptResponse,
  ManuscriptUpdateDataObject,
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
    manuscriptCreateData: ManuscriptCreateControllerDataObject,
  ): Promise<ManuscriptResponse | null> {
    const version = manuscriptCreateData?.versions?.[0];

    if (version) {
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

      const manuscriptId = await this.manuscriptDataProvider.create({
        ...manuscriptCreateData,
        versions: [
          {
            ...versionData,
            firstAuthors: getValidAuthorIds(firstAuthorsValues),
            correspondingAuthor: getValidAuthorIds(correspondingAuthorValues),
            additionalAuthors: getValidAuthorIds(additionalAuthorsValues),
          },
        ],
      });

      return this.fetchById(manuscriptId);
    }

    const manuscriptId = await this.manuscriptDataProvider.create({
      ...manuscriptCreateData,
      versions: [],
    });

    return this.fetchById(manuscriptId);
  }

  async createFile({
    fileType,
    filename,
    content,
    contentType,
  }: ManuscruptFileCreateDataObject): Promise<ManuscriptFileResponse> {
    const manuscriptFileAsset = await this.assetDataProvider.create({
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

  async update(
    id: string,
    manuscriptData: ManuscriptUpdateDataObject,
  ): Promise<ManuscriptResponse> {
    const currentManuscript = await this.manuscriptDataProvider.fetchById(id);

    if (!currentManuscript) {
      throw new NotFoundError(undefined, `manuscript with id ${id} not found`);
    }

    await this.manuscriptDataProvider.update(id, manuscriptData);

    return this.fetchById(id);
  }
}

export type ManuscruptFileCreateDataObject = {
  fileType: ManuscriptFileType;
  filename: string;
  content: Buffer;
  contentType: string;
};
