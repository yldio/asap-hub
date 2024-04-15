import { NotFoundError } from '@asap-hub/errors';
import {
  gp2 as gp2Model,
  ValidationErrorResponse,
  VALIDATION_ERROR_MESSAGE,
} from '@asap-hub/model';
import {
  OutputPostRequest,
  OutputVersionPostObject,
} from '@asap-hub/model/src/gp2';
import Boom from '@hapi/boom';
import { OutputDataProvider } from '../data-providers/types';
import { ExternalUserDataProvider } from '../data-providers/types/external-user.data-provider.type';

export default class OutputController {
  constructor(
    private outputDataProvider: OutputDataProvider,
    private externalUserDataProvider: ExternalUserDataProvider,
  ) {}

  async fetchById(outputId: string): Promise<gp2Model.OutputResponse> {
    const output = await this.outputDataProvider.fetchById(outputId);
    if (!output) {
      throw new NotFoundError(
        undefined,
        `output with id ${outputId} not found`,
      );
    }

    return output;
  }

  async fetch(options: FetchOptions): Promise<gp2Model.ListOutputResponse> {
    const { filter: fetchFilter, ...fetchOptions } = options;

    const filter: gp2Model.FetchOutputOptions['filter'] = Array.isArray(
      fetchFilter,
    )
      ? { documentType: fetchFilter }
      : fetchFilter;

    const { items, total } = await this.outputDataProvider.fetch({
      ...fetchOptions,
      filter,
    });

    return {
      items,
      total,
    };
  }

  private async parseToDataObject(
    data: OutputCreateData | OutputUpdateData,
  ): Promise<
    Omit<
      gp2Model.OutputCreateDataObject | gp2Model.OutputUpdateDataObject,
      'createdBy' | 'updatedBy' | 'addedDate'
    >
  > {
    return {
      authors: await this.mapAuthorsPostRequestToId(data.authors ?? []),
      documentType: data.documentType,
      link: data.link,
      publishDate: data.publishDate,
      subtype: data.subtype,
      title: data.title,
      type: data.type,
      description: data.description,
      shortDescription: data.shortDescription,
      sharingStatus: data.sharingStatus,
      gp2Supported: data.gp2Supported,
      tagIds: data.tagIds,
      doi: data.doi,
      rrid: data.rrid,
      accessionNumber: data.accessionNumber,
      workingGroupIds: data.workingGroupIds,
      projectIds: data.projectIds,
      mainEntityId: data.mainEntityId,
      contributingCohortIds: data.contributingCohortIds,
      relatedOutputIds: data.relatedOutputIds,
      relatedEventIds: data.relatedEventIds,
    };
  }
  async create(
    data: OutputCreateData,
  ): Promise<gp2Model.OutputResponse | null> {
    await this.validateOutput(data);

    const dataObject = await this.parseToDataObject(data);

    const outputId = await this.outputDataProvider.create({
      ...dataObject,
      createdBy: data.createdBy,
      addedDate: new Date(Date.now()).toISOString(),
    });

    return this.fetchById(outputId);
  }

  async update(
    id: string,
    data: OutputUpdateData,
  ): Promise<gp2Model.OutputResponse | null> {
    const normalisedData = this.normaliseResearchOutputData(data);

    const currentOutput = await this.outputDataProvider.fetchById(id);

    if (!currentOutput) {
      throw new NotFoundError(undefined, `output with id ${id} not found`);
    }

    let version: OutputVersionPostObject | undefined;

    if (data.createVersion) {
      version = {
        title: currentOutput.title || '',
        link: currentOutput.link,
        type: currentOutput.type,
        addedDate: currentOutput.addedDate || '',
        documentType: currentOutput.documentType,
      };

      this.validateVersionUniqueness(
        normalisedData,
        version,
        currentOutput?.versions,
      );
    }

    await this.validateOutput(data, id);

    const dataObject = await this.parseToDataObject(data);

    await this.outputDataProvider.update(
      id,
      {
        ...dataObject,
        versions:
          currentOutput.versions?.map(({ id: versionId }) => versionId) || [],
        updatedBy: data.updatedBy,
        addedDate: currentOutput.addedDate,
      },
      { newVersion: version },
    );

    return this.fetchById(id);
  }

