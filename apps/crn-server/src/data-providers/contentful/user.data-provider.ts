import {
  activeUserMembershipStatus,
  FetchUsersOptions,
  inactiveUserMembershipStatus,
  InterestGroupMembership,
  isUserDegree,
  isUserRole,
  LabResponse,
  ListPublicUserDataObject,
  ListUserDataObject,
  OrcidWork,
  PublicUserDataObject,
  TeamRole,
  UserDataObject,
  UserListItemDataObject,
  UserListItemTeam,
  UserSocialLinks,
  UserTeam,
  UserUpdateDataObject,
  WorkingGroupMembership,
} from '@asap-hub/model';

import {
  Environment,
  FetchPublicUsersQuery,
  FetchPublicUsersQueryVariables,
  FetchUserByIdQuery,
  FetchUserByIdQueryVariables,
  FetchUsersByLabIdQuery,
  FetchUsersByLabIdQueryVariables,
  FetchUsersByTeamIdQuery,
  FetchUsersByTeamIdQueryVariables,
  FetchUsersQuery,
  FetchUsersQueryVariables,
  FETCH_PUBLIC_USERS,
  FETCH_USERS,
  FETCH_USERS_BY_LAB_ID,
  FETCH_USERS_BY_TEAM_ID,
  FETCH_USER_BY_ID,
  getLinkEntities,
  GraphQLClient,
  Maybe,
  patchAndPublish,
  patchAndPublishConflict,
  pollContentfulGql,
  UsersFilter,
  UsersOrder,
} from '@asap-hub/contentful';
import { cleanArray } from '../../utils/clean-array';
import { isTeamRole, parseOrcidWorkFromCMS } from '../transformers';
import { UserDataProvider } from '../types';
import { parseResearchTags } from './research-tag.data-provider';

export type QueryUserListItem = NonNullable<
  NonNullable<FetchUsersQuery['usersCollection']>['items'][number]
>;

export type UserItem = NonNullable<NonNullable<FetchUserByIdQuery['users']>>;

export type PublicUserItem = NonNullable<
  NonNullable<FetchPublicUsersQuery['usersCollection']>['items'][number]
>;

export type TeamMembershipPublic = NonNullable<
  NonNullable<PublicUserItem['teamsCollection']>['items'][number]
>;

export type GroupMemberItemPublic = NonNullable<
  NonNullable<
    NonNullable<PublicUserItem['linkedFrom']>['workingGroupMembersCollection']
  >['items'][number]
>;
export type GroupLeaderItemPublic = NonNullable<
  NonNullable<
    NonNullable<PublicUserItem['linkedFrom']>['workingGroupLeadersCollection']
  >['items'][number]
>;

export type LabsCollection = UserItem['labsCollection'];

export type TeamsCollection = UserItem['teamsCollection'];

export type ResearchOutputsCollection = NonNullable<
  UserItem['linkedFrom']
>['researchOutputsCollection'];

export type ResearchOutputItem = NonNullable<
  NonNullable<
    NonNullable<UserItem['linkedFrom']>['researchOutputsCollection']
  >['items'][number]
>;

export type TeamMembership = NonNullable<
  NonNullable<UserItem['teamsCollection']>['items'][number]
>;
export type GroupMemberItem = NonNullable<
  NonNullable<
    NonNullable<UserItem['linkedFrom']>['workingGroupMembersCollection']
  >['items'][number]
>;
export type GroupLeaderItem = NonNullable<
  NonNullable<
    NonNullable<UserItem['linkedFrom']>['workingGroupLeadersCollection']
  >['items'][number]
>;

export type InterestGroupItem = NonNullable<
  NonNullable<
    NonNullable<TeamMembership['team']>['linkedFrom']
  >['interestGroupsTeamsCollection']
>['items'][number];

export type InterestGroupLeaderItem = NonNullable<
  NonNullable<
    NonNullable<UserItem['linkedFrom']>['interestGroupLeadersCollection']
  >['items'][number]
>;

type OrcidWorkContentful = {
  id: string;
  doi?: string;
  title?: string;
  type?: string;
  publicationDate?: Record<'day' | 'month' | 'year', string | undefined>;
  lastModifiedDate?: string;
};

export class UserContentfulDataProvider implements UserDataProvider {
  constructor(
    private contentfulClient: GraphQLClient,
    private getRestClient: () => Promise<Environment>,
  ) {}

