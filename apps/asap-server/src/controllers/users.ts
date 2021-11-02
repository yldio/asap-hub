import {
  ListUserResponse,
  UserPatchRequest,
  UserResponse,
} from '@asap-hub/model';
import { config, GraphqlUser, RestUser } from '@asap-hub/squidex';
import Boom from '@hapi/boom';
import Intercept from 'apr-intercept';
import FormData from 'form-data';
import { Got } from 'got';
import mime from 'mime-types';
import { parseGraphQLUser, parseUser } from '../entities';
import {
  FetchUserQuery,
  FetchUserQueryVariables,
  FetchUsersQuery,
  FetchUsersQueryVariables,
} from '../gql/graphql';
import { FETCH_USER, FETCH_USERS } from '../queries/users.queries';
import { fetchOrcidProfile, transformOrcidWorks } from '../utils/fetch-orcid';
import {
  InstrumentedSquidex,
  InstrumentedSquidexGraphql,
} from '../utils/instrumented-client';
import { sanitiseForSquidex } from '../utils/squidex';
import { FetchOptions } from '../utils/types';

export interface ResponseFetchUsers {
  queryUsersContentsWithTotal: {
    total: number;
    items: GraphqlUser[];
  };
}

export interface ResponseFetchUser {
  findUsersContent: GraphqlUser;
}

export interface UserController {
  fetch: (options: FetchOptions) => Promise<ListUserResponse>;
  fetchById: (id: string) => Promise<UserResponse>;
  fetchByCode: (code: string) => Promise<UserResponse>;
  connectByCode: (welcomeCode: string, userId: string) => Promise<UserResponse>;
  update: (id: string, update: UserPatchRequest) => Promise<UserResponse>;
  updateAvatar: (
    id: string,
    avatar: Buffer,
    contentType: string,
  ) => Promise<UserResponse>;
  syncOrcidProfile: (
    id: string,
    cachedUser: RestUser | undefined,
  ) => Promise<UserResponse>;
}

const fetchByCode = async (code: string, client: Got): Promise<RestUser> => {
  const [err, res] = await Intercept(
    client
      .get('users', {
        searchParams: {
          $top: 1,
          $filter: `data/connections/iv/code eq '${code}'`,
        },
      })
      .json() as Promise<{ items: RestUser[] }>,
  );

  if (err) {
    throw Boom.forbidden();
  }

  if (res.items.length === 0 || !res.items[0]) {
    throw Boom.forbidden();
  }

  return res.items[0];
};

export default class Users implements UserController {
  users: InstrumentedSquidex<RestUser>;

  client: InstrumentedSquidexGraphql;

  constructor(ctxHeaders?: Record<string, string>) {
    this.client = new InstrumentedSquidexGraphql(ctxHeaders);
    this.users = new InstrumentedSquidex('users', ctxHeaders);
  }

  async update(id: string, update: UserPatchRequest): Promise<UserResponse> {
    let isFullUpdate = false;

    if (update.teams?.length) {
      isFullUpdate = true;
    }

    const cleanUpdate = Object.entries(update).reduce((acc, [key, value]) => {
      if (value.trim && value.trim() === '') {
        isFullUpdate = true;
        acc[key] = { iv: null }; // deletes attribute on PUT requests
        return acc;
      }

      // map flat questions to squidex format
      if (key === 'questions' && value.length) {
        acc[key] = { iv: value.map((question: string) => ({ question })) };
        return acc;
      }

      // we get an object but squidex expects an array of objects
      if (key === 'social') {
        acc[key] = { iv: [value] };
        return acc;
      }

      acc[key] = { iv: value };
      return acc;
    }, {} as { [key: string]: { iv: unknown } });

    if (!isFullUpdate) {
      await this.users.patch(id, cleanUpdate);
      return this.fetchById(id);
    }

    const user = await this.users.fetchById(id);

    // update only contains the team the user is trying to change
    // we need to merge it with the ones on the DB, replacing the updated props
    // and deleting them if update is an empty string.
    /* eslint-disable @typescript-eslint/no-non-null-assertion, no-param-reassign */
    if (update.teams?.length) {
      cleanUpdate.teams = {
        iv: user.data.teams?.iv?.map(
          (team: {
            id: string[];
            responsibilities?: string | null;
            approach?: string | null;
          }) => {
            const teamUpdates = update.teams!.find(
              ({ id: teamId }) => team.id[0] === teamId,
            );
            if (teamUpdates?.approach?.trim) {
              team.approach =
                teamUpdates.approach.trim() === ''
                  ? null
                  : teamUpdates.approach;
            }
            if (teamUpdates?.responsibilities?.trim) {
              team.responsibilities =
                teamUpdates.responsibilities.trim() === ''
                  ? null
                  : teamUpdates.responsibilities;
            }
            return team;
          },
        ),
      };
    }
    /* eslint-enable @typescript-eslint/no-non-null-assertion, no-param-reassign */

    const updatedData = { ...user.data, ...cleanUpdate };
    await this.users.put(id, updatedData);

    // use fetch for proper user teams hydration
    return this.fetchById(id);
  }

