import { gp2 as gp2Model } from '@asap-hub/model';
import { gp2 as gp2Squidex, SquidexRestClient } from '@asap-hub/squidex';

export interface ExternalUserDataProvider {
  create(input: gp2Model.ExternalUserCreateDataObject): Promise<string>;
}

export class ExternalUserSquidexDataProvider
  implements ExternalUserDataProvider
{
  constructor(
    private externalUserSquidexRestClient: SquidexRestClient<gp2Squidex.RestExternalUser>,
  ) {}

  async create(input: gp2Model.ExternalUserCreateDataObject): Promise<string> {
    const { id } = await this.externalUserSquidexRestClient.create({
      name: { iv: input.name },
      orcid: (input.orcid && { iv: input.orcid }) || undefined,
    });
    return id;
  }
}
