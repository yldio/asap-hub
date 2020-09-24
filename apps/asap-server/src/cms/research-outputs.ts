import { Base, BaseOptions } from '@asap-hub/services-common';
import { ResearchOutputCreationRequest } from '@asap-hub/model';
import { CMSResearchOutput } from '../entities/research-outputs';

export default class ResearchOutput extends Base {
  constructor(CMSConfig: BaseOptions) {
    super(CMSConfig);
  }

  create(
    _id: string,
    _displayName: string,
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
}
