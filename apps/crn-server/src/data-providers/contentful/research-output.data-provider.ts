import {
  ListResearchOutputDataObject,
  ResearchOutputCreateDataObject,
  ResearchOutputDataObject,
  ResearchOutputUpdateDataObject,
  convertBooleanToDecision,
  convertDecisionToBoolean,
  isResearchOutputDocumentType,
  researchOutputMapType,
} from '@asap-hub/model';
import {
  GraphQLClient,
  Environment,
  addLocaleToFields,
  getLinkEntity,
  getLinkEntities,
  parseRichText,
  patch,
  RichTextFromQuery,
  FETCH_RESEARCH_OUTPUT_BY_ID,
  FETCH_RESEARCH_OUTPUTS,
  FetchResearchOutputByIdQuery,
  FetchResearchOutputByIdQueryVariables,
  FetchResearchOutputsQuery,
  FetchResearchOutputsQueryVariables,
  ResearchOutputsOrder,
  ResearchOutputsFilter,
  pollContentfulGql,
} from '@asap-hub/contentful';
import { isSharingStatus } from '../transformers/research-output';
import {
  ResearchOutputDataProvider,
  FetchResearchOutputOptions,
  UpdateResearchOutputOptions,
  CreateResearchOutputOptions,
} from '../types';

type ResearchOutputItem = NonNullable<
  FetchResearchOutputByIdQuery['researchOutputs']
>;

type TeamItem = NonNullable<
  NonNullable<ResearchOutputItem['teamsCollection']>['items'][number]
>;

type LabItem = NonNullable<
  NonNullable<ResearchOutputItem['labsCollection']>['items'][number]
>;

type AuthorItem = NonNullable<
  NonNullable<ResearchOutputItem['authorsCollection']>['items'][number]
>;

type RelatedResearchItem = NonNullable<
  NonNullable<ResearchOutputItem['relatedResearchCollection']>['items'][number]
>;
type RelatedEventItem = NonNullable<
  NonNullable<ResearchOutputItem['relatedEventsCollection']>['items'][number]
>;

export class ResearchOutputContentfulDataProvider
  implements ResearchOutputDataProvider
{
  constructor(
    private contentfulClient: GraphQLClient,
    private contentfulPreviewClient: GraphQLClient,
    private getRestClient: () => Promise<Environment>,
  ) {}

  async fetch(
    options: FetchResearchOutputOptions,
  ): Promise<ListResearchOutputDataObject> {
    const { take = 8, skip = 0, filter, search, includeDrafts } = options;

    const searchTerms = (search || '').split(' ').filter(Boolean);
    const where: ResearchOutputsFilter = {};

    if (searchTerms.length) {
      where.OR = [
        ...searchTerms.map((term) => ({ title_contains: term })),
        ...searchTerms.map((term) => ({ keywords: { name: term } })),
      ];
    }

    if (filter) {
      if (filter.teamId) {
        where.teams = { sys: { id: filter.teamId } };
      }
      if (filter.workingGroupId) {
        where.workingGroup = { sys: { id: filter.workingGroupId } };
      }
      if (filter.documentType) {
        if (Array.isArray(filter.documentType)) {
          where.documentType_in = filter.documentType;
        } else {
          where.documentType = filter.documentType;
        }
      }
      if (filter.title) {
        where.title = filter.title;
      }
      if (filter.link) {
        where.link = filter.link;
      }
      if (filter.status) {
        where.sys = {
          publishedVersion_exists: filter.status !== 'draft',
        };
      }
    }
    const client = includeDrafts
      ? this.contentfulPreviewClient
      : this.contentfulClient;
    const { researchOutputsCollection } = await client.request<
      FetchResearchOutputsQuery,
      FetchResearchOutputsQueryVariables
    >(FETCH_RESEARCH_OUTPUTS, {
      limit: take,
      skip,
      where,
      order: [
        ResearchOutputsOrder.SysFirstPublishedAtDesc,
        ResearchOutputsOrder.CreatedDateDesc,
      ],
      preview: includeDrafts,
    });

    if (!researchOutputsCollection) {
      return { total: 0, items: [] };
    }

    return {
      total: researchOutputsCollection.total,
      items: researchOutputsCollection.items
        .filter((item): item is ResearchOutputItem => item !== null)
        .map(parseGraphQLResearchOutput),
    };
  }

  private async fetchOutputById(id: string) {
    return this.contentfulClient.request<
      FetchResearchOutputByIdQuery,
      FetchResearchOutputByIdQueryVariables
    >(FETCH_RESEARCH_OUTPUT_BY_ID, { id, preview: false });
  }

  async fetchById(id: string): Promise<ResearchOutputDataObject | null> {
    const { researchOutputs } = await this.fetchOutputById(id);

    if (!researchOutputs) {
      const { researchOutputs: draftResearchOutput } =
        await this.contentfulPreviewClient.request<
          FetchResearchOutputByIdQuery,
          FetchResearchOutputByIdQueryVariables
        >(FETCH_RESEARCH_OUTPUT_BY_ID, { id, preview: true });
      if (!draftResearchOutput) {
        return null;
      }
      return parseGraphQLResearchOutput(draftResearchOutput);
    }

    return parseGraphQLResearchOutput(researchOutputs);
  }

  async create(
    input: ResearchOutputCreateDataObject,
    createOptions: CreateResearchOutputOptions,
  ): Promise<string> {
    const environment = await this.getRestClient();

    const researchOutputEntry = await environment.createEntry(
      'researchOutputs',
      {
        fields: addLocaleToFields({
          ...prepareInputForCreate(input),
          addedDate: createOptions.publish ? new Date().toISOString() : null,
        }),
      },
    );

    if (createOptions.publish) {
      await researchOutputEntry.publish();
    }

    return researchOutputEntry.sys.id;
  }

  async update(
    id: string,
    input: ResearchOutputUpdateDataObject,
    updateOptions: UpdateResearchOutputOptions,
  ): Promise<void> {
    const environment = await this.getRestClient();
    const entry = await environment.getEntry(id);
    const update = prepareInputForUpdate(input);
    const result = await patch(entry, update);

    if (updateOptions.publish) {
      const toPublish = await patch(result, {
        addedDate: update.lastUpdatedPartial,
      });

      const published = await toPublish.publish();

      const fetchOutputById = () => this.fetchOutputById(id);

      await pollContentfulGql<FetchResearchOutputByIdQuery>(
        published.sys.publishedVersion || Infinity,
        fetchOutputById,
        'researchOutputs',
      );
    }
  }
}