  private async validateOutput(
    outputData: OutputCreateData | OutputUpdateData,
    outputId?: string,
  ): Promise<void> {
    const isError = (
      error: ValidationErrorResponse['data'][0] | null,
    ): error is ValidationErrorResponse['data'][0] => !!error;

    const errors = (
      await Promise.all([
        this.validateTitleUniqueness(outputData, outputId),
        this.validateLinkUniqueness(outputData, outputId),
      ])
    ).filter(isError);

    this.handleErrors(errors);
  }

  private async validateTitleUniqueness(
    outputData: OutputCreateData | OutputUpdateData,
    outputId?: string,
  ): Promise<ValidationErrorResponse['data'][0] | null> {
    const result = await this.outputDataProvider.fetch({
      filter: {
        documentType: [outputData.documentType],
        title: outputData.title,
      },
    });

    if (result.total === 0) {
      return null;
    }

    if (result.total === 1 && result.items[0]?.id === outputId) {
      return null;
    }

    return ERROR_UNIQUE_TITLE;
  }

  private async validateLinkUniqueness(
    outputData: OutputCreateData | OutputUpdateData,
    outputId?: string,
  ): Promise<ValidationErrorResponse['data'][0] | null> {
    const result = await this.fetch({
      filter: {
        link: outputData.link || '',
      },
    });

    if (result.total === 0) {
      return null;
    }

    if (result.total === 1 && result.items[0]?.id === outputId) {
      return null;
    }

    return ERROR_UNIQUE_LINK;
  }

  private validateVersionUniqueness(
    newOutput: OutputUpdateData,
    newVersion: OutputVersionPostObject,
    versions: OutputVersionPostObject[] | undefined,
  ): void {
    const errors: ValidationErrorResponse['data'] = [];
    if (
      newOutput.link === newVersion.link ||
      (versions && versions.some((version) => version.link === newVersion.link))
    ) {
      errors.push(ERROR_UNIQUE_LINK);
    }
    this.handleErrors(errors);
  }

  private normaliseResearchOutputData = <T extends OutputPostRequest>(
    outputData: T,
  ): T => ({
    ...outputData,
    title: (outputData.title || '').trim(),
    link: outputData.link?.trim() ?? outputData.link,
  });

  private handleErrors(errors: ValidationErrorResponse['data']) {
    // TODO: Remove Boom from the controller layer
    // https://asaphub.atlassian.net/browse/CRN-777
    if (errors.length > 0) {
      throw Boom.badRequest<ValidationErrorResponse['data']>(
        `${VALIDATION_ERROR_MESSAGE} ${JSON.stringify(errors)}`,
        errors,
      );
    }
  }

  private mapAuthorsPostRequestToId = async (
    data: gp2Model.AuthorPostRequest[],
  ): Promise<gp2Model.AuthorUpsertDataObject[]> =>
    Promise.all(
      data.map(async (author) => {
        if ('userId' in author || 'externalUserId' in author) return author;

        const externalUserId = await this.externalUserDataProvider.create({
          name: author.externalUserName,
        });

        return { externalUserId };
      }),
    );
}

type FetchOptions = Omit<gp2Model.FetchOutputOptions, 'filter'> & {
  filter?: OutputFilter;
};

export type OutputCreateData = gp2Model.OutputPostRequest & {
  createdBy: string;
};

export type OutputUpdateData = gp2Model.OutputPutRequest & {
  updatedBy: string;
};
type OutputFilter = gp2Model.OutputDocumentType[] | gp2Model.FetchOutputFilter;

export const ERROR_UNIQUE_LINK = {
  instancePath: '/link',
  keyword: 'unique',
  message: 'must be unique',
  params: {
    type: 'string',
  },
  schemaPath: '#/properties/link/unique',
};

export const ERROR_UNIQUE_TITLE = {
  instancePath: '/title',
  keyword: 'unique',
  message: 'must be unique',
  params: {
    type: 'string',
  },
  schemaPath: '#/properties/title/unique',
};
