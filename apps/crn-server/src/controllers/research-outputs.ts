import { NotFoundError } from '@asap-hub/errors';
import Boom from '@hapi/boom';
import {
  AuthorUpsertDataObject,
  AuthorPostRequest,
  ListResearchOutputResponse,
  ResearchOutputCreateDataObject,
  ResearchOutputPostRequest,
  ResearchOutputPutRequest,
  ResearchOutputResponse,
  ResearchTagCategory,
  ResearchTagDataObject,
  ValidationErrorResponse,
  VALIDATION_ERROR_MESSAGE,
  ResearchOutputUpdateDataObject,
} from '@asap-hub/model';
import {
  FetchResearchOutputOptions,
  ResearchOutputDataProvider,
} from '../data-providers/research-outputs.data-provider';
import { ResearchTagDataProvider } from '../data-providers/research-tags.data-provider';
import { ExternalAuthorDataProvider } from '../data-providers/external-authors.data-provider';

export default class ResearchOutputs implements ResearchOutputController {
  constructor(
    private researchOutputDataProvider: ResearchOutputDataProvider,
    private researchTagDataProvider: ResearchTagDataProvider,
    private externalAuthorDataProvider: ExternalAuthorDataProvider,
  ) {}

  async fetchById(researchOutputId: string): Promise<ResearchOutputResponse> {
    const researchOutput = await this.researchOutputDataProvider.fetchById(
      researchOutputId,
    );
    if (!researchOutput) {
      throw new NotFoundError(
        undefined,
        `Research-output with id ${researchOutputId} not found`,
      );
    }

    return researchOutput;
  }

  async fetch(options: {
    take?: number;
    skip?: number;
    search?: string;
    filter?: ResearchOutputFilter;
    includeDrafts?: boolean;
  }): Promise<ListResearchOutputResponse> {
    const { filter: fetchFilter, ...fetchOptions } = options;

    const filter: FetchResearchOutputOptions['filter'] = Array.isArray(
      fetchFilter,
    )
      ? { documentType: fetchFilter }
      : fetchFilter;
    return this.researchOutputDataProvider.fetch({ ...fetchOptions, filter });
  }

  async create(
    researchOutputCreateData: ResearchOutputCreateData,
  ): Promise<ResearchOutputResponse | null> {
    await this.validateResearchOutputUniqueness(researchOutputCreateData);

    const { methods, organisms, environments, subtype } =
      await this.parseResearchTags(researchOutputCreateData);

    const {
      teams,
      labs,
      methods: _,
      organisms: __,
      environments: ___,
      subtype: ____,
      addedDate,
      ...input
    } = researchOutputCreateData;

    const researchOutputCreateDataObject: ResearchOutputCreateDataObject = {
      ...input,
      teamIds: teams,
      labIds: labs || [],
      authors: await this.mapAuthorsPostRequestToId(
        researchOutputCreateData.authors ?? [],
      ),
      methodIds: methods,
      organismIds: organisms,
      environmentIds: environments,
      subtypeId: subtype,
      addedDate: addedDate || new Date(Date.now()).toISOString(),
    };

    const researchOutputId = await this.researchOutputDataProvider.create(
      researchOutputCreateDataObject,
    );

    return this.researchOutputDataProvider.fetchById(researchOutputId);
  }

  async update(
    id: string,
    researchOutputUpdateData: ResearchOutputUpdateData,
  ): Promise<ResearchOutputResponse | null> {
    await this.validateResearchOutputUniqueness(researchOutputUpdateData, id);

    const { methods, organisms, environments, subtype } =
      await this.parseResearchTags(researchOutputUpdateData);

    const {
      teams,
      labs,
      methods: _,
      organisms: __,
      environments: ___,
      subtype: ____,
      ...input
    } = researchOutputUpdateData;

    const researchOutputUpdateDataObject: ResearchOutputUpdateDataObject = {
      ...input,
      teamIds: teams,
      labIds: labs || [],
      authors: await this.mapAuthorsPostRequestToId(
        researchOutputUpdateData.authors ?? [],
      ),
      methodIds: methods,
      organismIds: organisms,
      environmentIds: environments,
      subtypeId: subtype,
    };

    const researchOutputId = await this.researchOutputDataProvider.update(
      id,
      researchOutputUpdateDataObject,
    );

    return this.researchOutputDataProvider.fetchById(researchOutputId);
  }

