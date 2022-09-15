import { GenericError, NotFoundError } from '@asap-hub/errors';
import { gp2 } from '@asap-hub/model';
import { UserDataProvider } from '../data-providers/user.data-provider';

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

export interface UserController {
  fetch(options: FetchUsersOptions): Promise<gp2.ListUserResponse>;
  fetchByCode(code: string): Promise<gp2.UserResponse>;
  fetchById(id: string): Promise<gp2.UserResponse>;
  update(id: string, update: gp2.UserUpdateRequest): Promise<gp2.UserResponse>;
  connectByCode(welcomeCode: string, userId: string): Promise<gp2.UserResponse>;
}

export default class Users implements UserController {
  userDataProvider: UserDataProvider;

  constructor(userDataProvider: UserDataProvider) {
    this.userDataProvider = userDataProvider;
  }

  async update(
    id: string,
    update: gp2.UserUpdateRequest,
  ): Promise<gp2.UserResponse> {
    await this.userDataProvider.update(id, update);
    return this.fetchById(id);
  }

  async fetch(options: FetchUsersOptions): Promise<gp2.ListUserResponse> {
    const { total, items: users } = await this.userDataProvider.fetch(options);

    const items = total > 0 ? users.map(parseUserToResponse) : [];

    return { total, items };
  }

  async fetchById(id: string): Promise<gp2.UserResponse> {
    const user = await this.userDataProvider.fetchById(id);
    if (!user) {
      throw new NotFoundError(undefined, `user with id ${id} not found`);
    }

    return parseUserToResponse(user);
  }

  async fetchByCode(code: string): Promise<gp2.UserResponse> {
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
  ): Promise<gp2.UserResponse> {
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

export const parseUserToResponse = ({
  connections: _,
  ...user
}: gp2.UserDataObject): gp2.UserResponse => {
  const displayName = `${user.firstName} ${user.lastName}`;
  const response = {
    ...user,
    displayName,
  };
  return response;
};
