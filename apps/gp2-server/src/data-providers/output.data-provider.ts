import {
  addLocaleToFields,
  Environment,
  getLinkEntities,
  getLinkEntity,
  gp2 as gp2Contentful,
  GraphQLClient,
  patchAndPublish,
  pollContentfulGql,
} from '@asap-hub/contentful';
import { gp2 as gp2Model } from '@asap-hub/model';
import logger from '../utils/logger';
import { parseTag, TagItem } from './tag.data-provider';
import { isSharingStatus } from './transformers';
import { OutputDataProvider, UpdateOutputOptions } from './types';

export type OutputItem = NonNullable<
  NonNullable<
    gp2Contentful.FetchOutputsQuery['outputsCollection']
  >['items'][number]
>;

export class OutputContentfulDataProvider implements OutputDataProvider {
  constructor(
    private graphQLClient: GraphQLClient,
    private getRestClient: () => Promise<Environment>,
  ) {}
  private fetchOutputById(id: string) {
    return this.graphQLClient.request<
      gp2Contentful.FetchOutputByIdQuery,
      gp2Contentful.FetchOutputByIdQueryVariables
    >(gp2Contentful.FETCH_OUTPUT_BY_ID, { id });
  }
  async fetchById(id: string) {
    const outputGraphqlResponse = await this.fetchOutputById(id);

    const { outputs } = outputGraphqlResponse;

    return outputs ? parseContentfulGraphQLOutput(outputs) : null;
  }

  async fetch({
    take = 8,
    skip = 0,
    search,
    filter,
  }: gp2Model.FetchOutputOptions) {
    const outputs = await this.fetchOutputs(take, skip, {
      filter,
      search,
    });

    return parseOutputsCollection(outputs);
  }

  private async fetchOutputs(
    take: number,
    skip: number,
    { search, filter }: gp2Model.FetchOutputOptions,
  ) {
    if (filter?.workingGroupId) {
      return this.fetchOutputsByWorkingGroupId(
        take,
        skip,
        filter.workingGroupId,
      );
    }
    if (filter?.projectId) {
      return this.fetchOutputsByProjectId(take, skip, filter.projectId);
    }
    if (filter?.authorId) {
      return this.fetchOutputsByUserId(take, skip, filter.authorId);
    }

    if (filter?.externalAuthorId) {
      return this.fetchOutputsByExternalUserId(
        take,
        skip,
        filter.externalAuthorId,
      );
    }

    if (filter?.eventId) {
      return this.fetchOutputsByEventId(take, skip, filter.eventId);
    }
    const searchWhere = search ? getSearchWhere(search) : [];
    const filterWhere = filter ? getFilterWhere(filter) : [];
    const where = [...searchWhere, ...filterWhere];

    const { outputsCollection } = await this.graphQLClient.request<
      gp2Contentful.FetchOutputsQuery,
      gp2Contentful.FetchOutputsQueryVariables
    >(gp2Contentful.FETCH_OUTPUTS, {
      limit: take,
      skip,
      where: where.length ? { AND: where } : {},
      order: [gp2Contentful.OutputsOrder.AddedDateDesc],
    });
    return outputsCollection;
  }

  private async fetchOutputsByUserId(take: number, skip: number, id: string) {
    const { users } = await this.graphQLClient.request<
      gp2Contentful.FetchOutputsByUserIdQuery,
      gp2Contentful.FetchOutputsByUserIdQueryVariables
    >(gp2Contentful.FETCH_OUTPUTS_BY_USER_ID, {
      limit: take,
      skip,
      id,
    });
    return users?.linkedFrom?.outputsCollection;
  }

  private async fetchOutputsByExternalUserId(
    take: number,
    skip: number,
    id: string,
  ) {
    const { externalUsers } = await this.graphQLClient.request<
      gp2Contentful.FetchOutputsByExternalUserIdQuery,
      gp2Contentful.FetchOutputsByExternalUserIdQueryVariables
    >(gp2Contentful.FETCH_OUTPUTS_BY_EXTERNAL_USER_ID, {
      limit: take,
      skip,
      id,
    });
    return externalUsers?.linkedFrom?.outputsCollection;
  }

  private async fetchOutputsByProjectId(
    take: number,
    skip: number,
    id: string,
  ) {
    const { projects } = await this.graphQLClient.request<
      gp2Contentful.FetchOutputsByProjectIdQuery,
      gp2Contentful.FetchOutputsByProjectIdQueryVariables
    >(gp2Contentful.FETCH_OUTPUTS_BY_PROJECT_ID, {
      limit: take,
      skip,
      id,
    });
    return projects?.linkedFrom?.outputsCollection;
  }

