import { GenericError, NotFoundError } from '@asap-hub/errors';
import {
  FetchUsersOptions,
  ListUserResponse,
  UserDataObject,
  UserResponse,
  UserUpdateDataObject,
  UserUpdateRequest,
} from '@asap-hub/model';
import {
  fetchOrcidProfile,
  isValidOrcidResponse,
  transformOrcidWorks,
} from '@asap-hub/server-common';
import Intercept from 'apr-intercept';
import { AssetDataProvider, UserDataProvider } from '../data-providers/types';
import logger from '../utils/logger';

export default class UserController {
  constructor(
    private userDataProvider: UserDataProvider,
    private assetDataProvider: AssetDataProvider,
  ) {}

  async update(
    id: string,
    update: UserUpdateRequest,
    { suppressConflict = false } = {},
  ): Promise<UserResponse> {
    await this.userDataProvider.update(id, update, { suppressConflict });
    return this.fetchById(id);
  }

  async fetch(options: FetchUsersOptions): Promise<ListUserResponse> {
    const { total, items } = await this.userDataProvider.fetch(options);

    return {
      total,
      items: items.map((user) => ({
        ...user,
        onboarded: typeof user.onboarded === 'boolean' ? user.onboarded : true,
        displayName: getDisplayName(
          user.firstName,
          user.lastName,
          user.middleName,
          user.nickname,
        ),
      })),
    };
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

    const user = await this.userDataProvider.fetchById(users[0].id);
    if (!user) {
      throw new NotFoundError(
        undefined,
        `user with code ${code} and id ${users[0].id} not found`,
      );
    }
    return parseUserToResponse(user);
  }

  async updateAvatar(
    id: string,
    avatar: Buffer,
    contentType: string,
  ): Promise<UserResponse> {
    const assetId = await this.assetDataProvider.create({
      id,
      avatar,
      contentType,
    });
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
    const user = await this.userDataProvider.fetchById(items[0].id);

    if (!user) {
      throw new NotFoundError(
        undefined,
        `user with code ${welcomeCode} and id ${items[0].id} not found`,
      );
    }

    if (user.connections?.find(({ code }) => code === userId)) {
      return parseUserToResponse(user);
    }
    const existingConnections =
      user.connections?.filter(({ code }) => code !== welcomeCode) || [];
    return this.update(user.id, {
      email: user.email,
      connections: [...existingConnections, { code: userId }],
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
    if (!error && isValidOrcidResponse(res)) {
      const { lastModifiedDate, works } = transformOrcidWorks(res);
      updateToUser.orcidLastModifiedDate = new Date(
        parseInt(lastModifiedDate, 10),
      ).toISOString();
      updateToUser.orcidWorks = works.slice(0, 10);
    }
    if (error) {
      logger.warn(error, 'Failed to sync ORCID profile');
    }

    return this.update(user.id, updateToUser, { suppressConflict: true });
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
}: UserDataObject): UserResponse => {
  const onboarded = typeof user.onboarded === 'boolean' ? user.onboarded : true;
  const dismissedGettingStarted = !!user.dismissedGettingStarted;
  return {
    ...user,
    displayName: getDisplayName(
      user.firstName,
      user.lastName,
      user.middleName,
      user.nickname,
    ),
    dismissedGettingStarted,
    onboarded,
  };
};

const getFirstLettersInCapitalsAndDots = (str: string) => {
  const firstLetters = str
    .split(' ')
    .map((word) => `${word.charAt(0).toUpperCase()}. `)
    .join('');

  return firstLetters;
};
const getDisplayName = (
  firstName: string,
  lastName: string,
  middleName?: string,
  nickname?: string,
) =>
  `${firstName} ${nickname ? `(${nickname}) ` : ''}${
    middleName ? `${getFirstLettersInCapitalsAndDots(middleName)}` : ''
  }${lastName}`;
