import Intercept from 'apr-intercept';
import { GenericError, NotFoundError } from '@asap-hub/errors';
import { gp2, parseUserDisplayName } from '@asap-hub/model';
import {
  fetchOrcidProfile,
  isValidOrcidResponse,
  transformOrcidWorks,
} from '@asap-hub/server-common';
import { AssetDataProvider, UserDataProvider } from '../data-providers/types';
import logger from '../utils/logger';

export default class UserController {
  constructor(
    private userDataProvider: UserDataProvider,
    private assetDataProvider: AssetDataProvider,
  ) {}

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
    const assetId = await this.assetDataProvider.create({
      id,
      avatar,
      contentType,
    });
    return this.update(id, { avatar: assetId });
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
    loggedInUserId?: string,
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
    if (user.connections?.find(({ code }) => code === authUserId)) {
      return parseUserToResponse(user);
    }
    const existingConnections =
      user.connections?.filter(({ code }) => code !== welcomeCode) || [];

    return this.update(user.id, {
      email: user.email,
      connections: [...existingConnections, { code: authUserId }],
      activatedDate: user.activatedDate ?? new Date().toISOString(),
    });
  }

  async syncOrcidProfile(
    id: string,
    cachedUser: gp2.UserResponse | undefined = undefined,
  ): Promise<gp2.UserResponse> {
    let fetchedUser;
    if (!cachedUser) {
      fetchedUser = await this.fetchById(id);
    }

    const user = cachedUser || (fetchedUser as gp2.UserResponse);
    logger.debug(user.orcid, 'ORCID');
    const [error, res] = await Intercept(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      fetchOrcidProfile(user!.orcid!),
    );
    logger.debug(res, 'response');
    logger.debug(error, 'error');
    const updateToUser: gp2.UserUpdateDataObject = {
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

    return this.update(user.id, updateToUser);
  }

  private async queryByCode(code: string) {
    return this.userDataProvider.fetch({
      filter: { code, hidden: false },
      take: 1,
      skip: 0,
    });
  }
}

const parseUserToResponse = (
  {
    connections: _,
    lastModifiedDate: __,
    telephone,
    ...user
  }: gp2.UserDataObject,
  loggedInUserId?: string,
): gp2.UserResponse => ({
  ...user,
  displayName: parseUserDisplayName(
    'short',
    user.firstName,
    user.lastName,
    user.middleName,
    user.nickname,
  ),
  fullDisplayName: parseUserDisplayName(
    'full',
    user.firstName,
    user.lastName,
    user.middleName,
    user.nickname,
  ),
  ...(user.id === loggedInUserId && { telephone }),
  projectIds: user.projects.map(({ id }) => id),
  workingGroupIds: user.workingGroups.map(({ id }) => id),
  tagIds: user.tags.map(({ id }) => id),
});
