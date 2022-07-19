import { GenericError, NotFoundError } from '@asap-hub/errors';
import {
  FetchUsersOptions,
  ListUserResponse,
  UserResponse,
  UserUpdateDataObject,
  UserUpdateRequest,
} from '@asap-hub/model';
import Intercept from 'apr-intercept';
import { AssetDataProvider } from '../data-providers/assets.data-provider';
import {
  parseUserToResponse,
  UserDataProvider,
} from '../data-providers/users.data-provider';
import { fetchOrcidProfile, transformOrcidWorks } from '../utils/fetch-orcid';

export interface UserController {
  fetch(options: FetchUsersOptions): Promise<ListUserResponse>;
  fetchById(id: string): Promise<UserResponse>;
  fetchByCode(code: string): Promise<UserResponse>;
  connectByCode(welcomeCode: string, userId: string): Promise<UserResponse>;
  update(id: string, update: UserUpdateRequest): Promise<UserResponse>;
  updateAvatar(
    id: string,
    avatar: Buffer,
    contentType: string,
  ): Promise<UserResponse>;
  syncOrcidProfile(
    id: string,
    cachedUser: UserResponse | undefined,
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

  async update(id: string, update: UserUpdateRequest): Promise<UserResponse> {
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
    return this.update(id, { avatar: assetId });
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

  async syncOrcidProfile(
    id: string,
    cachedUser: UserResponse | undefined = undefined,
  ): Promise<UserResponse> {
    let fetchedUser;
    if (!cachedUser) {
      fetchedUser = await this.fetchById(id);
    }

    const user = cachedUser || (fetchedUser as UserResponse);
    const [error, res] = await Intercept(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      fetchOrcidProfile(user!.orcid!),
    );
    const updateToUser: UserUpdateDataObject = {
      email: user.email,
      orcidLastSyncDate: new Date().toISOString(),
    };
    if (!error) {
      const { lastModifiedDate, works } = transformOrcidWorks(res);
      updateToUser.orcidLastModifiedDate = lastModifiedDate;
      updateToUser.orcidWorks = works.slice(0, 10);
    }
    return this.update(user.id, updateToUser);
  }
  private async queryByCode(code: string) {
    return this.userDataProvider.fetch({
      filter: { code, hidden: false, onboarded: false },
      take: 1,
      skip: 0,
    });
  }
}
