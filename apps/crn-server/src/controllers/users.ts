import { GenericError, NotFoundError } from '@asap-hub/errors';
import {
  ListUserResponse,
  UserPatchRequest,
  UserResponse,
} from '@asap-hub/model';
import { RestUser } from '@asap-hub/squidex';
import { UserDataProvider } from '../data-providers/users';
import { parseUserToResponse } from '../entities';
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

  constructor(userDataProvider: UserDataProvider) {
    this.userDataProvider = userDataProvider;
  }

  async update(id: string, update: UserPatchRequest): Promise<UserResponse> {
    await this.userDataProvider.update(id, update);
    return this.fetchById(id);
  }

  async fetch(options: FetchUsersOptions): Promise<ListUserResponse> {
    const { total, items: users } = await this.userDataProvider.fetch(options);

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
    const { items: users } = await this.userDataProvider.fetchByCode(code);
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
    const user = await this.userDataProvider.syncOrcidProfile(id, cachedUser);
    return parseUserToResponse(user);
  }
}
