import { ExternalAuthorCreateDataObject } from '@asap-hub/model';
import { RestExternalAuthor, SquidexRestClient } from '@asap-hub/squidex';

export interface ExternalAuthorDataProvider {
  create(input: ExternalAuthorCreateDataObject): Promise<string>;
}

export class ExternalAuthorSquidexDataProvider
  implements ExternalAuthorDataProvider
{
  constructor(
    private externalAuthorSquidexRestClient: SquidexRestClient<RestExternalAuthor>,
  ) {}

  async create(input: ExternalAuthorCreateDataObject): Promise<string> {
    const { id } = await this.externalAuthorSquidexRestClient.create({
      name: { iv: input.name },
      orcid: (input.orcid && { iv: input.orcid }) || undefined,
    });
    return id;
  }
}
