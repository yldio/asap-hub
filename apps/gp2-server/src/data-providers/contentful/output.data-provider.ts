import {
  addLocaleToFields,
  Environment,
  gp2 as gp2Contentful,
  GraphQLClient,
  patchAndPublish,
  pollContentfulGql,
} from '@asap-hub/contentful';
import { gp2 as gp2Model } from '@asap-hub/model';
import logger from '../../utils/logger';
import { OutputDataProvider } from '../types';

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
    console.log('in fetchById');
    const outputGraphqlResponse = await this.fetchOutputById(id);

    const { outputs } = outputGraphqlResponse;

    return outputs ? parseContentfulGraphQLOutput(outputs) : null;
  }

  async fetch({
    take = 8,
    skip = 0,
    search,
    filter,
    includeDrafts,
  }: gp2Model.FetchOutputOptions) {
    console.log('in fetch', { search, filter, includeDrafts });
    if (filter?.workingGroup) {
      const { workingGroups } = await this.graphQLClient.request<
        gp2Contentful.FetchOutputsByWorkingGroupIdQuery,
        gp2Contentful.FetchOutputsByWorkingGroupIdQueryVariables
      >(gp2Contentful.FETCH_OUTPUTS_BY_WORKING_GROUP_ID, {
        limit: take,
        skip,
        id: filter.workingGroup,
      });

      const outputsCollection = workingGroups?.linkedFrom?.outputsCollection;

      return parseOutputsCollection(outputsCollection);
    }
    if (filter?.project) {
      const { projects } = await this.graphQLClient.request<
        gp2Contentful.FetchOutputsByProjectIdQuery,
        gp2Contentful.FetchOutputsByProjectIdQueryVariables
      >(gp2Contentful.FETCH_OUTPUTS_BY_PROJECT_ID, {
        limit: take,
        skip,
        id: filter.project,
      });

      const outputsCollection = projects?.linkedFrom?.outputsCollection;

      return parseOutputsCollection(outputsCollection);
    }
    if (filter?.author) {
      const { users } = await this.graphQLClient.request<
        gp2Contentful.FetchOutputsByUserIdQuery,
        gp2Contentful.FetchOutputsByUserIdQueryVariables
      >(gp2Contentful.FETCH_OUTPUTS_BY_USER_ID, {
        limit: take,
        skip,
        id: filter.author,
      });

      const outputsCollection = users?.linkedFrom?.outputsCollection;

      return parseOutputsCollection(outputsCollection);
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
      preview: includeDrafts === true,
      order: [gp2Contentful.OutputsOrder.PublishDateDesc],
    });

    return parseOutputsCollection(outputsCollection);
  }

  async create({
    publishDate: _,
    workingGroup,
    project,
    ...data
  }: gp2Model.OutputCreateDataObject) {
    console.log('in create');
    const environment = await this.getRestClient();

    const fields = cleanOutput({
      ...data,
    });
    const outputEntry = await environment.createEntry('outputs', {
      fields: addLocaleToFields({
        ...fields,
        relatedEntity: {
          sys: {
            type: 'Link',
            linkType: 'Entry',
            id: workingGroup || project,
          },
        },
        createdBy: {
          sys: {
            type: 'Link',
            linkType: 'Entry',
            id: data.createdBy,
          },
        },
        updatedBy: {
          sys: {
            type: 'Link',
            linkType: 'Entry',
            id: data.createdBy,
          },
        },
      }),
    });
    await outputEntry.publish();

    return outputEntry.sys.id;
  }

  async update(
    id: string,
    { publishDate: _, ...data }: gp2Model.OutputUpdateDataObject,
  ) {
    console.log('in update');
    const environment = await this.getRestClient();
    const user = await environment.getEntry(id);

    const fields = cleanOutput({
      ...data,
    });
    const authors = data.authors.map(getAuthorIdList);
    const result = await patchAndPublish(
      user,
      addLocaleToFields({
        ...fields,
        authors,
      }),
    );

    const fetchEventById = () => this.fetchOutputById(id);
    await pollContentfulGql<gp2Contentful.FetchOutputByIdQuery>(
      result.sys.publishedVersion || Infinity,
      fetchEventById,
      'outputs',
    );
  }
}

const getAuthorIdList = (authorDataObject: gp2Model.AuthorUpsertDataObject) => {
  if ('userId' in authorDataObject) {
    return authorDataObject.userId;
  }

  return authorDataObject.externalUserId;
};