  private async fetchOutputsByEventId(take: number, skip: number, id: string) {
    const { events } = await this.graphQLClient.request<
      gp2Contentful.FetchOutputsByEventIdQuery,
      gp2Contentful.FetchOutputsByEventIdQueryVariables
    >(gp2Contentful.FETCH_OUTPUTS_BY_EVENT_ID, {
      limit: take,
      skip,
      id,
    });
    return events?.linkedFrom?.outputsCollection;
  }

  private async fetchOutputsByWorkingGroupId(
    take: number,
    skip: number,
    id: string,
  ) {
    const { workingGroups } = await this.graphQLClient.request<
      gp2Contentful.FetchOutputsByWorkingGroupIdQuery,
      gp2Contentful.FetchOutputsByWorkingGroupIdQueryVariables
    >(gp2Contentful.FETCH_OUTPUTS_BY_WORKING_GROUP_ID, {
      limit: take,
      skip,
      id,
    });
    return workingGroups?.linkedFrom?.outputsCollection;
  }

  async create({
    workingGroupIds,
    projectIds,
    mainEntityId,
    ...data
  }: gp2Model.OutputCreateDataObject) {
    if (!mainEntityId) {
      throw new Error('invalid related entities');
    }
    const environment = await this.getRestClient();

    const fields = cleanOutput(data);
    const outputEntry = await environment.createEntry('outputs', {
      fields: addLocaleToFields({
        ...fields,
        relatedEntities: getLinkEntities([
          mainEntityId as string,
          ...(workingGroupIds || []),
          ...(projectIds || []),
        ]),
      }),
    });
    await outputEntry.publish();

    return outputEntry.sys.id;
  }

  async update(
    id: string,
    {
      workingGroupIds,
      projectIds,
      mainEntityId,
      ...input
    }: gp2Model.OutputUpdateDataObject,
    updateOptions?: UpdateOutputOptions,
  ) {
    const environment = await this.getRestClient();
    const entry = await environment.getEntry(id);
    const data = input;

    if (updateOptions?.newVersion) {
      const versionEntry = await environment.createEntry('outputVersion', {
        fields: addLocaleToFields({
          ...updateOptions.newVersion,
        }),
      });
      await versionEntry.publish();

      const { id: versionId } = versionEntry.sys;

      data.versions = entry.fields?.versions?.['en-US']
        ? [
            ...entry.fields.versions['en-US']
              .filter(
                (version: { sys: { id: string } } | null) => version !== null,
              )
              .map(({ sys }: { sys: { id: string } }) => sys.id),
            versionId,
          ]
        : [versionId];
    }

    const fields = cleanOutput(data);
    const result = await patchAndPublish(entry, {
      ...fields,
      relatedEntities: getLinkEntities([
        mainEntityId as string,
        ...(workingGroupIds || []),
        ...(projectIds || []),
      ]),
    });

    const fetchEventById = () => this.fetchOutputById(id);
    await pollContentfulGql<gp2Contentful.FetchOutputByIdQuery>(
      result.sys.publishedVersion ?? Infinity,
      fetchEventById,
      'outputs',
    );
  }
}

const getType = (
  documentType: gp2Model.OutputDocumentType,
  type?: string | null,
) => (documentType === 'Article' ? (type as gp2Model.OutputType) : undefined);

const getSubType = (
  documentType: gp2Model.OutputDocumentType,
  type?: gp2Model.OutputType,
  subtype?: string | null,
) =>
  documentType === 'Article' && type === 'Research'
    ? (subtype as gp2Model.OutputSubtype)
    : undefined;

const getEntity = (entity?: GraphQLEntity | null) =>
  entity
    ? {
        type: entity.__typename,
        id: entity.sys.id,
        title: entity.title ?? '',
      }
    : ({} as gp2Model.OutputOwner);
type GraphQLEntities = NonNullable<
  OutputItem['relatedEntitiesCollection']
>['items'];
type GraphQLEntity = NonNullable<GraphQLEntities[number]>;