const mapTeams = (items: (TeamItem | null)[]) =>
  items
    .filter((team: TeamItem | null): team is TeamItem => team !== null)
    .map((team) => ({
      id: team.sys.id,
      displayName: team.displayName || '',
    }));

const mapRelatedResearch = (
  items: (RelatedResearchItem | null)[],
  isOwnRelatedResearchLink: boolean,
) =>
  items
    .filter(
      (ro: RelatedResearchItem | null): ro is RelatedResearchItem =>
        ro !== null,
    )
    .map((ro: RelatedResearchItem) => ({
      id: ro?.sys.id,
      title: ro.title || '',
      type: researchOutputMapType(ro.type) || undefined,
      documentType:
        ro.documentType && isResearchOutputDocumentType(ro.documentType)
          ? ro.documentType
          : 'Grant Document',
      teams: mapTeams(ro.teamsCollection?.items || []),
      isOwnRelatedResearchLink,
    }));

const parseGraphQLResearchOutput = (
  researchOutputs: ResearchOutputItem,
): ResearchOutputDataObject => {
  const teams = mapTeams(researchOutputs.teamsCollection?.items || []);
  const contactEmails =
    (researchOutputs.teamsCollection?.items || [])
      .flatMap((team: TeamItem | null) =>
        team?.linkedFrom?.teamMembershipCollection?.items
          .filter(
            (membership) =>
              membership?.role === 'Project Manager' &&
              membership?.inactiveSinceDate === null,
          )
          .map(
            (membership) =>
              membership?.linkedFrom?.usersCollection?.items[0]?.email,
          ),
      )
      .filter((x): x is string => !!x) || [];
  return {
    id: researchOutputs.sys.id,
    title: researchOutputs.title || '',
    description: researchOutputs.description
      ? parseRichText(researchOutputs.description as RichTextFromQuery)
      : undefined,
    descriptionMD: researchOutputs.descriptionMd || '',
    link: researchOutputs.link || undefined,
    asapFunded: convertDecisionToBoolean(researchOutputs.asapFunded || null),
    usedInPublication: convertDecisionToBoolean(
      researchOutputs.usedInAPublication || null,
    ),
    type: researchOutputMapType(researchOutputs.type) || undefined,
    subtype: researchOutputs.subtype?.name || undefined,
    rrid: researchOutputs.rrid || undefined,
    accession: researchOutputs.accession || undefined,
    doi: researchOutputs.doi || undefined,
    labCatalogNumber: researchOutputs.labCatalogNumber || undefined,
    addedDate: researchOutputs.addedDate,
    publishDate: researchOutputs.publishDate,
    created: researchOutputs.createdDate,
    documentType:
      researchOutputs.documentType &&
      isResearchOutputDocumentType(researchOutputs.documentType)
        ? researchOutputs.documentType
        : 'Grant Document',
    sharingStatus:
      researchOutputs.sharingStatus &&
      isSharingStatus(researchOutputs.sharingStatus)
        ? researchOutputs.sharingStatus
        : 'Network Only',
    workingGroups: researchOutputs.workingGroup
      ? [
          {
            id: researchOutputs.workingGroup.sys.id,
            title: researchOutputs.workingGroup.title || '',
          },
        ]
      : [],
    authors:
      researchOutputs.authorsCollection?.items
        ?.filter((author): author is AuthorItem => author !== null)
        ?.filter(
          (author) =>
            author.__typename !== 'Users' || author?.onboarded !== false,
        )
        .map((author) => {
          if (author.__typename === 'Users') {
            return {
              id: author.sys.id,
              firstName: author.firstName || '',
              lastName: author.lastName || '',
              displayName: `${author.firstName} ${author.lastName}`,
              avatarUrl: author.avatar?.url || undefined,
            };
          }

          return {
            id: author.sys.id,
            displayName: author?.name || '',
            orcid: author.orcid || '',
          };
        }) || [],
    contactEmails: [...new Set(contactEmails)],
    lastUpdatedPartial: researchOutputs.lastUpdatedPartial,
    labs:
      researchOutputs.labsCollection?.items
        .filter((x): x is LabItem => x !== null && !!x.name)
        .map((lab: LabItem) => ({ id: lab.sys.id, name: lab.name || '' })) ||
      [],
    keywords:
      researchOutputs.keywordsCollection?.items
        .map((keyword) => keyword?.name || '')
        .filter(Boolean) || [],
    methods:
      researchOutputs.methodsCollection?.items
        .map((method) => method?.name || '')
        .filter(Boolean) || [],
    organisms:
      researchOutputs.organismsCollection?.items
        .map((organism) => organism?.name || '')
        .filter(Boolean) || [],
    environments:
      researchOutputs.environmentsCollection?.items
        .map((environment) => environment?.name || '')
        .filter(Boolean) || [],
    teams,
    published: !!researchOutputs.sys.publishedVersion,
    relatedResearch: [
      ...mapRelatedResearch(
        researchOutputs.relatedResearchCollection?.items || [],
        true,
      ),
      ...mapRelatedResearch(
        researchOutputs.linkedFrom?.researchOutputsCollection?.items || [],
        false,
      ),
    ],
    relatedEvents:
      researchOutputs.relatedEventsCollection?.items
        ?.filter((event): event is RelatedEventItem => event !== null)
        .map((event) => ({
          id: event.sys.id,
          title: event?.title || '',
          endDate: event.endDate || '',
        })) || [],
    reviewRequestedBy: researchOutputs.reviewRequestedBy
      ? {
          id: researchOutputs.reviewRequestedBy.sys.id,
          firstName: researchOutputs.reviewRequestedBy.firstName || '',
          lastName: researchOutputs.reviewRequestedBy.lastName || '',
        }
      : undefined,
  };
};