const getType = (
  documentType: gp2Model.OutputDocumentType,
  type?: string | null,
) => {
  if (documentType !== 'Article') {
    return undefined;
  }
  if (!(type && gp2Model.isOutputType(type))) {
    throw new TypeError('type not defined');
  }
  return type;
};
const getSubType = (
  documentType: gp2Model.OutputDocumentType,
  type?: gp2Model.OutputType,
  subtype?: string | null,
) => {
  if (!(documentType === 'Article' && type === 'Research')) {
    return undefined;
  }
  if (!(subtype && gp2Model.isOutputSubType(subtype))) {
    throw new TypeError('subtype not defined');
  }
  return subtype;
};

const getRelatedEntity = (related: OutputItem['relatedEntity']) => {
  const empty = { project: undefined, workingGroup: undefined };
  if (!related) {
    return empty;
  }
  return {
    ...empty,
    [related.__typename === 'Projects' ? 'project' : 'workingGroup']: {
      id: related.sys.id,
      title: related.title,
    },
  };
};

const getAuthors = (
  authors?: NonNullable<OutputItem['authorsCollection']>['items'],
) =>
  authors
    ?.filter(
      (author) => author?.__typename !== 'Users' || author.onboarded !== false,
    )
    .reduce(
      (
        authorList: (gp2Model.UserAuthor | gp2Model.ExternalUserResponse)[],
        author,
      ) => {
        if (!author?.__typename) {
          return authorList;
        }
        if (author.__typename === 'Users') {
          return [
            ...authorList,
            {
              id: author.sys.id,
              firstName: author.firstName || '',
              lastName: author.lastName || '',
              displayName: `${author.firstName} ${author.lastName}`,
              email: author.email || '',
              onboarded: author.onboarded || true,
              avatarUrl: author.avatar?.url ?? undefined,
            },
          ];
        }

        return [
          ...authorList,
          {
            id: author.sys.id,
            displayName: author.name || '',
          },
        ];
      },
      [],
    ) || [];

export const parseContentfulGraphQLOutput = (
  data: OutputItem,
): gp2Model.OutputDataObject => {
  if (
    !(data.documentType && gp2Model.isOutputDocumentType(data.documentType))
  ) {
    throw new TypeError('document type not defined');
  }
  const type = getType(data.documentType, data.type);
  const subtype = getSubType(data.documentType, type, data.subtype);
  const authors = getAuthors(data.authorsCollection?.items);
  const relatedEntity = getRelatedEntity(data.relatedEntity);
  return {
    id: data.sys.id,
    created: data.sys.firstPublishedAt,
    link: data.link || undefined,
    documentType: data.documentType,
    type,
    subtype,
    title: data.title || '',
    publishDate: data.publishDate,
    addedDate: data.addedDate || '',
    lastUpdatedPartial:
      data.lastUpdatedPartial ||
      data.sys.publishedAt ||
      data.sys.firstPublishedAt,
    authors,
    ...relatedEntity,
  };
};

const getDocumentTypeFilter = (documentType: string | string[]) =>
  Array.isArray(documentType)
    ? [{ documentType_in: documentType }]
    : [{ documentType }];
const getFilterWhere = ({
  title,
  documentType,
  link,
}: gp2Model.FetchOutputFilter) => {
  const titleFilter = title ? [{ title }] : [];
  const linkFilter = link ? [{ link }] : [];
  const documentTypeFilter = documentType
    ? getDocumentTypeFilter(documentType)
    : [];
  return [...titleFilter, ...documentTypeFilter, ...linkFilter];
};
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

const cleanOutput = (
  outputToUpdate:
    | gp2Model.OutputUpdateDataObject
    | gp2Model.OutputCreateDataObject,
) =>
  Object.entries(outputToUpdate).reduce((acc, [key, value]) => {
    if (key === 'authors') {
      return {
        ...acc,
        authors: (value as gp2Model.OutputUpdateDataObject['authors']).map(
          (author) => ({
            sys: {
              type: 'Link',
              linkType: 'Entry',
              id: author.userId || author.externalUserId,
            },
          }),
        ),
      };
    }
    return { ...acc, [key]: value };
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

  const { total, items: outputs } = outputsCollection;

  if (outputs === null) {
    logger.warn('outputs items returned null');
    return {
      total: 0,
      items: [],
    };
  }

  return {
    total,
    items: outputs.reduce((list: gp2Model.OutputDataObject[], item) => {
      if (!item) {
        return list;
      }

      return [...list, parseContentfulGraphQLOutput(item)];
    }, []),
  };
};
