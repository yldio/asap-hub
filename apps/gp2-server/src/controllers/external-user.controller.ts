import { NotFoundError } from '@asap-hub/errors';
import { gp2 } from '@asap-hub/model';
import { ExternalUserDataProvider } from '../data-providers/types/external-user.data-provider.type';

export default class ExternalUserController {
  constructor(private externalUserDataProvider: ExternalUserDataProvider) {}

  async fetch(
    options: gp2.FetchExternalUsersOptions,
  ): Promise<gp2.ListExternalUserResponse> {
    const { total, items: externalUsers } =
      await this.externalUserDataProvider.fetch(options);

    const items = total > 0 ? externalUsers : [];

    return {
      total,
      items: items.map(({ id, name, orcid }) => ({
        id,
        orcid,
        displayName: name,
      })),
    };
  }

  async fetchById(id: string): Promise<gp2.ExternalUserResponse> {
    const externalUser = await this.externalUserDataProvider.fetchById(id);
    if (!externalUser) {
      throw new NotFoundError(
        undefined,
        `external user with id ${id} not found`,
      );
    }

    const { name, orcid } = externalUser;

    return {
      id,
      displayName: name,
      orcid,
    };
  }
}