const prepareInput = (
  input: ResearchOutputCreateDataObject | ResearchOutputUpdateDataObject,
) => {
  const {
    authors,
    teamIds,
    relatedResearchIds,
    relatedEventIds,
    labIds,
    methodIds,
    environmentIds,
    organismIds,
    subtypeId,
    keywordIds,
    workingGroups,
    ...researchOutputData
  } = input;

  const {
    usedInPublication: _usedInPublication,
    description: _description,
    usageNotes: _usageNotes,
    ...researchOutput
  } = {
    ...researchOutputData,
    descriptionMD: researchOutputData.descriptionMD,
    asapFunded: convertBooleanToDecision(researchOutputData.asapFunded),
    usedInAPublication: convertBooleanToDecision(
      researchOutputData.usedInPublication,
    ),
    authors: getLinkEntities(
      authors.map((author) =>
        'userId' in author ? author.userId : author.externalAuthorId,
      ),
    ),
    labs: getLinkEntities(labIds),
    teams: getLinkEntities(teamIds),
    relatedResearch: getLinkEntities(relatedResearchIds),
    relatedEvents: getLinkEntities(relatedEventIds),
    methods: getLinkEntities(methodIds),
    keywords: getLinkEntities(keywordIds),
    environments: getLinkEntities(environmentIds),
    organisms: getLinkEntities(organismIds),
    workingGroup:
      workingGroups && workingGroups[0]
        ? getLinkEntity(workingGroups[0])
        : null,
    subtype: subtypeId ? getLinkEntity(subtypeId) : null,
  };

  return researchOutput;
};

const prepareInputForCreate = (input: ResearchOutputCreateDataObject) => ({
  ...prepareInput(input),
  createdBy: getLinkEntity(input.createdBy),
  updatedBy: getLinkEntity(input.createdBy),
  createdDate: new Date().toISOString(),
  lastUpdatedPartial: new Date().toISOString(),
});

const prepareInputForUpdate = (input: ResearchOutputUpdateDataObject) => {
  const { reviewRequestedById: _reviewRequestedById, ...researchOutput } =
    input;
  return {
    ...prepareInput(researchOutput),
    updatedBy: getLinkEntity(input.updatedBy),
    reviewRequestedBy: input.reviewRequestedById
      ? getLinkEntity(input.reviewRequestedById)
      : null,
    lastUpdatedPartial: new Date().toISOString(),
  };
};