  private fetchUserById(id: string, publicUser: boolean = false) {
    return this.contentfulClient.request<
      FetchUserByIdQuery,
      FetchUserByIdQueryVariables
    >(FETCH_USER_BY_ID, { id, publicUser });
  }

  async fetchById(
    id: string,
    publicUser: boolean = false,
  ): Promise<UserDataObject | null> {
    const { users } = await this.fetchUserById(id, publicUser);

    if (!users) {
      return null;
    }

    return parseContentfulGraphQlUsers(users);
  }

  async fetch(options: FetchUsersOptions): Promise<ListUserDataObject> {
    const result = await this.fetchUsers(options);

    return {
      total: result?.total,
      items: result?.items
        .filter((user): user is QueryUserListItem => user !== null)
        .map(parseContentfulGraphQlUserListItem),
    };
  }

  async fetchPublicUsers(
    options: FetchUsersOptions,
  ): Promise<ListPublicUserDataObject> {
    const result = await this.fetchPublicUsersData(options);

    return {
      total: result?.total,
      items: result?.items
        .filter((user): user is PublicUserItem => user !== null)
        .map(parseContentfulGraphQlPublicUsers),
    };
  }

  private async fetchUsers(options: FetchUsersOptions) {
    const { take = 8, skip = 0 } = options;

    const where: UsersFilter = generateFetchQueryFilter(options);
    const words = (options.search || '').split(' ').filter(Boolean);

    if (words.length) {
      const filters: UsersFilter[] = words.reduce(
        (acc: UsersFilter[], word) =>
          acc.concat([
            {
              OR: [{ expertiseAndResourceDescription_contains: word }],
            },
          ]),
        [],
      );
      where.AND = filters;
    }

    if (options.filter?.labId) {
      const { labs } = await this.contentfulClient.request<
        FetchUsersByLabIdQuery,
        FetchUsersByLabIdQueryVariables
      >(FETCH_USERS_BY_LAB_ID, {
        limit: take,
        skip,
        id: options.filter.labId,
      });

      const labMembershipCollection = labs?.linkedFrom?.labMembershipCollection;
      return labMembershipCollection
        ? {
            total: labMembershipCollection.total,
            items: labMembershipCollection.items.map(
              (labMembership) =>
                labMembership?.linkedFrom?.usersCollection?.items[0],
            ),
          }
        : { total: 0, items: [] };
    }

    if (options.filter?.teamId) {
      const { teamMembershipCollection } = await this.contentfulClient.request<
        FetchUsersByTeamIdQuery,
        FetchUsersByTeamIdQueryVariables
      >(FETCH_USERS_BY_TEAM_ID, {
        limit: take,
        skip,
        id: options.filter.teamId,
      });
      const users =
        teamMembershipCollection?.items
          ?.map((item) => item?.linkedFrom?.usersCollection?.items[0])
          .filter((item) => !!item) || [];

      return {
        total: users.length,
        items: users,
      };
    }

    const { usersCollection } = await this.contentfulClient.request<
      FetchUsersQuery,
      FetchUsersQueryVariables
    >(FETCH_USERS, {
      limit: take,
      skip,
      where,
      order: [UsersOrder.LastNameAsc],
    });
    return usersCollection || { total: 0, items: [] };
  }

  private async fetchPublicUsersData(options: FetchUsersOptions) {
    const { take = 8, skip = 0 } = options;

    const where: UsersFilter = generateFetchQueryFilter(options);

    const { usersCollection } = await this.contentfulClient.request<
      FetchPublicUsersQuery,
      FetchPublicUsersQueryVariables
    >(FETCH_PUBLIC_USERS, {
      limit: take,
      skip,
      where,
      order: [UsersOrder.LastNameAsc],
    });
    return usersCollection || { total: 0, items: [] };
  }

  async create(): Promise<string> {
    throw new Error('Method not implemented.');
  }
  async update(
    id: string,
    data: UserUpdateDataObject,
    { suppressConflict = false, polling = true } = {},
  ): Promise<void> {
    const pollForUpdate = async (publishedVersion: number | undefined) => {
      const fetchUserById = () => this.fetchUserById(id);

      await pollContentfulGql<FetchUserByIdQuery>(
        publishedVersion || Infinity,
        fetchUserById,
        'users',
      );
    };

    const fields = cleanUser(data);
    const environment = await this.getRestClient();
    const user = await environment.getEntry(id);
    const patchMethod = suppressConflict
      ? patchAndPublishConflict
      : patchAndPublish;
    const result = await patchMethod(user, {
      ...fields,
      ...(data.tagIds ? { researchTags: getLinkEntities(data.tagIds) } : {}),
    });
    if (!result || !polling) {
      return;
    }
    await pollForUpdate(result.sys.publishedVersion);
  }
}

