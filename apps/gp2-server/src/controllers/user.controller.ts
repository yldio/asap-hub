import { GenericError, NotFoundError } from '@asap-hub/errors';
import { UserResponse, UserUpdateRequest } from '@asap-hub/model';
import { UserController as BaseController } from '@asap-hub/server-common';
import {
  parseUserToResponse,
  UserDataProvider,
} from '../data-providers/users.data-provider';

export type FetchUsersFilter = {
  role?: string[];
  labId?: string[];
  teamId?: string[];
  code?: string;
  hidden?: boolean;
  onboarded?: boolean;
  orcid?: string;
};

export type FetchOptions<TFilter = string[]> = {
  search?: string;
  filter?: TFilter;
  take?: number;
  skip?: number;
};

export type FetchUsersOptions = FetchOptions<FetchUsersFilter>;

export interface UserController extends BaseController {
  fetchByCode(code: string): Promise<UserResponse>;
  update(id: string, update: UserUpdateRequest): Promise<UserResponse>;
  fetchById(id: string): Promise<UserResponse>;
}

export default class Users implements UserController {
  userDataProvider: UserDataProvider;

  constructor(userDataProvider: UserDataProvider) {
    this.userDataProvider = userDataProvider;
  }

  async update(id: string, update: UserUpdateRequest): Promise<UserResponse> {
    await this.userDataProvider.update(id, update);
    return this.fetchById(id);
  }

  async fetchById(id: string): Promise<UserResponse> {
    const user = await this.userDataProvider.fetchById(id);
    if (!user) {
      throw new NotFoundError(undefined, `user with id ${id} not found`);
    }

    return parseUserToResponse(user);
  }

  async fetchByCode(code: string): Promise<UserResponse> {
    const { items: users } = await this.queryByCode(code);
    if (users.length === 0) {
      throw new NotFoundError(undefined, `user with code ${code} not found`);
    }

    if (users.length !== 1 || !users[0]) {
      throw new GenericError(undefined, 'too many users found');
    }

    return parseUserToResponse(users[0]);
  }

  async connectByCode(
    welcomeCode: string,
    userId: string,
  ): Promise<UserResponse> {
    const { items } = await this.queryByCode(welcomeCode);

    if (!items || items.length > 1 || !items[0]) {
      throw new NotFoundError(
        undefined,
        `user with code ${welcomeCode} not found`,
      );
    }

    const user = items[0];
    if (user.connections?.find(({ code }) => code === userId)) {
      return parseUserToResponse(user);
    }
    return this.update(user.id, {
      email: user.email,
      connections: [...(user.connections || []), { code: userId }],
    });
  }

  private async queryByCode(code: string) {
    return this.userDataProvider.fetch({
      filter: { code, hidden: false, onboarded: false },
      take: 1,
      skip: 0,
    });
  }
}
