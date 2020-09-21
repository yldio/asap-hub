import { Base, BaseOptions } from '@asap-hub/services-common';
import { ResearchOutputCreationRequest } from '@asap-hub/model';
import { CMSResearchOutput } from '../entities/research-outputs';

export default class Users extends Base {
  constructor(CMSConfig: BaseOptions) {
    super(CMSConfig);
  }

  create(
    id: string,
    displayName: string,
    output: ResearchOutputCreationRequest,
  ): Promise<CMSResearchOutput> {
    return this.client
      .post<CMSResearchOutput>('research-outputs', {
        json: {
          url: { iv: output.url },
          doi: { iv: output.doi },
          title: { iv: output.title },
          text: { iv: output.text },
          type: { iv: output.type },
          publishDate: { iv: output.publishDate },
        },
        searchParams: { publish: true },
      })
      .json();
  }

  async fetchUserResearchOutputs(id: string): Promise<CMSResearchOutput[]> {
    const { items } = await this.client
      .get('research-outputs', {
        searchParams: { $filter: `data/createdBy/iv/id eq '${id}'` },
      })
      .json();

    return items;
  }
}
