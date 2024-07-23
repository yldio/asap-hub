import { NotFoundError } from '@asap-hub/errors';
import Boom from '@hapi/boom';
import {
  AuthorPostRequest,
  AuthorUpsertDataObject,
  ListResearchOutputResponse,
  ResearchOutputCreateDataObject,
  ResearchOutputDataObject,
  ResearchOutputPostRequest,
  ResearchOutputPutRequest,
  ResearchOutputResponse,
  ResearchOutputUpdateDataObject,
  ResearchOutputVersionPostRequest,
  ResearchTagCategory,
  ResearchTagDataObject,
  VALIDATION_ERROR_MESSAGE,
  ValidationErrorResponse,
  WorkingGroupResponse,
} from '@asap-hub/model';
import {
  FetchResearchOutputOptions,
  ResearchOutputDataProvider,
  ResearchTagDataProvider,
} from '../data-providers/types';
import { fetchAll } from '../utils/fetch-all';
import { ExternalAuthorDataProvider } from '../data-providers/types/external-authors.data-provider.types';
import {
  GenerativeContentDataProvider,
  generativeContentDataProviderNoop,
} from '../data-providers/contentful/generative-content.data-provider';

export default class ResearchOutputController {
  constructor(
    private researchOutputDataProvider: ResearchOutputDataProvider,
    private researchTagDataProvider: ResearchTagDataProvider,
    private externalAuthorDataProvider: ExternalAuthorDataProvider,
    private generativeContentDataProvider: GenerativeContentDataProvider = generativeContentDataProviderNoop,
  ) {}

  async fetchById(researchOutputId: string): Promise<ResearchOutputResponse> {
    const researchOutput =
      await this.researchOutputDataProvider.fetchById(researchOutputId);
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
    const normalisedResearchOutputCreateData = this.normaliseResearchOutputData(
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
      isInReview: normalisedResearchOutputCreateData.isInReview || false,
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
      teamIds: normalisedResearchOutputCreateData.teams,
      relatedResearchIds: normalisedResearchOutputCreateData.relatedResearch,
      relatedEventIds: normalisedResearchOutputCreateData.relatedEvents,
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
    const normalisedResearchOutputUpdateData = this.normaliseResearchOutputData(
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

    let version: ResearchOutputVersionPostRequest | undefined;
    if (researchOutputUpdateData.createVersion) {
      version = {
        title: currentResearchOutput.title || '',
        link: currentResearchOutput.link,
        type: currentResearchOutput.type,
        addedDate: currentResearchOutput?.addedDate,
        documentType: currentResearchOutput.documentType,
      };

      this.validateVersionUniqueness(
        normalisedResearchOutputUpdateData,
        version,
        currentResearchOutput?.versions,
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
      isInReview: normalisedResearchOutputUpdateData.isInReview,
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
      teamIds: normalisedResearchOutputUpdateData.teams,
      relatedResearchIds: normalisedResearchOutputUpdateData.relatedResearch,
      relatedEventIds: normalisedResearchOutputUpdateData.relatedEvents,
      title: normalisedResearchOutputUpdateData.title,
      type: normalisedResearchOutputUpdateData.type,
      updatedBy: normalisedResearchOutputUpdateData.updatedBy,
      statusChangedById: normalisedResearchOutputUpdateData.statusChangedById,
      statusChangedAt: normalisedResearchOutputUpdateData.hasStatusChanged
        ? new Date().toISOString()
        : currentResearchOutput.statusChangedAt,
      usageNotes: normalisedResearchOutputUpdateData.usageNotes,
      usedInPublication: normalisedResearchOutputUpdateData.usedInPublication,
      workingGroups: normalisedResearchOutputUpdateData.workingGroups,
      versions:
        currentResearchOutput?.versions?.map(
          ({ id: versionId }) => versionId,
        ) || [],
    };

    const updateOptions = {
      publish: normalisedResearchOutputUpdateData.published,
      newVersion: version,
    };

    await this.researchOutputDataProvider.update(
      id,
      researchOutputUpdateDataObject,
      updateOptions,
    );

    return this.fetchById(id);
  }

  async generateContent(
    data: Partial<Pick<ResearchOutputPostRequest, 'descriptionMD'>>,
  ): Promise<Partial<Pick<ResearchOutputResponse, 'shortDescription'>>> {
    if (!data.descriptionMD) {
      return {
        shortDescription: '',
      };
    }

    const shortDescription =
      await this.generativeContentDataProvider.summariseContent(
        data.descriptionMD,
      );

    return {
      shortDescription,
    };
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

    this.handleErrors(errors);
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

    return ERROR_UNIQUE_TITLE;
  }

  private validateTeamList(
    researchOutputData: ResearchOutputUpdateData,
    currentResearchOutput: ResearchOutputDataObject,
  ): ValidationErrorResponse['data'][0] | null {
    if (currentResearchOutput.teams[0]?.id !== researchOutputData.teams?.[0]) {
      return ERROR_TEAMS_ORDER_CHANGED;
    }

    return null;
  }

  private validateVersionUniqueness(
    newResearchOutput: ResearchOutputUpdateData,
    newVersion: ResearchOutputVersionPostRequest,
    versions: ResearchOutputVersionPostRequest[] | undefined,
  ): void {
    const errors: ValidationErrorResponse['data'] = [];

    if (
      newResearchOutput.link === newVersion.link ||
      (versions && versions.some((version) => version.link === newVersion.link))
    ) {
      errors.push(ERROR_UNIQUE_LINK);
    }

    this.handleErrors(errors);
  }

  private async validateLinkUniqueness(
    researchOutputData: ResearchOutputCreateData | ResearchOutputUpdateData,
    researchOutputId?: string,
  ): Promise<ValidationErrorResponse['data'][0] | null> {
    if (
      researchOutputData.documentType === 'Lab Resource' &&
      !researchOutputData.link
    ) {
      return null;
    }

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

    return ERROR_UNIQUE_LINK;
  }

  private async parseResearchTags(
    researchOutputData: ResearchOutputInputTags,
  ): Promise<ResearchOutputParsedTags> {
    const researchTags = (await fetchAll(this.researchTagDataProvider)).items;

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

  private handleErrors(errors: ValidationErrorResponse['data']) {
    if (errors.length > 0) {
      // TODO: Remove Boom from the controller layer
      // https://asaphub.atlassian.net/browse/CRN-777
      throw Boom.badRequest<ValidationErrorResponse['data']>(
        `${VALIDATION_ERROR_MESSAGE} ${JSON.stringify(errors)}`,
        errors,
      );
    }
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
    link: researchOutputData.link?.trim() ?? researchOutputData.link,
  });
}

export type ResearchOutputCreateData = ResearchOutputPostRequest & {
  createdBy: string;
};

export type ResearchOutputUpdateData = ResearchOutputPutRequest & {
  updatedBy: string;
  createVersion?: boolean;
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
      documentType?: string | string[];
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

export const ERROR_TEAMS_ORDER_CHANGED = {
  instancePath: '/teams',
  keyword: 'invalid',
  message: 'first team cannot be removed or changed',
  params: {
    type: 'string',
  },
  schemaPath: '#/properties/teams/invalid',
};
