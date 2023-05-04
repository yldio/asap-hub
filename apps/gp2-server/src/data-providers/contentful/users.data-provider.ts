import {
  FetchUsersOptions,
  gp2 as gp2Model,
  UserSocialLinks,
} from '@asap-hub/model';

import {
  Environment,
  FetchUserByIdQuery,
  FetchUserByIdQueryVariables,
  FetchUsersQuery,
  FetchUsersQueryVariables,
  FETCH_USERS,
  FETCH_USER_BY_ID,
  gp2 as gp2Contentful,
  GraphQLClient,
  Maybe,
  patchAndPublish,
  UsersFilter,
  UsersOrder,
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
      FetchUserByIdQuery,
      FetchUserByIdQueryVariables
    >(FETCH_USER_BY_ID, { id });
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
      items: [],
      // result?.items
      // .filter((x): x is UserItem => x !== null)
      // .map(parseContentfulGraphQlUsers),
    };
  }

  private async fetchUsers(options: gp2Model.FetchUsersOptions) {
    const { take = 8, skip = 0 } = options;

    const where = generateFetchQueryFilter(options);

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

  async update(id: string, data: gp2Model.UserUpdateDataObject): Promise<void> {
    const fields = cleanUser(data);
    const environment = await this.getRestClient();
    const user = await environment.getEntry(id);
    const result = await patchAndPublish(user, fields);

    const fetchEventById = () => this.fetchUserById(id);

    await waitForUpdated<FetchUserByIdQuery>(
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
  return {
    id: user.sys.id,
    createdDate: user.sys.firstPublishedAt,
    workingGroups: [],
    onboarded: !!user.onboarded,
    email: user.email ?? '',
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

    social: {
      linkedIn: user.linkedIn ?? undefined,
      orcid: user.orcid ?? undefined,
      researcherId: user.researcherId ?? undefined,
      twitter: user.twitter ?? undefined,
      github: user.github ?? undefined,
      googleScholar: user.googleScholar ?? undefined,
      researchGate: user.researchGate ?? undefined,
    },
    positions: [],
    projects: [],
    contributingCohorts: [],
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
