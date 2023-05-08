import { gp2 as gp2Model, UserSocialLinks } from '@asap-hub/model';

import {
  Environment,
  gp2 as gp2Contentful,
  GraphQLClient,
  Maybe,
  patchAndPublish,
  waitForUpdated,
} from '@asap-hub/contentful';
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

  async fetchById(id: string): Promise<gp2Model.UserDataObject | null> {
    const { users } = await this.fetchUserById(id);

    if (!users) {
      return null;
    }

    return parseContentfulGraphQlUsers(users);
  }

  async fetch(
    options: gp2Model.FetchUsersOptions,
  ): Promise<gp2Model.ListUserDataObject> {
    const result = await this.fetchUsers(options);

    return {
      total: result?.total,
      items: result?.items
        .filter((x): x is UserItem => x !== null)
        .map(parseContentfulGraphQlUsers),
    };
  }

  private async fetchUsers(options: gp2Model.FetchUsersOptions) {
    const { take = 8, skip = 0 } = options;

    const where = generateFetchQueryFilter(options);

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

  async create(): Promise<string> {
    throw new Error('Method not implemented.');
  }

  async update(id: string, data: gp2Model.UserUpdateDataObject): Promise<void> {
    const fields = cleanUser(data);
    const environment = await this.getRestClient();
    const user = await environment.getEntry(id);
    const result = await patchAndPublish(user, fields);

    const fetchEventById = () => this.fetchUserById(id);

    await waitForUpdated<gp2Contentful.FetchUserByIdQuery>(
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
    return { ...acc, [key]: value };
  }, {} as { [key: string]: unknown });

export const parseContentfulGraphQlUsers = (
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
    secondaryEmail: user.alternativeEmail ?? undefined,
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
    positions: [
      { department: 'Research', institution: 'Stark Industries', role: 'CEO' },
    ],
    projects,
    contributingCohorts,
    workingGroups,
  };
};
const generateFetchQueryFilter = ({
  filter,
}: gp2Model.FetchUsersOptions): gp2Contentful.UsersFilter => {
  const {
    regions,
    keywords,
    code,
    onlyOnboarded = true,
    hidden = true,
  } = filter || {};

  const filterCode = code ? { connections_contains_all: [code] } : {};
  const filterHidden = hidden ? { role_not: 'Hidden' } : {};
  const filterNonOnboarded = onlyOnboarded ? { onboarded: true } : {};
  const filterRegions = regions ? { regions_in: regions } : {};
  const filterKeywords = keywords ? { keywords_in: keywords } : {};

  return {
    ...filterCode,
    ...filterNonOnboarded,
    ...filterHidden,
    ...filterRegions,
    ...filterKeywords,
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
