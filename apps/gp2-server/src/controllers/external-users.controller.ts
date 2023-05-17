import { gp2 } from '@asap-hub/model';
import { ExternalUserDataProvider } from '../data-providers/external-user.data-provider';

export interface ExternalUsersController {
  fetch(options: gp2.FetchUsersOptions): Promise<gp2.ListExternalUserResponse>;
}

export default class ExternalUsers implements ExternalUsersController {
  constructor(private externalUserDataProvider: ExternalUserDataProvider) {}

  async fetch(
    options: gp2.FetchUsersOptions,
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
