import { gp2 as gp2Model, UserSocialLinks } from '@asap-hub/model';

import {
  addLocaleToFields,
  Environment,
  getBulkPayload,
  getLinkEntities,
  getLinkEntity,
  gp2 as gp2Contentful,
  GraphQLClient,
  Link,
  Maybe,
  patchAndPublish,
  pollContentfulGql,
} from '@asap-hub/contentful';
import logger from '../../utils/logger';
import { UserDataProvider } from '../types';

export type UserItem = NonNullable<
  NonNullable<gp2Contentful.FetchUsersQuery['usersCollection']>['items'][number]
>;

export class UserContentfulDataProvider implements UserDataProvider {
  constructor(
    private graphQLClient: GraphQLClient,
    private getRestClient: () => Promise<Environment>,
  ) {}

  private fetchUserById(id: string) {
    return this.graphQLClient.request<
      gp2Contentful.FetchUserByIdQuery,
      gp2Contentful.FetchUserByIdQueryVariables
    >(gp2Contentful.FETCH_USER_BY_ID, { id });
  }
  private async fetchUsersByProject(id: string[]) {
    const { projectsCollection } = await this.graphQLClient.request<
      gp2Contentful.FetchUsersByProjectIdQuery,
      gp2Contentful.FetchUsersByProjectIdQueryVariables
    >(gp2Contentful.FETCH_USERS_BY_PROJECT_ID, { id });
    return projectsCollection;
  }
  private async fetchUsersByWorkingGroup(id: string[]) {
    const { workingGroupsCollection } = await this.graphQLClient.request<
      gp2Contentful.FetchUsersByWorkingGroupIdQuery,
      gp2Contentful.FetchUsersByWorkingGroupIdQueryVariables
    >(gp2Contentful.FETCH_USERS_BY_WORKING_GROUP_ID, { id });
    return workingGroupsCollection;
  }

  async fetchById(id: string) {
    const { users } = await this.fetchUserById(id);
    return users ? parseUserToDataObject(users) : null;
  }

  private getUserIdFilter = async ({
    projects,
    workingGroups,
  }: gp2Model.FetchUsersOptions['filter'] = {}): Promise<string[]> => {
    const members = await Promise.all([
      getEntityMembers(projects, this.fetchUsersByProject.bind(this)),
      getEntityMembers(workingGroups, this.fetchUsersByWorkingGroup.bind(this)),
    ]);

    return members
      .flat()
      .filter((member): member is string => Boolean(member))
      .filter((id, index, arr) => arr.indexOf(id) === index);
  };
  async fetch(options: gp2Model.FetchUsersOptions) {
    const { projects, workingGroups } = options.filter || {};
    const userIdFilter = await this.getUserIdFilter({
      projects,
      workingGroups,
    });
    if (
      userIdFilter.length === 0 &&
      (projects?.length || workingGroups?.length)
    ) {
      return { total: 0, items: [] };
    }
    logger.debug(`fetch users ${JSON.stringify(options, undefined, 2)} `);
    const result = await this.fetchUsers(options, userIdFilter);

    const items = {
      total: result.total,
      items: result.items
        .filter((user: unknown): user is UserItem => user !== null)
        .map(parseUserToDataObject),
    };

    logger.debug(JSON.stringify(items, undefined, 2));
    return items;
  }

  private async fetchUsers(
    options: gp2Model.FetchUsersOptions,
    userIdFilter: string[],
  ) {
    const { take = 8, skip = 0 } = options;

    const where = generateFetchQueryFilter(options, userIdFilter);
    logger.debug(`fetch users where: ${JSON.stringify(where, undefined, 2)}`);

    const { usersCollection } = await this.graphQLClient.request<
      gp2Contentful.FetchUsersQuery,
      gp2Contentful.FetchUsersQueryVariables
    >(gp2Contentful.FETCH_USERS, {
      limit: take,
      skip,
      where,
      order: [gp2Contentful.UsersOrder.LastNameAsc],
    });
    return usersCollection || { total: 0, items: [] };
  }

  async create(data: gp2Model.UserCreateDataObject) {
    const fields = cleanUser(data);
    const environment = await this.getRestClient();
    const nextContributingCohorts = await addNextCohorts(
      environment,
      data.contributingCohorts,
    );
    const cohortFields = getCohortFields(nextContributingCohorts);
    const userEntry = await environment.createEntry('users', {
      fields: addLocaleToFields({
        ...fields,
        ...cohortFields,
      }),
    });

    await userEntry.publish();

    return userEntry.sys.id;
  }

