import { GenericError, NotFoundError } from '@asap-hub/errors';
import {
  ListUserResponse,
  UserPatchRequest,
  UserResponse,
} from '@asap-hub/model';
import {
  RestUser,
  SquidexGraphqlClient,
  SquidexRest,
  SquidexRestClient,
} from '@asap-hub/squidex';
import Intercept from 'apr-intercept';
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

export default class Users implements UserController {
  userDataProvider: UserDataProvider;
  userSquidexRestClient: SquidexRestClient<RestUser>;

  constructor(squidexGraphlClient: SquidexGraphqlClient) {
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
    await this.userDataProvider.updateAvatar(id, avatar, contentType);
    return this.fetchById(id);
  }

  async connectByCode(
    welcomeCode: string,
    userId: string,
  ): Promise<UserResponse> {
    const user = await this.userDataProvider.connectByCode(welcomeCode, userId);

    if (!user) {
      throw new NotFoundError(`user with code ${welcomeCode} not found`);
    }

    return parseUserToResponse(user);
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