  private async validateResearchOutputUniqueness(
    researchOutputData: ResearchOutputCreateData | ResearchOutputUpdateData,
    resarchOutputId?: string,
  ): Promise<void> {
    const isError = (
      error: ValidationErrorResponse['data'][0] | null,
    ): error is ValidationErrorResponse['data'][0] => !!error;

    const errors = (
      await Promise.all([
        this.validateTitleUniqueness(researchOutputData, resarchOutputId),
        this.validateLinkUniqueness(researchOutputData, resarchOutputId),
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
    researchOutputData: ResearchOutputCreateData | ResearchOutputUpdateData,
    researchOutputId?: string,
  ): Promise<ValidationErrorResponse['data'][0] | null> {
    const result = await this.researchOutputDataProvider.fetch({
      filter: {
        documentType: researchOutputData.documentType,
        title: researchOutputData.title,
      },
      includeDrafts: true,
    });

    if (result.total === 0) {
      return null;
    }

    if (result.total === 1 && result.items[0]?.id === researchOutputId) {
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
    researchOutputData: ResearchOutputCreateData | ResearchOutputUpdateData,
    researchOutputId?: string,
  ): Promise<ValidationErrorResponse['data'][0] | null> {
    const result = await this.fetch({
      filter: {
        link: researchOutputData.link || '',
      },
      includeDrafts: true,
    });

    if (result.total === 0) {
      return null;
    }

    if (result.total === 1 && result.items[0]?.id === researchOutputId) {
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

  private async parseResearchTags(
    researchOutputData: ResearchOutputInputTags,
  ): Promise<ResearchOutputParsedTags> {
    const researchTags = [
      ...(await this.researchTagDataProvider.fetch({ take: 100 })).items,
    ];

    const methods = mapResearchTags(
      researchTags,
      'Method',
      researchOutputData.methods,
      'methods',
    );

    const organisms = mapResearchTags(
      researchTags,
      'Organism',
      researchOutputData.organisms,
      'organisms',
    );

    const environments = mapResearchTags(
      researchTags,
      'Environment',
      researchOutputData.environments,
      'environments',
    );

    const subtype = researchOutputData.subtype
      ? mapResearchTag(
          researchTags,
          'Subtype',
          researchOutputData.subtype,
          'subtype',
        )
      : undefined;

    return {
      methods,
      organisms,
      environments,
      subtype,
    };
  }

  private mapAuthorsPostRequestToId = async (
    data: AuthorPostRequest[],
  ): Promise<AuthorUpsertDataObject[]> =>
    Promise.all(
      data.map(async (author) => {
        if ('userId' in author || 'externalAuthorId' in author) return author;

        const externalAuthorId = await this.externalAuthorDataProvider.create({
          name: author.externalAuthorName,
        });

        return { externalAuthorId };
      }),
    );
}

export interface ResearchOutputController {
  fetch: (options: {
    take?: number;
    skip?: number;
    search?: string;
    filter?: ResearchOutputFilter;
    includeDrafts?: boolean;
  }) => Promise<ListResearchOutputResponse>;

  fetchById: (id: string) => Promise<ResearchOutputResponse>;
  create: (
    researchOutputRequest: ResearchOutputCreateData,
  ) => Promise<ResearchOutputResponse | null>;
  update: (
    id: string,
    researchOutputRequest: ResearchOutputUpdateData,
  ) => Promise<ResearchOutputResponse | null>;
}
export type ResearchOutputCreateData = ResearchOutputPostRequest & {
  createdBy: string;
  addedDate?: string;
};

export type ResearchOutputUpdateData = ResearchOutputPutRequest & {
  updatedBy: string;
};

const mapResearchTags = (
  researchTags: ResearchTagDataObject[],
  category: ResearchTagCategory,
  values: string[],
  instancePath: string,
): string[] =>
  values.map((singleValue) =>
    mapResearchTag(researchTags, category, singleValue, instancePath),
  );

const mapResearchTag = (
  researchTags: ResearchTagDataObject[],
  category: ResearchTagCategory,
  value: string,
  instancePath: string,
): string => {
  const filteredTags = researchTags.filter(
    (tag) => tag.name === value && tag.category === category,
  );

  if (filteredTags && filteredTags.length > 0 && filteredTags[0]) {
    return filteredTags[0].id;
  }

  const categoryLowercase = category.toLocaleLowerCase();

  throw Boom.badRequest('Validation error', [
    {
      instancePath,
      keyword: 'invalid',
      message: `${value} does not exist`,
      params: {
        type: 'string',
      },
      schemaPath: `#/properties/${categoryLowercase}/invalid`,
    },
  ]);
};

type ResearchOutputFilter =
  | string[]
  | {
      documentType?: string;
      title?: string;
      link?: string;
    };

type ResearchOutputInputTags = {
  methods: string[];
  organisms: string[];
  environments: string[];
  subtype?: string;
};
type ResearchOutputParsedTags = {
  methods: string[];
  organisms: string[];
  environments: string[];
  subtype?: string;
};