  async update(id: string, data: gp2Model.UserUpdateDataObject) {
    const fields = cleanUser(data);
    const environment = await this.getRestClient();
    const user = await environment.getEntry(id);
    const previousContributingCohorts = user.fields.contributingCohorts;

    logger.debug(`The user: ${JSON.stringify(user, undefined, 2)}`);

    const nextContributingCohorts = await addNextCohorts(
      environment,
      data.contributingCohorts,
    );

    const cohortFields = getCohortFields(nextContributingCohorts);
    const result = await patchAndPublish(user, {
      ...fields,
      ...cohortFields,
    });

    await removePreviousCohorts(
      environment,
      data.contributingCohorts,
      previousContributingCohorts,
    );
    const fetchEventById = () => this.fetchUserById(id);
    await pollContentfulGql<gp2Contentful.FetchUserByIdQuery>(
      result.sys.publishedVersion || Infinity,
      fetchEventById,
      'users',
    );
  }
}

const cleanUser = (userToUpdate: gp2Model.UserUpdateDataObject) =>
  Object.entries(userToUpdate).reduce((acc, [key, value]) => {
    if (key === 'avatar') {
      return {
        ...acc,
        avatar: {
          sys: {
            type: 'Link',
            linkType: 'Asset',
            id: value,
          },
        },
      };
    }
    if (key === 'social') {
      // the frontend only sends the fields which have values defined
      // so need to default all social keys to null to allow unsetting
      return {
        ...acc,
        twitter: null,
        linkedIn: null,
        github: null,
        researcherId: null,
        googleScholar: null,
        researchGate: null,
        ...(value as UserSocialLinks),
      };
    }

    if (key === 'telephone') {
      return {
        ...acc,
        telephoneNumber: (value as gp2Model.UserUpdateDataObject['telephone'])
          ?.number,
        telephoneCountryCode: (
          value as gp2Model.UserUpdateDataObject['telephone']
        )?.countryCode,
      };
    }
    if (key === 'connections') {
      const connections = userToUpdate.connections || [];
      return {
        ...acc,
        connections: connections.map(({ code }) => code),
      };
    }
    return { ...acc, [key]: value };
  }, {} as { [key: string]: unknown });

export const parseUserToDataObject = (
  user: UserItem,
): gp2Model.UserDataObject => {
  const normaliseArray = (
    inputs: Maybe<Maybe<string>[]> | undefined,
  ): string[] =>
    (inputs || []).reduce<string[]>(
      (parsed, input) => (input ? [...parsed, input] : parsed),
      [],
    );

  const questions = normaliseArray(user.questions);
  const connections = normaliseArray(user.connections);
  const keywords = normaliseArray(user.keywords);

  const telephone =
    user.telephoneNumber || user.telephoneCountryCode
      ? {
          countryCode: user.telephoneCountryCode || undefined,
          number: user.telephoneNumber || undefined,
        }
      : undefined;
  const contributingCohorts = parseContributingCohorts(
    user.contributingCohortsCollection,
  );

  const positions = parsePositions(user.positions);
  const projects = parseProjects(user.linkedFrom?.projectMembershipCollection);
  const workingGroups = parseWorkingGroups(
    user.linkedFrom?.workingGroupMembershipCollection,
  );
  return {
    id: user.sys.id,
    createdDate: user.sys.firstPublishedAt,
    activatedDate: user.activatedDate ?? undefined,
    onboarded: !!user.onboarded,
    email: user.email ?? '',
    alternativeEmail: user.alternativeEmail ?? undefined,
    firstName: user.firstName ?? '',
    lastName: user.lastName ?? '',
    biography: user.biography ?? undefined,
    city: user.city ?? undefined,
    country: user.country ?? '',
    region: user.region as gp2Model.UserRegion,
    avatarUrl: user.avatar?.url ?? undefined,
    questions,
    role: user.role as gp2Model.UserRole,
    degrees: (user.degrees as gp2Model.UserDegree[]) || [],
    connections: connections.map((connection) => ({ code: connection })),
    keywords,
    telephone,
    fundingStreams: user.fundingStreams ?? undefined,
    social: {
      linkedIn: user.linkedIn ?? undefined,
      orcid: user.orcid ?? undefined,
      researcherId: user.researcherId ?? undefined,
      twitter: user.twitter ?? undefined,
      github: user.github ?? undefined,
      blog: user.blog ?? undefined,
      googleScholar: user.googleScholar ?? undefined,
      researchGate: user.researchGate ?? undefined,
    },
    positions,
    projects,
    contributingCohorts,
    workingGroups,
  };
};
const generateFetchQueryFilter = (
  { filter, search }: gp2Model.FetchUsersOptions,
  userIdFilter: string[],
): gp2Contentful.UsersFilter => {
  const {
    regions,
    keywords,
    code,
    onlyOnboarded,
    hidden = true,
  } = filter || {};

  const filterCode: gp2Contentful.UsersFilter = code
    ? { connections_contains_all: [code] }
    : {};
  const filterHidden: gp2Contentful.UsersFilter = hidden
    ? { role_not: 'Hidden' }
    : {};
  const filterNonOnboarded: gp2Contentful.UsersFilter = onlyOnboarded
    ? { onboarded: true }
    : {};
  const filterRegions: gp2Contentful.UsersFilter = regions
    ? { region_in: regions }
    : {};
  const filterKeywords: gp2Contentful.UsersFilter = keywords
    ? { keywords_contains_some: keywords }
    : {};
  const searchFilter = search ? getSearchFilter(search) : {};
  const filterUserId =
    userIdFilter.length > 0 ? { sys: { id_in: userIdFilter } } : {};
  return {
    ...filterUserId,
    ...filterCode,
    ...filterNonOnboarded,
    ...filterHidden,
    ...filterRegions,
    ...filterKeywords,
    ...searchFilter,
  };
};