const cleanUser = ({
  tagIds: _tagIds,
  ...userToUpdate
}: UserUpdateDataObject) =>
  Object.entries(userToUpdate).reduce(
    (acc, [key, value]) => {
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
          website1: null,
          website2: null,
          twitter: null,
          linkedIn: null,
          github: null,
          researcherId: null,
          googleScholar: null,
          researchGate: null,
          ...(value as UserSocialLinks),
        };
      }
      if (key === 'connections') {
        const connections = userToUpdate.connections || [];
        return {
          ...acc,
          connections: connections.map(({ code }) => code),
        };
      }
      if (typeof value === 'string') {
        return { ...acc, [key]: value.trim() === '' ? null : value };
      }
      return { ...acc, [key]: value };
    },
    {} as { [key: string]: unknown },
  );

export const parseContentfulGraphQlPublicUsers = (
  item: PublicUserItem,
): PublicUserDataObject => {
  const userId = item.sys.id;
  const degree =
    item.degree && isUserDegree(item.degree) ? item.degree : undefined;

  const teams: PublicUserDataObject['teams'] = cleanArray(
    item.teamsCollection?.items,
  )?.map((teamItem) => ({
    displayName: teamItem?.team?.displayName || '',
    role: teamItem?.role as TeamRole,
  }));

  const labs: LabResponse[] = cleanArray(item.labsCollection?.items).map(
    (labItem) => ({
      id: labItem?.sys.id || '',
      name: labItem?.name || '',
    }),
  );

  const tags = cleanArray(item.researchTagsCollection?.items || []).map(
    (tagItem) => tagItem?.name || '',
  );

  const isAlumni = !!item.alumniSinceDate;

  const workingGroupLeadersCollection = cleanArray(
    item.linkedFrom?.workingGroupLeadersCollection?.items,
  );
  const workingGroupMembersCollection = cleanArray(
    item.linkedFrom?.workingGroupMembersCollection?.items,
  );
  const interestGroupLeadersCollection = cleanArray(
    item?.linkedFrom?.interestGroupLeadersCollection?.items,
  );

  const teamsCollection = cleanArray(item?.teamsCollection?.items);

  const workingGroups = [
    ...parseToWorkingGroupsForPublicUser(
      workingGroupLeadersCollection,
      isAlumni,
    ),
    ...parseToWorkingGroupsForPublicUser(
      workingGroupMembersCollection,
      isAlumni,
    ),
  ];

  const interestGroups = removeDuplicates([
    ...parseToInterestGroups(teamsCollection),
    ...parseLeadersToInterestGroups(interestGroupLeadersCollection),
  ]);

  const researchOutputs = parseResearchOutputsCollection(
    item?.linkedFrom?.researchOutputsCollection,
    userId,
  );

  return {
    id: userId,
    avatarUrl: item.avatar?.url ?? undefined,
    biography: item.biography ?? undefined,
    city: item.city ?? undefined,
    country: item.country ?? undefined,
    createdDate: item.createdDate || item.sys.firstPublishedAt,
    lastModifiedDate: item.lastUpdated,
    alumni: isAlumni ? 'Yes' : 'No',
    degree,
    firstName: item.firstName ?? '',
    lastName: item.lastName ?? '',
    institution: item.institution ?? undefined,
    researchTheme: teamsCollection
      .map((teamItem) => teamItem.team?.researchTheme?.name)
      .filter(
        (researchThemeName): researchThemeName is string =>
          researchThemeName !== undefined,
      ),
    researchOutputs,
    tags,
    teams,
    labs,
    interestGroups,
    workingGroups,
    social: {
      website1: item.website1 ?? undefined,
      website2: item.website2 ?? undefined,
      linkedIn: item.linkedIn ?? undefined,
      orcid: item.orcid ?? undefined,
      researcherId: item.researcherId ?? undefined,
      twitter: item.twitter ?? undefined,
      github: item.github ?? undefined,
      googleScholar: item.googleScholar ?? undefined,
      researchGate: item.researchGate ?? undefined,
    },
  };
};

