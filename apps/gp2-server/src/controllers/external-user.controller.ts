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
}