type ContributingCohorts = NonNullable<
  NonNullable<gp2Contentful.FetchUsersQuery['usersCollection']>['items'][number]
>['contributingCohortsCollection'];

const parseContributingCohorts = (contributingCohorts: ContributingCohorts) =>
  contributingCohorts?.items.reduce(
    (cohorts: gp2Model.UserDataObject['contributingCohorts'], cohort) =>
      cohort?.contributingCohort?.name && cohort.role
        ? [
            ...cohorts,
            {
              contributingCohortId: cohort.contributingCohort.sys.id,
              name: cohort.contributingCohort.name,
              role: cohort.role as gp2Model.UserContributingCohortRole,
              ...(cohort.studyLink && { studyUrl: cohort.studyLink }),
            },
          ]
        : cohorts,
    [],
  ) || [];

type LinkedProject = NonNullable<
  NonNullable<
    NonNullable<
      gp2Contentful.FetchUsersQuery['usersCollection']
    >['items'][number]
  >['linkedFrom']
>['projectMembershipCollection'];
type LinkedWorkingGroup = NonNullable<
  NonNullable<
    NonNullable<
      gp2Contentful.FetchUsersQuery['usersCollection']
    >['items'][number]
  >['linkedFrom']
>['workingGroupMembershipCollection'];
type LinkedProjectItem = NonNullable<
  NonNullable<
    NonNullable<
      NonNullable<NonNullable<LinkedProject>['items'][number]>['linkedFrom']
    >['projectsCollection']
  >['items'][number]
>;
type LinkedProjectMembers = LinkedProjectItem['membersCollection'];
type LinkedWorkingGroupItem = NonNullable<
  NonNullable<
    NonNullable<
      NonNullable<
        NonNullable<LinkedWorkingGroup>['items'][number]
      >['linkedFrom']
    >['workingGroupsCollection']
  >['items'][number]
>;

type LinkedWorkingGroupMembers = LinkedWorkingGroupItem['membersCollection'];
export type Member<T> = {
  userId: string;
  role: T;
};
export const parseMembers = <T extends string>(
  members: LinkedProjectMembers | LinkedWorkingGroupMembers,
) =>
  members?.items.reduce((membersList: Member<T>[], member) => {
    const user = member?.user;
    const role = member?.role as T;
    if (!(user && user.onboarded)) {
      return membersList;
    }
    const groupMember = { role, userId: user.sys.id };
    return [...membersList, groupMember];
  }, []) || [];
const parseProjects = (
  projects: LinkedProject,
): gp2Model.UserDataObject['projects'] =>
  projects?.items
    .reduce((projectList: LinkedProjectItem[], project) => {
      const linked = project?.linkedFrom?.projectsCollection?.items[0];
      return linked ? [...projectList, linked] : projectList;
    }, [])
    .map((project) => {
      const projectId = project.sys.id;
      const status = project.status as gp2Model.ProjectStatus;
      const members = parseMembers<gp2Model.ProjectMemberRole>(
        project.membersCollection,
      );
      return {
        id: projectId,
        status,
        title: project.title || '',
        members,
      };
    }) || [];

