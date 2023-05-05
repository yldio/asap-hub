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
  ResearchOutputDataObject,
  WorkingGroupResponse,
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

    return {
      ...researchOutput,
      workingGroups: this.convertDataProviderWorkingGroupsToResponseType(
        researchOutput.workingGroups,
      ),
    };
  }

  async fetch(
    options: ResearchOutputFetchOptions,
  ): Promise<ListResearchOutputResponse> {
    const { filter: fetchFilter, ...fetchOptions } = options;

    const filter: FetchResearchOutputOptions['filter'] = Array.isArray(
      fetchFilter,
    )
      ? { documentType: fetchFilter }
      : fetchFilter;

    const researchOutputList = await this.researchOutputDataProvider.fetch({
      ...fetchOptions,
      filter,
    });

    return {
      items: researchOutputList.items.map((researchOutput) => ({
        ...researchOutput,
        workingGroups: this.convertDataProviderWorkingGroupsToResponseType(
          researchOutput.workingGroups,
        ),
      })),
      total: researchOutputList.total,
    };
  }

  async create(
    researchOutputCreateData: ResearchOutputCreateData,
  ): Promise<ResearchOutputResponse | null> {
    const normalisedResearchOutputCreateData =
      this.normaliseResearchOutputData<ResearchOutputCreateData>(
        researchOutputCreateData,
      );
    await this.validateResearchOutput(normalisedResearchOutputCreateData);
    const { methods, organisms, environments, subtype, keywords } =
      await this.parseResearchTags(normalisedResearchOutputCreateData);

    const researchOutputCreateDataObject: ResearchOutputCreateDataObject = {
      authors: await this.mapAuthorsPostRequestToId(
        normalisedResearchOutputCreateData.authors ?? [],
      ),
      accession: normalisedResearchOutputCreateData.accession,
      addedDate: normalisedResearchOutputCreateData.published
        ? new Date(Date.now()).toISOString()
        : undefined,
      asapFunded: normalisedResearchOutputCreateData.asapFunded,
      createdBy: normalisedResearchOutputCreateData.createdBy,
      description: normalisedResearchOutputCreateData.description,
      descriptionMD: normalisedResearchOutputCreateData.descriptionMD,
      documentType: normalisedResearchOutputCreateData.documentType,
      doi: normalisedResearchOutputCreateData.doi,
      environmentIds: environments,
      labCatalogNumber: normalisedResearchOutputCreateData.labCatalogNumber,
      labIds: normalisedResearchOutputCreateData.labs || [],
      link: normalisedResearchOutputCreateData.link,
      methodIds: methods,
      organismIds: organisms,
      publishDate: normalisedResearchOutputCreateData.publishDate,
      rrid: normalisedResearchOutputCreateData.rrid,
      sharingStatus: normalisedResearchOutputCreateData.sharingStatus,
      subtypeId: subtype,
      keywordIds: keywords,
      tags: normalisedResearchOutputCreateData.tags,
      teamIds: normalisedResearchOutputCreateData.teams,
      relatedResearchIds: normalisedResearchOutputCreateData.relatedResearch,
      title: normalisedResearchOutputCreateData.title,
      type: normalisedResearchOutputCreateData.type,
      usageNotes: normalisedResearchOutputCreateData.usageNotes,
      usedInPublication: normalisedResearchOutputCreateData.usedInPublication,
      workingGroups: normalisedResearchOutputCreateData.workingGroups,
    };

    const createOptions = {
      publish: normalisedResearchOutputCreateData.published,
    };
    const researchOutputId = await this.researchOutputDataProvider.create(
      researchOutputCreateDataObject,
      createOptions,
    );

    return this.fetchById(researchOutputId);
  }

  async update(
    id: string,
    researchOutputUpdateData: ResearchOutputUpdateData,
  ): Promise<ResearchOutputResponse | null> {
    const normalisedResearchOutputUpdateData =
      this.normaliseResearchOutputData<ResearchOutputUpdateData>(
        researchOutputUpdateData,
      );
    const currentResearchOutput =
      await this.researchOutputDataProvider.fetchById(id);

    if (!currentResearchOutput) {
      throw new NotFoundError(
        undefined,
        `research-output with id ${id} not found`,
      );
    }

    if (
      currentResearchOutput.published &&
      !normalisedResearchOutputUpdateData.published
    ) {
      throw Boom.badRequest('Cannot unpublish a research output');
    }

    await this.validateResearchOutput(
      normalisedResearchOutputUpdateData,
      id,
      currentResearchOutput,
    );

    const { methods, organisms, environments, subtype, keywords } =
      await this.parseResearchTags(normalisedResearchOutputUpdateData);

    const researchOutputUpdateDataObject: ResearchOutputUpdateDataObject = {
      authors: await this.mapAuthorsPostRequestToId(
        normalisedResearchOutputUpdateData.authors ?? [],
      ),
      accession: normalisedResearchOutputUpdateData.accession,
      addedDate: normalisedResearchOutputUpdateData.published
        ? currentResearchOutput.addedDate || new Date(Date.now()).toISOString()
        : undefined,
      asapFunded: normalisedResearchOutputUpdateData.asapFunded,
      descriptionMD: normalisedResearchOutputUpdateData.descriptionMD,
      description: normalisedResearchOutputUpdateData.description,
      documentType: normalisedResearchOutputUpdateData.documentType,
      doi: normalisedResearchOutputUpdateData.doi,
      environmentIds: environments,
      labCatalogNumber: normalisedResearchOutputUpdateData.labCatalogNumber,
      labIds: normalisedResearchOutputUpdateData.labs || [],
      link: normalisedResearchOutputUpdateData.link,
      methodIds: methods,
      organismIds: organisms,
      publishDate: normalisedResearchOutputUpdateData.publishDate,
      rrid: normalisedResearchOutputUpdateData.rrid,
      sharingStatus: normalisedResearchOutputUpdateData.sharingStatus,
      subtypeId: subtype,
      keywordIds: keywords,
      tags: normalisedResearchOutputUpdateData.tags,
      teamIds: normalisedResearchOutputUpdateData.teams,
      relatedResearchIds: normalisedResearchOutputUpdateData.relatedResearch,
      title: normalisedResearchOutputUpdateData.title,
      type: normalisedResearchOutputUpdateData.type,
      updatedBy: normalisedResearchOutputUpdateData.updatedBy,
      usageNotes: normalisedResearchOutputUpdateData.usageNotes,
      usedInPublication: normalisedResearchOutputUpdateData.usedInPublication,
      workingGroups: normalisedResearchOutputUpdateData.workingGroups,
    };

    const updateOptions = {
      publish: normalisedResearchOutputUpdateData.published,
    };
    await this.researchOutputDataProvider.update(
      id,
      researchOutputUpdateDataObject,
      updateOptions,
    );

    return this.fetchById(id);
  }

  private async validateResearchOutput(
    researchOutputData: ResearchOutputCreateData | ResearchOutputUpdateData,
    resarchOutputId?: string,
    currentResearchOutput?: ResearchOutputDataObject,
  ): Promise<void> {
    const isError = (
      error: ValidationErrorResponse['data'][0] | null,
    ): error is ValidationErrorResponse['data'][0] => !!error;

    const errors = (
      await Promise.all([
        this.validateTitleUniqueness(researchOutputData, resarchOutputId),
        this.validateLinkUniqueness(researchOutputData, resarchOutputId),
        (!('createdBy' in researchOutputData) &&
          currentResearchOutput &&
          this.validateTeamList(researchOutputData, currentResearchOutput)) ||
          null,
      ])
    ).filter(isError);

    if (errors.length > 0) {
      // TODO: Remove Boom from the controller layer
      // https://asaphub.atlassian.net/browse/CRN-777
      throw Boom.badRequest<ValidationErrorResponse['data']>(
        `${VALIDATION_ERROR_MESSAGE} ${JSON.stringify(errors)}`,
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

  private validateTeamList(
    researchOutputData: ResearchOutputUpdateData,
    currentResearchOutput: ResearchOutputDataObject,
  ): ValidationErrorResponse['data'][0] | null {
    if (currentResearchOutput.teams[0]?.id !== researchOutputData.teams?.[0]) {
      return {
        instancePath: '/teams',
        keyword: 'invalid',
        message: 'first team cannot be removed or changed',
        params: {
          type: 'string',
        },
        schemaPath: '#/properties/teams/invalid',
      };
    }

    return null;
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

    const keywords = mapResearchTags(
      researchTags,
      'Keyword',
      researchOutputData.keywords,
      'keywords',
    );

    return {
      methods,
      organisms,
      environments,
      subtype,
      keywords,
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

  private convertDataProviderWorkingGroupsToResponseType = (
    workingGroups: Pick<WorkingGroupResponse, 'id' | 'title'>[],
  ): [Pick<WorkingGroupResponse, 'id' | 'title'>] | undefined =>
    workingGroups[0] ? [workingGroups[0]] : undefined;

  private normaliseResearchOutputData = <T extends ResearchOutputPostRequest>(
    researchOutputData: T,
  ): T => ({
    ...researchOutputData,
    title: (researchOutputData.title || '').trim(),
    link: (researchOutputData.link || '').trim(),
  });
}

export interface ResearchOutputController {
  fetch: (
    options: ResearchOutputFetchOptions,
  ) => Promise<ListResearchOutputResponse>;
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
      status?: string;
      teamId?: string;
      workingGroupId?: string;
    };

type ResearchOutputInputTags = {
  methods: string[];
  organisms: string[];
  environments: string[];
  subtype?: string;
  keywords: string[];
};
type ResearchOutputParsedTags = {
  methods: string[];
  organisms: string[];
  environments: string[];
  subtype?: string;
  keywords: string[];
};

export type ResearchOutputFetchOptions = {
  take?: number;
  skip?: number;
  search?: string;
  filter?: ResearchOutputFilter;
  includeDrafts?: boolean;
};