export const parseContentfulGraphQlUsers = (item: UserItem): UserDataObject => {
  const normaliseArray = (
    input: Maybe<Maybe<string>[]> | undefined,
  ): string[] =>
    (input || []).reduce(
      (arr: string[], str: Maybe<string>) => (str ? [...arr, str] : arr),
      [],
    );

  const userId = item.sys.id;
  const questions = normaliseArray(item.questions);
  const connections = normaliseArray(item.connections);

  const role = item.role && isUserRole(item.role) ? item.role : 'Guest';
  const degree =
    item.degree && isUserDegree(item.degree) ? item.degree : undefined;

  const teams: UserTeam[] = parseTeamsCollection(item.teamsCollection);
  const labs: LabResponse[] = parseLabsCollection(item.labsCollection);

  const orcidWorks: OrcidWork[] = parseOrcidWorksContentful(
    item.orcidWorks || [],
  );

  const isAlumni = !!item.alumniSinceDate;

  const workingGroupLeadersCollection = cleanArray(
    item.linkedFrom?.workingGroupLeadersCollection?.items,
  );
  const workingGroupMembersCollection = cleanArray(
    item.linkedFrom?.workingGroupMembersCollection?.items,
  );
  const interestGroupLeadersCollection = cleanArray(
    item?.linkedFrom?.interestGroupLeadersCollection?.items,
  );

  const teamsCollection = cleanArray(item?.teamsCollection?.items);

  const workingGroups = [
    ...parseToWorkingGroups(workingGroupLeadersCollection, isAlumni),
    ...parseToWorkingGroups(workingGroupMembersCollection, isAlumni),
  ];

  const interestGroups = removeDuplicates([
    ...parseToInterestGroups(teamsCollection),
    ...parseLeadersToInterestGroups(interestGroupLeadersCollection),
  ]);

  const researchOutputs = parseResearchOutputsCollection(
    item?.linkedFrom?.researchOutputsCollection,
    userId,
  );

  return {
    id: userId,
    activeCampaignId: item.activeCampaignId || undefined,
    membershipStatus: [
      item.alumniSinceDate
        ? inactiveUserMembershipStatus
        : activeUserMembershipStatus,
    ],
    createdDate: item.createdDate || item.sys.firstPublishedAt,
    lastModifiedDate: item.lastUpdated,
    workingGroups,
    interestGroups,
    onboarded: typeof item.onboarded === 'boolean' ? item.onboarded : undefined,
    email: item.email ?? '',
    researchTheme: teamsCollection
      .map((teamItem) => teamItem.team?.researchTheme?.name)
      .filter(
        (researchThemeName): researchThemeName is string =>
          researchThemeName !== undefined,
      ),
    contactEmail: item.contactEmail ?? undefined,
    firstName: item.firstName ?? '',
    middleName: item.middleName || undefined,
    lastName: item.lastName ?? '',
    nickname: item.nickname || undefined,
    biography: item.biography ?? undefined,
    jobTitle: item.jobTitle ?? undefined,
    city: item.city ?? undefined,
    stateOrProvince: item.stateOrProvince ?? undefined,
    country: item.country ?? undefined,
    institution: item.institution ?? undefined,
    orcid: item.orcid ?? undefined,
    orcidLastModifiedDate: item.orcidLastModifiedDate ?? undefined,
    orcidLastSyncDate: item.orcidLastSyncDate ?? undefined,
    orcidWorks,
    alumniLocation: item.alumniLocation ?? undefined,
    alumniSinceDate: item.alumniSinceDate ?? undefined,
    reachOut: item.reachOut ?? undefined,
    researchInterests: item.researchInterests ?? undefined,
    researchOutputs,
    responsibilities: item.responsibilities ?? undefined,
    expertiseAndResourceDescription:
      item.expertiseAndResourceDescription ?? undefined,
    dismissedGettingStarted: item.dismissedGettingStarted ?? false,
    avatarUrl: item.avatar?.url ?? undefined,
    questions,
    role,
    openScienceTeamMember: !!item.openScienceTeamMember,
    degree,
    connections: connections.map((connection) => ({ code: connection })),
    teams,
    tags: parseResearchTags(item.researchTagsCollection?.items || []),
    labs,
    social: {
      website1: item.website1 ?? undefined,
      website2: item.website2 ?? undefined,
      linkedIn: item.linkedIn ?? undefined,
      orcid: item.orcid ?? undefined,
      researcherId: item.researcherId ?? undefined,
      twitter: item.twitter ?? undefined,
      github: item.github ?? undefined,
      googleScholar: item.googleScholar ?? undefined,
      researchGate: item.researchGate ?? undefined,
    },
  };
};

