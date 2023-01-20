import { GenericError, NotFoundError } from '@asap-hub/errors';
import { gp2 } from '@asap-hub/model';
import { AssetDataProvider } from '../data-providers/assets.data-provider';
import { UserDataProvider } from '../data-providers/user.data-provider';

export interface UserController {
  fetch(options: gp2.FetchUsersOptions): Promise<gp2.ListUserResponse>;
  fetchByCode(code: string): Promise<gp2.UserResponse>;
  fetchById(id: string, loggedInUserId: string): Promise<gp2.UserResponse>;
  update(id: string, update: gp2.UserUpdateRequest): Promise<gp2.UserResponse>;
  updateAvatar(
    id: string,
    avatar: Buffer,
    contentType: string,
  ): Promise<gp2.UserResponse>;
  connectByCode(
    welcomeCode: string,
    authUserId: string,
  ): Promise<gp2.UserResponse>;
}

export default class Users implements UserController {
  userDataProvider: UserDataProvider;
  assetDataProvider: AssetDataProvider;

  constructor(
    userDataProvider: UserDataProvider,
    assetDataProvider: AssetDataProvider,
  ) {
    this.userDataProvider = userDataProvider;
    this.assetDataProvider = assetDataProvider;
  }

  async update(
    id: string,
    update: gp2.UserUpdateRequest,
  ): Promise<gp2.UserResponse> {
    await this.userDataProvider.update(id, update);
    return this.fetchById(id, id);
  }

  async updateAvatar(
    id: string,
    avatar: Buffer,
    contentType: string,
  ): Promise<gp2.UserResponse> {
    const assetId = await this.assetDataProvider.create(
      id,
      avatar,
      contentType,
    );
    return this.update(id, { avatarUrl: assetId });
  }

  async fetch(options: gp2.FetchUsersOptions): Promise<gp2.ListUserResponse> {
    const { total, items: users } = await this.userDataProvider.fetch({
      ...options,
      filter: {
        ...options.filter,
        onlyOnboarded: options.filter?.onlyOnboarded ?? true,
      },
    });

    const items =
      total > 0 ? users.map((user) => parseUserToResponse(user)) : [];

    return { total, items };
  }

  async fetchById(
    id: string,
    loggedInUserId: string,
  ): Promise<gp2.UserResponse> {
    const user = await this.userDataProvider.fetchById(id);
    if (!user) {
      throw new NotFoundError(undefined, `user with id ${id} not found`);
    }

    return parseUserToResponse(user, loggedInUserId);
  }

  async fetchByCode(code: string): Promise<gp2.UserResponse> {
    const { items: users } = await this.queryByCode(code);
    if (users.length === 0) {
      throw new NotFoundError(undefined, `user with code ${code} not found`);
    }

    if (users.length !== 1 || !users[0]) {
      throw new GenericError(undefined, 'too many users found');
    }

    const user = users[0];
    return parseUserToResponse(user, user.id);
  }

  async connectByCode(
    welcomeCode: string,
    authUserId: string,
  ): Promise<gp2.UserResponse> {
    const { items } = await this.queryByCode(welcomeCode);

    if (!items || items.length > 1 || !items[0]) {
      throw new NotFoundError(
        undefined,
        `user with code ${welcomeCode} not found`,
      );
    }

    const user = items[0];
    return user.connections?.find(({ code }) => code === authUserId)
      ? parseUserToResponse(user, user.id)
      : this.update(user.id, {
          email: user.email,
          connections: [...(user.connections || []), { code: authUserId }],
          activatedDate: user.activatedDate ?? new Date().toISOString(),
        });
  }

  private async queryByCode(code: string) {
    return this.userDataProvider.fetch({
      filter: { code, hidden: false },
      take: 1,
      skip: 0,
    });
  }
}

export const parseUserToResponse = (
  { connections: _, telephone, ...user }: gp2.UserDataObject,
  loggedInUserId?: string,
): gp2.UserResponse => ({
  ...user,
  displayName: `${user.firstName} ${user.lastName}`,
  ...(user.id === loggedInUserId && { telephone }),
});
