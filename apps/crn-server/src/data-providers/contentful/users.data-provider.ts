import {
  activeUserTag,
  FetchUsersOptions,
  inactiveUserTag,
  isUserDegree,
  isUserRole,
  LabResponse,
  ListUserDataObject,
  OrcidWork,
  UserDataObject,
  UserSocialLinks,
  UserTeam,
  UserUpdateDataObject,
} from '@asap-hub/model';

import {
  Environment,
  FetchUserByIdQuery,
  FetchUserByIdQueryVariables,
  FetchUsersByLabIdQuery,
  FetchUsersByLabIdQueryVariables,
  FetchUsersByTeamIdQuery,
  FetchUsersByTeamIdQueryVariables,
  FetchUsersQuery,
  FetchUsersQueryVariables,
  FETCH_USERS,
  FETCH_USERS_BY_LAB_ID,
  FETCH_USERS_BY_TEAM_ID,
  FETCH_USER_BY_ID,
  GraphQLClient,
  Maybe,
  patchAndPublish,
  pollContentfulGql,
  UsersFilter,
  UsersOrder,
} from '@asap-hub/contentful';
import { isTeamRole } from '../../entities';
import { UserDataProvider } from '../types';
import { parseOrcidWorkFromCMS } from '../../entities/users';

export type UserItem = NonNullable<
  NonNullable<FetchUsersQuery['usersCollection']>['items'][number]
>;
export type TeamMembership = NonNullable<
  NonNullable<UserItem['teamsCollection']>['items'][number]
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

  private fetchUserById(id: string) {
    return this.contentfulClient.request<
      FetchUserByIdQuery,
      FetchUserByIdQueryVariables
    >(FETCH_USER_BY_ID, { id });
  }

  async fetchById(id: string): Promise<UserDataObject | null> {
    const { users } = await this.fetchUserById(id);

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
        .filter((x): x is UserItem => x !== null)
        .map(parseContentfulGraphQlUsers),
    };
  }

  private async fetchUsers(options: FetchUsersOptions) {
    const { take = 8, skip = 0 } = options;

    const where = generateFetchQueryFilter(options);

    if (options.filter?.labId) {
      const { labs } = await this.contentfulClient.request<
        FetchUsersByLabIdQuery,
        FetchUsersByLabIdQueryVariables
      >(FETCH_USERS_BY_LAB_ID, {
        limit: take,
        skip,
        id: options.filter.labId,
      });
      return labs?.linkedFrom?.usersCollection || { total: 0, items: [] };
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
        teamMembershipCollection?.items?.map(
          (item) => item?.linkedFrom?.usersCollection?.items[0],
        ) || [];
      return {
        total: teamMembershipCollection?.total || 0,
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

  async create(): Promise<string> {
    throw new Error('Method not implemented.');
  }

  async update(id: string, data: UserUpdateDataObject): Promise<void> {
    const fields = cleanUser(data);
    const environment = await this.getRestClient();
    const user = await environment.getEntry(id);
    const result = await patchAndPublish(user, fields);

    const fetchEventById = () => this.fetchUserById(id);

    await pollContentfulGql<FetchUserByIdQuery>(
      result.sys.publishedVersion || Infinity,
      fetchEventById,
      'users',
    );
  }
}

const cleanUser = (userToUpdate: UserUpdateDataObject) =>
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
    return { ...acc, [key]: value };
  }, {} as { [key: string]: unknown });

export const parseContentfulGraphQlUsers = (item: UserItem): UserDataObject => {
  const normaliseArray = (
    input: Maybe<Maybe<string>[]> | undefined,
  ): string[] =>
    (input || []).reduce(
      (arr: string[], str: Maybe<string>) => (str ? [...arr, str] : arr),
      [],
    );

  const expertiseAndResourceTags = normaliseArray(
    item.expertiseAndResourceTags,
  );
  const questions = normaliseArray(item.questions);
  const connections = normaliseArray(item.connections);

  const role = item.role && isUserRole(item.role) ? item.role : 'Guest';
  const degree =
    item.degree && isUserDegree(item.degree) ? item.degree : undefined;

  const teams: UserTeam[] = (item.teamsCollection?.items || []).reduce(
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
        },
      ];
    },
    [],
  );
  const labs: LabResponse[] = (item.labsCollection?.items || []).reduce(
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

  const orcidWorks: OrcidWork[] = parseOrcidWorksContentful(
    item.orcidWorks || [],
  );

  return {
    id: item.sys.id,
    _tags: [item.alumniSinceDate ? inactiveUserTag : activeUserTag],
    createdDate: item.createdDate || item.sys.firstPublishedAt,
    lastModifiedDate: item.sys.publishedAt,
    workingGroups: [],
    interestGroups: [],
    onboarded: !!item.onboarded,
    email: item.email ?? '',
    contactEmail: item.contactEmail ?? undefined,
    firstName: item.firstName ?? '',
    lastName: item.lastName ?? '',
    biography: item.biography ?? undefined,
    jobTitle: item.jobTitle ?? undefined,
    city: item.city ?? undefined,
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
    responsibilities: item.responsibilities ?? undefined,
    expertiseAndResourceDescription:
      item.expertiseAndResourceDescription ?? undefined,
    dismissedGettingStarted: item.dismissedGettingStarted ?? false,
    expertiseAndResourceTags,
    avatarUrl: item.avatar?.url ?? undefined,
    questions,
    role,
    degree,
    connections: connections.map((connection) => ({ code: connection })),
    teams,
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
const generateFetchQueryFilter = ({
  filter,
}: FetchUsersOptions): UsersFilter => {
  const { orcid, code, onboarded = true, hidden = true } = filter || {};

  const filterCode = code ? { connections_contains_all: [code] } : {};
  const filterHidden = hidden ? { role_not: 'Hidden' } : {};
  const filterNonOnboarded = onboarded ? { onboarded: true } : {};
  const filterOrcid = orcid ? { orcid_contains: orcid } : {};

  const queryFilter = {
    ...filterCode,
    ...filterNonOnboarded,
    ...filterHidden,
    ...filterOrcid,
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