export const parseContentfulGraphQlUserListItem = (
  item: QueryUserListItem,
): UserListItemDataObject => {
  const userFirstName = item.firstName ?? '';
  const userLastName = item.lastName ?? '';

  const userTeams = (item.teamsCollection?.items || []).reduce(
    (userListItemTeams: UserListItemTeam[], teamItem) => {
      if (!teamItem || !teamItem.role || !isTeamRole(teamItem.role)) {
        return userListItemTeams;
      }

      return [
        ...userListItemTeams,
        {
          id: teamItem?.team?.sys.id || '',
          displayName: teamItem?.team?.displayName || '',
          role: teamItem?.role,
        },
      ];
    },
    [],
  );

  const tags = parseResearchTags(item.researchTagsCollection?.items || []);
  return {
    alumniSinceDate: item.alumniSinceDate,
    avatarUrl: item.avatar?.url ?? undefined,
    city: item.city ?? undefined,
    stateOrProvince: item.stateOrProvince ?? undefined,
    country: item.country ?? undefined,
    createdDate: item.createdDate,
    degree: item.degree && isUserDegree(item.degree) ? item.degree : undefined,
    dismissedGettingStarted: item.dismissedGettingStarted ?? false,
    email: item.email ?? '',
    firstName: userFirstName,
    id: item.sys.id,
    institution: item.institution ?? undefined,
    jobTitle: item.jobTitle ?? undefined,
    labs: parseLabsCollection(item.labsCollection),
    lastName: userLastName,
    membershipStatus: [
      item.alumniSinceDate
        ? inactiveUserMembershipStatus
        : activeUserMembershipStatus,
    ],
    middleName: item.middleName ?? undefined,
    nickname: item.nickname ?? undefined,
    onboarded: typeof item.onboarded === 'boolean' ? item.onboarded : true,
    role: item.role && isUserRole(item.role) ? item.role : 'Guest',
    openScienceTeamMember: !!item.openScienceTeamMember,
    teams: userTeams,
    tags,
    _tags: tags.map((tag) => tag.name),
  };
};
const generateFetchQueryFilter = ({
  filter,
}: FetchUsersOptions): UsersFilter => {
  const {
    orcid,
    orcidLastSyncDate,
    code,
    onboarded = true,
    hidden = true,
  } = filter || {};

  const filterCode = code ? { connections_contains_all: [code] } : {};
  const filterHidden = hidden ? { role_not: 'Hidden' } : {};
  const filterNonOnboarded = onboarded ? { onboarded: true } : {};
  const filterOrcid = orcid ? { orcid_contains: orcid } : {};
  const filterOrcidLastSyncDate = orcidLastSyncDate
    ? { orcidLastSyncDate_lt: orcidLastSyncDate }
    : {};

  const queryFilter = {
    ...filterCode,
    ...filterNonOnboarded,
    ...filterHidden,
    ...filterOrcid,
    ...filterOrcidLastSyncDate,
  };

  return queryFilter;
};

const parseOrcidWorksContentful = (
  orcidWorksContentful: OrcidWorkContentful[],
): OrcidWork[] => {
  try {
    return orcidWorksContentful.map(parseOrcidWorkFromCMS);
  } catch (e) {
    throw new Error(`Invalid ORCID works content data: ${e}`);
  }
};

export const parseLabsCollection = (
  labsCollection: LabsCollection,
): LabResponse[] =>
  (labsCollection?.items || []).reduce(
    (userLabs: LabResponse[], lab): LabResponse[] => {
      if (!lab || !lab.name) {
        return userLabs;
      }

      return [
        ...userLabs,
        {
          id: lab.sys.id,
          name: lab.name,
        },
      ];
    },
    [],
  );

export const parseTeamsCollection = (
  teamsCollection: TeamsCollection,
): UserTeam[] =>
  (teamsCollection?.items || []).reduce(
    (userTeams: UserTeam[], team: TeamMembership | null): UserTeam[] => {
      if (!team) {
        return userTeams;
      }

      const { role: teamRole, inactiveSinceDate } = team;

      if (!teamRole || !isTeamRole(teamRole)) {
        return userTeams;
      }

      return [
        ...userTeams,
        {
          role: teamRole,
          inactiveSinceDate: inactiveSinceDate || undefined,
          displayName: team.team?.displayName || '',
          id: team.team?.sys.id || '',
          teamInactiveSince: team.team?.inactiveSince || '',
          proposal: team.team?.proposal ? team.team.proposal.sys.id : undefined,
        },
      ];
    },
    [],
  );

