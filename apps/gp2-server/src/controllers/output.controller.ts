import { NotFoundError } from '@asap-hub/errors';
import {
  gp2 as gp2Model,
  ValidationErrorResponse,
  VALIDATION_ERROR_MESSAGE,
} from '@asap-hub/model';
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

  async create(
    outputCreateData: OutputCreateData,
  ): Promise<gp2Model.OutputResponse | null> {
    await this.validateOutput(outputCreateData);

    const outputCreateDataObject: gp2Model.OutputCreateDataObject = {
      authors: await this.mapAuthorsPostRequestToId(
        outputCreateData.authors ?? [],
      ),
      addedDate: new Date(Date.now()).toISOString(),
      createdBy: outputCreateData.createdBy,
      documentType: outputCreateData.documentType,
      link: outputCreateData.link,
      publishDate: outputCreateData.publishDate,
      subtype: outputCreateData.subtype,
      title: outputCreateData.title,
      type: outputCreateData.type,
      workingGroupId: outputCreateData.workingGroupId,
      projectId: outputCreateData.projectId,
    };

    const outputId = await this.outputDataProvider.create(
      outputCreateDataObject,
    );

    return this.fetchById(outputId);
  }

  async update(
    id: string,
    outputUpdateData: OutputUpdateData,
  ): Promise<gp2Model.OutputResponse | null> {
    const currentOutput = await this.outputDataProvider.fetchById(id);

    if (!currentOutput) {
      throw new NotFoundError(undefined, `output with id ${id} not found`);
    }

    await this.validateOutput(outputUpdateData, id);

    const outputUpdateDataObject: gp2Model.OutputUpdateDataObject = {
      authors: await this.mapAuthorsPostRequestToId(
        outputUpdateData.authors ?? [],
      ),
      addedDate: currentOutput.addedDate,
      documentType: outputUpdateData.documentType,
      link: outputUpdateData.link,
      publishDate: outputUpdateData.publishDate,
      subtype: outputUpdateData.subtype,
      title: outputUpdateData.title,
      type: outputUpdateData.type,
      updatedBy: outputUpdateData.updatedBy,
    };

    await this.outputDataProvider.update(id, outputUpdateDataObject);

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

    if (errors.length > 0) {
      // TODO: Remove Boom from the controller layer
      // https://asaphub.atlassian.net/browse/CRN-777
      throw Boom.badRequest<ValidationErrorResponse['data']>(
        VALIDATION_ERROR_MESSAGE,
        errors,
      );
    }
  }

  private async validateTitleUniqueness(
    outputData: OutputCreateData | OutputUpdateData,
    outputId?: string,
  ): Promise<ValidationErrorResponse['data'][0] | null> {
    const result = await this.outputDataProvider.fetch({
      filter: {
        documentType: outputData.documentType,
        title: outputData.title,
      },
    });

    if (result.total === 0) {
      return null;
    }

    if (result.total === 1 && result.items[0]?.id === outputId) {
      return null;
    }

    return {
      instancePath: '/title',
      keyword: 'unique',
      message: 'must be unique',
      params: {
        type: 'string',
      },
      schemaPath: '#/properties/title/unique',
    };
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

    return {
      instancePath: '/link',
      keyword: 'unique',
      message: 'must be unique',
      params: {
        type: 'string',
      },
      schemaPath: '#/properties/link/unique',
    };
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
