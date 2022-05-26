import { GenericError, NotFoundError } from '@asap-hub/errors';
import {
  ListUserResponse,
  UserPatchRequest,
  UserResponse,
} from '@asap-hub/model';
import {
  config,
  RestUser,
  SquidexGraphqlClient,
  SquidexRest,
  SquidexRestClient,
} from '@asap-hub/squidex';
import Boom from '@hapi/boom';
import Intercept from 'apr-intercept';
import FormData from 'form-data';
import { Got } from 'got';
import mime from 'mime-types';
import createUserProvider, { UserDataProvider } from '../data-providers/users';
import { parseUser, parseUserToResponse } from '../entities';
import { fetchOrcidProfile, transformOrcidWorks } from '../utils/fetch-orcid';
import { FetchOptions } from '../utils/types';

export type FetchUsersFilter = {
  role?: string[];
  labId?: string[];
  teamId?: string[];
};

export type FetchUsersOptions = FetchOptions<FetchUsersFilter>;

export interface UserController {
  fetch(options: FetchUsersOptions): Promise<ListUserResponse>;
  fetchById(id: string): Promise<UserResponse>;
  fetchByCode(code: string): Promise<UserResponse>;
  connectByCode(welcomeCode: string, userId: string): Promise<UserResponse>;
  update(id: string, update: UserPatchRequest): Promise<UserResponse>;
  updateAvatar(
    id: string,
    avatar: Buffer,
    contentType: string,
  ): Promise<UserResponse>;
  syncOrcidProfile(
    id: string,
    cachedUser: RestUser | undefined,
  ): Promise<UserResponse>;
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
  userDataProvider: UserDataProvider;
  userSquidexRestClient: SquidexRestClient<RestUser>;
  squidexGraphlClient: SquidexGraphqlClient;

  constructor(squidexGraphlClient: SquidexGraphqlClient) {
    this.squidexGraphlClient = squidexGraphlClient;
    this.userSquidexRestClient = new SquidexRest('users');
    this.userDataProvider = createUserProvider(squidexGraphlClient);
  }

  async update(id: string, update: UserPatchRequest): Promise<UserResponse> {
    await this.userDataProvider.update(id, update);
    return this.fetchById(id);
  }

  async fetch(options: FetchUsersOptions): Promise<ListUserResponse> {
    const users = await this.userDataProvider.fetch(options);

    const total = users.length;
    const items = total > 0 ? users.map(parseUserToResponse) : [];

    return { total, items };
  }

  async fetchById(id: string): Promise<UserResponse> {
    const user = await this.userDataProvider.fetchById(id);
    if (!user) {
      throw new NotFoundError(`user with id ${id} not found`);
    }

    return parseUserToResponse(user);
  }

  async fetchByCode(code: string): Promise<UserResponse> {
    const users = await this.userDataProvider.fetchByCode(code);
    if (users.length === 0) {
      throw new NotFoundError(`user with code ${code} not found`);
    }

    if (users.length !== 1 || !users[0]) {
      throw new GenericError('too many users found');
    }

    return parseUserToResponse(users[0]);
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

    const { id: assetId } = await this.userSquidexRestClient.client
      .post('assets', {
        prefixUrl: `${config.baseUrl}/api/apps/${config.appName}`,
        headers: form.getHeaders(),
        body: form,
      })
      .json();

    await this.userSquidexRestClient.patch(id, { avatar: { iv: [assetId] } });

    // use fetch for proper user teams hydration
    return this.fetchById(id);
  }

  async connectByCode(
    welcomeCode: string,
    userId: string,
  ): Promise<UserResponse> {
    const user = await fetchByCode(
      welcomeCode,
      this.userSquidexRestClient.client,
    );
    if (user.data.connections.iv?.find(({ code }) => code === userId)) {
      return Promise.resolve(parseUser(user));
    }

    const connections = (user.data.connections.iv || []).concat([
      { code: userId },
    ]);

    const res = await this.userSquidexRestClient.patch(user.id, {
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
      fetchedUser = await this.userSquidexRestClient.fetchById(id);
    }

    const user = cachedUser || (fetchedUser as RestUser);

    const [error, res] = await Intercept(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      fetchOrcidProfile(user!.data.orcid!.iv),
    );

    const update: Partial<RestUser['data']> = {
      email: { iv: user.data.email.iv },
      orcidLastSyncDate: { iv: new Date().toISOString() },
    };

    if (!error) {
      const { lastModifiedDate, works } = transformOrcidWorks(res);
      update.orcidLastModifiedDate = { iv: lastModifiedDate };
      update.orcidWorks = { iv: works.slice(0, 10) };
    }

    const updatedUser = await this.userSquidexRestClient.patch(user.id, update);
    return parseUser(updatedUser);
  }
}