const getRelatedEntities = (relatedEntities?: GraphQLEntities) =>
  relatedEntities
    ?.filter((entity): entity is GraphQLEntity => entity !== null)
    .reduce(
      (acc, entity) => ({
        ...acc,
        [entity.__typename === 'Projects' ? 'projects' : 'workingGroups']: [
          ...(entity.__typename === 'Projects'
            ? acc.projects
            : acc.workingGroups),
          {
            id: entity.sys.id,
            title: entity.title,
          },
        ],
      }),
      {
        projects: [] as gp2Model.OutputOwner[],
        workingGroups: [] as gp2Model.OutputOwner[],
      },
    );

type GraphQLEvents = NonNullable<
  OutputItem['relatedEventsCollection']
>['items'];
type GraphQLEvent = NonNullable<GraphQLEvents[number]>;
const getRelatedEvents = (relatedEvents?: GraphQLEvents) =>
  relatedEvents
    ?.filter((event): event is GraphQLEvent => event !== null)
    .map((event) => ({
      id: event.sys.id,
      title: event?.title || '',
      endDate: event.endDate || '',
    })) || [];

type GraphQLCohorts = NonNullable<
  OutputItem['contributingCohortsCollection']
>['items'];
type GraphQLCohort = NonNullable<GraphQLCohorts[number]>;
const getCohorts = (cohorts?: GraphQLCohorts) =>
  cohorts
    ?.filter((cohort): cohort is GraphQLCohort => cohort !== null)
    .map((cohort) => ({
      id: cohort.sys.id,
      name: cohort.name ?? '',
      studyLink: cohort.studyLink ?? undefined,
    })) || [];

type GraphQLAuthors = NonNullable<OutputItem['authorsCollection']>['items'];
type GraphQLAuthor = NonNullable<GraphQLAuthors[number]>;
const getAuthors = (authors?: GraphQLAuthors) =>
  authors
    ?.filter(
      (author) => author?.__typename !== 'Users' || author.onboarded !== false,
    )
    .filter((author): author is GraphQLAuthor => author !== null)
    .map((author) =>
      author.__typename === 'Users'
        ? {
            id: author.sys.id,
            firstName: author.firstName ?? '',
            lastName: author.lastName ?? '',
            displayName: `${author.firstName} ${author.lastName}`,
            email: author.email ?? '',
            onboarded: author.onboarded ?? true,
            avatarUrl: author.avatar?.url ?? undefined,
          }
        : {
            id: author.sys.id,
            displayName: author.name || '',
          },
    ) || [];

type GraphQLOutputs = NonNullable<
  OutputItem['relatedOutputsCollection']
>['items'];
type GraphQLOutput = NonNullable<GraphQLOutputs[number]>;
export const getRelatedOutputs = (outputs?: GraphQLOutputs) =>
  outputs
    ?.filter(
      (output): output is GraphQLOutput =>
        output !== null &&
        output.documentType !== null &&
        output.title !== null,
    )
    .map(({ sys, documentType, title, type, relatedEntitiesCollection }) => ({
      id: sys.id,
      title: title ?? '',
      documentType: documentType as gp2Model.OutputDocumentType,
      ...(type ? { type: type as gp2Model.OutputType } : {}),
      entity: relatedEntitiesCollection?.items.length
        ? getEntity(relatedEntitiesCollection?.items[0])
        : undefined,
    })) || [];
type GraphQLOutputVersions = NonNullable<
  OutputItem['versionsCollection']
>['items'];
type GraphQLOutputVersion = NonNullable<GraphQLOutputVersions[number]>;
export const getOutputVersions = (items?: GraphQLOutputVersions) =>
  items
    ?.filter((output): output is GraphQLOutputVersion => output !== null)
    .map((output: GraphQLOutputVersion) => ({
      id: output?.sys.id || '',
      title: output?.title || '',
      link: output?.link || '',
      type: getType(
        output.documentType as gp2Model.OutputDocumentType,
        output.type,
      ),
      documentType: output.documentType as gp2Model.OutputDocumentType,
      addedDate: output?.addedDate || '',
    })) || [];
