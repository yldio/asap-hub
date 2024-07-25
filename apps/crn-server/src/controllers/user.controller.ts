import { GenericError, NotFoundError } from '@asap-hub/errors';
import Boom from '@hapi/boom';
import {
  FetchUsersOptions,
  ListUserResponse,
  UserDataObject,
  UserResponse,
  UserUpdateDataObject,
  UserUpdateRequest,
  ValidationErrorResponse,
  VALIDATION_ERROR_MESSAGE,
} from '@asap-hub/model';
import {
  fetchOrcidProfile,
  isValidOrcidResponse,
  parseUserDisplayName,
  transformOrcidWorks,
} from '@asap-hub/server-common';
import Intercept from 'apr-intercept';
import {
  AssetDataProvider,
  ResearchTagDataProvider,
  UserDataProvider,
} from '../data-providers/types';
import logger from '../utils/logger';

export default class UserController {
  constructor(
    private userDataProvider: UserDataProvider,
    private assetDataProvider: AssetDataProvider,
    private researchTagsDataProvider: ResearchTagDataProvider,
  ) {}

  async update(
    id: string,
    update: UserUpdateRequest,
    { suppressConflict = false, polling = true } = {},
  ): Promise<UserResponse> {
    if (update.tagIds) {
      await this.validateUser(update.tagIds);
    }
    await this.userDataProvider.update(id, update, {
      suppressConflict,
      polling,
    });
    return this.fetchById(id);
  }

  async fetch(options: FetchUsersOptions): Promise<ListUserResponse> {
    const { total, items } = await this.userDataProvider.fetch(options);

    return {
      total,
      items: items.map((user) => ({
        ...user,
        onboarded: typeof user.onboarded === 'boolean' ? user.onboarded : true,
        displayName: parseUserDisplayName(
          user.firstName,
          user.lastName,
          undefined,
          user.nickname,
        ),
        fullDisplayName: parseUserDisplayName(
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
    const { id: assetId } = await this.assetDataProvider.create({
      id,
      title: 'Avatar',
      description: 'Avatar',
      content: avatar,
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
    return this.update(
      user.id,
      {
        email: user.email,
        connections: [...existingConnections, { code: userId }],
      },
      {
        polling: false,
      },
    );
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

    return this.update(user.id, updateToUser, {
      suppressConflict: true,
      polling: false,
    });
  }
  private async queryByCode(code: string) {
    return this.userDataProvider.fetch({
      filter: { code, hidden: false, onboarded: false },
      take: 1,
      skip: 0,
    });
  }

  private async validateResearchTags(
    id: string,
  ): Promise<ValidationErrorResponse['data'][0] | null> {
    const result = await this.researchTagsDataProvider.fetchById(id);

    if (!result) {
      return {
        instancePath: '/tags',
        keyword: 'exist',
        message: 'must exist',
        params: {
          type: 'string',
        },
        schemaPath: '#/properties/tags/exist',
      };
    }
    return null;
  }

  private async validateUser(tagIds: string[]): Promise<void> {
    const isError = (
      error: ValidationErrorResponse['data'][0] | null,
    ): error is ValidationErrorResponse['data'][0] => !!error && error !== null;

    const errors = await (
      await Promise.all(tagIds.map(this.validateResearchTags.bind(this)))
    ).filter(isError);

    this.handleErrors(errors);
  }

  private handleErrors(errors: ValidationErrorResponse['data']) {
    if (errors.length > 0) {
      // TODO: Remove Boom from the controller layer
      // https://asaphub.atlassian.net/browse/CRN-777
      throw Boom.badRequest<ValidationErrorResponse['data']>(
        `${VALIDATION_ERROR_MESSAGE} ${JSON.stringify(errors)}`,
        errors,
      );
    }
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
    displayName: parseUserDisplayName(
      user.firstName,
      user.lastName,
      undefined,
      user.nickname,
    ),
    fullDisplayName: parseUserDisplayName(
      user.firstName,
      user.lastName,
      user.middleName,
      user.nickname,
    ),
    dismissedGettingStarted,
    onboarded,
  };
};
