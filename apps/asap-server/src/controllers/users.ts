import Boom from '@hapi/boom';
import Intercept from 'apr-intercept';
import { Got } from 'got';
import { Squidex, SquidexGraphql, GraphqlUser } from '@asap-hub/squidex';
import {
  UserResponse,
  ListUserResponse,
  UserPatchRequest,
} from '@asap-hub/model';

import { CMSUser, parseUser, parseGraphQLUser } from '../entities';
import { fetchOrcidProfile, transformOrcidWorks } from '../utils/fetch-orcid';

const GraphQLQueryUser = `
id
created
flatData {
  avatar {
    id
  }
  biography
  degree
  department
  email
  firstName
  institution
  jobTitle
  lastModifiedDate
  lastName
  location
  orcid
  orcidLastModifiedDate
  orcidLastSyncDate
  orcidWorks {
    doi
    id
    lastModifiedDate
    publicationDate
    title
    type
  }
  questions {
    question
  }
  skills
  skillsDescription
  teams {
    role
    approach
    responsibilities
    id {
      id
      flatData {
        displayName
        proposal {
          id
        }
      }
    }
  }
  role
  responsibilities
  reachOut
}`;

export const buildGraphQLQueryFetchUsers = (
  filter = '',
  top = 8,
  skip = 0,
): string =>
  `{
  queryUsersContentsWithTotal(top: ${top}, skip: ${skip}, filter: "${filter}", orderby: "data/firstName/iv,data/lastName/iv") {
    total
    items {
      ${GraphQLQueryUser}
    }
  }
}`;

export const buildGraphQLQueryFetchUser = (id: string): string =>
  `{
  findUsersContent(id: "${id}") {
    ${GraphQLQueryUser}
  }
}`;

export interface ResponseFetchUsers {
  queryUsersContentsWithTotal: {
    total: number;
    items: GraphqlUser[];
  };
}

export interface ResponseFetchUser {
  findUsersContent: GraphqlUser;
}

const fetchByCode = async (code: string, client: Got): Promise<CMSUser> => {
  const [err, res] = await Intercept(
    client
      .get('users', {
        searchParams: {
          $top: 1,
          $filter: `data/connections/iv/code eq '${code}'`,
        },
      })
      .json() as Promise<{ items: CMSUser[] }>,
  );

  if (err) {
    throw Boom.forbidden();
  }

  if (res.items.length === 0) {
    throw Boom.forbidden();
  }

  return res.items[0];
};

export default class Users {
  users: Squidex<CMSUser>;

  client: SquidexGraphql;

  constructor() {
    this.client = new SquidexGraphql();
    this.users = new Squidex('users');
  }

  async update(id: string, update: UserPatchRequest): Promise<UserResponse> {
    let deletesAtributes = false;

    const cleanUpdate = Object.entries(update).reduce((acc, [key, value]) => {
      if (value.trim && value.trim() === '') {
        deletesAtributes = true;
        acc[key] = { iv: null }; // deletes attribute on PUT requests
        return acc;
      }

      acc[key] = { iv: value };
      return acc;
    }, {} as { [key: string]: { iv: unknown } });

    if (!deletesAtributes) {
      const user = await this.users.patch(id, cleanUpdate);
      return parseUser(user);
    }

    const fullUser = await this.users.fetchById(id);
    const updatedData = { ...fullUser.data, ...cleanUpdate };
    const updatedUser = await this.users.put(id, updatedData);
    return parseUser(updatedUser);
  }

  async fetch(options: {
    take: number;
    skip: number;
    search?: string;
    filter?: string[];
  }): Promise<ListUserResponse> {
    const { take, skip, search, filter } = options;

    const searchQ = [
      "data/role/iv ne 'Hidden'",
      ...(search || '')
        .split(' ')
        .filter(Boolean) // removes whitespaces
        .reduce(
          (acc: string[], word: string) =>
            acc.concat(
              `(${[
                [`contains(data/firstName/iv, '${word}')`],
                [`contains(data/lastName/iv, '${word}')`],
                [`contains(data/institution/iv, '${word}')`],
                [`contains(data/skills/iv, '${word}')`],
              ].join(' or ')})`,
            ),
          [],
        ),
    ].join(' and ');

    const filterQ = (filter || [])
      .reduce(
        (acc: string[], word: string) =>
          acc.concat([`data/teams/iv/role eq '${word}'`]),
        [],
      )
      .join(' or ');

    const $filter = filterQ ? `${filterQ} and (${searchQ})`.trim() : searchQ;

    const query = buildGraphQLQueryFetchUsers($filter, take, skip);

    const { queryUsersContentsWithTotal } = await this.client.request<
      ResponseFetchUsers,
      unknown
    >(query);
    const { total, items } = queryUsersContentsWithTotal;

    return {
      total,
      items: items.map(parseGraphQLUser),
    };
  }

  async fetchById(id: string): Promise<UserResponse> {
    const query = buildGraphQLQueryFetchUser(id);
    const { findUsersContent } = await this.client.request<
      ResponseFetchUser,
      unknown
    >(query);
    if (!findUsersContent) {
      throw Boom.notFound();
    }
    return parseGraphQLUser(findUsersContent);
  }

  async fetchByCode(code: string): Promise<UserResponse> {
    const query = buildGraphQLQueryFetchUsers(
      `data/connections/iv/code eq '${code}'`,
      1,
      0,
    );
    const { queryUsersContentsWithTotal } = await this.client.request<
      ResponseFetchUsers,
      unknown
    >(query);

    const { total, items } = queryUsersContentsWithTotal;
    if (total !== 1) {
      throw Boom.forbidden();
    }

    return parseGraphQLUser(items[0]);
  }

  async connectByCode(
    welcomeCode: string,
    userId: string,
  ): Promise<UserResponse> {
    const user = await fetchByCode(welcomeCode, this.users.client);

    if (user.data.connections.iv.find(({ code }) => code === userId)) {
      return Promise.resolve(parseUser(user));
    }

    const connections = user.data.connections.iv.concat([{ code: userId }]);

    const res = await this.users.patch(user.id, {
      email: { iv: user.data.email.iv },
      connections: { iv: connections },
    });

    return parseUser(res);
  }

  async syncOrcidProfile(
    id: string,
    cachedUser: CMSUser | undefined = undefined,
  ): Promise<UserResponse> {
    let fetchedUser;
    if (!cachedUser) {
      fetchedUser = await this.users.fetchById(id);
    }

    const user = cachedUser || (fetchedUser as CMSUser);

    const [error, res] = await Intercept(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      fetchOrcidProfile(user!.data.orcid!.iv),
    );

    if (error) {
      throw Boom.badGateway();
    }

    const { lastModifiedDate, works } = transformOrcidWorks(res);

    if (
      !user.data.orcidLastModifiedDate?.iv ||
      user.data.orcidLastModifiedDate.iv < lastModifiedDate
    ) {
      const updatedUser = await this.users.patch(user.id, {
        email: { iv: user.data.email.iv },
        orcidLastSyncDate: { iv: `${new Date().toISOString()}` },
        orcidLastModifiedDate: { iv: lastModifiedDate },
        orcidWorks: { iv: works.slice(0, 10) },
      });
      return parseUser(updatedUser);
    }

    return parseUser(user);
  }
}