  async fetch(options: FetchOptions): Promise<ListUserResponse> {
    const { take = 8, skip = 0, search, filter } = options;

    const searchFilter = [
      ...(search || '')
        .split(' ')
        .filter(Boolean) // removes whitespaces
        .map(sanitiseForSquidex)
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

    const filterRoles = (filter || [])
      .filter((word) => word !== 'Staff')
      .reduce(
        (acc: string[], word: string) =>
          acc.concat([`data/teams/iv/role eq '${word}'`]),
        [],
      )
      .concat(filter?.includes('Staff') ? `data/role/iv eq 'Staff'` : [])
      .join(' or ');

    const filterHidden = "data/role/iv ne 'Hidden'";
    const filterNonOnboarded = 'data/onboarded/iv eq true';

    const queryFilter = [
      filterRoles && `(${filterRoles})`,
      filterNonOnboarded,
      filterHidden,
      searchFilter && `(${searchFilter})`,
    ]
      .filter(Boolean)
      .join(' and ')
      .trim();

    const { queryUsersContentsWithTotal } = await this.client.request<
      FetchUsersQuery,
      FetchUsersQueryVariables
    >(FETCH_USERS, { filter: queryFilter, top: take, skip });

    if (queryUsersContentsWithTotal === null) {
      return {
        total: 0,
        items: [],
      };
    }

    const { total, items } = queryUsersContentsWithTotal;

    if (items === null) {
      return {
        total: 0,
        items: [],
      };
    }

    return {
      total,
      items: items.map(parseGraphQLUser),
    };
  }

  async fetchById(id: string): Promise<UserResponse> {
    const { findUsersContent } = await this.client.request<
      FetchUserQuery,
      FetchUserQueryVariables
    >(FETCH_USER, { id });
    if (!findUsersContent) {
      throw Boom.notFound();
    }

    return parseGraphQLUser(findUsersContent);
  }

  async fetchByCode(code: string): Promise<UserResponse> {
    const { queryUsersContentsWithTotal } = await this.client.request<
      FetchUsersQuery,
      FetchUsersQueryVariables
    >(FETCH_USERS, {
      filter: `data/connections/iv/code eq '${code}'`,
      top: 1,
      skip: 0,
    });

    if (queryUsersContentsWithTotal === null) {
      throw Boom.forbidden();
    }

    const { total, items } = queryUsersContentsWithTotal;
    if (total !== 1 || !items?.[0]) {
      throw Boom.forbidden();
    }

    return parseGraphQLUser(items[0]);
  }

  async updateAvatar(
    id: string,
    avatar: Buffer,
    contentType: string,
  ): Promise<UserResponse> {
    const form = new FormData();
    form.append('file', avatar, {
      filename: `${id}.${mime.extension(contentType)}`,
      contentType,
    });

    const { id: assetId } = await this.users.client
      .post('assets', {
        prefixUrl: `${config.baseUrl}/api/apps/${config.appName}`,
        headers: form.getHeaders(),
        body: form,
      })
      .json();

    await this.users.patch(id, { avatar: { iv: [assetId] } });

    // use fetch for proper user teams hydration
    return this.fetchById(id);
  }

  async connectByCode(
    welcomeCode: string,
    userId: string,
  ): Promise<UserResponse> {
    const user = await fetchByCode(welcomeCode, this.users.client);
    if (user.data.connections.iv?.find(({ code }) => code === userId)) {
      return Promise.resolve(parseUser(user));
    }

    const connections = (user.data.connections.iv || []).concat([
      { code: userId },
    ]);

    const res = await this.users.patch(user.id, {
      email: { iv: user.data.email.iv },
      connections: { iv: connections },
    });

    return parseUser(res);
  }

  async syncOrcidProfile(
    id: string,
    cachedUser: RestUser | undefined = undefined,
  ): Promise<UserResponse> {
    let fetchedUser;
    if (!cachedUser) {
      fetchedUser = await this.users.fetchById(id);
    }

    const user = cachedUser || (fetchedUser as RestUser);

    const [error, res] = await Intercept(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      fetchOrcidProfile(user!.data.orcid!.iv),
    );

    // const err = error as RequestError;
    // if (err && err?.response?.statusCode !== 404) {
    // //eslint-disable-next-line no-console
    // console.log('Error fetching user from ORCID:', err);
    // }

    const update: Partial<RestUser['data']> = {
      email: { iv: user.data.email.iv },
      orcidLastSyncDate: { iv: new Date().toISOString() },
    };

    if (!error) {
      const { lastModifiedDate, works } = transformOrcidWorks(res);
      update.orcidLastModifiedDate = { iv: lastModifiedDate };
      update.orcidWorks = { iv: works.slice(0, 10) };
    }

    const updatedUser = await this.users.patch(user.id, update);
    return parseUser(updatedUser);
  }
}