const parseWorkingGroups = (
  workingGroupItems: LinkedWorkingGroup,
): gp2Model.UserDataObject['workingGroups'] =>
  workingGroupItems?.items
    .reduce((workingGroups: LinkedWorkingGroupItem[], workingGroup) => {
      const linked =
        workingGroup?.linkedFrom?.workingGroupsCollection?.items[0];
      return linked ? [...workingGroups, linked] : workingGroups;
    }, [])
    .map((workingGroup) => {
      const workingGroupId = workingGroup.sys.id;
      const members = parseMembers<gp2Model.WorkingGroupMemberRole>(
        workingGroup.membersCollection,
      );
      return {
        id: workingGroupId,
        title: workingGroup.title || '',
        members,
      };
    }) || [];

const parsePositions = (
  positions: NonNullable<
    NonNullable<
      gp2Contentful.FetchUsersQuery['usersCollection']
    >['items'][number]
  >['positions'],
): gp2Model.UserDataObject['positions'] =>
  positions?.map(
    ({
      role,
      department,
      institution,
    }: {
      role: string;
      department: string;
      institution: string;
    }) => ({
      role,
      department,
      institution,
    }),
  ) || [];

const getEntityMembers = async (
  ids: string[] | undefined,
  queryFetchMemberData: (
    filter: string[],
  ) => Promise<
    | gp2Contentful.FetchUsersByWorkingGroupIdQuery['workingGroupsCollection']
    | gp2Contentful.FetchUsersByProjectIdQuery['projectsCollection']
  >,
) => {
  if (!ids) {
    return [];
  }
  const entities = await queryFetchMemberData(ids);
  return entities?.items.flatMap(
    (entity) =>
      entity?.membersCollection?.items?.map(
        (member = {}) => member?.user?.sys.id,
      ) || [],
  );
};

const getSearchFilter = (search: string) => {
  type SearchFields = {
    OR: (
      | (Pick<gp2Contentful.UsersFilter, 'firstName_contains'> & {
          lastName_contains?: undefined;
        })
      | (Pick<gp2Contentful.UsersFilter, 'lastName_contains'> & {
          firstName_contains?: undefined;
        })
    )[];
  };

  const filter = search
    .split(' ')
    .filter(Boolean) // removes whitespaces
    .reduce<SearchFields[]>(
      (acc, word: string) => [
        ...acc,
        {
          OR: [{ firstName_contains: word }, { lastName_contains: word }],
        },
      ],
      [],
    );

  return { AND: [...filter] };
};
const getCohortFields = (nextContributingCohorts: string[] | undefined) =>
  nextContributingCohorts
    ? {
        contributingCohorts: getLinkEntities(nextContributingCohorts, false),
      }
    : {};

const addNextCohorts = async (
  environment: Environment,
  nextCohorts?: gp2Model.UserUpdateDataObject['contributingCohorts'],
) => {
  if (nextCohorts && nextCohorts.length > 0) {
    const nextContributingCohorts = await Promise.all(
      nextCohorts.map(async ({ contributingCohortId, role, studyUrl }) => {
        const entry = await environment.createEntry(
          'contributingCohortsMembership',
          {
            fields: addLocaleToFields({
              contributingCohort: getLinkEntity(contributingCohortId, false),
              role,
              studyLink: studyUrl,
            }),
          },
        );
        return entry.sys.id;
      }),
    );

    const payload = getBulkPayload(nextContributingCohorts, true);
    const publish = await environment.createPublishBulkAction(payload);
    await publish.waitProcessing();
    return nextContributingCohorts;
  }
  return undefined;
};

const removePreviousCohorts = async (
  environment: Environment,
  nextCohorts?: gp2Model.UserUpdateDataObject['contributingCohorts'],
  previousContributingCohorts?: { 'en-US': Link<'Entry'>[] },
) => {
  if (previousContributingCohorts && nextCohorts && nextCohorts.length > 0) {
    const previousCohorts = previousContributingCohorts['en-US'].map(
      (cohort) => cohort.sys.id,
    );
    const payload = getBulkPayload(previousCohorts, false);
    const unpublish = await environment.createUnpublishBulkAction(payload);
    await unpublish.waitProcessing();
    const cohortEntities = await environment.getEntries({
      content_type: 'contributingCohortsMembership',
      'sys.id[in]': previousCohorts.join(','),
    });
    return Promise.all(cohortEntities.items.map((entry) => entry.delete()));
  }
  return null;
};