export const parseResearchOutputsCollection = (
  researchOutputsCollection: ResearchOutputsCollection,
  userId: string,
): string[] =>
  (researchOutputsCollection?.items || []).reduce(
    (
      userResearchOutputs: string[],
      researchOutput: ResearchOutputItem | null,
    ): string[] => {
      const isAuthor = researchOutput?.authorsCollection?.items.some(
        (author) => author?.__typename === 'Users' && author.sys.id === userId,
      );

      if (isAuthor && researchOutput?.sys.id) {
        return [...userResearchOutputs, researchOutput.sys.id];
      }

      return userResearchOutputs;
    },
    [],
  );

export const parseToWorkingGroupsForPublicUser = (
  users: (GroupMemberItemPublic | GroupLeaderItemPublic)[],
  isAlumni: boolean,
): PublicUserDataObject['workingGroups'] =>
  users.reduce(
    (
      workingGroups: PublicUserDataObject['workingGroups'],
      user: GroupMemberItemPublic | GroupLeaderItemPublic,
    ) => {
      const workingGroup = user.linkedFrom?.workingGroupsCollection?.items[0];

      if (!workingGroup) {
        return workingGroups;
      }

      const isUserInactiveInWorkingGroup = !!user.inactiveSinceDate;
      const isWorkingGroupComplete = workingGroup.complete;
      const isUserActiveInWorkingGroup =
        !isAlumni && !isUserInactiveInWorkingGroup;
      const isActive = !isWorkingGroupComplete && isUserActiveInWorkingGroup;

      if (isActive) {
        workingGroups.push({
          name: workingGroup.title || '',
          role:
            'role' in user
              ? (user.role as WorkingGroupMembership['role'])
              : 'Member',
        });
      }

      return workingGroups;
    },
    [],
  );

export const parseToWorkingGroups = (
  users: (GroupMemberItem | GroupLeaderItem)[],
  isAlumni: boolean,
): WorkingGroupMembership[] =>
  users.reduce(
    (workingGroups: WorkingGroupMembership[], user: GroupLeaderItem) => {
      const workingGroup = user.linkedFrom?.workingGroupsCollection?.items[0];
      const isInActive = !!user.inactiveSinceDate;

      if (!workingGroup) {
        return workingGroups;
      }

      workingGroups.push({
        id: workingGroup.sys.id,
        name: workingGroup.title || '',
        role: (user.role as WorkingGroupMembership['role']) || 'Member',
        active: workingGroup?.complete ? false : !isAlumni && !isInActive,
      });

      return workingGroups;
    },
    [],
  );

const parseToInterestGroups = (
  teams: TeamMembership[] | TeamMembershipPublic[],
): InterestGroupMembership[] =>
  teams.flatMap(({ team }) => {
    const items = cleanArray(
      team?.linkedFrom?.interestGroupsTeamsCollection?.items.flatMap(
        (item) => item?.linkedFrom?.interestGroupsCollection?.items,
      ),
    );
    return items.map((group) => ({
      id: group?.sys.id || '',
      name: group?.name || '',
      active: !!group?.active,
    }));
  });

const parseLeadersToInterestGroups = (
  leaders: InterestGroupLeaderItem[],
): InterestGroupMembership[] =>
  leaders.reduce(
    (
      interestGroups: InterestGroupMembership[],
      leader: InterestGroupLeaderItem,
    ) => {
      const group = leader.linkedFrom?.interestGroupsCollection?.items[0];

      interestGroups.push({
        id: group?.sys.id,
        active: group?.active,
        name: group?.name,
        role: leader.role,
      } as InterestGroupMembership);

      return interestGroups;
    },
    [],
  );

const removeDuplicates = (
  interestGroups: InterestGroupMembership[],
): InterestGroupMembership[] => {
  const duplicates = new Map();
  return interestGroups.reduce((groups: InterestGroupMembership[], group) => {
    if (!duplicates.has(group.id)) {
      duplicates.set(group.id, group);
      groups.push(group);
    }
    return groups;
  }, []);
};