export const parseContentfulGraphQLOutput = (
  data: OutputItem,
): gp2Model.OutputDataObject => {
  const documentType = data.documentType as gp2Model.OutputDocumentType;
  const type = getType(documentType, data.type);
  const subtype = getSubType(documentType, type, data.subtype);
  const authors = getAuthors(data.authorsCollection?.items);
  const relatedOutputs = [
    ...getRelatedOutputs(data.relatedOutputsCollection?.items),
    ...getRelatedOutputs(data.linkedFrom?.outputsCollection?.items),
  ];
  const mainEntity = getEntity(data.relatedEntitiesCollection?.items[0]);
  const relatedEntities = getRelatedEntities(
    data.relatedEntitiesCollection?.items,
  );
  const relatedEvents = getRelatedEvents(data.relatedEventsCollection?.items);
  const contributingCohorts = getCohorts(
    data.contributingCohortsCollection?.items,
  );
  const versions = getOutputVersions(data.versionsCollection?.items);
  const projects =
    relatedEntities && relatedEntities.projects.length !== 0
      ? relatedEntities?.projects
      : undefined;
  const workingGroups =
    relatedEntities && relatedEntities.workingGroups.length !== 0
      ? relatedEntities?.workingGroups
      : undefined;

  const tags =
    data.tagsCollection?.items
      .filter((tag): tag is TagItem => tag !== null)
      .map(parseTag) ?? [];
  return {
    id: data.sys.id,
    created: data.sys.firstPublishedAt,
    link: data.link ?? undefined,
    documentType,
    type,
    subtype,
    title: data.title ?? '',
    description: data.description ?? '',
    gp2Supported: data.gp2Supported as gp2Model.DecisionOption,
    sharingStatus:
      data.sharingStatus && isSharingStatus(data.sharingStatus)
        ? data.sharingStatus
        : 'GP2 Only',
    publishDate: data.publishDate ?? undefined,
    addedDate: data.addedDate ?? '',
    lastUpdatedPartial:
      data.lastUpdatedPartial ??
      data.sys.publishedAt ??
      data.sys.firstPublishedAt,
    authors,
    tags,
    doi: data.doi ?? undefined,
    rrid: data.rrid ?? undefined,
    accessionNumber: data.accessionNumber ?? undefined,
    projects,
    workingGroups,
    mainEntity,
    contributingCohorts,
    relatedOutputs,
    relatedEvents,
    versions,
  };
};

const getFilterWhere = ({
  title,
  documentType,
  link,
}: gp2Model.FetchOutputFilter) => [
  ...(title ? [{ title }] : []),
  ...(documentType ? [{ documentType_in: documentType }] : []),
  ...(link ? [{ link }] : []),
];
const getSearchWhere = (search: string) => {
  type SearchFields = Pick<gp2Contentful.OutputsFilter, 'title_contains'>;
  const where = search
    .split(' ')
    .filter(Boolean) // removes whitespaces
    .reduce<SearchFields[]>(
      (acc, word: string) => [...acc, { title_contains: word }],
      [],
    );
  return [{ OR: where }];
};
const linkEntityValue = (value: string | string[]) =>
  Array.isArray(value)
    ? value.map((id) => getLinkEntity(id))
    : getLinkEntity(value);

const cleanOutput = (
  outputToUpdate: Omit<
    gp2Model.OutputUpdateDataObject | gp2Model.OutputCreateDataObject,
    'mainEntityId'
  >,
) =>
  Object.entries(outputToUpdate).reduce((acc, [key, value]) => {
    switch (key) {
      case 'authors':
        return {
          ...acc,
          authors: (value as gp2Model.OutputUpdateDataObject['authors']).map(
            (author) =>
              getLinkEntity(author.userId || (author.externalUserId as string)),
          ),
        };
      case 'createdBy':
        return {
          ...acc,
          createdBy: linkEntityValue(value as string),
          updatedBy: linkEntityValue(value as string),
        };
      case 'updatedBy':
        return { ...acc, updatedBy: linkEntityValue(value as string) };
      case 'tagIds':
        return { ...acc, tags: linkEntityValue(value as string[]) };
      case 'contributingCohortIds':
        return {
          ...acc,
          contributingCohorts: linkEntityValue(value as string[]),
        };
      case 'relatedOutputIds':
        return { ...acc, relatedOutputs: linkEntityValue(value as string[]) };
      case 'relatedEventIds':
        return { ...acc, relatedEvents: linkEntityValue(value as string[]) };
      case 'versions':
        return {
          ...acc,
          versions: value ? getLinkEntities(value as string[]) : undefined,
        };
      default:
        return { ...acc, [key]: value };
    }
  }, {} as { [key: string]: unknown });

type OutputsCollection = gp2Contentful.FetchOutputsQuery['outputsCollection'];
const parseOutputsCollection = (outputsCollection: OutputsCollection) => {
  if (!outputsCollection) {
    logger.warn('Outputs returned null');
    return {
      total: 0,
      items: [],
    };
  }

  return {
    total: outputsCollection.total,
    items: outputsCollection.items
      .filter((item): item is OutputItem => item !== null)
      .map(parseContentfulGraphQLOutput),
  };
};
