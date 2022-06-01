import { GenericError, NotFoundError } from '@asap-hub/errors';
import {
  ListUserResponse,
  UserPatchRequest,
  UserResponse,
} from '@asap-hub/model';
import { RestUser } from '@asap-hub/squidex';
import { AssetDataProvider } from '../data-providers/assets';
import { UserDataProvider } from '../data-providers/users';
import { parseUserToResponse } from '../entities';
import { FetchOptions } from '../utils/types';

export type FetchUsersFilter = {
  role?: string[];
  labId?: string[];
  teamId?: string[];
  code?: string;
  hidden?: boolean;
  onboarded?: boolean;
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
  assetDataProvider: AssetDataProvider;

  constructor(
    userDataProvider: UserDataProvider,
    assetDateProvider: AssetDataProvider,
  ) {
    this.userDataProvider = userDataProvider;
    this.assetDataProvider = assetDateProvider;
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
    const { items: users } = await this.userDataProvider.fetch({
      filter: { code, hidden: false, onboarded: false },
      take: 1,
      skip: 0,
    });
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
    const assetId = await this.assetDataProvider.create(
      id,
      avatar,
      contentType,
    );
    await this.userDataProvider.update(id, { avatar: assetId });
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
