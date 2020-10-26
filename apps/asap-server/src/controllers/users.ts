import Boom from '@hapi/boom';
import Debug from 'debug';
import path from 'path';
import url from 'url';
import Intercept from 'apr-intercept';
import { Got } from 'got';
import { v4 as uuidV4 } from 'uuid';
import { Squidex, GraphQL } from '@asap-hub/services-common';
import { Invitee, UserResponse, ListUserResponse } from '@asap-hub/model';

import {
  CMSUser,
  CMSGraphQLUser,
  parseUser,
  parseGraphQLUser,
} from '../entities';
import { sendEmail } from '../utils/send-mail';
import { origin } from '../config';
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
  displayName
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
}`;

export const buildGraphQLQueryFetchUsers = (
  top: number = 8,
  skip: number = 0,
  filter: string = '',
) =>
  `{
  queryUsersContentsWithTotal(top: ${top}, skip: ${skip}, filter: ${filter}, orderby: "data/displayName/iv") {
    total
    items {
      ${GraphQLQueryUser}
    }
  }
}`;

export const buildGraphQLQueryFetchUser = (id: string) =>
  `{
  findUsersContent(id: ${id}) {
    ${GraphQLQueryUser}
  }
}`;

interface Response {
  queryUsersContentsWithTotal: {
    total: number;
    items: CMSGraphQLUser[];
  };
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

const debug = Debug('users.create');
export default class Users {
  users: Squidex<CMSUser>;
  client: GraphQL;

  constructor() {
    this.client = new GraphQL();
    this.users = new Squidex('users');
  }

  async create(user: Invitee): Promise<UserResponse> {
    const code = uuidV4();

    // remove undefined(s)
    const userData: CMSUser['data'] = JSON.parse(
      JSON.stringify({
        lastModifiedDate: { iv: `${new Date().toISOString()}` },
        displayName: { iv: user.displayName },
        email: { iv: user.email },
        firstName: { iv: user.firstName },
        lastName: { iv: user.lastName },
        jobTitle: { iv: user.jobTitle },
        orcid: { iv: user.orcid },
        institution: { iv: user.institution },
        location: { iv: user.location },
        avatarUrl: { iv: user.avatarUrl },
        connections: { iv: [{ code }] },
      }),
    );

    const createdUser = await this.users.create(userData);

    const link = new url.URL(path.join(`/welcome/${code}`), origin);

    const [err] = await Intercept(
      sendEmail({
        to: [user.email],
        template: 'Welcome',
        values: {
          firstName: user.displayName,
          link: link.toString(),
        },
      }),
    );

    // istanbul ignore if
    if (err) {
      debug(err);
    }

    return parseUser(createdUser);
  }

  async fetch(options: {
    take: number;
    skip: number;
    search?: string;
    filter?: string[];
  }): Promise<ListUserResponse> {
    const { take, skip, search, filter } = options;

    const searchQ = (search || '')
      .split(' ')
      .filter(Boolean) // removes whitespaces
      .reduce(
        (acc: string[], word: string) =>
          acc.concat(
            `(${[
              [`contains(data/displayName/iv, '${word}')`],
              [`contains(data/firstName/iv, '${word}')`],
            ].join(' or ')})`,
          ),
        [],
      )
      .join(' and ');

    const filterQ = (filter || [])
      .reduce(
        (acc: string[], word: string) =>
          acc.concat([`data/teams/iv/role eq '${word}'`]),
        [],
      )
      .join(' or ');

    const and = filter && search ? ['and (', ')'] : ['', ''];

    const $filter =
      search || filter ? `${filterQ} ${and[0] + searchQ + and[1]}`.trim() : '';

    const query = buildGraphQLQueryFetchUsers(take, skip, $filter);

    const { queryUsersContentsWithTotal } = await this.client.request<
      Response,
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
    return parseGraphQLUser(await this.client.request(query));
  }

  async fetchByCode(code: string): Promise<UserResponse> {
    const user = await fetchByCode(code, this.users.client);
    return parseUser(user);
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
