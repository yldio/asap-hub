import { gp2 as gp2Model, UserSocialLinks } from '@asap-hub/model';

import {
  addLocaleToFields,
  Environment,
  gp2 as gp2Contentful,
  GraphQLClient,
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
    private contentfulClient: GraphQLClient,
    private getRestClient: () => Promise<Environment>,
  ) {}

  private fetchUserById(id: string) {
    return this.contentfulClient.request<
      gp2Contentful.FetchUserByIdQuery,
      gp2Contentful.FetchUserByIdQueryVariables
    >(gp2Contentful.FETCH_USER_BY_ID, { id });
  }
  private async fetchUsersByProject(id: string[]) {
    const { projectsCollection } = await this.contentfulClient.request<
      gp2Contentful.FetchUsersByProjectIdQuery,
      gp2Contentful.FetchUsersByProjectIdQueryVariables
    >(gp2Contentful.FETCH_USERS_BY_PROJECT_ID, { id });
    return projectsCollection;
  }
  private async fetchUsersByWorkingGroup(id: string[]) {
    const { workingGroupsCollection } = await this.contentfulClient.request<
      gp2Contentful.FetchUsersByWorkingGroupIdQuery,
      gp2Contentful.FetchUsersByWorkingGroupIdQueryVariables
    >(gp2Contentful.FETCH_USERS_BY_WORKING_GROUP_ID, { id });
    return workingGroupsCollection;
  }

  async fetchById(id: string): Promise<gp2Model.UserDataObject | null> {
    const { users } = await this.fetchUserById(id);
    return users ? parseContentfulGraphQLUsers(users) : null;
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
  async fetch(
    options: gp2Model.FetchUsersOptions,
  ): Promise<gp2Model.ListUserDataObject> {
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
      total: result?.total,
      items: result?.items
        .filter((user: unknown): user is UserItem => user !== null)
        .map(parseContentfulGraphQLUsers),
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

    const { usersCollection } = await this.contentfulClient.request<
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

  async create(data: gp2Model.UserCreateDataObject): Promise<string> {
    const fields = cleanUser(data);
    const environment = await this.getRestClient();
    const userEntry = await environment.createEntry('users', {
      fields: addLocaleToFields(fields),
    });

    await userEntry.publish();

    return userEntry.sys.id;
  }

  async update(id: string, data: gp2Model.UserUpdateDataObject): Promise<void> {
    try {
      const fields = cleanUser(data);
      const environment = await this.getRestClient();
      const user = await environment.getEntry(id);

      logger.debug(`The user: ${JSON.stringify(user, undefined, 2)}`);
      const output = await Promise.all(
        (data.contributingCohorts || [])?.map(async (contributingCohort) => {
          const entry = await environment.createEntry(
            'contributingCohortsMembership',
            {
              fields: addLocaleToFields({
                contributingCohort: {
                  sys: {
                    type: 'Link',
                    linkType: 'Entry',
                    id: contributingCohort.contributingCohortId,
                  },
                },
                role: contributingCohort.role,
                studyLink: contributingCohort.studyUrl,
              }),
            },
          );
          await entry.publish();
          return entry.sys.id;
        }),
      );

      const result = await patchAndPublish(user, {
        ...fields,
        contributingCohorts: output.map((id) => ({
          sys: {
            type: 'Link',
            linkType: 'Entry',
            id,
          },
        })),
      });

      if (user.fields['contributingCohorts']) {
        const cohorts = user.fields['contributingCohorts']['en-US'];
        const cohortEntities = await environment.getEntries({
          content_type: 'contributingCohortsMembership',
          'sys.id[in]': cohorts
            .map((cohort: { sys: { id: string } }) => cohort.sys.id)
            .join(','),
        });
        await Promise.all(
          cohortEntities.items.map(async (entry) => {
            await entry.unpublish();
            await entry.delete();
          }),
        );
      }
      const fetchEventById = () => this.fetchUserById(id);
      await pollContentfulGql<gp2Contentful.FetchUserByIdQuery>(
        result.sys.publishedVersion || Infinity,
        fetchEventById,
        'users',
      );
    } catch (err) {
      logger.error(`An error occurred updating a user ${id} - ${data}`);
      if (err instanceof Error) {
        logger.error(`The error message: ${err.message}`);
      }
      throw err;
    }
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

export const parseContentfulGraphQLUsers = (
  user: UserItem,
): gp2Model.UserDataObject => {
  const normaliseArray = (
    input: Maybe<Maybe<string>[]> | undefined,
  ): string[] =>
    (input || []).reduce(
      (arr: string[], str: Maybe<string>) => (str ? [...arr, str] : arr),
      [],
    );

  if (!(user.region && gp2Model.isUserRegion(user.region))) {
    throw new Error(`Region not defined: ${user.region}`);
  }
  if (!(user.role && gp2Model.isUserRole(user.role))) {
    throw new Error(`Role not defined: ${user.role}`);
  }
  const questions = normaliseArray(user.questions);
  const connections = normaliseArray(user.connections);

  if (user.degrees && !user.degrees.every(gp2Model.isUserDegree)) {
    throw new TypeError('Invalid degree received');
  }
  if (user.keywords && !user.keywords.every(gp2Model.isKeyword)) {
    throw new TypeError('Invalid keyword received');
  }

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
    region: user.region,
    avatarUrl: user.avatar?.url ?? undefined,
    questions,
    role: user.role,
    degrees: user.degrees || [],
    connections: connections.map((connection) => ({ code: connection })),
    keywords: user.keywords || [],
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

  const filterCode = code ? { connections_contains_all: [code] } : {};
  const filterHidden = hidden ? { role_not: 'Hidden' } : {};
  const filterNonOnboarded = onlyOnboarded ? { onboarded: true } : {};
  const filterRegions = regions ? { regions_in: regions } : {};
  const filterKeywords = keywords ? { keywords_in: keywords } : {};
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

const parseContributingCohorts = (
  cohorts: NonNullable<
    NonNullable<
      gp2Contentful.FetchUsersQuery['usersCollection']
    >['items'][number]
  >['contributingCohortsCollection'],
): gp2Model.UserDataObject['contributingCohorts'] =>
  cohorts?.items.map((cohort) => {
    if (
      !(
        cohort &&
        cohort.contributingCohort?.name &&
        cohort.role &&
        cohort.contributingCohort.sys.id
      )
    ) {
      throw new Error('Invalid Contributing Cohort');
    }
    if (!gp2Model.isUserContributingCohortRole(cohort.role)) {
      throw new Error('Invalid Contributing Cohort Role');
    }
    return {
      contributingCohortId: cohort.contributingCohort.sys.id,
      name: cohort.contributingCohort.name,
      role: cohort.role,
      ...(cohort.studyLink && { studyUrl: cohort.studyLink }),
    };
  }) || [];

const parseProjects = (
  projects: NonNullable<
    NonNullable<
      NonNullable<
        gp2Contentful.FetchUsersQuery['usersCollection']
      >['items'][number]
    >['linkedFrom']
  >['projectMembershipCollection'],
): gp2Model.UserDataObject['projects'] =>
  projects?.items
    ?.filter(
      (project) =>
        project?.linkedFrom?.projectsCollection?.items &&
        project.linkedFrom.projectsCollection.items.length > 0,
    )
    .map((project) => {
      const linkedProject = project?.linkedFrom?.projectsCollection?.items[0];
      const projectId = linkedProject?.sys.id;
      if (!projectId) {
        throw new Error('Project not defined.');
      }

      const status = linkedProject?.status;
      if (!(status && gp2Model.isProjectStatus(status))) {
        throw new TypeError('Status not defined');
      }
      return {
        id: projectId,
        status,
        title: linkedProject.title || '',
        members:
          linkedProject.membersCollection?.items.map((member) => {
            const user = member?.user;
            const role = member?.role;

            if (!(role && user && gp2Model.isProjectMemberRole(role))) {
              throw new Error('Invalid project members');
            }
            return { role, userId: user.sys.id };
          }) || [],
      };
    }) || [];

const parseWorkingGroups = (
  workingGroupItems: NonNullable<
    NonNullable<
      NonNullable<
        gp2Contentful.FetchUsersQuery['usersCollection']
      >['items'][number]
    >['linkedFrom']
  >['workingGroupMembershipCollection'],
): gp2Model.UserDataObject['workingGroups'] =>
  workingGroupItems?.items.map((wg) => {
    const linkedWorkingGroup =
      wg?.linkedFrom?.workingGroupsCollection?.items[0];

    const id = linkedWorkingGroup?.sys.id;
    if (!id) {
      throw new Error('Working Group not defined.');
    }
    return {
      id,
      title: linkedWorkingGroup.title || '',
      members:
        linkedWorkingGroup.membersCollection?.items.map((member) => {
          const user = member?.user;
          const role = member?.role;

          if (!(role && user && gp2Model.isWorkingGroupMemberRole(role))) {
            throw new Error('Invalid working group members');
          }
          return { role, userId: user.sys.id };
        }) || [],
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
      role?: string;
      department?: string;
      institution?: string;
    }) => {
      if (!(role && department && institution)) {
        throw new Error('Position not defined');
      }
      return {
        role,
        department,
        institution,
      };
    },
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
      | {
          firstName_contains: string;
          lastName_contains?: undefined;
        }
      | {
          lastName_contains: string;
          firstName_contains?: undefined;
        }
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
